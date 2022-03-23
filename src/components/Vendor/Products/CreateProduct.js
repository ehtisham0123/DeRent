import { useState } from "react";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

function CreateProduct() {
  const token = reactLocalStorage.get("token");
  const [formdata, setFormData] = useState({
    name: "",
    details: "",
    per_day_rent : "",
    per_week_rent   : "",
    category   : "",
    thumbnail   : "",
  });
  const [errors, setErrors] = useState({
    name: "",
    details: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    switch (name) {
      // checking product name
      case "name":
        if (value.length < 3) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Product Name length must be atleast 3 characters",
          }));
        } else if (value.length > 100) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Product Name must not exceed 25 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      // checking product details
      case "details":
        if (value.length < 8) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Product Details length must be atleast 8 characters",
          }));
        } else if (value.length > 1000) {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "Product Details must not exceed 500 characters",
          }));
        } else {
          setErrors((prevState) => ({
            ...prevState,
            [name]: "",
          }));
        }
        break;
      default:
        break;
    }
  };

  const handlePhoto = (e) => {
    setFormData({ ...formdata, thumbnail: e.target.files[0] });
  };


  const handleSubmit = async (e) => {
    setSuccess("");
    setError("");
    e.preventDefault();
    if (errors.name == "" && errors.details == "") {
      const fd = new FormData();
      fd.append("name", formdata.name);
      fd.append("details", formdata.details);
      fd.append("category", formdata.category);
      fd.append("per_day_rent", formdata.per_day_rent);
      fd.append("per_week_rent", formdata.per_week_rent);
      fd.append("thumbnail", formdata.thumbnail);
      await axios
        .post(`${process.env.React_App_Url}/vendor/products/create`, fd, {
         headers: {
            "Content-Type": "multipart/form-data",
             token: token,
          },
        })
        .then(
          (response) => {
            if (response.data.success) {
              setSuccess(response.data.success);
              setFormData({
                name: "",
                details: "",
                per_day_rent : "",
                per_week_rent   : "",
                category   : "",
                thumbnail   : "",
              });
            }
            else if (response.data.error) {
              setError(response.data.error);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  return (
    <div id="content" className="mx-5">
      <div className="text-center my-5 ">
        <h2>Create New Product</h2>
      </div>
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row">
          <div className="form-group col-md-12">
            <label for="name">Product Name</label>
            <input
              type="text"
              name="name"
              className={`form-control input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder="Product Name"
              onChange={handleChange}
              value={formdata.name}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>
          <div className="form-group col-md-6">
            <label for="category">Category</label>
            <select
              id="category"
              name="category"
              className={`form-control input ${
                errors.category ? "is-invalid" : ""
              }`}
              value={formdata.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Electronic Devices">Electronic Devices</option>
              <option value="Sports">Sports</option>
              <option value="Books">Books</option>
              <option value="Fashion and Beauty">Fashion and Beauty</option>
              <option value="Furniture">Furniture</option>
            </select>
            {errors.category && (
              <div className="invalid-feedback">{errors.category}</div>
            )}
          </div>
          <div className="form-group col-md-6 mt-1">
            <label for="thumbnail"> Product Thumbnail </label>
            <br />
            <input
              id="thumbnail"
              type="file"
              name="thumbnail"
              className="form-control-file input"
              onChange={handlePhoto}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label for="per_day_rent">Per Day Rent</label>
            <input
              type="number"
              name="per_day_rent"
              className={`form-control input`}
              id="per_day_rent"
              placeholder="Per Day Rent"
              onChange={handleChange}
              value={formdata.per_day_rent}
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label for="per_week_rent">Per Week Rent</label>
            <input
              type="number"
              name="per_week_rent"
              className={`form-control input`}
              id="per_week_rent"
              placeholder="Per Week Rent"
              onChange={handleChange}
              value={formdata.per_week_rent}
              required
            />
          </div>
          
          <div className="form-group col-md-12">
            <label for="details">Details</label>
            <textarea
              name="details"
              className={`form-control input ${errors.details ? "is-invalid" : ""}`}
              id="details"
              placeholder="Details"
              onChange={handleChange}
              value={formdata.details}
              rows="5"
            ></textarea>
            {errors.details && (
              <div className="invalid-feedback">{errors.details}</div>
            )}
          </div>
          

        </div>
        <div className="row">
            {success && (
              <div className="form-group col-md-12">
                <div class="alert alert-success" role="alert">
                  {success}
                </div>
              </div>
            )}
            {error && (
              <div className="form-group col-md-12">
                <div class="alert alert-da" role="alert">
                  {error}
                </div>
              </div>
            )}
          <div className="form-group col-md-12">
            <button type="submit" className="form-control input btn btn-outline-dark">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
