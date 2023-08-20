import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {
  MDBTable, MDBTableHead, MDBTableBody ,
    MDBIcon,
    MDBInput,
    MDBRow,
    MDBTypography,
    MDBCardImage,

  } from "mdb-react-ui-kit";
  import { Modal, Button } from 'react-bootstrap';

function History() {
  const [ShoppingCart, setShoppingCart] = useState([]);
  const [totalcard, settotalcard] = useState(0);
  const [cookies, setCookie] = useCookies([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const handle = (transactionId) => {
    setSelectedTransactionId(transactionId);

    setShowModal(true);

  };
  const handleCloseModal = () => {
        setShowModal(false);

  }
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
    <>
        <div className=' col-6 mx-auto' style={{ border: "solid", backgroundColor: "rgba(0,0,0,0.6083683473389356)", borderRadius: "35px" }}>
      <MDBTypography
        tag="h1"
        className="mb-5 pt-4 text-center fw-bold text-uppercase"
        style={{ fontFamily: "cursive", color: "rgba(241,72,169,0.9220938375350141)" }}
      >
        <MDBIcon fas icon="file-invoice-dollar" /> My History
      </MDBTypography>

      {ShoppingCart.length === 0 || ShoppingCart.some(item => item.PayStatus === false) ? (
        <div className='d-grid gap-2 col-12 mx-auto'>
          <MDBTypography
            tag="h6"
            className="mb-5 pt-2 text-center fw-bold text-uppercase"
            style={{ fontFamily: "cursive", color: "#fff" }}
          >
            <MDBIcon far icon="frown" /> Your history is empty. Start shopping now
          </MDBTypography>
          <button className="btn btn-outline-warning mx-auto" style={{ backgroundColor: '#FF5DBF5E', marginBottom: 20, borderRadius: 30, color: 'rgba(244, 240, 170, 0.61)', fontSize: "16px" }} onClick={() => window.location = '/shop'}>
            Go to Shop <MDBIcon fas icon="shopping-cart" />
          </button>
        </div>
      ) : (
        ShoppingCart.map((item, index) => (
          <div className ="container"style={{ border: "solid", marginBottom: "10px", backgroundColor: "#fff", borderRadius: "15px" }} key={item._id}>
            <h4 className="fw-bold mb-3 me-4 pe-4 " style={{ fontFamily: "cursive", color: "rgba(213,11,107,0.7148109243697479)", marginTop: "15px" }}><MDBIcon fas icon="shopping-basket" /> Order N : {index + 1}</h4>
            <div className="d-flex justify-content-between my-3 mx-auto">
              <div className="d-flex flex-column">
                <MDBTypography tag="h6" className="text-primary mb-2">
                  ID : {item._id}
                </MDBTypography>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="fw-bold mb-0 me-0"> <MDBIcon fas icon="map-marker-alt" /> Location: {item.location}</p> <br/>


                </div>
                <p className="fw-bold mb-0 me-0"> <MDBIcon fas icon="hand-holding-usd" /> Method of Payment: {item.MethodePay}</p>

              </div>
              <div >

<button className="btn btn-outline-info " style={{ borderRadius: 30, fontSize: "16px" }} onClick={() => handle(item._id)}>
  <MDBIcon fas icon="info-circle" /> More Details
</button>
                </div>
            </div>
            <hr style={{ height: "1px", backgroundColor: "#1266f1", opacity: 0 }} />
            <div className="d-flex justify-content-between p-2 mb-3" style={{ backgroundColor: "#e1f5fe" }}>
              <MDBTypography tag="h6" className="fw-bold mb-0">
                Total:
              </MDBTypography>
              <MDBTypography tag="h6" className="fw-bold mb-0">
                ${item.totalprice}
              </MDBTypography>
            </div>
          </div>
        ))
      )}
    </div>

    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header>
        <Modal.Title><MDBIcon fas icon="user-edit" /> Details of Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {ShoppingCart.map((item) => {
          return item.items.length > 0 && item._id === selectedTransactionId ? (
            item.items.map((cartItem) => (
              <div className="d-flex align-items-center my-3 mx-auto" key={cartItem._id}>
                
                <div className="d-flex flex-column">
                  <MDBTypography tag="h5" className="text-primary mb-2">
                    {cartItem.name}
                  </MDBTypography>
                  <div className="d-flex align-items-center">
                    <p className="fw-bold mb-0 me-2">
                      <MDBIcon fas icon="dollar-sign" /> Price/U: {cartItem.price} $
                    </p>
                    <p className="fw-bold mb-0 me-5">Quantity: {cartItem.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          ) : null;
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          <MDBIcon far icon="times-circle" /> Close
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);
}

export default History;
