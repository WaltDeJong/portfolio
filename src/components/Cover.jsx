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
                    <h3>Built to adapt, wired to grow</h3>
                </div>
                <div className='coverMiddleRow'>
                    <div className='introText'>
                        <p>Hi, I'm <span className='coverHighlight'>Walter</span> — a JavaScript developer and React & Node specialist with a focus on</p>
                        <div className='typewriterContainer'>
                            <Typewriter words={skills} />
                        </div>
                    </div>
                    <div className='coverImage'>
                        <img src="/images/Grow.png" alt="Grow" width={350} height={350} />
                    </div>
                    <div className='ctaButton'>
                        <button><a className='deskTopLink' href="#works">View My Projects</a></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cover;
