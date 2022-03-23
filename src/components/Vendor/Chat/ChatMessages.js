import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import { Link,useParams } from "react-router-dom";
import axios from "axios";
import Pusher from 'pusher-js';

function ChatMessages() {

  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [borrower, setBorrower] = useState([]);
  const [vendor, setVendor] = useState([]);
  let [messages, setMessages] = useState([]);
  const [input , setInput] = useState('');
  let { id } = useParams();

    useEffect(() => {
     var pusher = new Pusher('ea25a3949b7662bf5669', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', function(newMessage) {
      if(id == newMessage.borrower_id && user_id == newMessage.vendor_id){
        setMessages([...messages, newMessage])
      }
    });

    return() => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[messages]);

  useEffect(() => {
    let getBorrowerData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/vendor/chat/borrower/${id}`, {
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

      let getVendorData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/vendor/chat/avatar`, {
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

      let getMessages = async () => {
      await axios
        .get(`${process.env.React_App_Url}/vendor/chat/messages/${id}`,{
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
    setInput(e.target.value);
  }       
  const handleSubmit = (e) => {
  e.preventDefault()
  axios.post(`${process.env.React_App_Url}/vendor/chat/messages/new`,
  {
    message: input,
    borrower_id:id,
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
      !borrower?
        <div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-body welcome_card_body">     
                <h2 className="mt-2">Welcome To Chat</h2>
                <p>Hare you can Chat with Borrowers</p>
            
            </div>
          </div>   
        </div>
        :<div className="col-7 col-md-8 chat">
          <div className="card chat_card">
            <div className="card-header card_header msg_head">
              <div className="d-flex bd-highlight">
                <div className="img_cont">
                  <img
                     src={`${process.env.React_App_Url}/uploads/${borrower.avatar}`} alt={borrower.name}
                     className="rounded-circle user_img"
                  />
                </div>
                <div className="user_info">
                  <span>{borrower.name}</span>
                
                   <Link to={`/vendor/products/borrower-profile/${borrower.id}`}>
         
                    <p>{borrower.firstname} {borrower.lastname}</p>
        </Link>
                

                </div>
              </div>
            </div>
            <div className="card-body msg_card_body">
              
             {messages.map((message) => (
              message.status == 1 ?
              <div className="d-flex justify-content-start mb-4">
                <div className="img_cont_msg">
                  <img
                    src={`${process.env.React_App_Url}/uploads/${borrower.avatar}`} alt={borrower.name}
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
                    src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name}
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



