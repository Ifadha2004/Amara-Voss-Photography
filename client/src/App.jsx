import Header from "./components/Header"
import Hero from "./components/Hero"
import Gallery from "./components/Gallery"
import Events from "./components/Events"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"

import CheckoutStatus from "./components/CheckoutStatus"

function App() {
  const checkout = new URLSearchParams(window.location.search).get("checkout")
  if (checkout) return <><Header /><CheckoutStatus /><Footer /></>
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Gallery />
        <Events />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App