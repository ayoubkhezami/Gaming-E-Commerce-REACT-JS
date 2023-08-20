import React, {  useState, useEffect } from 'react';
import {  MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'; 

function ResetPassword(props) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
 
  const handleResetPassword = async () => {
    try {
      
      const response = await axios.post(
        'http://localhost:5000/ResetPassword',{email});
      if (response.data.status === 'SUCCESS') {
       alert('Email sent successfully. Please check your inbox.');
        setError('');
        props.onHide();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again later.');
    }
  };
  return (
    <Modal {...props} > 
    <Modal.Header closeButton style={{backgroundColor:" rgba(0,0,0,0.7736344537815126)"}} >
    <Modal.Title className="text-center w-100">
    <MDBIcon fas icon="key" /> Reset Password
</Modal.Title>
       </Modal.Header>
        <Modal.Body >
        <label htmlFor="email"  style={{ fontSize:"18px",marginBottom:"10px"}}> <MDBIcon far icon="envelope" /> Email address</label> 

<input type="email" className="form-control"  placeholder="name@example.com"  value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />

             </Modal.Body>
        <Modal.Footer >
        {error && <p style={ {marginTop:10,fontSize: 16,color: 'red', marginBottom: 10}}>{error}</p> }

        <div class=" d-md-flex justify-content-md-end">
        <button
                 className="btn btn-primary "
                 style={{ borderRadius:"10px"}}
                 onClick={handleResetPassword}
                >
                <MDBIcon far icon="paper-plane" /> Send
                </button>
</div>
</Modal.Footer >

    {/* You can add a footer here if needed */}
  </Modal>
  )
}

export default ResetPassword