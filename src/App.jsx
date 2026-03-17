import Cover from './components/Cover'
import TechnologiesBanner from './components/TechnologiesBanner'
import TechnologiesBanner2 from './components/TechnologiesBanner2'
import ResumeConstellation from './components/ResumeConstellation'
import Works from './components/Works'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Cover />
      <main>
        <TechnologiesBanner />
        <ResumeConstellation />
        <TechnologiesBanner2 />
        <Works />
      </main>
      <Footer />
    </>
  )
}

export default App
