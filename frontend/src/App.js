import './App.css';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';
import Home from './Page/Home';
import Profile from './Components/profile/profile';

import NotFound from './Components/notFound/notFound';
import Register from './Page/Registre';
import LandingPage from './Components/LandingPage';
import Login from './Page/Login';

import Shop from './Page/Shop';
import Card from './Page/card/Card';
import ResetPassword from './Page/ResetPassword';
import CheckoutSuccess from './Page/Stripe/CheckoutSuccess';



function App() {

  return (


  
      <Router>
         
          <Routes>
            
            <Route path="/" element={<Home />} >
            <Route path="" element={<LandingPage />} />
            <Route path='Shop' element={<Shop/>} />


            <Route path="profile" element={<Profile  />} />
            <Route path="Registre" element={<Register />} />
            <Route path="Login" element={<Login />} />
            <Route path="ResetPassword" element={<ResetPassword />} />
           
            <Route path="checkout-success" element={<CheckoutSuccess />} />

            <Route path="card" element={<Card />} />
            <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        
      </Router>
    );
  }
  


export default App;
