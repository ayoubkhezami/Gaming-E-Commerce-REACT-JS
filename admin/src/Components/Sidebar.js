import React, { useRef, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

import { Link, useLocation } from 'react-router-dom';
function Sidebar(){
  const location = useLocation();

  const [activeLink, setActiveLink] = useState(location.pathname);
  const [cookies, setCookie, removeCookie] = useCookies (['sessionAdmin', 'Admin', 'idAdmin', 'supadminCookie']);
  const imageData = localStorage.getItem('imageData');

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);
    return(
      <div className="content">
      <div className="container-fluid position-relative d-flex p-0">
<div className="sidebar pe-4 pb-3">
      <nav className="navbar bg-secondary navbar-dark">
      
        <Link to="/Home" className="navbar-brand mx-4 mb-3">
        <h3 className="text-primary" style={{lineHeight:0.6 ,color:'#d63384'}} ><img  className='logo' src="img/logo1.png"  style={{width: 60, height: 60,display:'block',marginLeft:'auto',marginRight:'auto',}} /><br/>Gamer's <span style={{color : 'white'}}>zone</span></h3>
        </Link>
        <div className="d-flex align-items-center ms-4 mb-4">
          <div className="position-relative">
            <img className="rounded-circle" src={imageData} alt style={{width: 40, height: 40}} />
            <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1" />
          </div>
          <div className="ms-3">
  <h6 className="mb-0">{cookies.Admin}</h6>
  {cookies.supadminCookie === 'true' ? (
    <span>Supadmin</span>
  ) : (
    <span>Admin</span>
  )}
</div>
        </div>
        <div className="navbar-nav w-100">
        <Link
        to="/Home"
        className={`nav-item nav-link ${activeLink === '/Home' ? 'active' : ''}`}
        onClick={() => handleLinkClick('/Home')}
      ><i className="fa fa-tachometer-alt me-2" />Dashboard</Link>
           <Link  to="/Table" className={`nav-item nav-link ${activeLink === '/Table' ? 'active' : ''}`}  onClick={() => handleLinkClick('/Table')}><i className="fa fa-table me-2" />Tables Of Product</Link>
           <Link to="/Form" className={`nav-item nav-link ${activeLink === '/Form' ? 'active' : ''}`}  onClick={() => handleLinkClick('/Form')}><i className="fa fa-keyboard me-2" />ADD Product</Link>

          <Link to="/Chart" className={`nav-item nav-link ${activeLink === '/Chart' ? 'active' : ''}`}  onClick={() => handleLinkClick('/Chart')}><i className="fa fa-chart-bar me-2" />Income</Link>
          {cookies.supadminCookie && (
            <>
          <Link
            to="/Admin"
            className={`nav-item nav-link ${activeLink === '/Admin' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/Admin')}
          ><i className=" fa fa-user-plus me-2" />ADD Admin</Link>
          <Link
            to="/ListeAdmin"
            className={`nav-item nav-link ${activeLink === '/ListeAdmin' ? 'active' : ''}`}
            onClick={() => handleLinkClick('/ListeAdmin')}
          ><i className="fa fa-address-card me-2"/>Admin's List</Link>
          </>
        )}
        </div>
      
      </nav>
    </div>
    </div>
     </div>
    );
}
export default Sidebar