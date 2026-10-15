import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Footer from "./components/Footer"
import Gallery from "./components/Gallery"
import Contact from "./components/Contact"

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App