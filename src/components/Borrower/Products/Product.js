import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import StarRatings from "react-star-ratings";

import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Product() {
  const token = reactLocalStorage.get("token");
  const user_id = reactLocalStorage.get("user_id");
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState([]);
  const [enrollment, setEnrollment] = useState();
  const [checkReview, setCheckReview] = useState(true);
  const [rating, SetRating] = useState(1);
  const [reviewDetails, SetReviewDetails] = useState("");

  let { id } = useParams();
  useEffect(() => {
    let getUserData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/products/show/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setProduct(response.data.result[0]);
            setReviews(response.data.reviews);
            setEnrollment(response.data.enrollment_id);
            response.data.reviews.map((review) => {  
            if(review.borrower_id == user_id){
                setCheckReview(false);
            }
            })
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUserData();
  }, [checkReview,enrollment]);

  const enroll = async (id) => {
    await axios
      .post(
        `${process.env.React_App_Url}/borrower/products/enroll/`,
        {
          product_id: product.id,
          vendor_id: product.vendor_id,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then((res) => {
        if (res.data.enrollment_id) {
          setEnrollment(res.data.enrollment_id);
        }
      });
  };

  const deleteEnrollment = async (id) => {
    await axios
      .delete(`${process.env.React_App_Url}/borrower/products/enrollment/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        setEnrollment(false);
        setCheckReview(true)
      });
  };
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
        setCheckReview(true)
      });
  };

  const changeRating = (newRating, name) => {
    SetRating(newRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(
        `${process.env.React_App_Url}/borrower/products/review`,
        {
          product_id: product.id,
          vendor_id: product.vendor_id,
          enorllment_id: enrollment,
          reviews:rating,
          reviews_details:reviewDetails,
        },
        {
          headers: {
            token: token,
          },
        }
      )
      .then(
        (response) => {
          if (response.data.success) {
            SetRating(1);
            SetReviewDetails('');
            setCheckReview(false)
          } 
        },
        (error) => {
          console.log(error);
        }
      );
  };

  return (
    <div id="content" className="mx-3">
      <div className="container">
        <h3 className="card-title text-center my-5">Product Details</h3>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">{product.name} By {product.vendor_firstname + " " + product.vendor_lastname}</h4>
                <div>
                  <Link
                    to={`/borrower/products/vendor-profile/${product.vendor_id}`}
                  >
                    <button className="btn btn-outline-dark btn-sm mr-1">
                      View Vendor Profile
                    </button>
                  </Link>
                {enrollment ? (
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={(e) => deleteEnrollment(product.id)}
                  >
                    Drop Product
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-dark"
                    onClick={(e) => enroll(product.id)}
                  >
                    <i className="fa fa-book mr-1"></i>Hire Product
                  </button>
                )}
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
                <hr />
                  {checkReview ? 
                    enrollment ?
                      <div className="card-body">
                        <h5 className="h6 card-title">Add Review</h5>
                          <form onSubmit={handleSubmit} className="needs-validation">
                            <div className="row">
                              <div className="form-group col-md-12">
                                <textarea
                                  name="details"
                                  className="form-control input"
                                  id="details"
                                  placeholder="Your Review"
                                  onChange={(e) => {
                                    SetReviewDetails(e.target.value);
                                  }}
                                  value={reviewDetails}
                                  rows="2"
                                  required
                                ></textarea>
                              </div>
                              <div className="form-group col-md-12">
                                <StarRatings
                                  rating={rating}
                                  starRatedColor="#000"
                                  starHoverColor="#000"
                                  starDimension="25px"
                                  starSpacing="2px"
                                  changeRating={changeRating}
                                  numberOfStars={5}
                                  name="rating"
                                />
                              </div>
                              <div className="form-group col-md-12">
                                <button
                                  type="submit"
                                  className="form-control btn btn-sm btn-outline-dark"
                                >
                                  Add Review
                                </button>
                              </div>
                            </div>
                          </form>
                      </div>
                    :null
                  :null
                  }
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
                    {review.borrower_id == user_id &&  
                      <button
                      className="btn btn-sm btn-outline-dark float-right my-2"
                      onClick={(e) => deleteReview(review.id)}
                      >
                      Delete Review
                    </button>
                    }

                      <br />
                      <small className="text-muted">{review.created_at}</small>
                      <div className="row">
                        <div className="col-md-12 my-1">
                          <StarRatings
                            rating={review.reviews}
                            starRatedColor="#000"
                            starDimension="20px"
                            starSpacing="2px"
                            numberOfStars={5}
                          />
                        </div>
                         
                      </div>
                      <div className="text-sm text-muted pl-3 ">
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
