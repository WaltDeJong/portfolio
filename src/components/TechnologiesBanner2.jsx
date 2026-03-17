import { FaLinux, FaPython, FaDocker } from 'react-icons/fa';
import { SiGooglegemini, SiNginx, SiUbuntu, SiGoogleads, SiGoogleanalytics, SiAnthropic } from 'react-icons/si';
import '../styles/technologiesbanner.css';

function TechnologiesBanner2() {
  return (
    <div className="technologiesBanner">
      <div className="icon-container">
        <SiGooglegemini className="tech-icon" />
        <span>Gemini</span>
      </div>
      <div className="icon-container">
        <FaLinux className="tech-icon" />
        <span>Linux</span>
      </div>
      <div className="icon-container">
        <SiNginx className="tech-icon" />
        <span>Nginx</span>
      </div>
      <div className="icon-container">
        <FaPython className="tech-icon" />
        <span>Python</span>
      </div>
      <div className="icon-container">
        <SiUbuntu className="tech-icon" />
        <span>Ubuntu</span>
      </div>
      <div className="icon-container">
        <FaDocker className="tech-icon" />
        <span>Docker</span>
      </div>
      <div className="icon-container">
        <SiGoogleads className="tech-icon" />
        <span>Google Ads</span>
      </div>
      <div className="icon-container">
        <SiGoogleanalytics className="tech-icon" />
        <span>Google Analytics</span>
      </div>
<div className="icon-container">
        <SiAnthropic className="tech-icon" />
        <span>Anthropic</span>
      </div>
    </div>
  );
}

export default TechnologiesBanner2;
