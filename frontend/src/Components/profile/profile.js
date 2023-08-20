import Spinner from "../spinner/spinner";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  MDBIcon,
  MDBInput,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter, } 
  from 'mdb-react-ui-kit';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import bcrypt from 'bcryptjs';
import History from "./history";
export default function Profile() {
  const [cookies] = useCookies(['session']);
  const navigate = useNavigate();

  const id = cookies.id;
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newTel, setNewTel] = useState('');
  const [UsernameError, setUsernameError] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [telError, settelError] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [CurrentPassword, setCurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [ConfirmnewPassword, setConfirmnewPassword] = useState("");
  const [PasswordError, setPasswordError] = useState('');
  const [CPasswordError, setCPasswordError] = useState('');
  const [CurrentPasswordError, setCurrentPasswordError] = useState('');
  const [topRightModal, setTopRightModal] = useState(false);
  const toggleShow = () => setTopRightModal(!topRightModal);

  const handlePasswordFormToggle = () => {
    setShowPasswordForm(!showPasswordForm);
    setCurrentPassword("");
    setnewPassword("");
    setConfirmnewPassword("");
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
      setNewProfileImage(reader.result);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/one' , { params: { id: id } });
        setUser(response.data);
        setIsLoading(false);
        setNewUsername(response.data.username); 
        setNewTel(response.data.phone_number);
        setNewProfileImage(response.data.profileImage);

      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    if (id ) {
      getUserData();
    } else {
      navigate('/Login');
    }
  }, [id, navigate]);

  const handleEdit = () => {
    setShowModal(true);

  };
  const handleCloseModal = () => {
    setNewUsername(user.username);
    setNewTel(user.phone_number);
    setNewProfileImage(user.profileImage);
    setErrorMessage('');
    setUsernameError('');
    settelError('');
    setShowModal(false);
    setShowPasswordForm(false);
    setCurrentPasswordError('');

  };
  const comparePassword = () => {
    const hashedPassword = user.password; 
    const match = bcrypt.compareSync(CurrentPassword, hashedPassword);
    return match;
  };
  const handleUpdate = () => {
    const phoneFormat = /^[0-9]+$/;
    const isPhoneValid = phoneFormat.test(newTel);
    let hasError = false;

   
  if (!newUsername || newUsername === '') {
    setUsernameError('Please enter your username');
    hasError = true;
  } else {
    setUsernameError('');
    
  }

  if ( !isPhoneValid|| newTel.length < 8) {
    settelError('Invalid Phone');
    hasError = true;
  } else {
    settelError('');
  }
  if(showPasswordForm){
  
  if (!comparePassword()) {
    setCurrentPasswordError('Incorrect current password');
    alert('Verify your information');
    hasError = true;

  } else {
    setCurrentPasswordError('');

  if (newPassword && newPassword.length <= 8) {
    setPasswordError('Weak Password!! (> 8 characters)');
    alert('Verify your information');
    hasError = true;

  } else {
    setPasswordError('');

    if (newPassword !== ConfirmnewPassword) {
      setCPasswordError('Verify your password :(');
      alert('Verify your information');
      hasError = true;

    }else {
      setCPasswordError('');

  }
}
  }
}
  if (!hasError) {
    updateUser({ username: newUsername, phone_number: newTel,profileImage:newProfileImage,password:newPassword });

  }
};

  const updateUser = async (updatedFields) => {
    try {
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      await axios.put(`http://localhost:5000/update/` + id, updatedUser);
      setShowPasswordForm(false);
      setCurrentPassword("");
      setnewPassword("");
      setConfirmnewPassword("");
      setPasswordError('');
      setCPasswordError('');
      setCurrentPasswordError('');
      setShowModal(false);
      setTopRightModal(!topRightModal);

    } catch (error) {
      alert('Error updating user information!');
      setShowModal(true);
      setNewUsername(user.username);
    setNewTel(user.phone_number);
    setNewProfileImage(user.profileImage);
    }
  };
  return (
    <div>
      {isLoading ? (
        <Spinner></Spinner>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="page-content">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="main-profile ">
                      <div className="row">
                        <div className="col-lg-4 d-flex justify-content-center align-items-center">
                          <img
                            src={user.profileImage}
                            alt=""
                            style={{
                              width: '200px',
                              height: '200px',
                              borderRadius: '50%',
                            }}
                          />
                        </div>
                        <div className="col-lg-4 align-self-center">
                          <div className="main-info header-text">
                            <span>Welcome</span>
                           
                            <h4   style={{
                              color:"white"
                            }}>
                              <MDBIcon
                                icon="user-alt"
                                className="me-2"
                              />
                              Name : {user.username} 
                            </h4>
                            <p>
                              You Haven't Gone Live yet. Go Live By Touching
                              The Button Below.
                            </p>
                          
 
                   
                          </div>
                        </div>
                        <div className="col-lg-4 align-self-center">
                          <ul>
                            <li>
                              <MDBIcon
                                icon="envelope"
                                className="me-2"
                              />
                              E-mail : {user.email}
                            </li>
                            <li>
                             
                              <MDBIcon
                                icon="phone-alt"
                                className="me-2"
                              />
                              Phone : {user.phone_number}
                              <li>
                            </li>

                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="container">
                        <div class="text-center">
                          <div className="heading-section">
                          
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">

                              <button  class="btn btn-warning "
                              style={{ backgroundColor: '#FF5DBF5E' ,marginBottom:20,marginLeft:5 , borderRadius:30,color: 'rgba(244, 240, 170, 0.61)',fontSize:"16px"}} onClick={handleEdit}>
                              <MDBIcon  icon="edit" className="me-2" />Update Profile
                              </button>
                              </div>
                              <Modal show={showModal} onHide={handleCloseModal}>
                              <Modal.Header >
                                <Modal.Title><MDBIcon fas icon="user-edit" /> Edit Your information</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                              <label className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"18px" }}><MDBIcon icon="user-circle" className="me-2" /> Username :</label>

                                <MDBInput
                                  type="text"
                                  value={newUsername}
                                  onChange={(e) => setNewUsername(e.target.value)}
                                  style={{
                                    backgroundColor: "#e8d3d8",
                                    borderRadius: "25px",
                                    marginTop: 5,
                                    marginBottom:20
                                  }}
                                />
                               <label className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"18px" }}><MDBIcon icon="phone-square" className="me-2" /> Phone :</label>

                                     <MDBInput
                                  type="text"
                                  value={newTel}
                                  onChange={(e) => setNewTel(e.target.value)}
                                  style={{
                                    backgroundColor: "#e8d3d8",
                                    borderRadius: "25px",
                                    marginTop: 5,
                                    marginBottom:20,
                                  }}
                                />
                                  <label className="form-label custom-label mb-2" style={{ color: '#e75e8d', fontSize: "18px" }}>
                                    <MDBIcon icon="camera" className="me-2" /> Profile Image:
                                  </label>
                                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                                  <MDBInput
                                    type="file"
                                    onChange={(e) => {
                                      setNewProfileImage(e.target.files[0]);
                                      handleImagePreview(e);
                                    }}
                                    style={{ marginBottom: 20 }}
                                  />
                                    {newProfileImage && (
                      <img src={newProfileImage} alt="Preview" style={{ marginTop: '10px', maxWidth: '200px', borderRadius: '50%' }} />
                    )}
                                              </div>

                              <span style={ {marginTop:15,fontSize: 14,color: 'red', marginBottom: 15}}>{UsernameError}</span> <br/>
                              <span style={ {marginTop:15,fontSize: 14,color: 'red', marginBottom: 15}}>{telError}</span> <br/>
                              <span style={ {marginTop:15,fontSize: 14,color: 'red', marginBottom: 15}}>{errorMessage}</span> 
                         
                              <div style={{ display: 'flex', justifyContent: 'center' }}>
                                
                              
                              <button
                                className="btn btn-warning"
                                style={{ marginBottom: 20, marginLeft: 5, borderRadius: 30, fontSize: "16px" }}
                                onClick={handlePasswordFormToggle}
                              >
                                <MDBIcon icon="unlock-alt" className="me-2" />
                                Change Password
                              </button>
                              </div>
                              {showPasswordForm && (
                                <form style={{ marginTop: '20px' }}>
                                  <label className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"18px" }}><MDBIcon icon="key" className="me-2" /> Current Password :</label>

                                      <MDBInput
                                        type="password"
                                        placeholder="Enter your password"
                                        value={CurrentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        style={{
                                          backgroundColor: "#e8d3d8",
                                          borderRadius: "25px",
                                          marginTop: 5,
                                          marginBottom:20
                                        }}
                                      />
                                      <label className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"18px" }}><MDBIcon icon="key" className="me-2" /> New Password :</label>

                                        <MDBInput
                                          type="password"
                                          placeholder="Enter your new password"

                                          value={newPassword}
                                          onChange={(e) => setnewPassword(e.target.value)}
                                          style={{
                                            backgroundColor: "#e8d3d8",
                                            borderRadius: "25px",
                                            marginTop: 5,
                                            marginBottom:20
                                          }}
                                        />
                                      <label className="form-label custom-label mb-2" style={{ color: '#e75e8d',fontSize:"18px" }}><MDBIcon icon="key" className="me-2" /> Confirm New Password :</label>

                                      <MDBInput
                                        type="password"
                                        placeholder="Confirm your new password"

                                        value={ConfirmnewPassword}
                                        onChange={(e) => setConfirmnewPassword(e.target.value)}
                                        style={{
                                          backgroundColor: "#e8d3d8",
                                          borderRadius: "25px",
                                          marginTop: 5,
                                          marginBottom:20
                                        }}
                                      />
                                           <span style={ {marginTop:15,fontSize: 14,color: 'red'}}>{PasswordError}</span> <br/>
                              <span style={ {marginTop:15,fontSize: 14,color: 'red'}}>{CPasswordError}</span> <br/><br/>
                              <span style={ {marginTop:15,fontSize: 14,color: 'red'}}>{CurrentPasswordError}</span> 
                                </form>
                                
                              )}
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                <MDBIcon far icon="times-circle" /> Close
                                </Button>
                                <Button variant="primary" onClick={handleUpdate}>
                                <MDBIcon fas icon="save" /> Save
                                </Button>
                              </Modal.Footer>
                            </Modal>

                            <MDBModal
                              animationDirection='right'
                              show={topRightModal}
                              tabIndex='-1'
                              setShow={setTopRightModal}
                              className="small-modal"
                            >
                              <MDBModalDialog position='top-right' side> 
                                <MDBModalContent>
                                  <MDBModalHeader className='bg-success text-white'>
                                    <MDBModalTitle ><MDBIcon far icon="bell" /> Notification</MDBModalTitle>
                                    <MDBBtn
                                      color='none'
                                      className='btn-close btn-close-white'
                                      onClick={toggleShow}
                                    ></MDBBtn>
                                  </MDBModalHeader>
                                  <MDBModalBody>
                                    <div className='row'>
                                      <div className='col-4 '>
                                        <i className='fa-solid fa-check-double fa-4x text-success'></i>

                                      </div>

                                      <div className='col-5'>
                                        <p>Updated  successfully....</p>
                                      </div>
                                    </div>
                                  </MDBModalBody>
                                  <MDBModalFooter>
                                  <button className="btn btn-outline-success" style={{ borderRadius: 30}} onClick={toggleShow}>
                                        Ok <MDBIcon far icon="check-circle" />
                                    </button>
                                  </MDBModalFooter>
                                </MDBModalContent>
                              </MDBModalDialog>
                            </MDBModal>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="page-content" style={{ border: "solid", marginBottom: "15px",  borderRadius: "60px",backgroundImage: "url('../assets/images/4597148.jpg')",  backgroundSize: "cover", backgroundRepeat: "no-repeat",backgroundPosition: "center" }}>

                    <History/>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
