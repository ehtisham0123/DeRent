import { useState } from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "../Home";

import Chat from "./Chat/Chat";

import EnrolledProducts from "./Products/EnrolledProducts";
import Products from "./Products/Products";
import Product from "./Products/Product";

import EditProfile from "./Profile/EditProfile"; 
import Profile from "./Profile/Profile";

import Vendor from "./Vendors/Vendor";

import logo from "../../logo.png";


function Borrower({history,match,location}) {
  const checkProfile =  location.pathname.includes("borrower/profile");
  const checkProducts =  location.pathname.includes("borrower/products");
  const checkChat =  location.pathname.includes("borrower/chat");
  const checkErollments =  location.pathname.includes("borrower/erollments");
  const [active, setActive] = useState(false);

const logout = () => {
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    history.push("/borrower-login");
  }

  if (!reactLocalStorage.get('token')){
    history.push("/borrower-login");
   }
  else if (reactLocalStorage.get('user_role') != 'borrower'){
    logout();    
    history.push("/borrower-login");
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
                </div>   
                <h3>DeRent</h3>
            </div>
          </div>
            
          <ul className="list-unstyled components mb-5">
            
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/borrower"  ? "active" : ""}`} 
              >
                <a href="">
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>

             <Link to={`${match.url}/profile`}>
              <li 
              className={`${checkProfile ? "active" : ""}`} 
              >
                <a href="">
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
                <a href="">
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
             
          <Route path={`${match.path}/products/enrolled-products`} component={EnrolledProducts} />
             
          <Route path={`${match.path}/products/view/:id`} component={Product}/>
                      
          <Route path={`${match.path}/products/vendor-profile/:id`} component={Vendor}/> 


        </Switch>
      </div>
  );
}

export default Borrower;
