import Navbar from './navbar';
import Typewriter from './typewriter';
import Image from 'next/image';
import styles from '../styles/cover.css'; 

function Cover() {
    const skills = [
        "Full Stack Development",
        "Interactive Web Apps",
        "API Integration & Design",
        "Creative Problem-Solving",
        "Continuous Learning",
        "LLM and AI Technologies"
    ];

    return (
        <div className='coverContainer'>
            <div className='navBarContainer'>
                <Navbar />
            </div>
            <div className='coverContent'>
                <div className='coverContentHeader'>
                    <h1>LET'S GROW.</h1>
                    <h3>Innovative solutions rooted in creativity</h3>
                </div>
                <div className='coverMiddleRow'>
                    <div className='introText'>
                        <p>Hi, I'm <span className='coverHighlight'>Walter</span> — I'm a Full Stack Javascript Developer that loves solving problems with</p>
                         <div className='typewriterContainer'>
                         <Typewriter words={skills} />
                         </div>
            
                    </div>
                    <div className='coverImage'>
                        <Image src="/images/grow.png" alt="Grow" width={350} height={350} />
                    </div>
                    <div className='ctaButton'>
                        <button>View My Work</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Cover;


