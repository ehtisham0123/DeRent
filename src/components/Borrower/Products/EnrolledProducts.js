import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";

import EnrolledProductsTableRow from "./EnrolledProductsTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function EnrolledProducts({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    setLoading(true);
    let getProductsData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/borrower/products/enrolled`,{
          headers: {
            token: token,
          } 
        })
        .then((response) => {
          if (response.data) {
            console.log(response.data.products)
            setProducts(response.data.products);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getProductsData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteEnrollment = async (id) => {
    await axios
      .delete(`${process.env.React_App_Url}/borrower/products/enrollment/${id}`,{
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const newProducts = products.filter((product) => product.id !== id);
        setProducts(newProducts);
      });
  };

  const searchProduct = async (name) => {
    setLoading(true);
    await axios
      .get(`${process.env.React_App_Url}/borrower/products/enrolled/${name}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        if (response.data) {
          setProducts(response.data.products);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Enrolled Products table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control search_bar"
              placeholder="Search"
              onChange={(e) => searchProduct(e.target.value)}
            />
          </div>
          <Link to={`/borrower/products`}>
            <button className="btn btn-outline-dark mr-1">
              <i className="fa fa-briefcase mr-1"></i> All Products
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px" }}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "50px" }}>#</th>
              <th style={{ minWidth: "140px" }}>Name</th>
              <th style={{ minWidth: "140px" }}>Category</th>
              <th style={{ minWidth: "140px" }}>Rent Per Day</th>
              <th style={{ minWidth: "140px" }}>Rent Per Week</th>
              <th style={{ minWidth: "180px" }}>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <div className="loading">
              <img src={Spinner} className="loader" alt="Loader" />
              <h2>Loading</h2>
            </div>
          ) : (
            <tbody>
              {currentProducts.map((product) => (
                <EnrolledProductsTableRow
                  deleteEnrollment={deleteEnrollment}
                  match={match}
                  product={product}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstProduct + 1} to {indexOfLastProduct} of{" "}
            {products.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control select"
                onChange={(e) => {
                  setProductsPerPage(e.target.value);
                }}
                value={productsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-center">
            <Pagination
              productsPerPage={productsPerPage}
              totalProducts={products.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnrolledProducts;
