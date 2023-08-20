import { Outlet } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Sidebar from'../Components/Sidebar';
import Footer from '../Components/footer';
import {  useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  let inactivityTimeout;

function resetInactivityTimeout() {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(() => {
    // Perform actions after inactivity timeout (e.g., delete cookies and redirect)
    deleteCookiesAndRedirect();
  }, 3*60*60*1000);
}
document.addEventListener('mousemove', resetInactivityTimeout);
document.addEventListener('keydown', resetInactivityTimeout);
document.addEventListener('scroll',resetInactivityTimeout)
function deleteCookiesAndRedirect() {
  // Delete all cookies
  setCookie('sessionAdmin', '', { path: '/', expires: new Date(0) });
  setCookie('Admin', '', { path: '/', expires: new Date(0) });
  setCookie('idAdmin', '', { path: '/', expires: new Date(0) });

  alert("your session has expired")
  navigate('/');
}
useEffect(() => {
  resetInactivityTimeout(); // Initial setup

  return () => {
    clearTimeout(inactivityTimeout);
    document.removeEventListener('mousemove', resetInactivityTimeout);
    document.removeEventListener('keydown', resetInactivityTimeout);
    document.removeEventListener('scroll',resetInactivityTimeout)
    // Remove other event listeners if added
  };
}, []);
useEffect(() => {
  if (!cookies.sessionAdmin) {
    window.location.replace('/');
  }
}, [navigate, cookies.sessionAdmin]);

    return (
      <div>
        <Navbar/>
         <Sidebar />
         <Outlet/> 
         <Footer/>
          
        
      </div>
    );
  }
  
  export default Home;