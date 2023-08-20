import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
  } from "mdb-react-ui-kit";

function History() {
  const [ShoppingCart, setShoppingCart] = useState([]);
  const [totalcard, settotalcard] = useState(0);
  const [cookies, setCookie] = useCookies([]);

  const fetchShoppingCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart/history', {
        params: { IdUser: cookies.id },
      });

      const paidShoppingHistory = response.data.filter((item) => item.PayStatus === true);
      setShoppingCart(paidShoppingHistory);
      console.log(paidShoppingHistory);

    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  useEffect(() => {
    fetchShoppingCart();
  }, []);

  return (
    <MDBRow className="justify-content-center align-items-center"  >
      <MDBCol >
        <MDBCard className="shopping-cart" style={{ borderRadius: "15px",backgroundColor:"rgba(255,255,255,0)" }} >
          <MDBCardBody className="text-black">
              <MDBCol lg="6" className="justify-content-center mx-auto">
                <MDBTypography
                  tag="h1"
                  className="mb-5 pt-2 text-center fw-bold text-uppercase"
                  style={{fontFamily:"cursive",color:"rgba(213,11,107,0.7148109243697479)"}}
                >
                 <MDBIcon fas icon="file-invoice-dollar" /> My History
                </MDBTypography>
                <MDBRow className="justify-content-center align-items-center flex-row" >
                {ShoppingCart.length === 0 || ShoppingCart.PayStatus===false ? (
                  <div className='d-grid gap-2 col-12 mx-auto'>
                     <MDBTypography
                  tag="h6"
                  className="mb-5 pt-2 text-center fw-bold text-uppercase"
                  style={{fontFamily:"cursive",color:"#fff"}}
                >
                  <MDBIcon far icon="frown" /> Your history is empty . Start shopping now 
                </MDBTypography>
                    <button className="btn btn-outline-warning mx-auto "style={{ backgroundColor: '#FF5DBF5E' ,marginBottom:20 , borderRadius:30,color: 'rgba(244, 240, 170, 0.61)',fontSize:"16px"}} onClick={() => window.location = '/shop'}>
                      Go to Shop <MDBIcon fas icon="shopping-cart" />
                    </button>
                  </div>
                ) : (
                ShoppingCart.map((item, index) => (
                  item.items.length > 0 ? (
                    <div style={{border:"solid" , marginBottom:"15px" ,backgroundColor:"rgba(255,255,255,0.891281512605042)" , borderRadius: "15px"}}>
                        
 <React.Fragment key={item._id} className="mx-auto">
  <h4 className="fw-bold mb-3 me-5 pe-3" style={{fontFamily:"cursive",color:"rgba(213,11,107,0.7148109243697479)",marginTop:"15px"}}><MDBIcon fas icon="shopping-basket" /> Order N : {index + 1}</h4>

  {item.items.map((cartItem) => (
    <div className="d-flex align-items-center my-3 mx-auto" key={cartItem._id}  >
      <div className="flex-shrink-0 me-4">
        <MDBCardImage
          src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Products/13.webp"
          fluid
          style={{ width: "150px" }}
          alt="Generic placeholder image"
        />
      </div>

      <div className="d-flex flex-column">
        <MDBTypography tag="h5" className="text-primary mb-2">
          {cartItem.name}
        </MDBTypography>
       
        <div className="d-flex align-items-center">
          <p className="fw-bold mb-0 me-2"><MDBIcon fas icon="dollar-sign" /> Price/U: {cartItem.price} $</p>
          <p className="fw-bold mb-0 me-5">Quantity: {cartItem.quantity}</p>
          <p className="fw-bold mb-0 me-0"> <MDBIcon fas icon="map-marker-alt" /> Location: {item.location}</p>

        </div>
      </div>
 
    </div>
    
  ))}

  <hr style={{ height: "2px", backgroundColor: "#1266f1", opacity: 0 }} />

  <div className="d-flex justify-content-between p-2 mb-2" style={{ backgroundColor: "#e1f5fe" }}>
    <MDBTypography tag="h5" className="fw-bold mb-0">
      Total:
    </MDBTypography>
    <MDBTypography tag="h5" className="fw-bold mb-0">
      ${item.totalprice}
    </MDBTypography>
  </div>
</React.Fragment>
</div>


                  ) : null
                  ))
                  )}
                            </MDBRow>

              </MDBCol>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>

  );
}

export default History;
