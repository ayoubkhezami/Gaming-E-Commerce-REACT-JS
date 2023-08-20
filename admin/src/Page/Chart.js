import React from 'react'
import { Link } from 'react-router-dom';
import Revenus from './Revenus';
import ProductsQuantityChart from './ProductsQuantityChart';

const Chart = () => {
  return (
    <div className="container-fluid position-relative d-flex p-0">
    <div class="content">
      <div className="container-fluid pt-4 px-4">
        <div className="row">
  
            <div className="col-sm-10 col-xl-6">
              <div className="bg-secondary rounded h-100 p-4">
                <h6 className="mb-4">MonthlyRevenue</h6>
                <Revenus/>
              </div>
            </div>
          
          {/* Ajoutez une classe de marge pour créer de l'espace */}
  
            <div className="col-sm-10 col-xl-6">
              <div className="bg-secondary rounded h-100 p-4">
                <h6 className="mb-4">ProductsQuantity</h6>
                <ProductsQuantityChart/>
              </div>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  </div>
  

  )
}

export default Chart
