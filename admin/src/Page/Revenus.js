import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart } from 'chart.js/auto';
import moment from 'moment';

function Revenus() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/Monthlyrevenue');
        const monthlyRevenue = response.data.revenueByMonth;
        const monthlyCanvas = document.getElementById('monthlyRevenueChart');

        if (monthlyRevenue) {
          const monthlyCtx = monthlyCanvas.getContext('2d');
          const newChartInstance = new Chart(monthlyCtx, {
            type: 'bar', // Utilisez le type de graphique 'bar' pour un graphique à barres
            data: {
              labels: monthlyRevenue.map((data) => {
                if (data._id.year !== null && data._id.month !== null) {
                  return moment(`${data._id.year}-${data._id.month}`, 'YYYY-M').format('MMM YYYY');
                } else {
                  return moment(new Date()).format('MMM YYYY');
                }
              }),
              datasets: [
                {
                  label: 'Monthly Revenue',
                  data: monthlyRevenue.map((data) => data.totalRevenue),
                  backgroundColor: ['rgba(75, 192, 192, 0.5)', "rgba(254,246,86,0.3086484593837535)","rgba(224,98,168,0.3086484593837535)"], // Couleur de remplissage des barres
                  borderWidth: 3,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          });

          setChartInstance(newChartInstance);
        }
      } catch (error) {
        console.error('Error fetching monthly revenue data:', error);
      }
    };

    fetchMonthlyRevenue();
  }, []);

  return <canvas id="monthlyRevenueChart" width="200" height="200" />;
}

export default Revenus;
