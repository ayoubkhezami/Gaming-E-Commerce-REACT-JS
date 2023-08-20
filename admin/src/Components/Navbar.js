import { useCookies } from 'react-cookie';
import { NavLink } from 'react-router-dom';

function Navbar(){
  const [cookies, setCookie, removeCookie] = useCookies (['sessionAdmin', 'Admin', 'idAdmin', 'sessionSupAdmin', 'SupAdmin', 'idSupAdmin']);
  const imageData = localStorage.getItem('imageData');
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout ?');

    if (confirmLogout) {
      removeCookie('sessionAdmin');
      removeCookie('Admin');
      removeCookie('idAdmin');
      removeCookie('supadminCookie');
      
      localStorage.removeItem('imageData');
    }
  };
  return(


<div className="content">
    {/* Navbar Start */}
    <nav className="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
      <a href="index.html" className="navbar-brand d-flex d-lg-none me-4">
        <h2 className="text-primary mb-0"><i className="fa fa-user-edit" /></h2>
      </a>

      <div className="navbar-nav align-items-center ms-auto">
        
        
        <div className="nav-item dropdown">
          <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
            <img className="rounded-circle me-lg-2" src={imageData} alt style={{width: 40, height: 40}} />
            <span className="d-none d-lg-inline-flex">{cookies.Admin}</span>
          </a>
          <div className="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
            <NavLink to="/" onClick={handleLogout} className="dropdown-item">Log Out</NavLink>
          </div>
        </div>
      </div>
    </nav>
    </div>
    );
}
export default Navbar