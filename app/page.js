import Image from "next/image";
import styles from "./page.module.css";
import Cover from "./components/cover";
import TechnologiesBanner from "./components/technologiesBanner";
import Education from "./components/education";
import Projects from "./components/projects";
import Footer from "./components/footer";

export default function Home() {
  return (
   <>
   <Cover/>
   <TechnologiesBanner />
   <Education />
   <Projects />
   <Footer />
   </>
  );
}
