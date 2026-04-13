import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainNav from './components/home/MainNav'
import About from './pages/About'
import Blog from './pages/Blog'
import Contact from './pages/Contact'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Home from './pages/Home'
import JoinUs from './pages/JoinUs'
import Projects from './pages/Projects'
import Subgroups from './pages/Subgroups'
import Team from './pages/Team'

function App() {
  return (
    <BrowserRouter>
      <MainNav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/join-us" element={<JoinUs />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/subgroups" element={<Subgroups />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
