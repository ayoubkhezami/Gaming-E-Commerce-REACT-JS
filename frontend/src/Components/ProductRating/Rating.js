import React, { useState } from 'react';
import "./Rating.css"
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { MDBIcon } from 'mdb-react-ui-kit';

const Rating = (props) => {
  const [cookies] = useCookies();
  const id = cookies.id;

  const productId=props.IDProduct
  const [rating, setRating] = useState(null);
  const [messgae, Setmessgae] = useState('');
  const [showresulta, Setshowresulta] = useState(false);

  const handleRatingChange = (value) => {
    if(id){
    setRating(value);
    axios.post(`http://localhost:5000/product/review/${productId}`, { rating: value ,id})
    .then((response) => {
        console.log(response.data);
        Setmessgae(response.data.rating)
        Setshowresulta(true)
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert('Internal server error');
        }
      });
    }else{
      alert('You should login Before');

    }
  };
  const renderRatingResult = () => {
    if (rating === null) {
      return <p>Please rate the product</p>;
    } else {
      return <div style={{ marginTop:"-10px"}}>
      <p style={{ color:"rgba(252,176,69,1)" ,fontFamily:"fantasy",fontSize: '18px'}}> You selected : {rating} <MDBIcon far icon="star" /> </p>
      <p style={{ color:"rgba(250,0,0,0.6223739495798319)" ,fontFamily:"fantasy",fontSize: '18px',marginTop:"-10px"}} >
      " Thank You for Your Feedback "  <MDBIcon fas icon="grin-stars" />
      </p>
      
      </div>

    }
    
  };
  return (
    <div className="container d-flex justify-content-center " >
      <div className="row">
        <div className="col-md-12">
        <div className="result-message">
            {renderRatingResult()}
          </div>
          <div className="stars">
            
            <form action="">
              <input className="star star-5" id="star-5" type="radio" name="star" checked={rating === 5} onChange={() => handleRatingChange(5)} />
              <label className="star star-5" htmlFor="star-5"></label>
              <input className="star star-4" id="star-4" type="radio" name="star" checked={rating === 4} onChange={() => handleRatingChange(4)} />
              <label className="star star-4" htmlFor="star-4"></label>
              <input className="star star-3" id="star-3" type="radio" name="star" checked={rating === 3} onChange={() => handleRatingChange(3)} />
              <label className="star star-3" htmlFor="star-3"></label>
              <input className="star star-2" id="star-2" type="radio" name="star" checked={rating === 2} onChange={() => handleRatingChange(2)} />
              <label className="star star-2" htmlFor="star-2"></label>
              <input className="star star-1" id="star-1" type="radio" name="star" checked={rating === 1} onChange={() => handleRatingChange(1)} />
              <label className="star star-1" htmlFor="star-1"></label>
            </form>
          </div>
         
          {showresulta && (

          <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ fontSize: '20px', marginRight: '15px' }}>
            Rating Final:
          </p>
          <button className="btn btn-warning btn-lg" style={{ borderRadius: 30, fontSize: "16px",marginTop:"-6px",marginRight: '15px' }} disabled>
            {messgae}
            <MDBIcon far icon="star" />
          </button>
         
        </div>
           
         
                  

          )}
        </div>
      </div>
    </div>
  );
};

export default Rating;