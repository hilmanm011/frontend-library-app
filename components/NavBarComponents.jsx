import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='mt-3'>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3 p-2">
        <h3 className='text-bold m-2' style={{ fontFamily: 'monospace', color: '#ffc107' }}>.LIBRARY</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/books">
                Daftar Buku
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/inventory">
                Inventory
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/mahasiswa">
                Mahasiswa
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/peminjaman">
                Daftar Peminjaman
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/history-peminjaman">
                History Peminjaman
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/report-peminjaman">
                Laporan Peminjaman
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
