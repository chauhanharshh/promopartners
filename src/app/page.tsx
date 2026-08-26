"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import emailjs from '@emailjs/browser';
import ScrollFloat from '../components/ScrollFloat';
import FallingText from '../components/FallingText';
import DomeGalleryWrapper from '../components/DomeGalleryWrapper';
import GlobeWordSphere from '../components/GlobeWordSphere';
import TextType from '../components/TextType';
import ScrollExpand from '../components/ScrollExpand';

const EMAILJS_CONFIG = {
  PUBLIC_KEY: '0imT0R61Bi0txxBez',
  CONTACT_SERVICE_ID: 'service_omp8888',
  CONTACT_TEMPLATE_ID: 'template_8spxjvh'
};

const promoImages = [
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024997/p13_urzmhq.jpg', alt: 'Campaign 1' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p9_omhzbr.jpg', alt: 'Campaign 2' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p11_e7tipz.jpg', alt: 'Campaign 3' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p1_gczosc.jpg', alt: 'Campaign 4' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p10_qiy29h.jpg', alt: 'Campaign 5' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p7_cygowe.jpg', alt: 'Campaign 6' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024996/p8_mihb5k.jpg', alt: 'Campaign 7' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024995/p6_zfre9d.jpg', alt: 'Campaign 8' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024995/p4_ywhkuk.jpg', alt: 'Campaign 9' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024995/p5_bbe1ne.jpg', alt: 'Campaign 10' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024995/p2_ll3cxz.jpg', alt: 'Campaign 11' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024995/p3_zu700f.jpg', alt: 'Campaign 12' },
  { src: 'https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024953/p10_ypbsq8.jpg', alt: 'Campaign 13' }
];



const FALLING_TEXT_HIGHLIGHT = ['ELEVATE'];

const TEXT_TYPE_WORDS = ["BRAND PROMOTIONS", "INFLUENCER MARKETING", "PR & MEDIA"];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hideIndicator, setHideIndicator] = useState(false);
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);

  // Hero Video States
  const [videoSrc, setVideoSrc] = useState<string>('https://res.cloudinary.com/dz9pqjbrx/video/upload/v1787742472/0516_s0ysof_mbdiei.webm');
  const [videoPoster, setVideoPoster] = useState<string>('https://res.cloudinary.com/dz9pqjbrx/image/upload/v1779024997/p13_urzmhq.jpg');
  const [isMobile, setIsMobile] = useState(false);

  const domeGalleryOptions = React.useMemo(() => ({
    overlayBlurColor: '#F5F0E8',
    grayscale: false,
    fit: isMobile ? 0.5 : 0.95,
    minRadius: isMobile ? 280 : 900,
    openedImageWidth: isMobile ? '200px' : '280px',
    openedImageHeight: isMobile ? '280px' : '380px',
    imageBorderRadius: '16px',
    openedImageBorderRadius: '20px',
    dragSensitivity: isMobile ? 15 : 20,
    segments: 35
  }), [isMobile]);

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 768;
      setIsMobile(mobileCheck);
      setVideoSrc(
        mobileCheck
          ? 'https://res.cloudinary.com/dz9pqjbrx/video/upload/q_auto,f_auto/v1779404680/mp__1_aayiwe.mp4'
          : 'https://res.cloudinary.com/dz9pqjbrx/video/upload/v1787742472/0516_s0ysof_mbdiei.webm'
      );
      setVideoPoster('');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stats & Results Countup States
  const [stats, setStats] = useState({ clients: 0, activeClients: 0, teamMembers: 0 });
  const [results, setResults] = useState({ reach: 0, impressions: 0, followers: 0, footfall: 0, media: 0, roi: 0 });

  // Contact Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formError, setFormError] = useState('');

  // Video Modal States
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoSrc, setActiveVideoSrc] = useState('');

  // FAQ Accordion State
  const [activeFaqIdx, setActiveFaqIdx] = useState<number | null>(null);

  // Form Fields
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  // Refs for animation
  const statsRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const contactVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // Window scroll interactions
  useEffect(() => {
    const handleScroll = () => {
      // The hero section takes up 1 + 1.2 (scrollDistance) + 1.5 (holdDistance) = 3.7 viewport heights
      const isScrolled = window.scrollY > window.innerHeight * 3.5;
      setScrolled((prev) => {
        if (prev !== isScrolled) return isScrolled;
        return prev;
      });

      const shouldHide = window.scrollY > 100;
      setHideIndicator((prev) => {
        if (prev !== shouldHide) return shouldHide;
        return prev;
      });

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress((prev) => {
        if (Math.abs(prev - progress) > 0.1) return progress;
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section visibility animations via intersection observer
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Stats Intersection Observer & Countup
  useEffect(() => {
    const element = statsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = { clients: 25, activeClients: 18, teamMembers: 10 };
            const current = { clients: 0, activeClients: 0, teamMembers: 0 };

            gsap.to(current, {
              clients: targets.clients,
              activeClients: targets.activeClients,
              teamMembers: targets.teamMembers,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                setStats({
                  clients: Math.ceil(current.clients),
                  activeClients: Math.ceil(current.activeClients),
                  teamMembers: Math.ceil(current.teamMembers)
                });
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Results Intersection Observer & Countup
  useEffect(() => {
    const element = resultsRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targets = { reach: 3, impressions: 50, followers: 10, footfall: 40, media: 5, roi: 5 };
            const current = { reach: 0, impressions: 0, followers: 0, footfall: 0, media: 0, roi: 0 };

            gsap.to(current, {
              reach: targets.reach,
              impressions: targets.impressions,
              followers: targets.followers,
              footfall: targets.footfall,
              media: targets.media,
              roi: targets.roi,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                setResults({
                  reach: Math.ceil(current.reach),
                  impressions: Math.ceil(current.impressions),
                  followers: Math.ceil(current.followers),
                  footfall: Math.ceil(current.footfall),
                  media: Math.ceil(current.media),
                  roi: Math.ceil(current.roi)
                });
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // GSAP animations for Contact Modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('dg-scroll-lock');
      gsap.to(modalOverlayRef.current, { autoAlpha: 1, pointerEvents: 'auto', duration: 0.35 });
      gsap.fromTo(modalContentRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.1 }
      );
      if (contactVideoRef.current) {
        contactVideoRef.current.pause();
        contactVideoRef.current.currentTime = 0;
      }
    } else {
      document.body.classList.remove('dg-scroll-lock');
      gsap.to(modalContentRef.current, { y: 40, opacity: 0, duration: 0.3, ease: 'power3.in' });
      gsap.to(modalOverlayRef.current, { autoAlpha: 0, pointerEvents: 'none', duration: 0.35, delay: 0.1 });
      if (contactVideoRef.current) {
        contactVideoRef.current.pause();
      }
    }
  }, [isModalOpen]);

  // Video playback on hover
  const handlePortraitCardMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const cards = document.querySelectorAll('.portrait-card');
    cards.forEach((otherCard) => {
      const video = otherCard.querySelector('video');
      if (video) {
        if (otherCard === e.currentTarget) {
          video.play().catch(() => { });
        } else {
          video.pause();
        }
      }
    });
  };

  const handlePortraitCardMouseLeave = () => {
    const cards = document.querySelectorAll('.portrait-card');
    cards.forEach((card) => {
      const video = card.querySelector('video');
      if (video) {
        video.play().catch(() => { });
      }
    });
  };

  const handlePortraitCardClick = (e: React.MouseEvent<HTMLAnchorElement>, src: string) => {
    e.preventDefault();
    setActiveVideoSrc(src);
    setIsVideoModalOpen(true);
  };

  const handleCheckboxChange = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const submitContactForm = async () => {
    // Validate
    if (!fname.trim() || !lname.trim() || !email.trim()) {
      setFormError('Please fill out all required fields.');
      setTimeout(() => setFormError(''), 3000);
      return;
    }

    setIsSending(true);
    setFormError('');

    const templateParams = {
      from_name: `${fname} ${lname}`,
      from_email: email,
      company: company || 'Not provided',
      services: selectedServices.join(', ') || 'None selected',
      message: message,
      to_email: 'hello@promopartnersmarketing.com',
      reply_to: email
    };

    try {
      await Promise.all([
        emailjs.send(
          EMAILJS_CONFIG.CONTACT_SERVICE_ID,
          EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
          {
            ...templateParams,
            to_email: 'hello@promopartnersmarketing.com',
            to_name: 'PromoPartners Team',
            subject: `New Inquiry from ${fname}`
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        ),
        emailjs.send(
          EMAILJS_CONFIG.CONTACT_SERVICE_ID,
          EMAILJS_CONFIG.CONTACT_TEMPLATE_ID,
          {
            ...templateParams,
            to_email: email,
            to_name: fname,
            subject: 'Thank you for reaching out — PromoPartners®'
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        ).catch((err) => {
          console.log('Customer copy failed, continuing...', err);
        })
      ]);

      setFormSubmitted(true);
      setIsSending(false);

      // Play left panel success video
      if (contactVideoRef.current) {
        contactVideoRef.current.muted = true;
        contactVideoRef.current.loop = true;
        contactVideoRef.current.play().catch(() => { });
      }
    } catch (error) {
      console.log('EmailJS failed:', error);
      setIsSending(false);
      setFormError('Something went wrong. Please try again.');
    }
  };

  // Nav link smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMobileNavActive(false);
    if (targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <div id="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="logo-container cursor-hover">
          <a href="#" onClick={(e) => handleNavClick(e, '#')} style={{ textDecoration: 'none' }}>
            <div className="logo">PROMO<span>PARTNERS</span><span className="reg-mark">®</span></div>
            <div className="logo-subtext">MARKETING</div>
          </a>
        </div>
        <ul className="nav-links">
          <li><a href="#" onClick={(e) => handleNavClick(e, '#')} className="cursor-hover">Home</a></li>
          <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')}>Services</a></li>
          <li><a href="#work" onClick={(e) => handleNavClick(e, '#work')}>Work</a></li>
          <li><a href="/careers/">Careers</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')}>About</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a></li>
        </ul>
        <button
          className="nav-cta-btn cursor-hover"
          onClick={() => setIsModalOpen(true)}
        >
          Let's Talk
        </button>
        <button onClick={() => setIsMobileNavActive(true)} className="hamburger-btn cursor-hover" aria-label="Open Navigation">☰</button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`nav-overlay ${isMobileNavActive ? 'active' : ''}`} id="nav-overlay">
        <button onClick={() => setIsMobileNavActive(false)} className="close-overlay-btn cursor-hover" aria-label="Close Navigation">✕</button>
        <ul className="overlay-links">
          <li><a href="#" onClick={(e) => handleNavClick(e, '#')} className="cursor-hover">Home</a></li>
          <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="cursor-hover">Services</a></li>
          <li><a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="cursor-hover">Work</a></li>
          <li><a href="/careers/" className="cursor-hover">Careers</a></li>
          <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="cursor-hover">About</a></li>
          <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="cursor-hover">Contact</a></li>
        </ul>
      </div>

      <header className="hero-scroll-expand-wrapper" style={{ position: 'relative', zIndex: 1, width: '100%', backgroundColor: 'var(--charcoal)' }}>
        <ScrollExpand
          mediaType="video"
          src={videoSrc || undefined}
          poster={videoPoster || undefined}
          useWindowScroll={true}
          startWidth={60}
          startHeight={20}
          startRadius={100}
          scrollDistance={1.2}
          holdDistance={1.5}
          overlayScrim={0.5}
          playOnFullExpand={true}
        >
          <div className="hero">
            <div className="hero-content" style={{ opacity: 1, transform: 'none', position: 'relative', zIndex: 10 }}>
              <p id="hero-subtitle">
                <TextType
                  text={TEXT_TYPE_WORDS}
                  typingSpeed={50}
                  deletingSpeed={30}
                  pauseDuration={2000}
                />
              </p>
              <div className="hero-tagline">SOCH SE STRATEGY TAK SAB YAHIN</div>
              <h1>PROMOPARTNERS<span className="reg-mark">®</span></h1>
              <div className="hero-marketing-subtext">MARKETING</div>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="btn cursor-hover">Let's Work Together</a>
            </div>
          </div>
        </ScrollExpand>
      </header>

      <section id="about" className="about-intro">

        <ScrollFloat>A Modern Approach to a New Age of Marketing</ScrollFloat>
        <p className="about-intro-text">
          Promopartners India is a dynamic digital marketing and brand promotion agency committed to helping
          businesses grow in the digital era. With a creative approach and data-driven strategies, we focus on
          building strong brand identities, increasing visibility, and delivering measurable results. Having worked
          with 25+ clients across diverse industries, including renowned brands like Snitch Clothing, we turn ideas
          into strategies and strategies into success.
        </p>
        <div className="founder-line">Krish Singh — Founder & CEO</div>

        <div className="about-locations">
          Available at: Haridwar · Delhi · Gurgaon · Pune · Surat · Talegaon Dabhade
        </div>

        {/* 3D Interactive Text Globe */}
        <GlobeWordSphere />
      </section>

      <section id="stats-section" className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-item-num-wrap">
              <div className="stat-number">{stats.clients}</div><span className="stat-plus">+</span>
            </div>
            <div className="stat-label">Clients Worked With</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-num-wrap">
              <div className="stat-number">{stats.activeClients}</div><span className="stat-plus">+</span>
            </div>
            <div className="stat-label">Active Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-item-num-wrap">
              <div className="stat-number">{stats.teamMembers}</div><span className="stat-plus">+</span>
            </div>
            <div className="stat-label">Team Members</div>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="services-header">
          <ScrollFloat>OUR EXPERTISE</ScrollFloat>
          <p>Delivering high-impact digital solutions tailored for brand growth</p>
        </div>
        <div className="services-grid">
          <div className="service-card cursor-hover">
            <div className="service-num">01</div>
            <div className="service-title">Marketing & Brand Promotion</div>
            <div className="service-desc">Strategic omnichannel campaigns designed to amplify your brand presence and engage target audiences effectively.</div>
          </div>
          <div className="service-card cursor-hover">
            <div className="service-num">02</div>
            <div className="service-title">Branding & Content Creation</div>
            <div className="service-desc">Crafting unique brand identities and compelling visual narratives that leave a lasting impression.</div>
          </div>
          <div className="service-card cursor-hover">
            <div className="service-num">03</div>
            <div className="service-title">SEO & Performance Marketing</div>
            <div className="service-desc">Data-driven search optimization and high-ROI advertising strategies to scale your digital growth.</div>
          </div>
          <div className="service-card cursor-hover">
            <div className="service-num">04</div>
            <div className="service-title">Website Designing</div>
            <div className="service-desc">Bespoke, high-performance web experiences that blend stunning aesthetics with seamless functionality.</div>
          </div>
          <div className="service-card cursor-hover">
            <div className="service-num">05</div>
            <div className="service-title">Social Media Ads</div>
            <div className="service-desc">Targeted, high-converting ad campaigns across Instagram, Facebook, and LinkedIn to maximize reach.</div>
          </div>
          <div className="service-card cursor-hover">
            <div className="service-num">06</div>
            <div className="service-title">Photoshoots & Videoshoots</div>
            <div className="service-desc">Cinematic commercial photography and video production that bring your brand's story to life.</div>
          </div>
        </div>
      </section>

      {/* Seamless Beige Section Wrapper */}
      <div
        className="beige-flow-wrapper"
        style={{
          backgroundColor: '#F5F0E8',
          width: '100%',
          position: 'relative',
          zIndex: 2,
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          margin: 0,
          padding: 0,
          marginTop: '-60px',
          clipPath: 'polygon(0 60px, 100% 0, 100% 100%, 0 100%)'
        }}
      >
        <section
          id="work"
          style={{
            width: '100%',
            height: isMobile ? '450px' : '950px',
            background: '#F5F0E8',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 0,
            padding: 0,
            border: 'none',
            outline: 'none',
            boxShadow: 'none'
          }}
        >
          <div style={{ textAlign: 'center', paddingTop: isMobile ? '40px' : '100px', paddingBottom: '20px', position: 'relative', zIndex: 10 }}>
            <p style={{
              fontFamily: "'Bricolage Grotesque', var(--font-inter)",
              fontSize: isMobile ? '10px' : '13px',
              letterSpacing: isMobile ? '2px' : '4px',
              color: '#C9A227',
              marginBottom: '8px'
            }}>
              BEHIND THE LENS
            </p>
            <h2 style={{
              fontFamily: 'var(--font-dm-serif)',
              fontSize: isMobile ? '32px' : '52px',
              fontStyle: 'italic',
              color: '#2D3436',
              margin: 0
            }}>
              "ICONIC"
            </h2>
            <p style={{
              fontFamily: "'Bricolage Grotesque', var(--font-inter)",
              fontSize: isMobile ? '10px' : '13px',
              letterSpacing: isMobile ? '3px' : '6px',
              color: '#2D3436',
              marginTop: '8px'
            }}>
              MOMENTS
            </p>
          </div>

          <DomeGalleryWrapper
            images={promoImages}
            options={domeGalleryOptions}
            height={isMobile ? '350px' : '800px'}
          />
        </section>

        <section id="work-editorial" className="work-editorial" style={{ borderTop: 'none', marginTop: '-2px', border: 'none', outline: 'none', boxShadow: 'none', backgroundColor: '#F5F0E8', position: 'relative', zIndex: 3 }}>
          <div className="section-header">
            <ScrollFloat>WORK THAT SPEAKS</ScrollFloat>
          </div>

          <div className="portrait-cards-container">
            {/* Card 1 */}
            <a
              href="#"
              onClick={(e) => handlePortraitCardClick(e, 'https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778947931/IMG_0440_ns2aqf.mov')}
              onMouseEnter={handlePortraitCardMouseEnter}
              onMouseLeave={handlePortraitCardMouseLeave}
              className="portrait-card"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778947931/IMG_0440_ns2aqf.jpg"
                src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778947931/IMG_0440_ns2aqf.mov"
              />
              <div className="fullscreen-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </div>
            </a>

            {/* Card 2 */}
            <a
              href="#"
              onClick={(e) => handlePortraitCardClick(e, 'https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778951897/IMG_0439_mhgr4i.mov')}
              onMouseEnter={handlePortraitCardMouseEnter}
              onMouseLeave={handlePortraitCardMouseLeave}
              className="portrait-card"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778951897/IMG_0439_mhgr4i.jpg"
                src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778951897/IMG_0439_mhgr4i.mov"
              />
              <div className="fullscreen-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </div>
            </a>

            {/* Card 3 */}
            <a
              href="#"
              onClick={(e) => handlePortraitCardClick(e, 'https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952260/IMG_0437_xmfxiy.mov')}
              onMouseEnter={handlePortraitCardMouseEnter}
              onMouseLeave={handlePortraitCardMouseLeave}
              className="portrait-card"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952260/IMG_0437_xmfxiy.jpg"
                src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952260/IMG_0437_xmfxiy.mov"
              />
              <div className="fullscreen-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </div>
            </a>

            {/* Card 4 */}
            <a
              href="#"
              onClick={(e) => handlePortraitCardClick(e, 'https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952339/IMG_0438_du2cm0.mov')}
              onMouseEnter={handlePortraitCardMouseEnter}
              onMouseLeave={handlePortraitCardMouseLeave}
              className="portrait-card"
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952339/IMG_0438_du2cm0.jpg"
                src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778952339/IMG_0438_du2cm0.mov"
              />
              <div className="fullscreen-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                </svg>
              </div>
            </a>
          </div>

          <div className="view-all-container">
            <a href="https://www.instagram.com/promopartnersads/" target="_blank" rel="noopener noreferrer" className="btn-view-all cursor-hover">
              VIEW ALL WORK
            </a>
          </div>
        </section>
      </div>

      <section id="results" className="results-section" ref={resultsRef}>
        <div className="results-header">
          <ScrollFloat>OUR RESULTS</ScrollFloat>
          <p>Data-driven success stories and campaign impacts</p>
        </div>
        <div className="results-grid">
          <div className="result-card cursor-hover">
            <div className="result-title">Brand Awareness Campaign</div>
            <div className="result-stat"><span>{results.reach}</span>x</div>
            <div className="result-desc">increase in reach</div>
          </div>
          <div className="result-card cursor-hover">
            <div className="result-title">Influencer Collab</div>
            <div className="result-stat"><span>{results.impressions}</span>K+</div>
            <div className="result-desc">impressions</div>
          </div>
          <div className="result-card cursor-hover">
            <div className="result-title">Social Media Growth</div>
            <div className="result-stat"><span>{results.followers}</span>K</div>
            <div className="result-desc">followers in 30 days</div>
          </div>
          <div className="result-card cursor-hover">
            <div className="result-title">Restaurant Campaign</div>
            <div className="result-stat"><span>{results.footfall}</span>%</div>
            <div className="result-desc">increase in footfall</div>
          </div>
          <div className="result-card cursor-hover">
            <div className="result-title">PR Coverage</div>
            <div className="result-stat">Featured in <span>{results.media}</span>+</div>
            <div className="result-desc">media outlets</div>
          </div>
          <div className="result-card cursor-hover">
            <div className="result-title">Performance Marketing</div>
            <div className="result-stat"><span>{results.roi}</span>x</div>
            <div className="result-desc">ROI achieved</div>
          </div>
        </div>
      </section>

      <section id="clients" className="clients-section">
        <div className="clients-header">
          <h2>BRANDS WE'VE WORKED WITH</h2>
          <p>Partnering with visionary brands across diverse industries</p>
        </div>
        <div className="clients-grid">
          {['Snitch Clothing', 'Pashto Cafe', 'Inings Restro Cafe', 'Hotels4u.in', 'Pinnacle Restro Cafe', 'Fresh o Fit', 'Manohar Dairy', 'Havemore Restaurant'].map((client, idx) => (
            <div key={idx} className="client-card cursor-hover">
              <div className="client-name">{client}</div>
            </div>
          ))}
          <div className="client-card highlight cursor-hover" onClick={() => setIsModalOpen(true)}>
            <div className="client-name">& Many More</div>
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section">
        <FallingText
          text="READY TO ELEVATE ?"
          highlightWords={FALLING_TEXT_HIGHLIGHT}
          fontSize={isMobile ? "clamp(1.8rem, 7vw, 3rem)" : "clamp(2.5rem, 6vw, 5rem)"}
          backgroundColor="transparent"
          gravity={1}
          mouseConstraintStiffness={0.2}
        />
        <div className="cta-center-overlay">
          <p className="cta-slogan">JAB DIKHEGA TABHI TOH BIKEGA</p>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="btn cursor-hover" id="cta-action-btn">WORK WITH US</a>
          <p className="cta-plans">PLANS STARTING FROM ₹3,999/- ONLY</p>
        </div>
      </section>

      <section id="faq" className="faq-section">
        <div className="faq-container">
          <div className="faq-header">
            <p className="faq-subtitle">HAVE QUESTIONS?</p>
            <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="faq-title-line"></div>
          </div>
          <div className="faq-list">
            {[
              {
                q: "What services do you offer?",
                a: "PromoPartners offers: Marketing & Brand Promotion, Influencer Marketing, Branding & Content Creation, SEO & Performance Marketing, Social Media Ads, Website Designing, Photoshoots & Videoshoots, and PR & Media Outreach."
              },
              {
                q: "How much do your plans cost?",
                a: "PromoPartners Marketing plans start from just ₹3,999/- per month. We offer customized packages for Brand Promotions, Influencer Marketing, SEO, Social Media Ads, and more. Contact us at +91 7668191106 for a custom quote."
              },
              {
                q: "Which cities do you serve?",
                a: "PromoPartners Marketing is available across India including Haridwar, Delhi, Gurgaon, Pune, Surat, and Talegaon Dabhade. We also offer remote marketing services pan India."
              },
              {
                q: "How can I contact PromoPartners?",
                a: "You can contact PromoPartners Marketing at: Phone/WhatsApp: +91 7668191106, Email: workwithpromopartners@gmail.com, Instagram: @promopartnersindia, or visit promopartnersmarketing.com"
              },
              {
                q: "Which brands have you worked with?",
                a: "PromoPartners has worked with 25+ brands including Snitch Clothing, Pashto Cafe, Inings Restro Cafe, Hotels4u.in, Pinnacle Restro Cafe, Fresh o Fit, Manohar Dairy, and Havemore Restaurant among many others."
              },
              {
                q: "How long does it take to see results?",
                a: "The timeline for results varies based on the services. Social Media Ads and Influencer Campaigns can generate immediate traction, while SEO and organic branding generally take 3 to 6 months to show significant growth."
              }
            ].map((item, idx) => {
              const active = activeFaqIdx === idx;
              return (
                <div key={idx} className={`faq-item ${active ? 'active' : ''}`}>
                  <button onClick={() => setActiveFaqIdx(active ? null : idx)} className="faq-question">
                    {item.q}
                    <span className="faq-chevron">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </button>
                  <div className="faq-answer" style={{ maxHeight: active ? '500px' : '0px', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', overflow: 'hidden' }}>
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mega-footer">
        <div className="mega-footer-top">
          <div className="mega-footer-left">
            <div className="mega-footer-media">
              <video
                autoPlay muted loop playsInline
                src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778947931/IMG_0440_ns2aqf.mov"
              />
            </div>
            <div className="mega-footer-contact-row">
              <div className="stay-connected">
                <span className="dot"></span> Stay connected
              </div>
              <a href="mailto:info@promopartnersmarketing.com" className="mega-email cursor-hover">info@promopartnersmarketing.com</a>
            </div>
          </div>
          <div className="mega-footer-right">
            <div className="mega-footer-col">
              <h4>Navigation</h4>
              <a href="#" onClick={(e) => handleNavClick(e, '#')} className="cursor-hover mega-link">Home</a>
              <a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="cursor-hover mega-link">Services</a>
              <a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="cursor-hover mega-link">Work</a>
              <a href="/careers/" className="cursor-hover mega-link">Careers</a>
              <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="cursor-hover mega-link">About</a>
            </div>
            <div className="mega-footer-col">
              <h4>Social Media</h4>
              <a href="https://www.instagram.com/promopartnersads" target="_blank" rel="noopener noreferrer" className="cursor-hover mega-link">Instagram</a>
              <a href="https://wa.me/917668191106" target="_blank" rel="noopener noreferrer" className="cursor-hover mega-link">WhatsApp</a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="cursor-hover mega-link">Facebook</a>
            </div>
          </div>
        </div>

        <div className="mega-footer-middle">
          <div className="copyright">©2025 PromoPartners Marketing. All Rights Reserved</div>
          <div className="legal-links">
            <a href="#" className="cursor-hover">Terms of Use</a>
            <a href="#" className="cursor-hover">Privacy Policy</a>
          </div>
        </div>

        <div className="mega-footer-bottom">
          <div className="mega-text-marquee">
            <span>PROMOPARTNERS MARKETING • </span>
            <span>PROMOPARTNERS MARKETING • </span>
          </div>
          <div className="mega-footer-blur"></div>
        </div>
      </footer>

      {/* Split Contact Modal */}
      <div id="contact-modal" ref={modalOverlayRef} className="modal-overlay" style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}>
        <div className="modal-content" ref={modalContentRef}>
          <button onClick={() => setIsModalOpen(false)} className="modal-close cursor-hover" aria-label="Close Modal">&times;</button>

          <div className="modal-left">
            <video
              ref={contactVideoRef}
              id="modal-left-video"
              muted
              loop
              playsInline
              preload="auto"
              poster="https://res.cloudinary.com/dz9pqjbrx/image/upload/q_auto/f_auto/v1778873766/p12_ki5tql.png"
            >
              <source src="https://res.cloudinary.com/dz9pqjbrx/video/upload/v1778992468/kling_20260517_VIDEO_Animate_th_3196_0_o27ntl.mp4" type="video/mp4" />
            </video>
            <div className="modal-left-content">
              <h3>PromoPartners</h3>
              <p>MARKETING</p>
            </div>
          </div>

          <div className="modal-right">
            {!formSubmitted ? (
              <div id="pp-form-wrap">
                <div className="modal-header">
                  <h2 className="modal-title">LET'S WORK TOGETHER</h2>
                  <p className="modal-subtitle">Reach us at <a href="mailto:info@promopartnersmarketing.com" className="cursor-hover">info@promopartnersmarketing.com</a></p>
                </div>

                <form id="contact-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pp-fname">First Name</label>
                      <input type="text" id="pp-fname" value={fname} onChange={(e) => setFname(e.target.value)} placeholder="Your First Name" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="pp-lname">Last Name</label>
                      <input type="text" id="pp-lname" value={lname} onChange={(e) => setLname(e.target.value)} placeholder="Your Last Name" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pp-email">Email</label>
                    <input type="email" id="pp-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="pp-company">Company Name</label>
                    <input type="text" id="pp-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Company" />
                  </div>

                  <div className="services-group">
                    <span className="services-label">Services</span>
                    <div className="checkbox-grid">
                      {[
                        'Marketing & Brand Promotion',
                        'Branding & Content Creation',
                        'SEO & Performance Marketing',
                        'Website Designing',
                        'Social Media Ads',
                        'Photoshoots & Videoshoots'
                      ].map((service) => (
                        <label key={service} className="checkbox-label cursor-hover">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => handleCheckboxChange(service)}
                          />
                          <div className="custom-checkbox"></div>
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="pp-msg">Message</label>
                    <textarea id="pp-msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Your Message"></textarea>
                  </div>

                  <button
                    type="button"
                    id="pp-submit-btn"
                    onClick={submitContactForm}
                    disabled={isSending}
                    className={`submit-btn cursor-hover ${isSending ? 'btn-sending' : ''}`}
                  >
                    {isSending ? 'SENDING...' : 'GET STARTED'}
                  </button>
                  {formError && (
                    <p style={{ color: '#e74c3c', fontSize: '12px', textAlign: 'center', marginTop: '10px', fontFamily: 'Manrope, sans-serif' }}>
                      {formError}
                    </p>
                  )}
                </form>
              </div>
            ) : (
              <div id="pp-success" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
                <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontSize: '36px', color: '#C9A227', letterSpacing: '3px', marginBottom: '16px' }}>THANK YOU!</h2>
                <p style={{ color: '#ffffff', fontSize: '16px', lineHeight: '1.6', marginBottom: '12px' }}>We've received your inquiry and will get back to you within <strong style={{ color: '#C9A227' }}>24 hours.</strong></p>
                <p style={{ color: '#aaaaaa', fontSize: '13px' }}>A confirmation email has been sent to your inbox.</p>
                <div style={{ marginTop: '30px', padding: '16px 24px', border: '1px solid #C9A227', color: '#C9A227', fontFamily: "'Bricolage Grotesque'", letterSpacing: '2px', fontSize: '14px' }}>
                  📸 @promopartnersads &nbsp;|&nbsp; 📞 +91 7668191106 / +91 8755746566
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Video Fullscreen Modal */}
      {isVideoModalOpen && (
        <div id="video-modal" className="video-modal" style={{ display: 'flex', opacity: 1 }}>
          <div onClick={() => setIsVideoModalOpen(false)} className="video-modal-overlay"></div>
          <div className="video-modal-content">
            <button onClick={() => setIsVideoModalOpen(false)} className="video-modal-close cursor-hover">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="video-modal-wrapper">
              <video id="modal-video" src={activeVideoSrc} autoPlay loop controls style={{ width: '100%', height: '100%', objectFit: 'contain' }}></video>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
