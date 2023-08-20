
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  MDBIcon } from 'mdb-react-ui-kit';
import axios from 'axios';

const Form = () => {
  const navigate = useNavigate();

  const [name, setname] = useState('');
  const [price, setprice] = useState('');
  const [quantity, setquantity] = useState('');
  const [genre, setgenre] = useState('');
  const [Categorie, setCategorie] = useState('');
  const [pic, setPic] = useState(null);
  const [title, settitle] = useState('');

  const [imagePreview, setImagePreview] = useState('');
  const [Description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleImagePreview = (pic) => {
   
    const reader = new FileReader();
    const file = pic.target.files[0];

    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setErrorMessage('Invalid file format. Only JPG and PNG images are allowed.');
      return;
    }

    reader.onloadend = () => {
      setImagePreview(reader.result);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };
  
  const handleADD = () => {
  

    if (!name || !price || !pic || !quantity || !genre || !Categorie || !Description || !title) {
      setErrorMessage('All fields are required.');
      return;
    }

 

    const pricetest = /^[0-9]+$/;
    if (!pricetest.test(price) ) {
      setErrorMessage('price should contain only numbers .');
      return;
    }

    const quantitytest = /^[0-9]+$/;
    if (!quantitytest.test(quantity) ) {
      setErrorMessage('quantity should contain only numbers .');
      return;
    }
  

    const product = {
      name: name,
      description: Description,
      category: Categorie,
      qty: quantity,
      image: imagePreview,
      game_title: title,
      price:price,
      genre:genre
    };

    axios
      .post('http://localhost:5000/product/save', product)
      .then(function (response) {
        console.log(response);
        alert('New product Add ');
        navigate('/Home');
      })
      .catch((error) => {
        if (error.response) {
          const { message } = error.response.data;
          setErrorMessage(message);
        } else {
          setErrorMessage('An error occurred. Please try again later.');
        }
      });
  };
  return (
    <div class="container-fluid position-relative d-flex p-0">
    <div class="content">
       <div className="container-fluid ">
       <div className="row justify-content-center align-items-center">

          <div className="col-sm-6 col-xl-6">
            <div className="bg-secondary rounded h-100 p-4">
              <h4 className="mb-4" style={{textAlign:"center"}}> <MDBIcon fas icon="plus" /> ADD Product</h4>
              <div className="input-group mb-5">
                <span className="input-group-text" id="basic-addon1"><MDBIcon fas icon="terminal" /></span>
                <input 
                type="text"
                 className="form-control"
                  placeholder="game_title" 
                  aria-label="name" 
                  aria-describedby="basic-addon1" 
                   value={title}
                  onChange={(e) => settitle(e.target.value)} />
              </div>
              <div className="input-group mb-5">
                <span className="input-group-text" id="basic-addon1"><MDBIcon fas icon="terminal" /></span>
                <input 
                type="text"
                 className="form-control"
                  placeholder="Name Of product" 
                  aria-label="name" 
                  aria-describedby="basic-addon1" 
                   value={name}
                  onChange={(e) => setname(e.target.value)} />
              </div>
              <div className="input-group mb-5">
                <span className="input-group-text">$</span>
                <input type="text" 
                className="form-control" 
                aria-label="Amount (to the nearest dollar)" 
                 placeholder="Price/U" 
                 value={price}
                  onChange={(e) => setprice(e.target.value)}
                 />
                <span className="input-group-text">.00</span>
                <span className="input-group-text"><MDBIcon fas icon="list-ol" /></span>
                <input type="number"
                 className="form-control" 
                 placeholder="Quantity"
                  aria-label="Server"
                  value={quantity}
                  onChange={(e) => setquantity(e.target.value)}
                   />

              </div>
              <div className="input-group mb-5" > 
              <span className="input-group-text">Genre</span>

<select 
name="genre"
 id="genre-select"
  className="form-control" 
  style={{backgroundColor:"black"}}
  value={genre}
  onChange={(e) => setgenre(e.target.value)}
  >
  <option className="input-group-text" value="">--Please choose an option--</option>
  <option value="FPS">FPS</option>
  <option value="MMORPG">MMORPG</option>

  <option value="Action">Action</option>
  <option value="Adventure">Adventure</option>
  <option value="Horror">Horror</option>
  <option value="Strategy">Strategy</option>
  <option value="Puzzle">Puzzle</option>
  <option value="Sport">Sport</option>

</select>

<span className="input-group-text">Category</span>

<select name="Categorie" 
id="Categorie-select"
 className="form-control" 
 style={{backgroundColor:"black"}}
 value={Categorie}
 onChange={(e)=>setCategorie(e.target.value)}>
 
  <option className="input-group-text" value="">--Please choose an option--</option>
  <option value="clothes">clothes</option>
  <option value="electronics">electronics</option>
  <option value="cosmetics">cosmetics</option>

</select>
</div>

              <div className="input-group mb-5">
              <span className="input-group-text" id="basic-addon2"><MDBIcon far icon="images" /></span>

              <input className="input-group-text"
               type="file"
                id="avatar"
                 name="avatar"
                  accept="image/png, image/jpeg" 
                  style={{backgroundColor:"black"}}
                  onChange={(e) => {
                    setPic(e.target.files[0]);
                    handleImagePreview(e);
                  }}
                   />
                   
              </div>
              {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{  maxWidth: '200px', borderRadius: '50%' }} />
                    )}
              <div className="input-group ">
                <span className="input-group-text">Description</span>
                <textarea
                 className="form-control" 
                 aria-label="With textarea" 
                 value={Description}
                 onChange={(e) => setDescription(e.target.value)}
                  />
              </div>
              <br/>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}

<div className=" input-group  d-grid gap-2 d-md-flex justify-content-md-end">
  <button
    className="btn btn-primary btn-lg"
    size="lg"
    onClick={handleADD}

  >
    <MDBIcon icon="sign-in-alt" className="me-2" /> ADD
  </button>
</div>
            </div>
            
          </div>
    
        </div>
        </div>
        </div>
      
  </div>

  )
}

export default Form


