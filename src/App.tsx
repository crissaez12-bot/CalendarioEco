import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import MonteCarlo from './pages/MonteCarlo'
import News from './pages/News'
import Calendario from './pages/Calendario'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/monte-carlo" element={<MonteCarlo />} />
        <Route path="/news" element={<News />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
