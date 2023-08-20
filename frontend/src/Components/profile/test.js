import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {
  MDBTable, MDBTableHead, MDBTableBody ,
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
    <MDBTable>
      <MDBTableHead light>
        <tr>
          <th scope='col'>#</th>
          <th scope='col'>id</th>
          <th scope='col'>location</th>
          <th scope='col'>totalprice</th>
          <th scope='col'>Details</th>

        </tr>
      </MDBTableHead>
      <MDBTableBody>
      {ShoppingCart.length === 0 && ShoppingCart.PayStatus===false ? (
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
        <tr key={item._id}>
            
                 
           
          <th scope='row' >{index + 1}</th>
          <td> {item._id}</td>
          <td>{item.location}</td>
          <td>${item.totalprice}</td>
          <td>${item.totalprice}</td>

        </tr>
         ) : null
         ))
         )}
      </MDBTableBody>
    </MDBTable>
  );
}

export default History;
