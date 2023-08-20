import { useCookies } from 'react-cookie';
import {  MDBIcon } from 'mdb-react-ui-kit';


import { NavLink ,useNavigate} from 'react-router-dom';

function Header() {
  const [cookies, setCookie, removeCookie] = useCookies(['session','username','id','cartItemsCount','CardId']);
  const sessionCookie = cookies.session;
  const username = cookies.username;
  const cartItemsCount = cookies.cartItemsCount;
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout ?');

    if (confirmLogout) {
      removeCookie('session');
      removeCookie('username');
      removeCookie('id');
      removeCookie('cartItemsCount');
      removeCookie('CardId');

    }

  };

  // Fetch cart data and calculate the total number of products in the cart

  // const fetchCartData = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/cart/user', { params: { IdUser: cookies.id } });

  //     console.log('Cart Data:', response.data.shoppingcart.items);
  //     const totalItems = response.data.shoppingcart.items.length;

  //     setCartItemsCount(totalItems); // Update cartItemsCount state here
  //   } catch (error) {
  //     console.error('Error fetching cart data:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (sessionCookie) {
  //     fetchCartData();
  //   }
  // },[]);
  
   
  return (
    <header className="header-area header-sticky">
      <div className="container">
        <div className="row">

          <div className="col-12">
            <nav className="main-nav">
              <NavLink to="/"  className="logo">
                <img src="assets/images/logo.png" alt="" style={{marginTop:"-10px"}}/>
              </NavLink>
              
              <ul className="nav">
                <li><NavLink to="/"><MDBIcon fas icon="home" /> Home</NavLink></li>
                <li><NavLink to="/shop" ><MDBIcon fas icon="shopping-cart" /> Shop</NavLink></li>
                
                {sessionCookie ? (
                  <>
                    <li><NavLink to="/card" ><MDBIcon fas icon="shopping-basket" /><span className="notification"> {cartItemsCount}</span></NavLink></li>
                    <li><NavLink to="/Login" onClick={handleLogout}><MDBIcon fas icon="sign-out-alt" /> Logout</NavLink></li>
                    <li><NavLink to={`/profile`}>Profile <img src="../assets/images/profile-header.jpg" alt="" /></NavLink></li>
                  </>
                ) : (
                  <>
                    <li><NavLink to="/Registre"><MDBIcon fas icon="user-plus" /> Register</NavLink></li>
                    <li><NavLink to="/Login"><MDBIcon fas icon="sign-in-alt" /> Login</NavLink></li>
                    <li></li>
                  </>
                )}
              </ul>
              <a className='menu-trigger'>
                <span>Menu</span>
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
