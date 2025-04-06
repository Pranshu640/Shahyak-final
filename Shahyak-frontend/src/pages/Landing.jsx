import React, { useState, useEffect, useRef } from 'react';
import Iridescence from '../components/background/Iridescence';
import NavBar from '../components/Navbar/NavBar';
import BlurText from '../components/BlurText/Blurtext';
import SpotlightCard from '../components/spotlightcard/SpotlightCard';
import { FaHeartbeat, FaBell, FaUserMd, FaBrain, FaLaptopMedical, FaChartLine } from 'react-icons/fa';
import './Landing.css';
import { FaMicrophone, FaCalendarAlt } from 'react-icons/fa';

const Landing = () => {
  const [headingAnimated, setHeadingAnimated] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showProblem, setShowProblem] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  
  const featuresRef = useRef(null);
  const problemRef = useRef(null);
  const solutionRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Features section animation
      if (featuresRef.current) {
        const rect = featuresRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowFeatures(true);
          // Add parallax effect to feature cards
          const cards = document.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            const delay = index * 200;
            setTimeout(() => {
              card.classList.add('visible');
            }, delay);
          });
        }
      }
      
      // Problem section animation
      if (problemRef.current) {
        const rect = problemRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowProblem(true);
        }
      }
      
      // Solution section animation
      if (solutionRef.current) {
        const rect = solutionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowSolution(true);
        }
      }
      
      // Team section animation
      if (teamRef.current) {
        const rect = teamRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowTeam(true);
          // Add staggered animation to team members
          const members = document.querySelectorAll('.team-member');
          members.forEach((member, index) => {
            const delay = index * 200;
            setTimeout(() => {
              member.classList.add('visible');
            }, delay);
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headingAnimated) {
      // After heading animation completes, show description with a delay
      const descTimer = setTimeout(() => {
        setShowDescription(true);
      }, 800);

      // Show CTA buttons with a longer delay
      const ctaTimer = setTimeout(() => {
        setShowCta(true);
      }, 1500);

      return () => {
        clearTimeout(descTimer);
        clearTimeout(ctaTimer);
      };
    }
  }, [headingAnimated]);

  const handleAnimationComplete = () => {
    console.log('Animation complete');
    // Trigger the heading to move up with a slightly longer delay
    // to ensure animation completes properly
    setTimeout(() => {
      setHeadingAnimated(true);
    }, 600);
  };

  return (
    <div className="app-container">
      <Iridescence
        color={[1, 0.95, 1]}
        mouseReact={false}
        amplitude={0.15}
        speed={1.2}
      />
      <NavBar />
      <main className="container">
        <div className="landing-content">
          <div className={`heading-container ${headingAnimated ? 'moved-up' : ''}`}>
            <BlurText
              text="Your Personal Health-Care Platform"
              delay={150}
              className="blur-text"
              animateBy="words"
              direction="top"
              threshold={0.1}
              rootMargin="0px"
              animationFrom={{ opacity: 0, transform: 'translateY(20px)' }}
              animationTo={[{ opacity: 1, transform: 'translateY(0)' }]}
              easing="easeOutQuad"
              onAnimationComplete={handleAnimationComplete}
            />
          </div>
          
          <div className={`description-container ${showDescription ? 'visible' : ''}`}>
            <p className="text">
              SHAHYAK is an AI-powered health companion that provides personalized health insights, 
              medication reminders, and connects you with healthcare professionals. 
              Take control of your health journey with our intuitive platform.
            </p>
          </div>
          
          <div className={`cta-container ${showCta ? 'visible' : ''}`}>
            <a href="/signup" className="cta-button cta-primary">Get Started</a>
            <a href="/about" className="cta-button cta-secondary">Learn More</a>
          </div>
        </div>


        <div className="features-section" ref={featuresRef}>
  <h2 className={`features-heading ${showFeatures ? 'visible' : ''}`}>Powerful Features</h2>
  <div className={`features-grid ${showFeatures ? 'visible' : ''}`}>
    <SpotlightCard className="feature-card" spotlightColor="rgba(132, 0, 255, 0.14)">
      <div className="feature-icon">
        <FaHeartbeat />
      </div>
      <h3>AI Health Consultation</h3>
      <p>Get fast, personalized health advice using advanced AI. Input symptoms via text, voice, image, or live camera to receive instant recommendations and understand when to visit a doctor.</p>
      <a href="#" className="learn-more-btn">Learn More</a>
    </SpotlightCard>
    <SpotlightCard className="feature-card" spotlightColor="rgba(132, 0, 255, 0.14)">
      <div className="feature-icon">
        <FaMicrophone />
      </div>
      <h3>Real-Time Voice Consultation</h3>
      <p>Have a live voice-based conversation with our AI for a more interactive experience. Ask health questions, describe symptoms, and receive voice feedback — completely hands-free.</p>
      <a href="#" className="learn-more-btn">Learn More</a>
    </SpotlightCard>
    <SpotlightCard className="feature-card" spotlightColor="rgba(132, 0, 255, 0.14)">
      <div className="feature-icon">
        <FaUserMd />
      </div>
      <h3>Find Nearby Doctors</h3>
      <p>Discover healthcare professionals through our map-based and list-based system. Filter by specialization, read reviews, and book appointments directly through the platform.</p>
      <a href="#" className="learn-more-btn">Learn More</a>
    </SpotlightCard>
    <SpotlightCard className="feature-card" spotlightColor="rgba(132, 0, 255, 0.14)">
      <div className="feature-icon">
        <FaCalendarAlt />
      </div>
      <h3>Health Camps & Events</h3>
      <p>Browse upcoming health camps and awareness drives in your area. NGOs and organizations can list their events, making it easier for you to participate in community health initiatives.</p>
      <a href="#" className="learn-more-btn">Learn More</a>
    </SpotlightCard>
  </div>
</div>

        {/* Problem We Are Fixing Section */}
        <div className="problem-section" ref={problemRef}>
          <h2 className={`section-heading ${showProblem ? 'visible' : ''}`}>The Problem We Are Fixing</h2>
          <div className="problem-content">
            <div className={`problem-text ${showProblem ? 'visible' : ''}`}>
              <p>
              In today’s fast-paced world, managing personal health is harder than ever. Patients face challenges with remembering medications, monitoring symptoms, and getting help when they need it most.
              </p>
              <p>
              Many people either don’t track their health metrics, don’t follow prescriptions, or struggle to reach healthcare providers in time — leading to worsening conditions that could have been prevented.
              </p>
            </div>
            <div className={`problem-stats ${showProblem ? 'visible' : ''}`}>
              <div className="stat-card">
                <div className="stat-icon"><FaLaptopMedical /></div>
                <h3>50%</h3>
                <p>of patients don't take medications as prescribed</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaChartLine /></div>
                <h3>75%</h3>
                <p> adults aged 40 and older with a chronic condition admitted to some form of non-adherent behavior in the past 12 months</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon"><FaUserMd /></div>
                <h3>65 million</h3>
                <p>people in India face challenges in accessing timely healthcare services.​</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solution We Are Driving Section */}
        <div className="solution-section" ref={solutionRef}>
          <h2 className={`section-heading ${showSolution ? 'visible' : ''}`}>The Solution We Are Driving</h2>
          <div className={`solution-content ${showSolution ? 'visible' : ''}`}>
            <div className="solution-image">
              {/* Placeholder for solution image */}
              <div className="solution-image-placeholder"></div>
            </div>
            <div className="solution-text">
              <p>
              We’re building an intelligent AI Health Assistant that acts like a virtual doctor—available 24/7. It collects user input through voice, text, image, or camera and gives instant, personalized feedback.
              </p>
              <p>
              Using AI models for text and image understanding, the assistant suggests possible conditions, home remedies, or when to see a real doctor. Users can even talk to the assistant through a live voice call for a more human-like experience.
              </p>
              <p>
              Our goal is to make healthcare more accessible, interactive, and personalized. Future features like video calls, emotional analysis, and wearable integration will make health support feel truly connected and real.
              </p>
            </div>
          </div>
        </div>

        {/* Team and About Us Section */}
        <div className="team-section" ref={teamRef}>
          <h2 className={`section-heading ${showTeam ? 'visible' : ''}`}>The Team Behind SHAHYAK</h2>
          <p className={`team-intro ${showTeam ? 'visible' : ''}`}>
          We are a passionate group of student innovators—developers, designers, and health enthusiasts—dedicated to transforming how people manage their health using technology.

          </p>
          <div className={`team-grid ${showTeam ? 'visible' : ''}`}>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Pranshu Bansal</h3>
              <p className="member-role">Full Stack Developer</p>
              <p className="member-bio">Architecting seamless digital experiences across front, back, and beyond.</p>
            </div>
            <div className="team-member">
              <div className="member-photo"></div>
              <h3>Moksh</h3>
              <p className="member-role">AI Developer</p>
              <p className="member-bio">Pioneering intelligent medical innovations through code, compassion, and computation.</p>
            </div>
          </div>
          <div className={`team-cta ${showTeam ? 'visible' : ''}`}>
            <a href="/about" className="cta-button cta-primary">Learn More About Us</a>
            <a href="/contact" className="cta-button cta-secondary">Contact Our Team</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;