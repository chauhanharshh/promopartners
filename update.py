import sys
import re

with open('h:/pp/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace CSS
css_pattern = re.compile(r'/\* --- About Philosophy --- \*/.*?/\* --- Custom Cursor --- \*/', re.DOTALL)

new_css = '''/* --- About Intro --- */
        .about-intro {
            background-color: var(--beige);
            color: var(--dark-text);
            padding: 120px 20px;
            text-align: center;
        }

        .about-intro h2 {
            font-family: var(--font-bebas);
            font-size: clamp(3rem, 6vw, 6rem);
            letter-spacing: 2px;
            font-style: italic;
            font-weight: 400;
            margin-bottom: 24px;
            line-height: 1.1;
        }

        .about-intro-text {
            max-width: 600px;
            margin: 0 auto 60px;
            font-size: 18px;
            line-height: 1.6;
            color: rgba(45, 52, 54, 0.8);
            font-weight: 300;
        }

        .media-logos {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 40px;
            flex-wrap: wrap;
            margin-bottom: 80px;
        }

        .media-logo {
            font-family: var(--font-inter);
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 3px;
            color: rgba(45, 52, 54, 0.5);
        }

        .intro-images {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .img-portrait {
            width: 40%;
            aspect-ratio: 3/4;
            object-fit: cover;
            transform: translateY(40px);
        }

        .img-landscape {
            width: 60%;
            aspect-ratio: 4/3;
            object-fit: cover;
            transform: translateY(-40px);
        }

        /* --- Photo Grid --- */
        .photo-grid-section {
            background-color: var(--beige);
            padding: 100px 0 0;
        }

        .photo-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1px;
            width: 100%;
        }

        .photo-item {
            position: relative;
            overflow: hidden;
            aspect-ratio: 3/4;
        }

        .photo-item:nth-child(even) {
            aspect-ratio: 4/5;
        }

        .photo-item:nth-child(3n) {
            aspect-ratio: 1/1;
        }

        .photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.8s ease;
        }

        .photo-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.4);
            opacity: 0;
            transition: opacity 0.4s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--white);
            font-family: var(--font-bebas);
            font-size: 24px;
            letter-spacing: 2px;
            text-align: center;
            padding: 20px;
        }

        .photo-item:hover img {
            transform: scale(1.05);
        }

        .photo-item:hover .photo-overlay {
            opacity: 1;
        }

        /* --- Diagonal Divider --- */
        .angled-divider {
            background-color: var(--beige);
            padding: 80px 0;
            overflow: hidden;
            position: relative;
            z-index: 10;
        }

        .angled-banner {
            background-color: #111;
            color: #fff;
            padding: 40px 0;
            transform: rotate(-3deg) scale(1.05);
            text-align: center;
        }

        .angled-banner h2 {
            font-family: var(--font-bebas);
            font-size: clamp(4rem, 8vw, 8rem);
            letter-spacing: 4px;
            font-style: italic;
            margin: 0;
            line-height: 1;
        }

        /* --- Video Work --- */
        .video-work {
            background-color: var(--beige);
            padding: 40px 20px 140px;
        }

        .video-grid {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
        }

        .video-card {
            position: relative;
            aspect-ratio: 16/9;
            background-size: cover;
            background-position: center;
            cursor: pointer;
            overflow: hidden;
        }

        .video-card::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
            transition: opacity 0.4s ease;
        }

        .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
            transition: transform 0.4s ease, background 0.4s ease;
        }

        .play-button svg {
            width: 30px;
            height: 30px;
            fill: #fff;
            margin-left: 5px;
        }

        .video-card:hover .play-button {
            transform: translate(-50%, -50%) scale(1.1);
            background: var(--accent-color);
        }

        .video-title {
            position: absolute;
            bottom: 30px;
            left: 30px;
            color: #fff;
            z-index: 2;
            font-family: var(--font-inter);
            font-size: 24px;
            font-weight: 700;
        }

        /* --- CTA Section --- */
        .cta-section {
            position: relative;
            padding: 160px 20px;
            text-align: center;
            background-image: url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            color: #fff;
        }

        .cta-section::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 1;
        }

        .cta-content {
            position: relative;
            z-index: 2;
            max-width: 800px;
            margin: 0 auto;
        }

        .cta-content h2 {
            font-family: var(--font-bebas);
            font-size: clamp(3rem, 6vw, 6rem);
            letter-spacing: 2px;
            font-style: italic;
            margin-bottom: 20px;
            line-height: 1.1;
        }

        .cta-content p {
            font-family: var(--font-inter);
            font-size: 18px;
            opacity: 0.8;
            margin-bottom: 40px;
            font-weight: 300;
        }

        .cta-content .btn {
            background-color: var(--accent-color);
            color: #fff;
            padding: 20px 60px;
            font-size: 16px;
        }

        /* --- Footer --- */
        footer {
            background-color: var(--beige);
            color: var(--dark-text);
            padding: 60px 40px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 40px;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
        }

        .footer-logo {
            font-family: var(--font-barlow);
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -1px;
            display: block;
            margin-bottom: 5px;
        }

        .footer-social {
            display: flex;
            gap: 15px;
            margin-top: 10px;
        }

        .footer-social a {
            color: var(--dark-text);
            opacity: 0.6;
            text-decoration: none;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .footer-social a:hover {
            opacity: 1;
        }

        .footer-nav {
            display: flex;
            justify-content: center;
            gap: 30px;
        }

        .footer-nav a {
            color: var(--dark-text);
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .footer-contact {
            text-align: right;
            font-size: 14px;
            line-height: 1.6;
            opacity: 0.8;
        }

        @media (max-width: 1024px) {
            .intro-images {
                flex-direction: column;
            }
            .img-portrait, .img-landscape {
                width: 100%;
                transform: none !important;
            }
            .photo-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        @media (max-width: 768px) {
            .footer-grid {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 30px;
            }
            .footer-nav {
                flex-direction: column;
                gap: 15px;
            }
            .footer-contact {
                text-align: center;
            }
            .footer-social {
                justify-content: center;
            }
            .video-grid {
                grid-template-columns: 1fr;
            }
            .photo-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        /* --- Custom Cursor --- */'''

content = css_pattern.sub(new_css, content)

# Replace HTML
html_pattern = re.compile(r'<div class="trusted-strip">.*?</footer>', re.DOTALL)

new_html = '''<section id="about-intro" class="about-intro">
        <h2>A Modern Approach to a<br>New Age of Marketing</h2>
        <p class="about-intro-text">
            We don't just run ads; we craft narratives that resonate. PromoPartners is a premium agency dedicated to building brand equity through high-impact promotions, immersive events, and strategic media outreach.
        </p>
        
        <div class="media-logos">
            <div class="media-logo">VOGUE</div>
            <div class="media-logo">COSMOPOLITAN</div>
            <div class="media-logo">FORBES</div>
            <div class="media-logo">BUSINESS INSIDER</div>
        </div>

        <div class="intro-images">
            <img src="https://images.unsplash.com/photo-1558522195-e1201b090344?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" class="img-portrait" alt="Editorial Portrait">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" class="img-landscape" alt="Editorial Landscape">
        </div>
    </section>

    <section id="photo-grid" class="photo-grid-section">
        <div class="photo-grid">
            <div class="photo-item">
                <img src="https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work">
                <div class="photo-overlay">Aura Lifestyle</div>
            </div>
            <div class="photo-item">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work">
                <div class="photo-overlay">Velvet & Co.</div>
            </div>
            <div class="photo-item">
                <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Work">
                <div class="photo-overlay">Nexus Tech</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Luxe Haven</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Prism Events</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1558522195-e1201b090344?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Orbit Digital</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Eclipse</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1475721025505-1175af40a7dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Zenith</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Vanguard</div>
            </div>
            <div class=\"photo-item\">
                <img src=\"https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80\" alt=\"Work\">
                <div class=\"photo-overlay\">Solstice</div>
            </div>
        </div>
    </section>

    <div class="angled-divider">
        <div class="angled-banner">
            <h2>WORK THAT SPEAKS</h2>
        </div>
    </div>

    <section id="video-work" class="video-work">
        <div class="video-grid">
            <div class="video-card" style="background-image: url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');">
                <div class="play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div class="video-title">Luxe Haven Launch</div>
            </div>
            <div class="video-card" style="background-image: url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');">
                <div class="play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div class="video-title">Aura Lifestyle Campaign</div>
            </div>
            <div class="video-card" style="background-image: url('https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');">
                <div class="play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div class="video-title">Nexus Tech Summit</div>
            </div>
            <div class="video-card" style="background-image: url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');">
                <div class="play-button">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
                <div class="video-title">Prism Events Showcase</div>
            </div>
        </div>
    </section>

    <section id="cta-section" class="cta-section">
        <div class="cta-content">
            <h2>Let's Build Something Great</h2>
            <p>Ready to elevate your brand? Tell us about your vision, and we'll help you make it unforgettable.</p>
            <a href="#" class="btn">Work With Us</a>
        </div>
    </section>

    <footer>
        <div class="footer-grid">
            <div class="footer-logo-area">
                <div class="footer-logo">PROMO<span>PARTNERS</span></div>
                <div class="footer-social">
                    <a href="#">IG</a>
                    <a href="#">IN</a>
                    <a href="#">X</a>
                </div>
            </div>
            
            <div class="footer-nav">
                <a href="#about-intro">About</a>
                <a href="#photo-grid">Work</a>
                <a href="#video-work">Films</a>
                <a href="#cta-section">Contact</a>
            </div>
            
            <div class="footer-contact">
                hello@promopartners.com<br>
                +1 (555) 123-4567<br>
                New York & Los Angeles
            </div>
        </div>
    </footer>'''

content = html_pattern.sub(new_html, content)

with open('h:/pp/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated successfully')
