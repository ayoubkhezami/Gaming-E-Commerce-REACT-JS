import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { MDBContainer, MDBCol, MDBRow, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);

  const emailOrUsername = useRef();
  const password = useRef();
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
    if (cookies.session) {
      navigate(`/profile`);
     
    }
  }, [cookies.session, cookies.username, navigate]);

  const handleLogin = () => {
    if (!emailOrUsername.current.value || !password.current.value) {
      setErrorMessage('All fields are required.');
      return;
    }
  
    const loginData = {};
  
    if (emailOrUsername.current.value.includes('@')) {
      loginData.email = emailOrUsername.current.value;
    } else {
      loginData.username = emailOrUsername.current.value;
    }
  
    loginData.password = password.current.value;
  
    axios
      .post('http://localhost:5000/signIn', loginData)
      .then(function (response) {
        const { token, user, sessionId } = response.data;
  
        if (token && user && sessionId) {
          setCookie('session', sessionId,  { path: '/' });
          setCookie('username', user.username, { path: '/' });
          setCookie('id', user._id, { path: '/' });
          alert('Welcome, ' + user.username);
          navigate(`/profile`);

          // Fetch the user's cart data and set cartItemsCount
          axios
            .get('http://localhost:5000/cart/user', { params: { IdUser: user._id } })
            .then((response) => {
              const cartItemsCount = response.data[0].items.length;
              setCookie('cartItemsCount', cartItemsCount,  { path: '/'  });
              setCookie('CardId', response.data[0]._id,  { path: '/'  });

            })
            .catch((error) => {
              console.error('Error fetching cart data:', error);
              setCookie('cartItemsCount', 0, { path: '/' });
              
            });
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
  
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="page-content">
            <h1 style={{ color: '#a06177' ,textAlign:"center"}}>Welcome back, you've been missed!</h1>

            <MDBContainer fluid className="p-3 my-4">
            <MDBRow>
                <MDBCol col="5" md="5">
                
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
                    className="img-fluid"
                   
                  />
               </MDBCol>
               <MDBCol col="7" md="6"style={{ marginTop:"100px" }}>

                  <div className="mb-4">
                    <label htmlFor="emailInput" className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"20px" }}><MDBIcon icon="envelope" className="me-2" /> Email address :</label>
                    <MDBInput
                      id="emailInput"
                      type="email"
                      size="lg"
                      icon="envelope"
                      iconClass="text-primary"
                      placeholder="Enter your email"
                      ref={emailOrUsername}
                      style={{ backgroundColor:"#e8d3d8" ,borderRadius:"25px"}}

                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="passwordInput" className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"20px" }}><MDBIcon icon="lock" className="me-2"/>Password :</label>
                    <MDBInput
                      id="passwordInput"
                      type={showPassword ? 'text' : 'password'} 
                      size="lg"
                      icon="lock"
                      iconClass="text-primary"
                      placeholder="Enter your password"
                      ref={password}
                      style={{ backgroundColor:"#e8d3d8" ,borderRadius:"25px"}}>

                        <div className="position-relative">
                              <button
                                className="btn btn-link btn-sm"
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                  position: 'absolute',
                                  right: '10px',
                                  transform: 'translateY(-120%)',
                                }}
                              >
                                {showPassword ? (
                                  <MDBIcon icon="eye" />
                                ) : (
                                  <MDBIcon icon="eye-slash" />
                                )}
                              </button>
                            </div>
                            </MDBInput>

                  </div>
                  {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                  <div className="d-flex justify-content-between mx-4 mb-4">
                    <Link to="/ResetPassword">Forgot password?</Link>
                    <Link to="/Registre" className="text-end">Are you New? Create account</Link>
                  </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                 className="btn btn-primary btn-lg"
                 size="lg"
                 style={{ backgroundColor: '#e75e8e5b' }}
                onClick={handleLogin} >
                <MDBIcon icon="sign-in-alt" className="me-2" /> Login
                </button>
                </div>
                </MDBCol>

              </MDBRow>
            </MDBContainer>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
