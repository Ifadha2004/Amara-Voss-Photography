import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Footer from "./components/Footer"
import Gallery from "./components/Gallery"

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Gallery goes here next */}
        <Gallery />
        <About />
        {/* Contact goes here later */}
      </main>
      <Footer />
    </>
  )
}

export default App