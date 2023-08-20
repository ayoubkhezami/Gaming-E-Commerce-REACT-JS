import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MDBIcon } from "mdb-react-ui-kit";
  import Modal from 'react-bootstrap/Modal'; 

    const Table = () => {
        const [errorMessage, setErrorMessage] = useState('');
        const [products, setProducts] = useState([]);
        const [showUpdateModal, setShowUpdateModal] = useState(false);
        const [selectedProduct, setSelectedProduct] = useState(null);
        const [imagePreview, setImagePreview] = useState('');
        const [price, setprice] = useState('');
        const [quantity, setquantity] = useState('');
        const [pic, setPic] = useState(null);
        const [productid,SetproductId]=useState('')
  
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
        const handleRetrieveProduct = () => {
            axios.get("http://localhost:5000/products/getgenre")
                .then(response => {
                    setProducts(response.data); // Update the state with fetched products
                })
                .catch(error => {
                    if (error.response) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage("An Error has Occurred. Please try again later.");
                    }
                });
        };
    
        useEffect(() => {
            handleRetrieveProduct(); // Fetch products when the component mounts
        }, []);
        const handleDeleteProduct = (productId, productName) => {
            const deleteData = {
                _id: productId,
                name: productName
            };
            
            axios.post('http://localhost:5000/product/delete', deleteData)
                .then(response => {
                    // Refresh the product list after successful deletion
                    handleRetrieveProduct();
                })
                .catch(error => {
                    if (error.response) {
                        setErrorMessage(error.response.data);
                    } else {
                        setErrorMessage("An Error has Occurred. Please try again later.");
                    }
                });
        };
        const handleCloseModal = () => {
         
          setShowUpdateModal(false);
      
        };
        const handleOpenUpdateModal = (productId) => {
            const productToUpdate = products.find(product => product._id === productId);
            setSelectedProduct(productToUpdate);
            SetproductId(productToUpdate._id);
            setprice(productToUpdate.price); // Set the price state with the selected product's price
            setquantity(productToUpdate.qty); 
            setImagePreview(productToUpdate.image)
            setShowUpdateModal(true);
          };
    const handleUpdateProduct =()=>{
        const UpdateData= {
            _id:productid,
            qty:quantity,
            price:price,
            image:imagePreview
        }
        axios.post('http://localhost:5000/product/update',UpdateData)
        .then(response=>{
          setShowUpdateModal(false);
alert("Updated  successfully....")
          const updatedProductIndex = products.findIndex(
            (product) => product._id === productid
          );
  
          if (updatedProductIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[updatedProductIndex] = {
              ...updatedProducts[updatedProductIndex],
              qty: UpdateData.qty,
              price: UpdateData.price,
              image: UpdateData.image,
              // Update other fields as needed
            };
  
            setProducts(updatedProducts);
          }
        })
        .catch((error)=>{
            if (error.response) {
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An Error has Occurred. Please try again later.");
            }
        })

    }
  return (
    <div class="container-fluid position-relative d-flex p-0">
    <div class="content">
   
     <div className="container-fluid pt-4 px-4">
                <div className="row g-4">
                  
                    <div className="col-12">
                        <div className="bg-secondary rounded h-100 p-4">
                            <h6 className="mb-4">Product's list</h6>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Label</th>
                                            <th scope="col">Quantity</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Game Title</th>
                                            <th scope="col">Genre</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Price</th>
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
    {products.map((product, index) => (
        <tr key={product._id}>
            <th scope="row">{index + 1}</th>
            <td>{product.name}</td>
            <td>{product.qty}</td>
            <td>{product.category}</td>
            <td>{product.game_title}</td>
            <td>{product.genre.name}</td>
            <td>
  {product.description.length > 70
    ? product.description.substring(0, 70) + "..."
    : product.description}
</td>
            <td>{product.price}$</td>
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(product._id,product.name)}
                >
                    Delete
                </button>
                <button
                className="btn btn-primary btn-sm mx-2"
                onClick={() => handleOpenUpdateModal(product._id)}
                >
                 Update
                </button>
            </td>
            <Modal show={showUpdateModal} tabIndex="-1"onHide={handleCloseModal} >
    
      <Modal.Header closeButton style={{backgroundColor:" rgba(0,0,0,0.07055322128851538)"}}>
      <Modal.Title className="text-center w-100">

      <h4  style={{textAlign:"center", color:'black'}}> <MDBIcon fas icon="plus" /> Update Product</h4>

      </Modal.Title>

      </Modal.Header>
      <Modal.Body>
      
              <div className="input-group mb-5">
                <span className="input-group-text" id="basic-addon1"><MDBIcon fas icon="terminal" /></span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="ProductId"
                    aria-label="name"
                    aria-describedby="basic-addon1"
                    value={productid} // Use productid state here
                    readOnly

                    
                />
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

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>



              <input className="input-group-text"
               type="file"
                id="avatar"
                 name="avatar"
                  accept="image/png, image/jpeg" 
                  style={{backgroundColor:"black"}}
                  onChange={(e) => {
                    setImagePreview(e.target.files[0]);
                    handleImagePreview(e);
                  }}
                   />

                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', borderRadius: '50%' }} />
                    )}
              </div>

             
              <br/>
              {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
             

      </Modal.Body>
      <Modal.Footer style={{ display: 'flex', justifyContent: 'space-between' ,backgroundColor:" rgba(0,0,0,0.2638305322128851)"}} >
        <button className="btn btn-outline-danger" style={{ borderRadius: 30}} onClick={() => setShowUpdateModal(false)}>
        <MDBIcon fas icon="times-circle" />  Cancel
        </button>
        <button className="btn btn-outline-success" style={{ borderRadius: 30}}  onClick={()=>handleUpdateProduct()}>
        <MDBIcon far icon="edit" /> Update
        </button>
      </Modal.Footer>
</Modal>
        </tr>
        
    ))}
</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            </div>
       
    </div>


 
  )
}

export default Table;
