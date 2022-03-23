import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Pusher from 'pusher-js';

function ChatMessages() {

  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [vendor, setVendor] = useState([]);
  const [borrower, setBorrower] = useState([]);
  let [messages, setMessages] = useState([]);
  const [input , setInput] = useState('');
  let { id } = useParams();

    useEffect(() => {
     var pusher = new Pusher('ea25a3949b7662bf5669', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      if(user_id == newMessage.borrower_id && id == newMessage.vendor_id){
      setMessages([...messages, newMessage])
        }
    });

    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);

  useEffect(() => {
    let getVendorData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/chat/vendor/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setVendor(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getVendorData();

      let getBorrowerData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/chat/avatar`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setBorrower(response.data.result[0]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBorrowerData();

      let getMessages = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/chat/messages/${id}`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setMessages(response.data.messages);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getMessages();



  }, [id]);

  const handleMessage = (e) => {
    console.log(e);
    setInput(e.target.value);
  }       
  const handleSubmit = (e) => {
  e.preventDefault()
  axios.post(`${process.env.React_App_Url}/borrower/chat/messages/new`,
  {
    message: input,
    vendor_id:id,
  },{
          headers: {
            token: token,
          },
        })
.then(function (response) {
    setInput('');
  })
 .catch(function (error) {
    console.log(error);
  });
  }



  return (
      !vendor?
        <div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-body welcome_card_body">     
                <h2 className="mt-2">Welcome To Chat</h2>
                <p>Hare you can Chat with Vendors</p>
            </div>
          </div>   
        </div>
        :<div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-header card_header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                     src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name}
                     className="rounded-circle user_img"
                  />
                </div>
                <div className="user_info">
                  <span>{vendor.name}</span>
                
                  <Link
                    to={`/borrower/products/vendor-profile/${vendor.id}`}
                  >
          

                  <p>{vendor.firstname} {vendor.lastname}</p>
                  </Link>
                
                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              
             {messages.map((message) => (
              message.status != 1 ?
              <div className="d-flex justify-content-start mb-4">
                <div className="img_cont_msg">
                  <img
                    src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
                <div className="msg_cotainer">
                 {message.message}
                </div>
              </div>
              :
              <div className="d-flex justify-content-end mb-4">
                <div className="msg_cotainer_send">
                 {message.message}
                </div>
                <div className="img_cont_msg">
                  <img
                    src={`${process.env.React_App_Url}/uploads/${borrower.avatar}`} alt={borrower.name}
                    className="rounded-circle user_img_msg"
                  />
                </div>
              </div>
              ))}
            </div>
            <div className="card-footer">
              <form onSubmit={handleSubmit} >
              <div className="input-group">
                <input
                  className="form-control type_msg"
                  placeholder="Type your message..."
                  value={input} 
                  onChange={handleMessage}
                  required
                />
                <div className="input-group-append">
                  <button type="submit" className="input-group-text send_btn"
                    >
                    <img src={`/send.png`} style={{width:"26px"}} alt={borrower.name} />
                    </button>
                </div>
              </div>
                </form>
            </div>
          </div>   
        </div>
  
  );

 
 


}
export default ChatMessages;



