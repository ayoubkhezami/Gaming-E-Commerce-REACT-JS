import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const CART_API_URL = 'http://localhost:5000/cart/user';
const PRODUCT_API_URL = 'http://localhost:5000/product';

function CheckoutSuccess() {
  const [cookies, setCookie] = useCookies();
  const navigate = useNavigate();
  const [shoppingCart, setShoppingCart] = useState([]);

  const updateProductQuantity = async (productId, quantity) => {
    try {
      const productResponse = await axios.get(`${PRODUCT_API_URL}/one`, { params: { id: productId } });
      const productQty = productResponse.data.qty;

      const updatedQuantity = Math.max(0, productQty - quantity); 
      console.log('Updating quantity for product:', productId);
      console.log('New quantity:', updatedQuantity);
      await axios.post(`${PRODUCT_API_URL}/update`, {
        _id: productId,
        qty: updatedQuantity,
      });
    } catch (error) {
      console.error('Error while updating product quantity:', error.message);
    }
  };

  const updateShoppingCart = async () => {
    try {
      const response = await axios.get(CART_API_URL, { params: { IdUser: cookies.id } });
      const items = response.data[0].items;
      setShoppingCart(items);

      const processedProductIds = new Set();

      const uniqueItems = items.filter((item) => {
        if (!processedProductIds.has(item.product)) {
          processedProductIds.add(item.product);
          return true;
        }
        return false;
      });


      const productUpdatePromises = uniqueItems.map((item) => updateProductQuantity(item.product, item.quantity));
      await Promise.all(productUpdatePromises);

      const { CardId } = cookies;
      if (CardId) {
        const response = await axios.post(`http://localhost:5000/pay/card/${CardId}`);
        console.log(response.data);
        setCookie('cartItemsCount', 0, { path: '/' });
        localStorage.setItem('checkoutSuccess_' + CardId, true);
      } else {
        console.error('CardId not found in cookies.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cookies.session) {
      const { CardId } = cookies;
      const hasAccessed = localStorage.getItem('checkoutSuccess_' + CardId);

      if (!hasAccessed) {
        updateShoppingCart();
      } else {
        navigate('/');
      }
    } else {
      navigate('/Login');
    }
  }, [cookies.session, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };



  return (
    <div className="container">
    <div className="row">
      <div className="col-lg-12">
        <div className="page-content">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '50px', marginTop: '-90px' ,color: '#fff'}}>
  
          <img src="../assets/images/credit-card.png" className="img-fluid" alt="Registration" style={{ maxWidth: '300px' }} />
  
            <div className="heading-section">
              <h1 style={{ color: 'rgba(237, 73, 134, 0.8240546218487395)', marginBottom: '30px' }}>
                <em style={{ color: '#fff' }}> Thank</em> You ! <MDBIcon far icon="smile-beam" />
              </h1>
            </div>
  
            <h2 style={{ marginBottom: '10px' }}>Payment Done Successfully !!</h2>
            <h3 style={{ marginBottom: '30px' }}>Your Payment receipt will be send it by admin in your email <MDBIcon far icon="envelope" /></h3>
  
            <button className="btn btn-primary btn-lg" size="lg" style={{ backgroundColor: '#e75e8e5b' }} onClick={handleGoHome}>
              <MDBIcon fas icon="home" />  Go Home
            </button>
  
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default CheckoutSuccess;
