const DomeGalleryDefaults = {
  maxVerticalRotationDeg: 5,
  dragSensitivity: 20,
  enlargeTransitionMs: 300,
  segments: 35,
  dragDampening: 2,
  fit: 0.6,
  fitBasis: 'auto',
  minRadius: 600,
  maxRadius: Infinity,
  padFactor: 0.25,
  overlayBlurColor: '#120F17',
  openedImageWidth: '250px',
  openedImageHeight: '350px',
  imageBorderRadius: '30px',
  openedImageBorderRadius: '30px',
  grayscale: true
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};
const getDataNumber = (el, name, fallback) => {
  const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
  const n = attr == null ? NaN : parseFloat(attr);
  return Number.isFinite(n) ? n : fallback;
};

class DomeGallery {
  constructor(container, images, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.images = images || [];
    this.options = { ...DomeGalleryDefaults, ...options };
    
    this.rotation = { x: 0, y: 0 };
    this.startRot = { x: 0, y: 0 };
    this.startPos = null;
    this.dragging = false;
    this.moved = false;
    this.inertiaRAF = null;
    this.opening = false;
    this.openStartedAt = 0;
    this.lastDragEndAt = 0;
    this.scrollLocked = false;
    this.velocity = [0, 0];
    this.movement = [0, 0];
    this.lastPos = null;
    this.lastTime = 0;
    this.lockedRadius = 0;
    
    this.focusedEl = null;
    this.originalTilePosition = null;
    this.currentImageIndex = -1;

    this.initDOM();
    this.setupResizeObserver();
    this.setupEvents();
    this.startAutoRotate();
  }

  startAutoRotate() {
    const autoRotate = () => {
      if (!this.dragging && !this.focusedEl) {
        this.rotation.y = wrapAngleSigned(this.rotation.y + 0.03);
        this.applyTransform(this.rotation.x, this.rotation.y);
      }
      this.autoRotateId = requestAnimationFrame(autoRotate);
    };
    this.autoRotateId = requestAnimationFrame(autoRotate);
  }

  buildItems() {
    const seg = this.options.segments;
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
      const ys = c % 2 === 0 ? evenYs : oddYs;
      return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (this.images.length === 0) return coords.map(c => ({ ...c, src: '', alt: '' }));
    
    const normalizedImages = this.images.map(image => {
      if (typeof image === 'string') return { src: image, alt: '' };
      return { src: image.src || '', alt: image.alt || '' };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    for (let i = 1; i < usedImages.length; i++) {
      if (usedImages[i].src === usedImages[i - 1].src) {
        for (let j = i + 1; j < usedImages.length; j++) {
          if (usedImages[j].src !== usedImages[i].src) {
            const tmp = usedImages[i];
            usedImages[i] = usedImages[j];
            usedImages[j] = tmp;
            break;
          }
        }
      }
    }

    return coords.map((c, i) => ({ ...c, src: usedImages[i].src, alt: usedImages[i].alt }));
  }

  computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
  }

  initDOM() {
    this.container.classList.add('sphere-root');
    this.container.style.setProperty('--segments-x', this.options.segments);
    this.container.style.setProperty('--segments-y', this.options.segments);
    this.container.style.setProperty('--overlay-blur-color', this.options.overlayBlurColor);
    this.container.style.setProperty('--tile-radius', this.options.imageBorderRadius);
    this.container.style.setProperty('--enlarge-radius', this.options.openedImageBorderRadius);
    this.container.style.setProperty('--image-filter', this.options.grayscale ? 'grayscale(1)' : 'none');

    const items = this.buildItems();
    
    let html = `
      <main class="sphere-main">
        <div class="stage">
          <div class="sphere">
            ${items.map(it => `
              <div class="item" data-src="${it.src}" data-offset-x="${it.x}" data-offset-y="${it.y}" data-size-x="${it.sizeX}" data-size-y="${it.sizeY}" style="--offset-x: ${it.x}; --offset-y: ${it.y}; --item-size-x: ${it.sizeX}; --item-size-y: ${it.sizeY}">
                <div class="item__image" role="button" tabindex="0" aria-label="${it.alt || 'Open image'}">
                  <img src="${it.src}" draggable="false" alt="${it.alt}" />
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="overlay"></div>
        <div class="overlay overlay--blur"></div>
        <div class="edge-fade edge-fade--top"></div>
        <div class="edge-fade edge-fade--bottom"></div>
        <div class="viewer">
          <div class="scrim"></div>
          <div class="frame"></div>
          <button class="nav-btn nav-btn-left" aria-label="Previous" style="display: none;">&#8592;</button>
          <button class="nav-btn nav-btn-right" aria-label="Next" style="display: none;">&#8594;</button>
        </div>
      </main>
    `;

    this.container.innerHTML = html;

    this.mainRef = this.container.querySelector('.sphere-main');
    this.sphereRef = this.container.querySelector('.sphere');
    this.viewerRef = this.container.querySelector('.viewer');
    this.scrimRef = this.container.querySelector('.scrim');
    this.frameRef = this.container.querySelector('.frame');
    this.btnLeft = this.container.querySelector('.nav-btn-left');
    this.btnRight = this.container.querySelector('.nav-btn-right');

    this.applyTransform(this.rotation.x, this.rotation.y);
  }

  applyTransform(xDeg, yDeg) {
    if (this.sphereRef) {
      this.sphereRef.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  }

  setupResizeObserver() {
    this.ro = new ResizeObserver(entries => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width), h = Math.max(1, cr.height);
      const minDim = Math.min(w, h), maxDim = Math.max(w, h), aspect = w / h;
      
      let basis;
      switch (this.options.fitBasis) {
        case 'min': basis = minDim; break;
        case 'max': basis = maxDim; break;
        case 'width': basis = w; break;
        case 'height': basis = h; break;
        default: basis = aspect >= 1.3 ? w : minDim;
      }
      
      let radius = basis * this.options.fit;
      const heightGuard = h * 1.35;
      radius = Math.min(radius, heightGuard);
      
      const responsiveMinRadius = w < 768 ? Math.max(280, Math.min(this.options.minRadius, w * 1.2)) : this.options.minRadius;
      radius = clamp(radius, responsiveMinRadius, this.options.maxRadius);
      this.lockedRadius = Math.round(radius);

      const viewerPad = Math.max(8, Math.round(minDim * this.options.padFactor));
      this.container.style.setProperty('--radius', `${this.lockedRadius}px`);
      this.container.style.setProperty('--viewer-pad', `${viewerPad}px`);

      // Pre-calculate CSS variables in JS to avoid buggy CSS division and unitless division in mobile Safari/Chrome
      const segments = this.options.segments || 35;
      const rotY = (360 / segments) / 2;
      const rotX = (360 / segments) / 2;
      const circ = this.lockedRadius * 3.14159265;
      const itemWidth = circ / segments;
      const itemHeight = circ / segments;

      this.container.style.setProperty('--rot-y', `${rotY}deg`);
      this.container.style.setProperty('--rot-x', `${rotX}deg`);
      this.container.style.setProperty('--item-width', `${itemWidth}px`);
      this.container.style.setProperty('--item-height', `${itemHeight}px`);

      this.applyTransform(this.rotation.x, this.rotation.y);

      const enlargedOverlay = this.viewerRef?.querySelector('.enlarge');
      if (enlargedOverlay && this.frameRef && this.mainRef) {
        const frameR = this.frameRef.getBoundingClientRect();
        const mainR = this.mainRef.getBoundingClientRect();

        const hasCustomSize = this.options.openedImageWidth && this.options.openedImageHeight;
        if (hasCustomSize) {
          const tempDiv = document.createElement('div');
          tempDiv.style.cssText = `position: absolute; width: ${this.options.openedImageWidth}; height: ${this.options.openedImageHeight}; visibility: hidden;`;
          document.body.appendChild(tempDiv);
          const tempRect = tempDiv.getBoundingClientRect();
          document.body.removeChild(tempDiv);

          const centeredLeft = frameR.left - mainR.left + (frameR.width - tempRect.width) / 2;
          const centeredTop = frameR.top - mainR.top + (frameR.height - tempRect.height) / 2;

          enlargedOverlay.style.left = `${centeredLeft}px`;
          enlargedOverlay.style.top = `${centeredTop}px`;
          this.updateNavButtons(centeredLeft, centeredTop, tempRect.width, tempRect.height);
        } else {
          enlargedOverlay.style.left = `${frameR.left - mainR.left}px`;
          enlargedOverlay.style.top = `${frameR.top - mainR.top}px`;
          enlargedOverlay.style.width = `${frameR.width}px`;
          enlargedOverlay.style.height = `${frameR.height}px`;
          this.updateNavButtons(frameR.left - mainR.left, frameR.top - mainR.top, frameR.width, frameR.height);
        }
      }
    });
    this.ro.observe(this.container);
  }

  stopInertia() {
    if (this.inertiaRAF) {
      cancelAnimationFrame(this.inertiaRAF);
      this.inertiaRAF = null;
    }
  }

  startInertia(vx, vy) {
    const MAX_V = 1.4;
    let vX = clamp(vx, -MAX_V, MAX_V) * 80;
    let vY = clamp(vy, -MAX_V, MAX_V) * 80;
    let frames = 0;
    const d = clamp(this.options.dragDampening ?? 0.6, 0, 1);
    const frictionMul = 0.94 + 0.055 * d;
    const stopThreshold = 0.015 - 0.01 * d;
    const maxFrames = Math.round(90 + 270 * d);
    
    const step = () => {
      vX *= frictionMul;
      vY *= frictionMul;
      if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
        this.inertiaRAF = null;
        return;
      }
      if (++frames > maxFrames) {
        this.inertiaRAF = null;
        return;
      }
      const nextX = clamp(this.rotation.x - vY / 200, -this.options.maxVerticalRotationDeg, this.options.maxVerticalRotationDeg);
      const nextY = wrapAngleSigned(this.rotation.y + vX / 200);
      this.rotation = { x: nextX, y: nextY };
      this.applyTransform(nextX, nextY);
      this.inertiaRAF = requestAnimationFrame(step);
    };
    this.stopInertia();
    this.inertiaRAF = requestAnimationFrame(step);
  }

  lockScroll() {
    if (this.scrollLocked) return;
    this.scrollLocked = true;
    document.body.classList.add('dg-scroll-lock');
  }

  unlockScroll() {
    if (!this.scrollLocked) return;
    if (this.container.getAttribute('data-enlarging') === 'true') return;
    this.scrollLocked = false;
    document.body.classList.remove('dg-scroll-lock');
  }

  setupEvents() {
    this.container.querySelectorAll('.item__image').forEach(el => {
      el.addEventListener('click', (e) => {
        if (this.dragging || this.moved || (performance.now() - this.lastDragEndAt < 80) || this.opening) return;
        this.openItemFromElement(e.currentTarget);
      });
      el.addEventListener('pointerup', (e) => {
        if (e.pointerType !== 'touch') return;
        if (this.dragging || this.moved || (performance.now() - this.lastDragEndAt < 80) || this.opening) return;
        this.openItemFromElement(e.currentTarget);
      });
    });

    this.mainRef.addEventListener('pointerdown', (e) => {
      if (this.focusedEl) return;
      this.stopInertia();
      this.dragging = true;
      this.moved = false;
      this.startRot = { ...this.rotation };
      this.startPos = { x: e.clientX, y: e.clientY };
      this.lastPos = { x: e.clientX, y: e.clientY };
      this.lastTime = performance.now();
      this.mainRef.setPointerCapture(e.pointerId);
    });

    this.mainRef.addEventListener('pointermove', (e) => {
      if (this.focusedEl || !this.dragging || !this.startPos) return;
      const dxTotal = e.clientX - this.startPos.x;
      const dyTotal = e.clientY - this.startPos.y;
      
      if (!this.moved) {
        if (dxTotal * dxTotal + dyTotal * dyTotal > 16) this.moved = true;
      }
      
      const nextX = clamp(
        this.startRot.x - dyTotal / this.options.dragSensitivity,
        -this.options.maxVerticalRotationDeg,
        this.options.maxVerticalRotationDeg
      );
      const nextY = wrapAngleSigned(this.startRot.y + dxTotal / this.options.dragSensitivity);
      
      if (this.rotation.x !== nextX || this.rotation.y !== nextY) {
        this.rotation = { x: nextX, y: nextY };
        this.applyTransform(nextX, nextY);
      }

      const now = performance.now();
      const dt = Math.max(1, now - this.lastTime);
      this.velocity = [(e.clientX - this.lastPos.x) / dt, (e.clientY - this.lastPos.y) / dt];
      this.movement = [e.clientX - this.lastPos.x, e.clientY - this.lastPos.y];
      this.lastPos = { x: e.clientX, y: e.clientY };
      this.lastTime = now;
    });

    this.mainRef.addEventListener('pointerup', (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      this.mainRef.releasePointerCapture(e.pointerId);

      let [vx, vy] = this.velocity;
      if (Math.abs(vx) < 0.001 && Math.abs(vy) < 0.001) {
        vx = clamp((this.movement[0] / this.options.dragSensitivity) * 0.02, -1.2, 1.2);
        vy = clamp((this.movement[1] / this.options.dragSensitivity) * 0.02, -1.2, 1.2);
      }
      if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005) {
        this.startInertia(vx, vy);
      }
      if (this.moved) this.lastDragEndAt = performance.now();
      this.moved = false;
    });

    this.mainRef.addEventListener('pointercancel', (e) => {
      this.dragging = false;
      this.moved = false;
    });

    this.mainRef.addEventListener('touchmove', (e) => {
      if (!this.focusedEl && this.dragging) {
        e.preventDefault();
      }
    }, { passive: false });

    const close = () => {
      if (performance.now() - this.openStartedAt < 250) return;
      const el = this.focusedEl;
      if (!el) return;
      this.hideNavButtons();
      const parent = el.parentElement;
      const overlay = this.viewerRef?.querySelector('.enlarge');
      if (!overlay) return;
      
      const refDiv = parent.querySelector('.item__image--reference');
      const originalPos = this.originalTilePosition;
      
      if (!originalPos) {
        overlay.remove();
        if (refDiv) refDiv.remove();
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        el.style.visibility = '';
        el.style.zIndex = 0;
        this.focusedEl = null;
        this.container.removeAttribute('data-enlarging');
        this.opening = false;
        this.unlockScroll();
        return;
      }

      const currentRect = overlay.getBoundingClientRect();
      const rootRect = this.container.getBoundingClientRect();
      
      const originalPosRelativeToRoot = {
        left: originalPos.left - rootRect.left,
        top: originalPos.top - rootRect.top,
        width: originalPos.width,
        height: originalPos.height
      };
      const overlayRelativeToRoot = {
        left: currentRect.left - rootRect.left,
        top: currentRect.top - rootRect.top,
        width: currentRect.width,
        height: currentRect.height
      };

      const animatingOverlay = document.createElement('div');
      animatingOverlay.className = 'enlarge-closing';
      animatingOverlay.style.cssText = `position:absolute;left:${overlayRelativeToRoot.left}px;top:${overlayRelativeToRoot.top}px;width:${overlayRelativeToRoot.width}px;height:${overlayRelativeToRoot.height}px;z-index:9999;border-radius: var(--enlarge-radius, 32px);overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.35);transition:all ${this.options.enlargeTransitionMs}ms ease-out;pointer-events:none;margin:0;transform:none;`;
      
      const originalImg = overlay.querySelector('img');
      if (originalImg) {
        const img = originalImg.cloneNode();
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        animatingOverlay.appendChild(img);
      }
      
      overlay.remove();
      this.container.appendChild(animatingOverlay);
      void animatingOverlay.getBoundingClientRect();

      requestAnimationFrame(() => {
        animatingOverlay.style.left = originalPosRelativeToRoot.left + 'px';
        animatingOverlay.style.top = originalPosRelativeToRoot.top + 'px';
        animatingOverlay.style.width = originalPosRelativeToRoot.width + 'px';
        animatingOverlay.style.height = originalPosRelativeToRoot.height + 'px';
        animatingOverlay.style.opacity = '0';
      });

      const cleanup = () => {
        animatingOverlay.remove();
        this.originalTilePosition = null;
        if (refDiv) refDiv.remove();
        parent.style.transition = 'none';
        el.style.transition = 'none';
        parent.style.setProperty('--rot-y-delta', '0deg');
        parent.style.setProperty('--rot-x-delta', '0deg');
        requestAnimationFrame(() => {
          el.style.visibility = '';
          el.style.opacity = '0';
          el.style.zIndex = 0;
          this.focusedEl = null;
          this.container.removeAttribute('data-enlarging');
          requestAnimationFrame(() => {
            parent.style.transition = '';
            el.style.transition = 'opacity 300ms ease-out';
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              setTimeout(() => {
                el.style.transition = '';
                el.style.opacity = '';
                this.opening = false;
                if (!this.dragging && this.container.getAttribute('data-enlarging') !== 'true') {
                  document.body.classList.remove('dg-scroll-lock');
                }
              }, 300);
            });
          });
        });
      };
      animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
    };

    this.scrimRef.addEventListener('click', close);

    this.btnLeft.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigate(-1);
    });

    this.btnRight.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigate(1);
    });

    window.addEventListener('keydown', e => { 
      if (e.key === 'Escape') close(); 
      if (e.key === 'ArrowLeft' && this.focusedEl) this.navigate(-1);
      if (e.key === 'ArrowRight' && this.focusedEl) this.navigate(1);
    });
  }

  navigate(direction) {
    if (this.currentImageIndex === -1 || !this.images.length) return;
    
    this.currentImageIndex = (this.currentImageIndex + direction + this.images.length) % this.images.length;
    const newImageSrc = this.images[this.currentImageIndex].src || this.images[this.currentImageIndex];
    
    const overlay = this.viewerRef?.querySelector('.enlarge');
    if (!overlay) return;
    
    const img = overlay.querySelector('img');
    if (!img) return;

    img.style.transition = 'opacity 0.2s ease';
    img.style.opacity = '0';
    
    setTimeout(() => {
      img.src = newImageSrc;
      img.onload = () => {
        img.style.opacity = '1';
      };
    }, 200);
  }

  setupCloseEvents() {
    window.addEventListener('beforeunload', () => {
      document.body.classList.remove('dg-scroll-lock');
    });
  }

  openItemFromElement(el) {
    if (this.opening) return;
    this.opening = true;
    this.openStartedAt = performance.now();
    this.lockScroll();
    
    const parent = el.parentElement;
    this.focusedEl = el;
    el.setAttribute('data-focused', 'true');
    
    const offsetX = getDataNumber(parent, 'offsetX', 0);
    const offsetY = getDataNumber(parent, 'offsetY', 0);
    const sizeX = getDataNumber(parent, 'sizeX', 2);
    const sizeY = getDataNumber(parent, 'sizeY', 2);
    
    const parentRot = this.computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, this.options.segments);
    const parentY = normalizeAngle(parentRot.rotateY);
    const globalY = normalizeAngle(this.rotation.y);
    let rotY = -(parentY + globalY) % 360;
    if (rotY < -180) rotY += 360;
    const rotX = -parentRot.rotateX - this.rotation.x;
    
    parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
    parent.style.setProperty('--rot-x-delta', `${rotX}deg`);
    
    const refDiv = document.createElement('div');
    refDiv.className = 'item__image item__image--reference';
    refDiv.style.opacity = '0';
    refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
    parent.appendChild(refDiv);

    void refDiv.offsetHeight;

    const tileR = refDiv.getBoundingClientRect();
    const mainR = this.mainRef.getBoundingClientRect();
    const frameR = this.frameRef.getBoundingClientRect();

    if (tileR.width <= 0 || tileR.height <= 0) {
      this.opening = false;
      this.focusedEl = null;
      parent.removeChild(refDiv);
      this.unlockScroll();
      return;
    }

    this.originalTilePosition = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
    el.style.visibility = 'hidden';
    el.style.zIndex = 0;
    
    const overlay = document.createElement('div');
    overlay.className = 'enlarge';
    overlay.style.position = 'absolute';
    overlay.style.left = frameR.left - mainR.left + 'px';
    overlay.style.top = frameR.top - mainR.top + 'px';
    overlay.style.width = frameR.width + 'px';
    overlay.style.height = frameR.height + 'px';
    overlay.style.opacity = '0';
    overlay.style.zIndex = '30';
    overlay.style.willChange = 'transform, opacity';
    overlay.style.transformOrigin = 'top left';
    overlay.style.transition = `transform ${this.options.enlargeTransitionMs}ms ease, opacity ${this.options.enlargeTransitionMs}ms ease`;
    
    const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
    this.currentImageIndex = this.images.findIndex(img => (img.src || img) === rawSrc);
    if (this.currentImageIndex === -1) this.currentImageIndex = 0;

    const img = document.createElement('img');
    img.src = rawSrc;
    overlay.appendChild(img);
    this.viewerRef.appendChild(overlay);
    
    const tx0 = tileR.left - frameR.left;
    const ty0 = tileR.top - frameR.top;
    const sx0 = tileR.width / frameR.width;
    const sy0 = tileR.height / frameR.height;

    const validSx0 = isFinite(sx0) && sx0 > 0 ? sx0 : 1;
    const validSy0 = isFinite(sy0) && sy0 > 0 ? sy0 : 1;

    overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${validSx0}, ${validSy0})`;

    setTimeout(() => {
      if (!overlay.parentElement) return;
      overlay.style.opacity = '1';
      overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
      this.container.setAttribute('data-enlarging', 'true');
      if (!wantsResize) {
        this.updateNavButtons(frameR.left - mainR.left, frameR.top - mainR.top, frameR.width, frameR.height);
      }
    }, 16);

    const wantsResize = this.options.openedImageWidth || this.options.openedImageHeight;
    if (wantsResize) {
      const onFirstEnd = ev => {
        if (ev.propertyName !== 'transform') return;
        overlay.removeEventListener('transitionend', onFirstEnd);
        const prevTransition = overlay.style.transition;
        overlay.style.transition = 'none';
        const tempWidth = this.options.openedImageWidth || `${frameR.width}px`;
        const tempHeight = this.options.openedImageHeight || `${frameR.height}px`;
        overlay.style.width = tempWidth;
        overlay.style.height = tempHeight;
        
        const newRect = overlay.getBoundingClientRect();
        overlay.style.width = frameR.width + 'px';
        overlay.style.height = frameR.height + 'px';
        void overlay.offsetWidth;
        
        overlay.style.transition = `left ${this.options.enlargeTransitionMs}ms ease, top ${this.options.enlargeTransitionMs}ms ease, width ${this.options.enlargeTransitionMs}ms ease, height ${this.options.enlargeTransitionMs}ms ease`;
        
        const centeredLeft = frameR.left - mainR.left + (frameR.width - newRect.width) / 2;
        const centeredTop = frameR.top - mainR.top + (frameR.height - newRect.height) / 2;
        
        requestAnimationFrame(() => {
          overlay.style.left = `${centeredLeft}px`;
          overlay.style.top = `${centeredTop}px`;
          overlay.style.width = tempWidth;
          overlay.style.height = tempHeight;
          this.updateNavButtons(centeredLeft, centeredTop, newRect.width, newRect.height);
        });
        
        const cleanupSecond = () => {
          overlay.removeEventListener('transitionend', cleanupSecond);
          overlay.style.transition = prevTransition;
        };
        overlay.addEventListener('transitionend', cleanupSecond, { once: true });
      };
      overlay.addEventListener('transitionend', onFirstEnd);
    }
  }

  updateNavButtons(left, top, width, height) {
    if (!this.btnLeft || !this.btnRight) return;
    this.btnLeft.style.display = 'flex';
    this.btnLeft.style.left = `${left - 60}px`;
    this.btnLeft.style.top = `${top + height / 2}px`;
    this.btnLeft.style.transform = 'translate(-50%, -50%)';

    this.btnRight.style.display = 'flex';
    this.btnRight.style.left = `${left + width + 60}px`;
    this.btnRight.style.top = `${top + height / 2}px`;
    this.btnRight.style.transform = 'translate(-50%, -50%)';
  }

  hideNavButtons() {
    if (this.btnLeft) this.btnLeft.style.display = 'none';
    if (this.btnRight) this.btnRight.style.display = 'none';
  }
}

export default DomeGallery;
