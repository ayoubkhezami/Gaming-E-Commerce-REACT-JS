import React, { useState,useEffect } from 'react'
import axios from 'axios';
import { useCookies } from 'react-cookie'

    const ListeAdmin = () => {
        const [Admins, setAdmins] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [cookies] = useCookies()
   
     
        useEffect(() => {

            if ( !cookies.supadminCookie) {
              window.location.replace('/Home');
            }
          }, [cookies.supadminCookie])
        useEffect(() => {
            axios.get("http://localhost:5000/getadmin")
            .then(response => {
                setAdmins(response.data);
            })
            .catch(error => {
                if (error.response) {
                    setErrorMessage(error.response.data);
                } else {
                    setErrorMessage("An Error has Occurred. Please try again later.");
                }
            });       
         }, []);
         const handleDeleteAdmin = (adminId, adminUsername) => {
            const confirmLogout = window.confirm('Are you sure you want to delete this account ?');
            if (confirmLogout) {

            axios.post(`http://localhost:5000/delete`,  { _id: adminId, username: adminUsername }
            )
            .then(response => {
              // Suppression réussie, mettez à jour la liste des administrateurs
              setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== adminId));
            })
            .catch(error => {
              if (error.response) {
                setErrorMessage(error.response.data);
              } else {
                setErrorMessage("An Error has Occurred. Please try again later.");
              }
            });
        }
          };
    
  return (
    <div class="container-fluid position-relative d-flex p-0">
    <div class="content">
   
     <div className="container-fluid pt-4 px-4">
                <div className="row g-4">
                  
                    <div className="col-12">
                        <div className="bg-secondary rounded h-100 p-4">
                            <h6 className="mb-4">Admin's list</h6>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">username</th>
                                            <th scope="col">email</th>
                                            <th scope="col">phone_number</th>
                                            
                                            <th scope="col">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
    {Admins.map((admin, index) => (
        <tr key={admin._id}>
            <th scope="row">{index + 1}</th>
            <td>{admin.username}</td>
            <td>{admin.email}</td>
            <td>{admin.phone_number}</td>
            
        
            <td>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAdmin(admin._id, admin.username)}

                >
                    Delete
                </button>
            
            </td>
   
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

export default ListeAdmin;
