import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "../components/NavBarComponents"
import BookComponent from "../components/BookComponent"
import MahasiswaComponent from "../components/MahasiswaComponent"
import PeminjamanComponent from "../components/PeminjamanComponent"
import InventoryComponent from "../components/InventoryComponent"
import HisPeminjamanComponent from "../components/HisPeminjamanComponent"
import ReportComponent from "../components/ReportComponent"

function App() {

  return (
    <BrowserRouter>
    <div className="container">
      <NavBar />
      <Routes>
          <Route path="/books" element={<BookComponent />} />
          <Route path="/mahasiswa" element={<MahasiswaComponent />} />
          <Route path="/peminjaman" element={<PeminjamanComponent />} />
          <Route path="/inventory" element={<InventoryComponent />} />
          <Route path="/history-peminjaman" element={<HisPeminjamanComponent />} />
          <Route path="/report-peminjaman" element={<ReportComponent />} />
      </Routes>
    </div>
  </BrowserRouter>
  )
}

export default App
