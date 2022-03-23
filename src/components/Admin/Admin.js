import Home from "../Home";
import Borrowers from "./Borrowers/Borrowers";
import CreateBorrower from "./Borrowers/CreateBorrower"; 
import EditBorrower from "./Borrowers/EditBorrower"; 
import Borrower from "./Borrowers/Borrower";

import Vendors from "./Vendors/Vendors";
import CreateVendor from "./Vendors/CreateVendor";
import EditVendor from "./Vendors/EditVendor"; 
import Vendor from "./Vendors/Vendor";

import Products from "./Products/Products";
import HiredProducts from "./Products/HiredProducts";
import EditProduct from "./Products/EditProduct"; 
import Product from "./Products/Product";

import {useState} from "react";
import { Link ,Switch ,Route} from "react-router-dom";
import {reactLocalStorage} from 'reactjs-localstorage';

import logo from "../../logo.png";


function Admin({history,match,location}) {
  
  const checkBorrowers =  location.pathname.includes("admin/borrowers");
  const checkVendors =  location.pathname.includes("admin/vendors");
  const checkProducts =  location.pathname.includes("admin/products");
  const [active, setActive] = useState(false);

  const logout = ()=>{
    reactLocalStorage.remove('token');
    reactLocalStorage.remove('user_id');
    reactLocalStorage.remove('user_role');
    history.push("/admin-login");
  }

  const toggleClass = () => {
      const currentState = active;
      setActive(!currentState );
  };

  if (!reactLocalStorage.get('token')){
    history.push("/admin-login");
   }
  else if (reactLocalStorage.get('user_role') !== 'admin'){
    logout();    
    history.push("/admin-login");
   
   }


  return (
      <div className="wrAdminer d-flex align-items-stretch">
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
                </div>        <h3>DeRent</h3>
            </div>
          </div>
            
          <ul className="list-unstyled components mb-5">
            <Link to={`${match.url}`}>
              <li 
               className={`${location.pathname === "/admin"  ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-home mr-3"></span> Home
                </a>
              </li>
            </Link>


           <Link to={`${match.url}/vendors`}>
              <li
              className={`${checkVendors ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-user mr-3"></span>
                  Vendors
                </a>
              </li>
            </Link>              


           <Link to={`${match.url}/borrowers`}>
              <li
              className={`${checkBorrowers ? "active" : ""}`} 
              >
                <a>
                  <span className="fa fa-male mr-3"></span>
                  Borrowers
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
    
          <Route exact path={`${match.path}/borrowers`} component={Borrowers} />
          
          <Route path={`${match.path}/borrowers/create`} component={CreateBorrower}/>
             
          <Route path={`${match.path}/borrowers/profile/:id`} component={Borrower}/>
                      
          <Route path={`${match.path}/borrowers/edit/:id`} component={EditBorrower}/>
          
          

          <Route exact path={`${match.path}/vendors`} component={Vendors} />
          
          <Route path={`${match.path}/vendors/create`} component={CreateVendor}/>
             
          <Route path={`${match.path}/vendors/profile/:id`} component={Vendor}/>
                      
          <Route path={`${match.path}/vendors/edit/:id`} component={EditVendor}/>



          <Route exact path={`${match.path}/products`} component={Products} />
          
          <Route exact path={`${match.path}/products/hired-products/:id`} component={HiredProducts} />
             
          <Route path={`${match.path}/products/view/:id`} component={Product}/>
                      
          <Route path={`${match.path}/products/edit/:id`} component={EditProduct}/>
             
        </Switch>
      </div>
  );
}

export default Admin;
