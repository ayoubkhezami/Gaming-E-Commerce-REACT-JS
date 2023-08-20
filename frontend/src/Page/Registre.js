import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBCol, MDBRow, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pic, setPic] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
  const handleRegister = () => {
    const emailValue = email;
    const phoneValue = phone;
    const passwordValue = password;
    const confirmPasswordValue = confirmPassword;

    if (!username || !emailValue || !pic || !phoneValue || !passwordValue || !confirmPasswordValue) {
      setErrorMessage('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setErrorMessage('Invalid email format.');
      return;
    }

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneValue) || phoneValue.length < 8) {
      setErrorMessage('Phone number should contain only numbers and be at least 8 digits long.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(passwordValue)) {
      setErrorMessage(
        'Password should be at least 6 characters long and contain at least one lowercase letter, one uppercase letter, one symbol, and one digit.'
      );
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const UserData = {
      username: username,
      email: emailValue,
      phone_number: phoneValue,
      password: passwordValue,
      profileImage: imagePreview,
    };

    axios
      .post('http://localhost:5000/save', UserData)
      .then(function (response) {
        console.log(response);
        alert('Welcome, please verify your email before to login');
        navigate('/Login');
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
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <div className="page-content">
            <MDBContainer fluid>
              <MDBRow>
                <h1 className="mb-4" style={{ color: '#a06177', textAlign: 'center' }}>
                  <MDBIcon fas icon="user-plus" /> Create Account
                </h1>

                <MDBCol col="7" md="6">
                  <div className="mb-4">
                    <label
                      htmlFor="UsernameInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon icon="user-alt" className="me-2" /> Name :
                    </label>
                    <MDBInput
                      id="UsernameInput"
                      type="text"
                      size="lg"
                      icon="envelope"
                      iconClass="text-primary"
                      placeholder="Enter your name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="emailInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon icon="envelope" className="me-2" /> Email address :
                    </label>
                    <MDBInput
                      id="emailInput"
                      type="email"
                      size="lg"
                      icon="envelope"
                      iconClass="text-primary"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                     
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                   <MDBIcon icon="camera" className="me-2" /> Profile image :
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                      onChange={(e) => {
                        setPic(e.target.files[0]);
                        handleImagePreview(e);
                      }}
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '50%' }} />
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="PhoneInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon icon="phone-alt" className="me-2" /> Phone Number :
                    </label>
                    <MDBInput
                      id="PhoneInput"
                      size="lg"
                      icon="envelope"
                      iconClass="text-primary"
                      placeholder="Enter your Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="passwordInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon icon="lock" className="me-2" />
                      Password :
                    </label>
                    <MDBInput
                      id="passwordInput"
                      type={showPassword ? 'text' : 'password'} 
                      size="lg"
                      icon="lock"
                      iconClass="text-primary"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
           


                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPasswordInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon icon="lock" className="me-2" />
                      Confirm Password :
                    </label>
                    <MDBInput
                      id="confirmPasswordInput"
                      type={showPassword ? 'text' : 'password'} 
                      size="lg"
                      icon="lock"
                      iconClass="text-primary"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                  <div className="form-check my-2">
          <input
            className="form-check-input"
            type="checkbox"
            onChange={togglePasswordVisibility}
          />
                   <label className="form-check-label" htmlFor="showPassword" style={{ color: '#e75e8d' }}>
                          <MDBIcon far icon="eye" /> Show Password
                    </label>
        </div>
                  {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                  <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      className="btn btn-primary btn-lg"
                      size="lg"
                      style={{ backgroundColor: '#e75e8e5b' }}
                      onClick={handleRegister}
                    >
                      <MDBIcon icon="sign-in-alt" className="me-2" /> Register
                    </button>
                  </div>
                </MDBCol>
                <MDBCol col="5" md="6" style={{ marginTop: '100px' }}>
                  <img src="https://cdn-icons-png.flaticon.com/512/3456/3456400.png" className="img-fluid" alt="Registration" />
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;