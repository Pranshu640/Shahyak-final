import React, { useEffect, useState, useRef } from 'react';
import NavBar from '../components/Navbar/NavBar';
import Iridescence from '../components/background/Iridescence';
import { FaLightbulb, FaHandHoldingHeart, FaUsers, FaRocket } from 'react-icons/fa';
import './About.css';

const About = () => {
  const [showMission, setShowMission] = useState(false);
  const [showValues, setShowValues] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showStory, setShowStory] = useState(false);
  
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const storyRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Mission section animation
      if (missionRef.current) {
        const rect = missionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowMission(true);
        }
      }
      
      // Values section animation
      if (valuesRef.current) {
        const rect = valuesRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowValues(true);
        }
      }
      
      // Team section animation
      if (teamRef.current) {
        const rect = teamRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowTeam(true);
          // Add staggered animation to team members
          const members = document.querySelectorAll('.about-team-member');
          members.forEach((member, index) => {
            const delay = index * 200;
            setTimeout(() => {
              member.classList.add('visible');
            }, delay);
          });
        }
      }
      
      // Story section animation
      if (storyRef.current) {
        const rect = storyRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        if (isVisible) {
          setShowStory(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app-container">
      <Iridescence
        color={[1, 1, 1]}
        mouseReact={false}
        amplitude={0.1}
        speed={1.0}
      />
      <NavBar />
      <main className="about-container">
        <section className="about-hero">
          <h1 className="about-title">About SHAHYAK</h1>
          <p className="about-subtitle">Revolutionizing personal healthcare through AI innovation</p>
        </section>
        
        <section className="about-mission" ref={missionRef}>
          <h2 className={`section-heading ${showMission ? 'visible' : ''}`}>Our Mission</h2>
          <div className={`mission-content ${showMission ? 'visible' : ''}`}>
            <div className="mission-image"></div>
            <div className="mission-text">
              <p>At SHAHYAK, our mission is to empower individuals to take control of their health journey through accessible, intelligent technology.</p>
              <p>We believe that everyone deserves personalized healthcare support that adapts to their unique needs and circumstances. By combining artificial intelligence with human-centered design, we're creating solutions that make health management intuitive, effective, and even enjoyable.</p>
              <p>Our goal is to reduce preventable health complications, improve medication adherence, and create meaningful connections between patients and healthcare providers.</p>
            </div>
          </div>
        </section>
        
        <section className="about-values" ref={valuesRef}>
          <h2 className={`section-heading ${showValues ? 'visible' : ''}`}>Our Core Values</h2>
          <div className={`values-grid ${showValues ? 'visible' : ''}`}>
            <div className="value-card">
              <div className="value-icon"><FaLightbulb /></div>
              <h3>Innovation</h3>
              <p>We constantly push boundaries to create cutting-edge solutions that transform healthcare experiences.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaHandHoldingHeart /></div>
              <h3>Compassion</h3>
              <p>We approach every decision with empathy, understanding that behind every data point is a human life.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaUsers /></div>
              <h3>Inclusivity</h3>
              <p>We design for everyone, ensuring our solutions are accessible regardless of age, ability, or background.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><FaRocket /></div>
              <h3>Excellence</h3>
              <p>We hold ourselves to the highest standards in everything we do, from code quality to user experience.</p>
            </div>
          </div>
        </section>
        
        <section className="about-team" ref={teamRef}>
          <h2 className={`section-heading ${showTeam ? 'visible' : ''}`}>Meet Our Team</h2>
          <p className={`team-intro ${showTeam ? 'visible' : ''}`}>Our diverse team brings together expertise from healthcare, technology, and design to create solutions that truly make a difference.</p>
          
          <div className="about-team-grid">
          <div className="about-team-member">
              <div className="member-photo"></div>
              <h3>Pranshu Bansal</h3>
              <p className="member-role">Full Stack Developer</p>
              <p className="member-bio">Architecting seamless digital experiences across front, back, and beyond.</p>
            </div>
            <div className="about-team-member">
              <div className="member-photo"></div>
              <h3>Moksh</h3>
              <p className="member-role">AI Developer</p>
              <p className="member-bio">Pioneering intelligent medical innovations through code, compassion, and computation.</p>
            </div>
          </div>
        </section>
        
        <section className="about-story" ref={storyRef}>
          <h2 className={`section-heading ${showStory ? 'visible' : ''}`}>Our Story</h2>
          <div className={`story-content ${showStory ? 'visible' : ''}`}>
            <p>SHAHYAK began with a simple observation: despite tremendous advances in medical technology, many people still struggle with the day-to-day management of their health.</p>
            <p>Our founder, James Wilson, experienced this firsthand when helping his mother manage multiple chronic conditions. The fragmented nature of healthcare information, complicated medication schedules, and difficulty accessing timely support led to unnecessary complications and stress.</p>
            <p>In 2020, James assembled a team of healthcare professionals, AI specialists, and UX designers with a shared vision: to create an intelligent health companion that could simplify health management and provide personalized support.</p>
            <p>After two years of research, development, and user testing, SHAHYAK was born – a comprehensive platform that combines medication management, health monitoring, and professional support in one intuitive interface.</p>
            <p>Today, we're proud to be helping thousands of users take control of their health journey, and we're just getting started.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;