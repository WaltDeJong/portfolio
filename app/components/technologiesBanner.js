import { FaNodeJs, FaReact, FaHtml5, FaCss3Alt, FaGitAlt, FaGithub, FaDatabase } from 'react-icons/fa';
import { SiNextdotjs, SiDigitalocean, SiOpenai, SiStripe, SiJavascript } from 'react-icons/si';
import '../styles/technologiesbanner.css'; // Make sure to create this CSS file

function TechnologiesBanner() {
  return (
    <div className="technologiesBanner">
      <div className="icon-container">
        <FaNodeJs className="tech-icon" />
        <span>Node.js</span>
      </div>
      <div className="icon-container">
        <FaReact className="tech-icon" />
        <span>React.js</span>
      </div>
      <div className="icon-container">
        <SiNextdotjs className="tech-icon" />
        <span>Next.js</span>
      </div>
      <div className="icon-container">
        <SiDigitalocean className="tech-icon" />
        <span>DigitalOcean</span>
      </div>
      <div className="icon-container">
        <SiOpenai className="tech-icon" />
        <span>OpenAI</span>
      </div>
      <div className="icon-container">
        <SiStripe className="tech-icon" />
        <span>Stripe</span>
      </div>
      <div className="icon-container">
        <SiJavascript className="tech-icon" />
        <span>JavaScript</span>
      </div>
      <div className="icon-container">
        <FaHtml5 className="tech-icon" />
        <span>HTML5</span>
      </div>
      <div className="icon-container">
        <FaCss3Alt className="tech-icon" />
        <span>CSS3</span>
      </div>
      <div className="icon-container">
        <FaDatabase className="tech-icon" />
        <span>SQL</span>
      </div>
      <div className="icon-container">
        <FaGitAlt className="tech-icon" />
        <span>Git</span>
      </div>
      <div className="icon-container">
        <FaGithub className="tech-icon" />
        <span>GitHub</span>
      </div>
    </div>
  );
}

export default TechnologiesBanner;
