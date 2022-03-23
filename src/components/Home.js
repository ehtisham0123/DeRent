import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";

function Home() {
  const token = reactLocalStorage.get("token");
  const [response, setResponse] = useState([]);
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/`, {
        headers: {
          token: token,
        },
      })
        .then((response) => {
          if (response.data) {
            setResponse(response.data.result[0]);    
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
   <div id="content" className="p-4 p-md-5 pt-5">
   <h2 className="text-center mb-4">DeRent</h2>
    <div class="container ml-4">
        <div class="row py-2">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-2">
            </div>
            <div class="col-6">
              <h3 class="h5 home-serv homeserv-border">    
                 {response.products}   Products
                </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-center py-2">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-2">
            </div>
            <div class="col-6">
              <h3 class="h5 home-serv homeserv-border">
               {response.vendors}  Vendors
              
             </h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-md-end py-2 ">
        <div class="col-6 text-center">
          <div class="row">
            <div class="col-2">
            </div>
            <div class="col-6">
              <h3 class="h5 home-serv homeserv-border">
                 {response.borrowers }  Borrowers
             </h3>
            </div>
          </div>
        </div>
      </div>



    </div>
   </div>
   )}

export default Home;



