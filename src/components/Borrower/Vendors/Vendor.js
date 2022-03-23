import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import LocationShowModal from "../../LocationShowModal";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Vendor() {
  const token = reactLocalStorage.get("token");
  const [vendor, setVendor] = useState([]);
  const [products, setProducts] = useState([]);
  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/vendors/profile/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setVendor(response.data.result[0]);
            setProducts(response.data.products);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, []);
  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Vendor Profile</h2>
      </div>
      <div className="row">
        <div className="col-md-4 border pt-5 my-1 text-dark d-flex flex-column align-items-center">
          <div className="profile-img mb-3">
            <img src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name} />
          </div>
          <Link to={`/borrower/chat/${vendor.id}`}>
            <button className="btn btn-outline-dark  mb-1 mr-1">
              <i className="fa fa-comment"></i> Message
            </button>
          </Link>
        </div>
          <div className="col-md-8 border p-4  my-1">
          <h2 className="text-dark mb-4">{vendor.name}</h2>
          <div className="profile-tab">
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Full Name</h5>
              </div>
              <div className="col-md-8">
                <p>
                  {vendor.firstname} {vendor.lastname}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Email</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.email}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Gender</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.gender}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Contact</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.contact}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Age</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.age}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">House No</h5>
              </div>
              <div className="col-md-8">
                {vendor.housenumber ? (
                  <p>{vendor.housenumber}</p>
                ) : (
                  <p className="text-dark">Null </p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Street</h5>
              </div>
              <div className="col-md-8">
                {vendor.streetnumber ? (
                  <p>{vendor.streetnumber}</p>
                ) : (
                  <p className="text-dark">Null </p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">City</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.city}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">State</h5>
              </div>
              <div className="col-md-8">
                {vendor.state ? (
                  <p>{vendor.state}</p>
                ) : (
                  <p className="text-dark">Null </p>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Country</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.country}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <h5 className="headings">Postal code</h5>
              </div>
              <div className="col-md-8">
                <p>{vendor.postalcode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row gutters-sm mt-1">
        <div className="col-sm-6 h-100 mb-3">
          <LocationShowModal
            latitude={vendor.latitude}
            longitude={vendor.longitude}
          />
        </div>
        <div className="col-sm-6 mb-3">
          <div
            className="card -berry edge--bottom"
            style={{ height: "325px", "overflow-y": "auto" }}
          >
            <div className="card-body">
              <h6 className="d-flex align-items-center mb-3">
                <i className="material-icons text-dark mr-2">Products</i>
              </h6>
              {products.map((product) => (
                <div className="row">
                  <div className="col-sm-10">
                    <h6 className="mb-0">{product.name}</h6>
                  </div>
                  <div className="col-sm-2 text-dark  text-right">
                    <p>
                      <Link to={`../../products/view/${product.id}`}>
                        <button className="btn btn-sm btn-outline-dark mr-1">
                          View
                        </button>
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vendor;
