import './App.css';
import {BrowserRouter as Router,Route,Routes,useNavigate} from 'react-router-dom';
import Chart from './Page/Chart';
import Error404 from './Page/Error404';
import Form from './Page/Form';
import Dashboard from './Page/Dashboard';
import Home from './Page/Home';
import Signin from './Page/Signin'; 
import Table from './Page/Table';
import Admin from './Page/AddAdmin';
import ListeAdmin from './Page/ListeAdmin';
function App() {

  return (


  
    <Router>

    <Routes>
    <Route path="/" element={<Signin/>} />

       <Route path="/" element={<Home />} >
       <Route path="Home" element={<Dashboard/>} />
       <Route path="Form" element={<Form/>} />
       <Route path='Chart' element={<Chart />} />
       <Route path='Admin' element={<Admin />} />
       <Route path='ListeAdmin' element={<ListeAdmin />} />

       <Route path='Table' element={<Table />} />

       <Route path="Error404" element={<Error404/>} />
      </Route>
    </Routes>

</Router>
    );
  }
  


export default App;
