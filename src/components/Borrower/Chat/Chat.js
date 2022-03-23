import "./Chat.css";
import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link,useParams } from "react-router-dom";
import ChatMessages from "./ChatMessages";
function Chat() {
const token = reactLocalStorage.get("token");
  const [vendors, setVendors] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getVendorsData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/chat/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setVendors(response.data.result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getVendorsData();
  }, []);

  const searchVendor = async (name) => {
    await axios
      .get(`${process.env.React_App_Url}/borrower/chat/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setVendors(response.data.result);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };



  return (
   <div id="content" className="p-1 p-md-5 pt-5 content">
     <div className="container-fluid h-100">
      <div className="row justify-content-center h-100">
        <div className="col-5 col-md-4 chat">
          <div className="card chat_card mb-sm-3 mb-md-0 contacts_card">
            <div className="card-header card_header">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search..."
                  onChange={(e) => searchVendor(e.target.value)}
                  className="form-control search"
                />          
              </div>
            </div>
            <div className="card-body card_body contacts_body">
              <ui className="contacts">
              {vendors.map((vendor) => (
              <Link  style={{ textDecoration: 'none' }}  to={`/borrower/chat/${vendor.id}`} > 
                <li 
                 className={`${
                    id == vendor.id ? "chat_active" : ""
                  }`}
                >
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <img
                        src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name}
                        className="rounded-circle user_img"
                      />
                    </div>
                    <div className="user_info">
                      <span>{vendor.name}</span>
                       <p>{vendor.firstname} {vendor.lastname}</p>
                    </div>
                  </div>
                </li>
              </Link>            
                ))}
              </ui>
            </div>
          </div>
        </div>
        <ChatMessages vendorId={id}/>
      </div>
    </div> 
    </div>
  );
}

export default Chat;



