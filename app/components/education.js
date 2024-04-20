import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../styles/education.css'; // Make sure this CSS is linked properly

function Education() {
  return (
    <div className="educationContainer" id='education'>
      <div className="educationText">
        <h2>Education and Learning</h2>
        <p>I love learning. Transitioning from a psychology degree at McMaster to criminology, and from horticulture studies at the University of Guelph as a municipal horticulturalist, my career has been a journey of continuous skill development. I've discovered coding is my passion and I love creating things that are efficient, elegant and amazing </p>
        <p>This journey includes completing an extensive Software Development program consisting of six rigorous graduate-level courses offered by the University of British Columbia.</p>
        <p>I'm adaptable and continuously learning new technologies from documentation, project based learning, and a multitude of online courses.  I believe there is always a solution, it just takes work.</p>
      </div>
      <div className="educationDetails">
        <div className="imagesRow">
          <Image src="/images/UBCLogo.jpg" alt="Grow" width={100} height={75} />
          <Image src="/images/EDXLogo.jpg" alt="Grow" width={100} height={75} />
        </div>
        <div className='educationDetailsText'>
            <div className='educationDetailsHeaderText'>
                <h3>MicroMasters Program in Software Development</h3>
                <button className='microMastersButton'><Link  target="_blank" rel="noopener noreferrer" href='https://credentials.edx.org/credentials/2c72714f22124783a1999131e0f09176/'>View MicroMasters Credential</Link></button>
                <p>A program offered by UBCx in collaboration with edX</p>
        </div>
        <p>I have successfully completed the UBCx Software Development MicroMasters® program, an intensive graduate-level series of courses focusing on robust programming, software system design, and agile development techniques. This rigorous program has equipped me with expert skills in Java and TypeScript, preparing me for advanced roles in software development. The completion of this program also positions me to pursue further studies and leverage my certificate towards a Master’s degree, showcasing my commitment to continuous professional growth.</p>
        <p>This program provided a comprehensive, graduate-level curriculum in software development, preparing me to advance in this rapidly evolving field.</p>
      </div>
      </div>
    </div>
  );
}

export default Education;


