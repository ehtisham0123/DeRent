import React, { useState } from "react";
import axios from "axios";
import {reactLocalStorage} from 'reactjs-localstorage';

function AdminLogin(props) {
 
	if (reactLocalStorage.get('token')){
	  	props.history.push("/admin");
	}
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    axios
      .post(`${process.env.React_App_Url}/admin/login`, formdata)
      .then(function (response) {
        if (response.data.token) {
          reactLocalStorage.set('token', response.data.token);
          reactLocalStorage.set('user_id', response.data.user_id);
          reactLocalStorage.set('user_role', response.data.user_role);
          props.history.push("/admin");
        }
        else if (response.data.error) {
          setError(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
 
  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-1 col-sm-2 col-md-3"></div>
    	<div className="col-10  col-sm-8   col-md-6 align-self-center login-form">
          <h2>Admin Login</h2>
          <form onSubmit={handleSubmit} >
            <div className="row">
              <div className="form-group col-md-12">
                <label for="email">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control input ${error ? "is-invalid" : ""}`}
                  id="email"
                  spellcheck="false"
                  placeholder="Email"
                  onChange={handleChange}
                  value={formdata.email}
                  required
                />
              </div>
              <div className="form-group col-md-12">
                <label for="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control input ${error ? "is-invalid" : ""}`}
                  id="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={formdata.password}
                  required
                />
                {error && (
                  <div className="invalid-feedback mt-2">{error}</div>
                )}
              </div>
            </div>
            <div className="row">
	          <div className="form-group col-md-12 mt-2">
	            <button type="submit" className="form-control input btn btn-outline-dark">
	              Login
	            </button>
	          </div>
	        </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AdminLogin;
