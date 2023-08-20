
import React, { useState,useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {  MDBIcon } from 'mdb-react-ui-kit'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const Admin = () => {
  const [cookies] = useCookies()
  const navigate = useNavigate();

  useEffect(() => {

    if ( !cookies.supadminCookie) {
      window.location.replace('/Home');
    }
  }, [navigate,cookies.supadminCookie])

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleImagePreview = (pic) => {
   
    const reader = new FileReader();
    const file = pic.target.files[0];

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setErrorMessage('Invalid file format. Only JPG and PNG images are allowed.');
      return;
    }

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };
  
  const handleADD = () => {
  

    if (!username || !email || !pic || !phone ) {
        setErrorMessage('All fields are required.');
      return;
    }

 

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phone) || phone.length !== 8) {
      setErrorMessage('Phone number should contain only numbers and be at least 8 digits long.');
      return;
    }
  

    const Admin = {
        username: username,
        email: email,
        phone_number: phone,
        profileImage: imagePreview,
      };
  

    axios
      .post('http://localhost:5000/CreatAdmin', Admin)
      .then(function (response) {
        console.log(response);
        alert('New Admin Add ');
        navigate('/Home');
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
  return (
    <div class="container-fluid position-relative d-flex p-0">
    <div class="content">
       <div className="container-fluid ">
       <div className="row justify-content-center align-items-center">

          <div className="col-sm-6 col-xl-6">
            <div className="bg-secondary rounded h-100 p-4">
              <h4 className="mb-4" style={{textAlign:"center"}}> <MDBIcon fas icon="plus" /> ADD Admin</h4>
              <div className="input-group mb-5">
                <span className="input-group-text" id="basic-addon1"><MDBIcon far icon="user-circle" /></span>
                <input 
                type="text"
                 className="form-control"
                  placeholder="username" 
                  aria-label="name" 
                  aria-describedby="basic-addon1" 
                   value={username}
                  onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="input-group mb-5">
                <span className="input-group-text" id="basic-addon1"><MDBIcon fas icon="at" /></span>
                <input 
                type="email"
                 className="form-control"
                  placeholder="Email" 
                  aria-label="name" 
                  aria-describedby="basic-addon1" 
                   value={email}
                  onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="input-group mb-5">
              <span className="input-group-text" id="basic-addon1"><MDBIcon fas icon="phone-square-alt" /></span>
                <input type="text" 
                className="form-control" 
                aria-label="Amount (to the nearest dollar)" 
                 placeholder="Phone" 
                 value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                 />
                

              </div>
     

              <div className="input-group mb-5">
              <span className="input-group-text" id="basic-addon2"><MDBIcon far icon="images" /></span>

              <input className="input-group-text"
               type="file"
                id="avatar"
                 name="avatar"
                  accept="image/png, image/jpeg" 
                  style={{backgroundColor:"black"}}
                  onChange={(e) => {
                    setPic(e.target.files[0]);
                    handleImagePreview(e);
                  }}
                   />
                   
              </div>
              {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{  maxWidth: '200px', borderRadius: '50%' }} />
                    )}
             
              <br/>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

<div className=" input-group  d-grid gap-2 d-md-flex justify-content-md-end">
  <button
    className="btn btn-primary btn-lg"
    size="lg"
    onClick={handleADD}

  >
   <MDBIcon far icon="save" /> Save
  </button>
</div>
            </div>
            
          </div>
    
        </div>
        </div>
        </div>
      
  </div>

  )
}

export default Admin


