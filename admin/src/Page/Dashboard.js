
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import {  MDBIcon } from 'mdb-react-ui-kit';
import { Chart } from 'chart.js/auto';
import Revenus from './Revenus';

const  Dashboard = () => {
  const [ShoppingCart, setShoppingCart] = useState([]);
  const [totalRevenue, settotalRevenue] = useState();
  const [total, settotal] = useState();
  useEffect(() => {
  const fetchShoppingCart = async () => {
    try {
      const response = await axios.get('http://localhost:5000/cart/all');

      const paidShoppingHistory = response.data.filter((item) => item.MethodePay === "Cash");
      const shoppingCartWithClientDetails = await Promise.all(
        paidShoppingHistory.map(async (item) => {
          const clientResponse = await axios.get(`http://localhost:5000/users/one`, { params: { id: item.client } });
          const client = clientResponse.data;
  
          return {
            ...item,
            clientEmail: client.email
          };
        })
      );
  
      setShoppingCart( shoppingCartWithClientDetails.reverse());
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };
  const fetchDailyRevenue = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/Dailyrevenue');

      settotalRevenue(response.data.dailyRevenue)
      settotal(response.data.total )

    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  

    fetchShoppingCart();
    fetchDailyRevenue();
  }, []);


  return (
    
   <div class="content">
  
      <div className="container-fluid pt-4 px-4">
        <div className="row g-4">
          <div className="col-sm-12 col-xl-6">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-line fa-3x text-primary" />
              <div className="ms-3">
                <p className="mb-2">Today Sale</p>
                <h6 className="mb-0">$ {totalRevenue}</h6>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-xl-6">
            <div className="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
              <i className="fa fa-chart-bar fa-3x text-primary" />
              <div className="ms-3">
                <p className="mb-2">Year's Sales</p>
                <h6 className="mb-0">$ {total}</h6>
              </div>
            </div>
          </div>
         
        </div>
      </div>
     
   
      {/* Sales Chart End */}
      {/* Recent Sales Start */}
      <div className="container-fluid pt-4 px-4">
        
 
        <div className="bg-secondary text-center rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h6 className="mb-0"> Status of cash delivery</h6>
          </div>
          <div className="table-responsive">
            <table className="table text-start align-middle table-bordered table-hover mb-0">
              <thead>
                <tr className="text-white">
                  <th scope="col">Date</th>
                  <th scope="col">ID Order</th>

                  <th scope="col">Customer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Pay Status</th>
                  <th scope="col">Status of delivery</th>

                </tr>
              </thead>
              <tbody>
              {ShoppingCart.map((item, index) => (

                <tr key={item._id}>
                  <td>{moment(item.date).format('YYYY-MM-DD HH:mm:ss')}</td>

                  <td>{item._id}</td>

                  <td>{item.clientEmail}</td>
                  <td>${item.totalprice}</td>
                  <td>{item.PayStatus ? 'Paid' : 'Unpaid'}</td>
                  <td style={{textAlign:"center"}}>{item.delivery ? <MDBIcon far icon="check-circle"  style={{color:"green"}}/> : <MDBIcon far icon="times-circle" style={{color:"red"}} />}</td>

                </tr>
           ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
   
      
     
  

  </div>
  
 
  );
}

export default  Dashboard



