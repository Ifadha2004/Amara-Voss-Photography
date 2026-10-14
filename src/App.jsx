import Header from "./components/Header"
import Hero from "./components/Hero"
import About from "./components/About"
import Footer from "./components/Footer"

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Gallery goes here next */}
        <About />
        {/* Contact goes here later */}
      </main>
      <Footer />
    </>
  )
}

export default App