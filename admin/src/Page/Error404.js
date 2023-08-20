import React from "react";

import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
  
      <div className="container-fluid position-relative d-flex p-0">
      <div class="content">
          <div className="container-fluid pt-4 px-4">
            <div className="row vh-100 bg-secondary rounded align-items-center justify-content-center mx-0">
              <div className="col-md-6 text-center p-4">
                <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                <h1 className="display-1 fw-bold">404</h1>
                <h1 className="mb-4">Page Not Found</h1>
                <p className="mb-4">
                  We’re sorry, the page you have looked for does not exist on our website! Maybe go to our home page or
                  try to use a search?
                </p>
                <Link  className="btn btn-primary rounded-pill py-3 px-5" to="">
                  Go Back To Home
                </Link>
              </div>
            </div>
          </div>
          </div>
          
        <Link to="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
          <i className="bi bi-arrow-up"></i>
        </Link>
      </div>
    );
  };
  

export default Error404;
































































{/*
    <!-- JavaScript Libraries -->
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="lib/chart/chart.min.js"></script>
    <script src="lib/easing/easing.min.js"></script>
    <script src="lib/waypoints/waypoints.min.js"></script>
    <script src="lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="lib/tempusdominus/js/moment.min.js"></script>
    <script src="lib/tempusdominus/js/moment-timezone.min.js"></script>
    <script src="lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js"></script>

    <!-- Template Javascript -->
    <script src="js/main.js"></script>
    */}
