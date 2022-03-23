import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";

import ProductsTableRow from "./ProductsTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function Products({ match, location }) {
  const token = reactLocalStorage.get("token");
  let user_id = reactLocalStorage.get("user_id");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(5);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setLoading(true);
    let getProductsData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/vendor/products/`,{
          headers: {
            token: token,
          }, 
          params: {
            category: category
          }, 
        })
        .then((response) => {
          if (response.data) {
            setProducts(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getProductsData();
  }, [category]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteProduct = async (id) => {
    await axios
      .delete(`${process.env.React_App_Url}/vendor/products/${id}`,{
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
      .get(`${process.env.React_App_Url}/vendor/products/${name}`, {
        headers: {
          token: token,
        },
        params: {
            category: category
        },
      })
      .then((response) => {
        if (response.data) {
          setProducts(response.data.result);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

   const setNewCategories = async (e) => { 
    setCategory(e.target.value);
  }

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Products table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div className="d-flex align-items-center">
            <input
              type="search"
              className="form-control search_bar ml-3"
              placeholder="Search"
              onChange={(e) => searchProduct(e.target.value)}
            />
            <label>
              <select
                class="form-control form-control select ml-3"
                onChange={setNewCategories}
              >
                <option value="All">ALL</option>
                <option value="Electronic Devices">Electronic Devices </option>
                <option value="Sports">Sports </option>
                <option value="Books">Books </option>
                <option value="Fashion and Beauty">Fashion and Beauty </option>
                <option value="Furniture">Furniture </option>
              </select>
            </label>
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-dark mr-1">
              <i className="fa fa-user-plus"></i> Add Product
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
              <th style={{ minWidth: "150px" }}>Name</th>
              <th style={{ minWidth: "150px" }}>Category</th>
              <th style={{ minWidth: "150px" }}>Rent Per Day</th>
              <th style={{ minWidth: "150px" }}>Rent Per Week</th>
              <th style={{ minWidth: "150px" }}>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <div className="loading">
              <img src={Spinner} className="loader" alt="loader" />
              <h2>Loading</h2>
            </div>
          ) : (
            <tbody>
              {currentProducts.map((product) => (
                <ProductsTableRow
                  match={match}
                  product={product}
                  deleteProduct={deleteProduct}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstProduct + 1} to {indexOfLastProduct} of{" "}
            {Products.length} entities
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

export default Products;
