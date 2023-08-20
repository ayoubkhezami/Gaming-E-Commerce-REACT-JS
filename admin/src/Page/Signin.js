import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import ResetPassword from './ResetPasword';



const Signin = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
  const expirationDate = new Date();
  expirationDate.setTime(expirationDate.getTime() + 60 * 1000);
  const email = useRef();
  const password = useRef();
  const [modalShow,setModalShow]=useState(false)

  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState('');
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (cookies.sessionAdmin) {
      navigate(`/Home`);
     
    }
  }, [cookies.sessionAdmin,navigate]);

  const handleLogin = () => {
    if (!email.current.value || !password.current.value) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const loginData = {};
  
    if (email.current.value.includes('@')) {
      loginData.email = email.current.value;
    } else {
      loginData.username = email.current.value;
    }
  
    loginData.password = password.current.value;
  
    axios
      .post('http://localhost:5000/admin', loginData)
      .then(function (response) {
        const { token, user, sessionId } = response.data;
  
        if (token && user && sessionId) {
          setCookie('sessionAdmin', sessionId, { path: '/'});
          setCookie('Admin', user.username, { path: '/'  });
          setCookie('idAdmin', user._id, { path: '/' });
          localStorage.setItem('imageData', user.profileImage);

          alert('Welcome, ' + user.username);
          if (user.role.name === 'Supadmin') {
            // Set a specific cookie for supadmin
            setCookie('supadminCookie', 'true', { path: '/' });
          }
          window.location.replace(`/Home`);
        }
      })
      .catch((error) => {
        if (error.response) {
          const { message } = error.response.data;
          setErrorMessage(message);
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };
 
  
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        // Call the function that handles login
        handleLogin();
      }
    };
  
    document.addEventListener('keydown', handleKeyPress);
  
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);
  useEffect(() => {
    const handlePopstate = () => {
      window.history.pushState(null, '', '/Home');
    };

    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);
  useEffect(() => {
    if (cookies.sessionAdmin) {
      window.location.replace('/Home');
    }
  }, []);
  return (
    <div style={{backgroundImage: "url('img/Black and Blue Modern Gradient Zoom Virtual Background.png')",  backgroundSize: "cover", backgroundRepeat: "no-repeat",backgroundPosition: "center"}}>
      
   
<div className="container-fluid position-relative d-flex align-items-center justify-content-center min-vh-100">
  <div className="bg-secondary rounded p-4 p-sm-5 mx-3" style={{ maxWidth: "450px", width: "80%" }}>
    <div className="d-flex align-items-center justify-content-between mb-3">
      <a href="index.html" className="">
        <h5 className="text-primary">
          <i className="fa fa-user-edit me-2">Gamer's zone</i>
        </h5>
      </a>
      <h5>Sign In</h5>
    </div>
    <div className="form-floating mb-3">
      <input type="email" className="form-control" id="email" placeholder="name@example.com" ref={email} style={{ width: "100%" }} />
      <label htmlFor="email">Email address</label>
    </div>
    <div className="form-floating mb-4">
       
    <input
      type="password"
      className="form-control"
      id="password"
      placeholder="Password"
      ref={password}
      style={{  
      height: "100%",
     }} 
    />
    <label htmlFor="password">Password</label>
  

    </div>


      
    {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
   
    <button type="submit" className="btn btn-primary py-3 w-100 mb-4" onClick={handleLogin}>Sign In</button>
    <div className="d-flex align-items-center justify-content-between mb-4">
      <Link onClick={() => setModalShow(true)}>Forgot Password</Link>
    </div> 
    <ResetPassword show={modalShow}
      onHide={() => setModalShow(false)} />
  </div>
</div>

</div>
  
   
  )
}

export default Signin
