import React from 'react';

const Footer = () => {
  const footerStyle = {
    position: 'fixed',
    bottom: 0,
    right:0,
    width:"84%",
    boxShadow: '0px -1px 5px rgba(0, 0, 0, 0.1)', // Optional: Add a subtle shadow
  };

  return (
    <div >
      <div className="container-fluid pt-4 px-4">
        <div className="bg-secondary rounded-top p-4" style={footerStyle}>
          <div className="row">
            <div className="col-12 col-sm-6 text-center text-sm-start">
              © <a href="#">Gamer's Zone</a>, All Right Reserved.
            </div>
            <div className="col-12 col-sm-6 text-center text-sm-end">
              Designed By <a href="https:/Swiftcode.com">Swiftcode</a>
              <br />Distributed By: <a href="https://Swiftcode.com" target="_blank">Swiftcode</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
