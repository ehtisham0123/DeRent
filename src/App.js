import "./App.css";
import {reactLocalStorage} from 'reactjs-localstorage';

import Home from "./Home";
import Admin from "./components/Admin/Admin";
import Vendor from "./components/Vendor/Vendor";
import Borrower from "./components/Borrower/Borrower";

import AdminLogin from "./components/Admin/AdminLogin";
import VendorLogin from "./components/Vendor/VendorLogin";
import VendorSignup from "./components/Vendor/VendorSignup";
import BorrowerLogin from "./components/Borrower/BorrowerLogin";
import BorrowerSignup from "./components/Borrower/BorrowerSignup";

import { Link, Switch, Route } from "react-router-dom";
import { useState } from "react";


import logo from "./logo.png";
require('dotenv').config()

function App({ location,history }) {
  const [active, setActive] = useState(false);
  const toggleClass = () => {
    const currentState = active;
    setActive(!currentState);
  };
  return (
    <div className="App">
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/vendor" component={Vendor} />
        <Route path="/borrower" component={Borrower} />
        <div className="wrapper d-flex align-items-stretch"  >
          <nav id="sidebar" className={active ? "active" : null}>
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
              <Link to={`/`}>
                <li className={`${location.pathname === "/" ? "active" : ""}`}>
                  <a>
                    <span className="fa fa-home mr-3"></span>
                    Home
                  </a>
                </li>
              </Link>
              <Link to={`/admin-login`}>
                <li
                  className={`${
                    location.pathname === "/admin-login" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-sign-in mr-3"></span>
                    Admin Login
                  </a>
                </li>
              </Link>
              <Link to={`/vendor-signup`}>
                <li
                  className={`${
                    location.pathname === "/vendor-signup" ? "active" : ""
                  }`}
                >
                  <a className="d-flex align-items-center">
                    <span className="fa fa-user-plus mr-3"></span>
                    Vendor Registration
                  </a>
                </li>
              </Link>
              <Link to={`/vendor-login`}>
                <li
                  className={`${
                    location.pathname === "/vendor-login" ? "active" : ""
                  }`}
                >
                  <a className="d-flex align-items-center">
                    <span className="fa fa-sign-in mr-3"></span>                      
                    Vendor Login
                  </a>
                </li>
              </Link>
              <Link to={`/borrower-signup`}>
                <li
                  className={`${
                    location.pathname === "/borrower-signup" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-user-plus mr-3"></span>
                    Borrower Registration
                  </a>
                </li>
              </Link>
              <Link to={`/borrower-login`}>
                <li
                  className={`${
                    location.pathname === "/borrower-login" ? "active" : ""
                  }`}
                >
                  <a>
                    <span className="fa fa-sign-in mr-3"></span>
                    Borrower Login
                  </a>
                </li>
              </Link>
            </ul>
          </nav>

          <Route exact path="/" component={Home} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/vendor-login" component={VendorLogin} />
          <Route path="/vendor-signup/" component={VendorSignup} />
          <Route path="/borrower-login" component={BorrowerLogin} />
          <Route path="/borrower-signup" component={BorrowerSignup} />
        </div>
      </Switch>
    </div>
  );
}

export default App;
