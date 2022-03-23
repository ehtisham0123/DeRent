import { useState, useEffect } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link,useParams } from "react-router-dom";

import HiredProductsTableRow from "./HiredProductsTableRow";
import Pagination from "./Pagination";
import Spinner from "../../Spinner.png";

function HiredBorrowers({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowersPerPage, setBorrowersPerPage] = useState(5);
  const indexOfLastBorrower = currentPage * borrowersPerPage;
  const indexOfFirstBorrower = indexOfLastBorrower - borrowersPerPage;
  const currentBorrowers = borrowers.slice(indexOfFirstBorrower, indexOfLastBorrower);

  let { id } = useParams();

  useEffect(() => {
    setLoading(true);
    let getBorrowersData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/admin/products/hired-products/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setBorrowers(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getBorrowersData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

   const deleteEnrollment = async (borrower_id) => {
    await axios
      .delete(`${process.env.React_App_Url}/admin/products/enrollment/product/${id}/borrower/${borrower_id}`,
      {
        headers: {
          token: token,
        },
      }
      )
      .then((res) => {
        setBorrowers(borrowers.filter((borrower) => borrower.id !== borrower_id));
      });
  };


  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center mb-5">Hired Products table</h3>
        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px" }}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "100" }}>#</th>
              <th style={{ minWidth: "100px" }}>Photo</th>
              <th style={{ minWidth: "200px" }}>Borrower Name</th>
              <th style={{ minWidth: "200px" }}>Borrower Email</th>
              <th style={{ minWidth: "100px" }}>Actions</th>
            </tr>
          </thead>
          {loading ? (
            <div className="loading">
              <img src={Spinner} className="loader" alt="loader" />
              <h2>Loading</h2>
            </div>
          ) : (
            <tbody>
              {currentBorrowers.map((borrower) => (
                <HiredProductsTableRow
                  match={match}
                  borrower={borrower}
                  deleteEnrollment={deleteEnrollment}
                />
              ))}
            </tbody>
          )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstBorrower + 1} to {indexOfLastBorrower} of{" "}
            {borrowers.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control select"
                onChange={(e) => {
                  setBorrowersPerPage(e.target.value);
                }}
                value={borrowersPerPage}
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
              productsPerPage={borrowersPerPage}
              totalProducts={borrowers.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HiredBorrowers;
