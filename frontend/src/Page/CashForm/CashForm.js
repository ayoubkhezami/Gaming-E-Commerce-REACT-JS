import axios from "axios";
import React, { useState } from 'react';
import { MDBIcon,MDBInput} from "mdb-react-ui-kit";
import { useCookies } from 'react-cookie';

import {  useNavigate } from 'react-router-dom';



export default function CashForm({ CardId }) {
  const [adress,setadress]=useState();
  const [cookies,setCookie] = useCookies([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const send = () => {
    if (!adress) {
      setErrorMessage('Location is required.');
      return;
    }
    axios
    .post(`http://localhost:5000/Cash/${CardId}`, {
      Username:cookies.username,
id:cookies.id,
      location: adress,
    })
    .then((response) => {
      alert(" Successfully !! Thank you ,Please check your email ")
      navigate(`/`);
      setCookie('cartItemsCount', 0, { path: '/' });

    })
    .catch((err) => {
      console.log('Error while updating cart address:', err.message);
      setErrorMessage('Error while updating cart address.');
    });
  }


  return (
    <>
       
        
      <div>
      <label ><MDBIcon fas icon="map-marker-alt" /> Address</label>
      <MDBInput id="Address" value={adress} onChange={(e) => setadress(e.target.value)}  placeholder="1234 Main St, City, Country"name="Address"type="Address" required  style={{ backgroundColor:"#e8d3d8" ,borderRadius:"25px",marginBottom:"20px"}}/>
      </div>
      {errorMessage && <div className="text-danger mr-5">{errorMessage}</div>}

      <div class=" d-md-flex justify-content-md-end">

<button className="btn btn-primary " style={{  backgroundColor: 'rgba(245,35,135,0.6363795518207283)' }} onClick={send} >
<MDBIcon fas icon="paper-plane" />  Send
      </button>

      </div>
    </>
  );
}
