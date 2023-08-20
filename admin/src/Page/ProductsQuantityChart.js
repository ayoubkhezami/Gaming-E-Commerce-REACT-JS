import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

function ProductsQuantityChart() {
  const [chartInstance, setChartInstance] = useState(null);
  useEffect(() => {
  const fetchSoldProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/ProductsQuantity');
      const  SoldProducts=response.data.soldProducts;
      const chartCanvas = document.getElementById('productsQuantityChart');

      
      if (SoldProducts) {
        const chartCtx = chartCanvas.getContext('2d');
        const newChartInstance = new Chart(chartCtx, {
          type: 'doughnut', // Utilisez le type de graphique 'doughnut'
          data: {
            labels: SoldProducts.map((product) => product._id),
            datasets: [
              {
                data: SoldProducts.map((product) => product.totalQuantitySold),
                backgroundColor: [
                  'rgba(75, 192, 192, 0.5)',
                  'rgba(255, 99, 132, 0.5)',
                  "rgba(249,237,0,0.34506302521008403)"
                  // ... Ajoutez d'autres couleurs ici pour chaque produit
                ],
                borderColor: 'white',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          },
        });

        setChartInstance(newChartInstance);
      }
    } catch (error) {
      console.error('Error fetching sold products data:', error);
    }
  };

 
    fetchSoldProducts();
  }, []);

  return (
    <canvas id="productsQuantityChart" width="50" height="20" />
  );
}

export default ProductsQuantityChart;
