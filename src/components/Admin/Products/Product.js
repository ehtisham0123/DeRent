import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";


function Product() {
  const token = reactLocalStorage.get("token");
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState([]);

  let { id } = useParams();
  useEffect(() => {
    let getProductData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/admin/products/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setProduct(response.data.result[0]);
            setReviews(response.data.reviews);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getProductData();
  }, []);
  const deleteReview = async (id) => {
    await axios
      .delete(`${process.env.React_App_Url}/borrower/products/reviews/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newReviews = reviews.filter((review) => review.id !== id);
        setReviews(newReviews);
      });
  };

  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Product Details</h3>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header border d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">{product.name} By {product.vendor_firstname + " " + product.vendor_lastname}</h4>
                <div className="d-flex">
                  <Link to={`../../vendors/profile/${product.vendor_id}`}>
                    <button className="btn btn-outline-dark btn-sm mr-1">
                      View Vendor
                    </button>
                  </Link>
                  <Link to={`/admin/products/hired-products/${product.id}`}>
                    <button className="btn btn-outline-dark btn-sm mr-1">
                      hired products
                    </button>
                  </Link>
                </div>
              </div>
              <div className="card-body h-100">
                <p className="no-margin-bottom">{product.details} </p>
                <div class="row my-5">
                  <div class="col-6">
                    <div class="row">
                      <div class="col-6">
                        <p class="mb-0">Category</p>
                      </div>
                      <div class="col-6">
                        {product.category}
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-6">
                        <p class="mb-0">Per Day Rent</p>
                      </div>
                      <div class="col-6">
                        {product.per_day_rent}
                      </div>
                    </div>
                    <div class="row mt-4">
                      <div class="col-6">
                        <p class="mb-0">Per Week Rent</p>
                      </div>
                      <div class="col-6 mb-5">
                        {product.per_week_rent}
                      </div>
                    </div>
                  </div>

                  <div class="col-6">
                    <a href={`http://localhost:3000/uploads/${product.thumbnail}`} target="_blank" >
                      <img
                        src={`${process.env.React_App_Url}/uploads/${product.thumbnail}`}
                        alt={product.name}
                        height="190"
                        style={{ marginTop: '-20px' }}
                      />
                    </a>
                  </div>
                </div>
                {reviews.map((review) => (
                  <div className="media mb-4">
                    <img
                      src={`${process.env.React_App_Url}/uploads/${review.borrower_photo}`}
                      alt={product.borrower_name}
                      width="36"
                      height="36"
                      className="rounded-circle mr-2"
                    />
                    <div className="media-body">
                      <strong>
                        {review.borrower_firstname} {review.borrower_Lastname}
                      </strong>{" "}
                      added a review on <strong>{product.name}</strong>'s Product
                      <span
                        className="btn btn-outline-dark btn-sm float-right my-2"
                        onClick={(e) => deleteReview(review.id)}
                      >
                        Delete
                      </span>

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-6 text-warning font-weight-bold">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#000"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                      </div>
                      <div className="border text-sm text-muted p-2 ml-3">
                        {review.reviews_details}
                      </div>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;

