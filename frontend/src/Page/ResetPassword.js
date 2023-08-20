import React, {  useState, useEffect } from 'react';
import { MDBContainer, MDBCol, MDBRow, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {  useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['session']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    if (cookies.session) {
      navigate(`/profile/${cookies.username}`);
    }
  }, [cookies.session, cookies.username, navigate]);
  const handleResetPassword = async () => {
    try {
      
      const response = await axios.post(
        'http://localhost:5000/ResetPassword',{email});
      if (response.data.status === 'SUCCESS') {
       alert('Email sent successfully. Please check your inbox.');
        setError('');
        navigate('/Login');

      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="page-content">
            <h1 style={{ color: '#F480C6D4' ,textAlign:"center"}}><MDBIcon icon="lock" className="me-2" />Forgot your Password?</h1>
            <br/>
            <h5 style={{ color: 'rgba(255, 255, 255, 1)' ,textAlign:"center"}}>Don't Worry! Enter your email and we'll email you with new password</h5>
            <MDBContainer fluid className="p-3 my-4">
              <MDBRow>
                <MDBCol col="5" md="5">
                  <img
                    src="../assets/images/reset-password.png"
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
                      style={{ backgroundColor:"#e8d3d8" ,borderRadius:"25px"}}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
            
                 <div className="text-danger mb-3"></div>
                 {error && <p style={ {marginTop:10,fontSize: 16,color: 'red', marginBottom: 10}}>{error}</p> }
               
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                 className="btn btn-primary btn-lg"
                 size="lg"
                 style={{ backgroundColor: '#e75e8e5b' }}
                 onClick={handleResetPassword}
                >
                <MDBIcon  icon="key"className="me-2" /> Reset Password
                </button>
                </div>

                </MDBCol>
              </MDBRow>
            </MDBContainer>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword