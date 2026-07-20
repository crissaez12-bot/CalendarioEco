import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import General from './pages/General'
import MonteCarlo from './pages/MonteCarlo'
import News from './pages/News'
import Calendario from './pages/Calendario'
import Earnings from './pages/Earnings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/general" element={<General />} />
        <Route path="/monte-carlo" element={<MonteCarlo />} />
        <Route path="/news" element={<News />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/earnings" element={<Earnings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
