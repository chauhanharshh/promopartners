"use client";

import React, { useEffect, useState } from 'react';
import emailjs from '@emailjs/browser';
import './careers.css';

const EMAILJS_CONFIG = {
  PUBLIC_KEY: '0imT0R61Bi0txxBez',
  CAREERS_SERVICE_ID: 'service_pnet51c',
  CAREERS_TEMPLATE_ID: 'template_dzou1wp'
};

interface Position {
  id: string;
  title: string;
  location: string;
  type: string;
  responsibilities: string[];
  requirements: string[];
}

const openPositions: Position[] = [
  {
    id: 'smm',
    title: 'Social Media Manager',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Develop and execute innovative social media strategies for premium brand accounts.',
      'Oversee content calendars, copywriting, and community engagement across Instagram and LinkedIn.',
      'Analyze performance metrics and optimize campaigns for maximum reach and conversion.'
    ],
    requirements: [
      '2+ years of agency experience managing high-growth brand pages.',
      'Exceptional understanding of viral trends, algorithm dynamics, and brand voice.'
    ]
  },
  {
    id: 've',
    title: 'Video Editor',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Edit high-retention short-form reels and cinematic commercial brand videos.',
      'Perform professional color grading, sound design, and motion graphics integration.'
    ],
    requirements: [
      'Expert proficiency in Premiere Pro, After Effects, or DaVinci Resolve.',
      'Strong portfolio showcasing fast-paced editorial cuts and premium aesthetics.'
    ]
  },
  {
    id: 'pme',
    title: 'Performance Marketing Executive',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Plan, deploy, and scale high-budget ad campaigns across Meta, Google, and LinkedIn Ads.',
      'Conduct rigorous A/B testing on ad creatives, copy, and audience targeting.'
    ],
    requirements: [
      'Proven track record of managing profitable ROAS for e-commerce or D2C brands.',
      'Strong analytical mindset with deep expertise in Google Analytics and Meta Ads Manager.'
    ]
  },
  {
    id: 'gd',
    title: 'Graphic Designer',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Design stunning social media statics, carousel posts, ad creatives, and brand identity assets.',
      'Collaborate with the marketing team to translate strategic concepts into visual masterpieces.'
    ],
    requirements: [
      'Mastery of Adobe Photoshop, Illustrator, and Figma.',
      'Exceptional eye for typography, layout composition, and modern editorial aesthetics.'
    ]
  },
  {
    id: 'bde',
    title: 'Business Development Executive',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Identify and onboard high-potential brand clients looking for premium marketing solutions.',
      'Craft tailored pitch decks, conduct discovery calls, and manage client relationships.'
    ],
    requirements: [
      'Excellent communication, negotiation, and interpersonal skills.',
      'Prior B2B sales or agency experience with a strong network in the D2C/retail ecosystem.'
    ]
  },
  {
    id: 'cc',
    title: 'Content Creator / Influencer Coordinator',
    location: 'Pan India / Remote',
    type: 'Full Time / Freelance',
    responsibilities: [
      'Scout, negotiate, and collaborate with top-tier influencers and creators for brand campaigns.',
      'Script engaging video concepts and ensure seamless execution of creator deliverables.'
    ],
    requirements: [
      'Deep understanding of the Indian influencer ecosystem and creator rates.',
      'Charismatic communication skills and strong project management capabilities.'
    ]
  }
];

export default function Careers() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileNavActive, setIsMobileNavActive] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [reason, setReason] = useState('');

  // Submit states
  const [isSending, setIsSending] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccordion = (id: string) => {
    if (activeAccordion === id) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(id);
    }
  };

  const handleApplyClick = (e: React.MouseEvent, roleName: string) => {
    e.stopPropagation();
    setRole(roleName);
    const applySection = document.getElementById('apply-now');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !role || !portfolio.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    setIsSending(true);
    setFormError('');

    const templateParams = {
      from_name: name,
      from_email: email,
      phone: phone,
      position: role,
      portfolio: portfolio,
      why_join: reason,
      reply_to: email
    };

    try {
      await Promise.all([
        emailjs.send(
          EMAILJS_CONFIG.CAREERS_SERVICE_ID,
          EMAILJS_CONFIG.CAREERS_TEMPLATE_ID,
          {
            ...templateParams,
            to_email: 'career@promopartnersmarketing.com',
            to_name: 'PromoPartners HR',
            subject: `New Application - ${role} from ${name}`
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        ),
        emailjs.send(
          EMAILJS_CONFIG.CAREERS_SERVICE_ID,
          EMAILJS_CONFIG.CAREERS_TEMPLATE_ID,
          {
            ...templateParams,
            to_email: email,
            to_name: name,
            subject: 'Application Received — PromoPartners®'
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        ).catch((err) => {
          console.log('Applicant copy failed, continuing...', err);
        })
      ]);

      setFormSubmitted(true);
      setIsSending(false);
    } catch (error) {
      console.log('EmailJS FAILED:', error);
      setIsSending(false);
      setFormError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {/* Custom Cursor (hidden/disabled default as per visual styles) */}
      
      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <div className="logo-container cursor-hover">
          <a href="/" style={{ textDecoration: 'none' }}>
            <div className="logo">PROMO<span>PARTNERS</span><span className="reg-mark">®</span></div>
            <div className="logo-subtext">MARKETING</div>
          </a>
        </div>
        <ul className="nav-links">
          <li><a href="/" className="cursor-hover">Home</a></li>
          <li><a href="/#services" className="cursor-hover">Services</a></li>
          <li><a href="/#work" className="cursor-hover">Work</a></li>
          <li><a href="/careers/" className="cursor-hover">Careers</a></li>
          <li><a href="/#about" className="cursor-hover">About</a></li>
          <li><a href="/#contact" className="cursor-hover">Contact</a></li>
        </ul>
        <button onClick={() => setIsMobileNavActive(true)} className="hamburger-btn cursor-hover" aria-label="Open Navigation">☰</button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <div className={`nav-overlay ${isMobileNavActive ? 'active' : ''}`} id="nav-overlay">
        <button onClick={() => setIsMobileNavActive(false)} className="close-overlay-btn cursor-hover" aria-label="Close Navigation">✕</button>
        <ul className="overlay-links">
          <li><a href="/" className="cursor-hover">Home</a></li>
          <li><a href="/#services" className="cursor-hover">Services</a></li>
          <li><a href="/#work" className="cursor-hover">Work</a></li>
          <li><a href="/careers/" className="cursor-hover">Careers</a></li>
          <li><a href="/#about" className="cursor-hover">About</a></li>
          <li><a href="/#contact" className="cursor-hover">Contact</a></li>
        </ul>
      </div>

      {/* Hero Section */}
      <header className="careers-hero">
        <div className="hero-tagline">SOCH SE STRATEGY TAK SAB YAHIN</div>
        <h1>JOIN THE TEAM</h1>
        <p>We're building something big. Come be part of it.</p>
      </header>

      {/* Why Join Us Section */}
      <section className="why-join-us">
        <div className="section-header">
          <h2>WHY JOIN US</h2>
        </div>
        <div className="why-grid">
          <div className="why-card cursor-hover">
            <div className="why-icon">🚀</div>
            <div className="why-title">Fast Growth</div>
            <div className="why-desc">Work on real campaigns from day one. No bureaucracy, just high-impact execution and rapid career scaling.</div>
          </div>
          <div className="why-card cursor-hover">
            <div className="why-icon">🎯</div>
            <div className="why-title">Real Experience</div>
            <div className="why-desc">Hands-on with top brands across India. Shape the digital narratives of industry leaders like Snitch Clothing.</div>
          </div>
          <div className="why-card cursor-hover">
            <div className="why-icon">🤝</div>
            <div className="why-title">Great Culture</div>
            <div className="why-desc">Young, energetic, driven team of 10+. A collaborative environment where bold ideas are celebrated.</div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="open-positions">
        <div className="section-header">
          <h2>OPEN POSITIONS</h2>
        </div>
        <div className="positions-container">
          {openPositions.map((pos) => {
            const isActive = activeAccordion === pos.id;
            return (
              <div key={pos.id} className={`position-card cursor-hover ${isActive ? 'active' : ''}`}>
                <div className="position-header" onClick={() => toggleAccordion(pos.id)}>
                  <div className="position-info">
                    <div className="position-title">{pos.title}</div>
                    <div className="position-meta">
                      <div className="meta-item">📍 {pos.location}</div>
                      <div className="meta-item">💼 {pos.type}</div>
                    </div>
                  </div>
                  <div className="position-actions">
                    <button className="btn-apply cursor-hover" onClick={(e) => handleApplyClick(e, pos.title)}>APPLY NOW</button>
                    <div className="accordion-toggle cursor-hover">
                      <svg className="accordion-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
                <div 
                  className="position-body" 
                  style={{ 
                    maxHeight: isActive ? '500px' : '0px', 
                    transition: 'max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1)', 
                    overflow: 'hidden' 
                  }}
                >
                  <div className="position-content">
                    <h4>Responsibilities</h4>
                    <ul>
                      {pos.responsibilities.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                    <h4>Requirements</h4>
                    <ul>
                      {pos.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Apply Now Section */}
      <section id="apply-now" className="apply-now-section">
        <div className="section-header">
          <h2>APPLY NOW</h2>
        </div>
        <div className="apply-container">
          {formSubmitted ? (
            <div id="apply-success" style={{ display: 'block', backgroundColor: 'transparent', border: 'none', padding: 0 }} className="form-success">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🙌</div>
                <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontSize: '36px', color: '#C9A227', letterSpacing: '3px', marginBottom: '16px' }}>APPLICATION RECEIVED!</h2>
                <p style={{ color: '#2D3436', fontSize: '16px', lineHeight: '1.6', marginBottom: '12px' }}>Thank you for applying at PromoPartners! Our team will review your application and get back to you within <strong style={{ color: '#C9A227' }}>3-5 working days.</strong></p>
                <p style={{ color: '#666', fontSize: '13px', marginBottom: '24px' }}>A confirmation email has been sent to your inbox.</p>
                <div style={{ padding: '16px 24px', border: '1px solid #C9A227', color: '#C9A227', fontFamily: "'Bricolage Grotesque'", letterSpacing: '2px', fontSize: '14px' }}>
                  JAB DIKHEGA TABHI TO BIKEGA 🔥
                </div>
              </div>
            </div>
          ) : (
            <form id="careers-form" className="apply-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-name">Full Name</label>
                  <input type="text" id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-phone">Phone Number</label>
                  <input type="tel" id="c-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your Phone Number" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="c-email">Email</label>
                  <input type="email" id="c-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="c-role">Position Applying For</label>
                  <select id="c-role" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="" disabled>Select a position</option>
                    {openPositions.map((pos) => (
                      <option key={pos.id} value={pos.title}>{pos.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="c-portfolio">Portfolio / Instagram Link</label>
                <input type="url" id="c-portfolio" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="Your Portfolio Link" required />
              </div>

              <div className="form-group">
                <label htmlFor="c-reason">Why do you want to join?</label>
                <textarea id="c-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={4} placeholder="Your Message"></textarea>
              </div>

              <button type="submit" disabled={isSending} className={`submit-btn cursor-hover ${isSending ? 'btn-sending' : ''}`}>
                {isSending ? 'SENDING...' : 'SUBMIT APPLICATION'}
              </button>
              
              {formError && (
                <p style={{ color: '#e74c3c', fontSize: '13px', textAlign: 'center', marginTop: '12px', fontFamily: 'Manrope, sans-serif' }}>
                  {formError}
                </p>
              )}
            </form>
          )}

          <div className="contact-line">
            For direct applications DM us at <a href="https://www.instagram.com/promopartnersads" target="_blank" rel="noopener noreferrer" className="cursor-hover">@promopartnersads</a> or mail <a href="mailto:info@promopartnersmarketing.com" className="cursor-hover">info@promopartnersmarketing.com</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-grid">
          <div className="footer-logo-area">
            <div className="footer-logo">PROMO<span>PARTNERS</span><span className="reg-mark">®</span></div>
            <div className="footer-logo-subtext">MARKETING</div>
            <div className="footer-social">
              <a href="https://www.instagram.com/promopartnersads" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="cursor-hover">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://wa.me/917668191106" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="cursor-hover">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a href="mailto:info@promopartnersmarketing.com" aria-label="Email" className="cursor-hover">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <a href="/#about" className="cursor-hover">About</a>
            <a href="/#services" className="cursor-hover">Services</a>
            <a href="/#work" className="cursor-hover">Work</a>
            <a href="/careers/" className="cursor-hover">Careers</a>
            <a href="/#contact" className="cursor-hover">Contact</a>
          </div>

          <div className="footer-contact">
            <a href="mailto:info@promopartnersmarketing.com" className="cursor-hover">info@promopartnersmarketing.com</a><br />
            <a href="tel:+917668191106" className="cursor-hover">+91 7668191106</a> / <a href="tel:+918755746566" className="cursor-hover">+91 8755746566</a> | <a href="https://wa.me/917668191106" target="_blank" rel="noopener noreferrer" className="cursor-hover">WhatsApp</a><br />
            <a href="https://www.instagram.com/promopartnersads" target="_blank" rel="noopener noreferrer" className="cursor-hover">@promopartnersads</a><br />
            Haridwar, Uttarakhand — Pan India Available
          </div>
        </div>
      </footer>
    </>
  );
}
