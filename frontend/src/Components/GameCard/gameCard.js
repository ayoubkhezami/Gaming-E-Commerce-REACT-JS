import React, {  useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { MDBIcon,  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter, } from 'mdb-react-ui-kit';
import Details from '../../Page/Details';

export default function GameCard(props) {
  const [cookies,setCookie] = useCookies();
  const [quantity, setQuantity] = useState(1); // Initial quantity set to 1
  const [modalShow,setModalShow]=useState(false)
  const [topRightModal, setTopRightModal] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(0);

  const toggleShow = () => setTopRightModal(!topRightModal);

  const navigate = useNavigate();
  const handleBackToShopping = () => {
 
    navigate("/card");
  };

  const updateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
  };
  const fetchShoppingCart = async () => {
    if (cookies.id) {
    try {

      const response = await axios.get('http://localhost:5000/cart/user', { params: { IdUser: cookies.id } });
      const cartItems = response.data[0].items;

      const cartItem = cartItems.find(item => item.product === props.game._id);
      if (cartItem) {
        setLocalQuantity(cartItem.quantity);
      } else {
        setLocalQuantity(localQuantity);
      }
      setCookie('cartItemsCount', response.data[0].items.length, { path: '/' });

    } catch (error) {
      setCookie('cartItemsCount', 0, { path: '/' });

    }
  }
  };
  useEffect(() => {
   
    fetchShoppingCart();
  }, [cookies.id]);

  const addToCart = async (productId) => {
    if (localQuantity+1> props.game.qty) {
      alert('Cannot add more than available stock.');
      return;
    }
console.log(localQuantity+1)
    try {
      // const updatedQuantity = props.game.qty - 1; // Decrement quantity by 1
  
      // // Update the product quantity on the server
      //  await axios.post('http://localhost:5000/product/update', {
      //   _id: productId,
      //   qty: updatedQuantity,
      // });
  
      // Check if the product quantity was successfully updated
        
        const response = await axios.post('http://localhost:5000/cart/save', {
          items: [
            {
              product: productId,
              name: props.game.name,
              quantity: quantity,
              price: props.game.price,
            },
          ],
          totalprice: props.game.price * quantity,
          username: cookies.username,
          IdUser: cookies.id,
        });
  
        console.log(response.data); 
        setTopRightModal(!topRightModal);

        fetchShoppingCart();
      
    } catch (error) {
      if (!cookies.id) {
        alert('Connect to your account is required.');
        navigate('/Login');
      } else {
        console.error('Error adding item to cart:', error);
        alert('Failed to add item to cart. Please try again.');
      }
    }
  };
  const renderRating = () => {
    if (props.reviews[0]) {
      return (
        <span>
          {props.reviews} <MDBIcon fas icon="star-half-alt" />
        </span>
      );
    } else {
      return <span> -- <MDBIcon fas icon="star-half-alt" /></span>;
    }
  };



  return (
    
<div className="col-md-4 col-sm-5">
    <div className="item">
      <div className="thumb">
        <img src={props.game.image} alt="" className="thumb-img"/>
        <span className="price">
          {props.game.price}$ <br/>
          {renderRating()}

        </span>
      </div>
      <div className="down-content">
        <span className="category">{props.game.category}</span>
        <h4>{props.game.name}</h4>

        <button  class="btn btn-outline-warning "  style={{  borderRadius:30,fontWeight:"bold"}}onClick={() => setModalShow(true)} >
        <MDBIcon fas icon="info-circle" /> Details
    </button>

        {props.game.qty === 0 ? (
             <span style={{ color: 'red', fontWeight: 'bold', marginLeft: '20px' }}>
               Out of Stock
           </span>      
             ) : (
              <>
<Link onClick={() => addToCart(props.game._id)}>
              <i className="fa fa-shopping-bag"></i>
            </Link>
              <MDBModal
              animationDirection='right'
              show={topRightModal}
              tabIndex='-1'
              setShow={setTopRightModal}
              
            >
              <MDBModalDialog position='top-right' side>
                <MDBModalContent>
                  <MDBModalHeader className='bg-success text-white'>
                    <MDBModalTitle>Product in the cart</MDBModalTitle>
                    <MDBBtn
                      color='none'
                      className='btn-close btn-close-white'
                      onClick={toggleShow}
                    ></MDBBtn>
                  </MDBModalHeader>
                  <MDBModalBody>
                    <div className='row'>
                      <div className='col-3 text-center'>
                        <i className='fas fa-shopping-cart fa-4x text-success'></i>
                      </div>
      
                      <div className='col-9'>
                        <p>Do you need more time to make a purchase decision?</p>
                        <p>No pressure, your product will be waiting for you in the cart.</p>
                      </div>
                    </div>
                  </MDBModalBody>
                  <MDBModalFooter style={{ display: 'flex', justifyContent: 'space-between' }}>
                    
                  <button className="btn btn-outline-dark" style={{ borderRadius: 30}} onClick={toggleShow}>
                  Back to shopping <MDBIcon fas icon="shopping-cart" />
              </button>
                        <button className="btn btn-outline-success" style={{ borderRadius: 30}} onClick={handleBackToShopping}>
                        Go to the cart <MDBIcon icon="angle-double-right" className="me-2" /> 
                      </button>
                     
                  </MDBModalFooter>
                </MDBModalContent>
              </MDBModalDialog>
            </MDBModal>
            </>
          )}

        
  

    <Details 
    img={props.game.image}
    name={props.game.name} 
    price={props.game.price} 
    game_name={props.game.game_title} 
    cat={props.game.category} 
    qte={props.game.qty} 
    desc={props.game.description}
    ID={props.game._id}
    image={props.game.image}
    game={props.game}
review={props.reviews}
quantity={quantity} 
localQuantity={localQuantity} 

updateQuantity={updateQuantity} 

    addToCart={addToCart} 
      show={modalShow}
      onHide={() => setModalShow(false)}
    />
          {/*<summary>Details</summary>
          <p className="text-primary">
            {props.game.name} - {props.game.id}
          </p>
          <p>
            Price : <span className="text-dark">{props.game.price}</span>
          </p>
          <p>
            Game ID: <span className="text-dark">{props.game._id}</span>
          </p>
          <p>
            Genre: <span className="text-dark">{props.game.category}</span>
          </p>
          {Array.isArray(props.game.tags) && props.game.tags.length > 0 && (
            <div>
              <p>Multi-tags:</p>
              <ul className="p-0 m-0 d-flex">
                {props.game.tags.map((i) => (
                  <li>{i},</li>
                ))}
              </ul>
            </div>
          )}
                </details>*/}
      </div>
    </div>
  </div>
);
} 

