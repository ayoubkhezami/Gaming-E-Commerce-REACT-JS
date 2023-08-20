import axios from "axios";
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  MDBIcon,
} from "mdb-react-ui-kit";
const PayButton = ({ cartItems,CardId,address }) => {
  const [cookies,setCookie] = useCookies([]);
  const id = cookies.id;
  const [errorMessage, setErrorMessage] = useState('');


  const handleCheckout = () => {

    if (!address) {
      setErrorMessage('Location is required.');
      return;
    }
   
   
    // Update the quantity for each product in the cartItems array
 
    axios
      .post(`http://localhost:5000/cart/address/${CardId}`, {
        location: address,
      })
      .then((response) => {
        console.log(response.data); // Display success message from the backend if needed

        // Proceed to checkout as before
        axios
          .post(`http://localhost:5000/checkout`, {
            cartItems,
            userId: id,
            CardId,
          })
          .then((response) => {
            console.log('Checkout Response:', response.data);
      
            window.location.href = response.data.url;
          
            
          })
          .catch((err) => console.log(err.message));
      })
      .catch((err) => {
        console.log('Error while updating cart address:', err.message);
        setErrorMessage('Error while updating cart address.');
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      {errorMessage && <div className="text-danger mr-5">{errorMessage}</div>}

      <button className="btn btn-outline-success " style={{ borderRadius: 30}} onClick={() => handleCheckout()}>
        Go To Pay <MDBIcon fas icon="credit-card" />
      </button>
    </div>
  );
};

export default PayButton;
