import Navbar from './Navbar';
import Typewriter from './Typewriter';
import '../styles/cover.css';

function Cover() {
    const skills = [
        "AI Integration",
        "LLM API Architecture",
        "AI Agent Development",
        "Prompt Engineering",
        "React & Node.js",
        "Software Development",
        "AI Data Annotation",
    ];

    return (
        <div className='coverContainer'>
            <div className='navBarContainer'>
                <Navbar />
            </div>
            <div className='coverContent'>
                <div className='coverContentHeader'>
                    <h1>LET'S GROW.</h1>
                    <h2>Built to adapt, wired to grow</h2>
                </div>
                <div className='coverMiddleRow'>
                    <div className='introText'>
                        <p>Hi, I'm <span className='coverHighlight'>Walter</span> — a JavaScript developer and React & Node specialist with a focus on</p>
                        <div className='typewriterContainer'>
                            <Typewriter words={skills} />
                        </div>
                    </div>
                    <div className='coverImage'>
                        <img src="/images/Grow.webp" alt="Illustration representing growth and development" style={{ maxWidth: '350px', width: '100%', height: 'auto' }} />
                    </div>
                    <div className='ctaButton'>
                        <a className='ctaLink' href="#works">View My Projects</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cover;
