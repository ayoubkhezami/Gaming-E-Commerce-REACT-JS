
import { Link } from 'react-router-dom';
import React, {  useState,useEffect } from 'react';
import axios from 'axios';
import { MDBContainer, MDBCol, MDBRow, MDBIcon, MDBInput,MDBTextArea } from 'mdb-react-ui-kit';

function LandingPage(){
  const [games, setGames] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setmsg] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const send = async () => {
    if (!username || !email || !msg) {
      setErrorMessage('All fields are required.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Invalid email format.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/contact', {
        usernameInput: username,
        emailInput: email, 
        messageInput: msg,
      });
      alert('Your message has been sent successfully! A reply will be sent to your provided email.');
      setUsername('');
      setEmail('');
      setmsg('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.response?.data?.error || 'An error occurred while sending the email.');
    }
  };
  
  const fetchGames = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products/all');
      const gamesWithRatings = response.data.filter((game) => game.reviews.length > 0);

     const sortedGames = gamesWithRatings.sort((a, b) => {
      const ratingA = (a.reviews[0].rating); 
      const ratingB = (b.reviews[0].rating);

      return ratingB - ratingA;

    });
      setGames(sortedGames.slice(0, 4));
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };
  useEffect(() => {
    fetchGames();
  }, []);

    return(
    
    <>

<div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="page-content">
          <div className="main-banner1">
            <div className="row">
              <div className="col-lg-7">
                <div className="header-text">
                  
                  <h6 style={{ color: 'rgba(198,132,255,0.6055672268907564)' }} > <i class="fa-solid fa-door-open"></i> Welcome To Gamer's zone</h6>
                  <h4><em>Browse</em> Our Popular shop Here</h4>
                  <div className="main-button">
                    <Link to="/shop" className="lead fw-normal" ><i className="fa-solid fa-cart-shopping"></i> Browse Now </Link>

                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="most-popular">
            <div className="row">
              <div className="col-lg-12">
                <div className="heading-section">
                <h4><em>Most Reviwed</em> Product</h4>
                </div>
                <div className="row">
                      {games.map((game, index) => (
                        <div className="col-lg-3 col-sm-6" key={index}>
                          <div className="item">
                            <img src="assets/images/game-02.jpg" alt={game.name} />
                            <h4 style={{ color: 'rgba(255, 0, 128, 0.705)' }}>
                              <i className="fa-solid fa-barcode"></i> {game.name}
                              <br />
                              <span>Category: {game.category}</span>
                            </h4>
                            <ul>
                              {game.reviews.map((review, index) => (
                                <li key={index}>
                                  <i className="fa fa-star"></i> {review.rating}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                
                  <div className="col-lg-12">
                    <div className="main-button my-4">
                             <Link to="/shop" className="lead fw-normal" ><i className="fa-solid fa-plus"></i> More Product </Link>
                                           </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="gaming-library">
            <div className="col-lg-12">
              <div className="heading-section">
                <h4 style={{textAlign:"center"}}><em> Contact</em> Us <MDBIcon fas icon="comments" /> </h4>
              </div>
              <MDBContainer fluid>
              <MDBRow  className="justify-content-center">
                

                <MDBCol col="7" md="5" >
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
                   
                         iconClass="text-primary"
                      placeholder=" Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                
                 
                
                  <div className="mb-4">
                    <label
                      htmlFor="messageInput"
                      className="form-label custom-label mb-2"
                      style={{ color: '#e75e8d', fontSize: '20px' }}
                    >
                      <MDBIcon fas icon="comment"  className="me-2"/>
                      Your Message :
                    </label>
                    <MDBTextArea 
                      id="messageInput"
                      size="lg"
                      icon="lock"
                      iconClass="text-primary"
                      placeholder="Message"
                      value={msg}
                      onChange={(e) => setmsg(e.target.value)}
                      style={{ backgroundColor: '#e8d3d8', borderRadius: '25px' }}
                    />
                  </div>
                  {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

                  <div class="d-grid gap-2 d-md-flex ">
                    <button
                      className="btn btn-primary btn-lg"
                      size="lg"
                      style={{ backgroundColor: '#e75e8e5b' }}
                      onClick={send}

                    >
                      <MDBIcon fas icon="paper-plane" className="me-2"/>
                      Send
                    </button>
                  </div>
                </MDBCol>
                <MDBCol  md="5"   style={{marginLeft:"60px" }} >
                  <img src="../assets/images/mail.png" className="img-fluid" alt="Registration" />
                </MDBCol>
              </MDBRow>
            </MDBContainer>
            </div>
           
          </div>
        </div>
      </div>
    </div>
  </div>

    
         </>);
    }
    export default LandingPage