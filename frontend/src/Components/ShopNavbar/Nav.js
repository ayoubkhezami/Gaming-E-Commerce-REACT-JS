import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Nav = () => {
  const [gameCategories, setGameCategories] = useState([]);

  useEffect(() => {
 
    axios.get('http://localhost:5000/genre/all') 
      .then(response => {
        setGameCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching game categories:', error);
      });
  }, []);


  const totalCategoriesWidth = gameCategories.reduce((total, category) => total + category.length * 10, 0);

 
  const navbarStyle = totalCategoriesWidth > window.innerWidth ? { width: '100%' } : {};

  return (
    <div className="mini-navbar" style={navbarStyle}>
      {gameCategories.map((category, index) => (
        <span key={category._id} className="navbar-category">
          {category.name}
        </span>
      ))}
    </div>
  );
};

export default Nav;
