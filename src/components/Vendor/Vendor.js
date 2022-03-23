import Home from "../Home";
import Chat from "./Chat/Chat";
import Products from "./Products/Products";
import HiredProducts from "./Products/HiredProducts";
import CreateProduct from "./Products/CreateProduct";
import EditProduct from "./Products/EditProduct"; 
import Product from "./Products/Product";
import EditProfile from "./Profile/EditProfile"; 
import Profile from "./Profile/Profile";
import Borrower from "./Borrowers/Borrower";

import { useState } from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import logo from "../../logo.png";


function Vendor({history,match,location}) {
  const checkProfile =  location.pathname.includes("vendor/profile");
  const checkChat =  location.pathname.includes("vendor/chat");
  
  const checkProducts =  location.pathname.includes("vendor/products");
  const checkErollments =  location.pathname.includes("vendor/erollments");
  const [active, setActive] = useState(false);

   const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    history.push("/vendor-login");
  }

  if (!reactLocalStorage.get('token')){
    history.push("/vendor-login");
   }
  else if (reactLocalStorage.get('user_role') != 'vendor'){
    logout();    
    history.push("/vendor-login");
   }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };


  return (
      <div className="wrapper d-flex align-items-stretch">
            <nav id="sidebar" className={active ? 'active': null}>
            <div className="custom-menu">
             <button
              type="button"
              id="sidebarCollapse"
              className="btn btn-primary"
              onClick={toggleClass} 
            ></button>
          </div>
          <div
            className="img bg-wrap text-center py-4"
          >
            <div className="user-logo">
   <div
                  className="img"
                >
                  <img
                  src={logo}
                  width="220"
                 />
                </div>               <h3>DeRent</h3>
              </div>
            </div>
            
          <ul className="list-unstyled components mb-5">
            
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/vendor"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>

             <Link to={`${match.url}/profile`}>
              <li 
              className={`${checkProfile ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-id-card mr-3"></span> Profile
                </a>
              </li>
            </Link>
                     <Link to={`${match.url}/chat`}>
              <li 
              className={`${checkChat ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-comment mr-3"></span> Chat
                </a>
              </li>
            </Link>

            <Link to={`${match.url}/products`}>
              <li
              className={`${checkProducts ? "active" : ""}`} 
              >
                <a href="#">
                  <span className="fa fa-briefcase mr-3" aria-hidden="true"></span>
                  Products
                </a>
              </li>
            </Link>     
            <Link onClick={logout}>
              <li>
                <a>
                   <span className="fa fa-sign-out mr-3" aria-hidden="true"></span>
                    Logout
                </a>  
              </li>
            </Link>    
          </ul>
        </nav>
        <Switch>

          <Route exact path={`${match.path}`}  component={Home} />  

          <Route exact path={`${match.path}/chat/:id?`}  component={Chat} />  


          <Route path={`${match.path}/profile/edit/`} component={EditProfile}/>
          
          <Route path={`${match.path}/profile/`} component={Profile}/>
                      
             

          <Route exact path={`${match.path}/products`} component={Products} />
          
          <Route exact path={`${match.path}/products/hired-products/:id`} component={HiredProducts} />

          <Route path={`${match.path}/products/create`} component={CreateProduct}/>
             
          <Route path={`${match.path}/products/view/:id`} component={Product}/>
                      
          <Route path={`${match.path}/products/edit/:id`} component={EditProduct}/> 
          
          <Route path={`${match.path}/products/borrower-profile/:id`} component={Borrower}/> 

        </Switch>
      </div>
  );
}

export default Vendor;
