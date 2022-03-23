import { useState, useEffect } from "react";
import BorrowersTableRow from "./BorrowersTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function Borrowers({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [borrowers, setBorrowers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowersPerPage, setBorrowersPerPage] = useState(5);
  const indexOfLastBorrower = currentPage * borrowersPerPage;
  const indexOfFirstBorrower = indexOfLastBorrower - borrowersPerPage;
  const currentBorrowers = borrowers.slice(
    indexOfFirstBorrower,
    indexOfLastBorrower
  );

  useEffect(() => {
    setLoading(true);
    let getBorrowersData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/admin/borrowers/`,{
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
    console.log(process.env)
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteBorrower = async (id) => {
    await axios.delete(`${process.env.React_App_Url}/admin/borrowers/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newborrowers = borrowers.filter((borrower) => borrower.id !== id);
      setBorrowers(newborrowers);
    });
  };

  const searchBorrower = async (name) => {
    setLoading(true);
    await axios
      .get(`${process.env.React_App_Url}/admin/borrowers/${name}`,{
          headers: {
            token: token,
          }
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

  return (
    <div id="content" className="p-4">
      <div className="card-body">
        <h3 className="card-title text-center">Borrowers Table</h3>
        <div className="row d-flex align-items-center justify-content-between mr-1">
          <div>
            <input
              type="search"
              className="form-control search_bar ml-3"
              placeholder="Search"
              onChange={(e) => searchBorrower(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-dark mr-1">
              <i className="fa fa-borrower-plus"></i> Add Borrower
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px"}}
        >
          <thead>
            <tr role="row">
              <th style={{ minWidth: "5px" }}>Photo</th>
              <th style={{ minWidth: "100px" }}>Name</th>
              <th style={{ minWidth: "200px" }}>Email</th>
              <th style={{ minWidth: "50px" }}>Contact</th>
              <th style={{ minWidth: "50px" }}>Gender</th>
              <th style={{ minWidth: "50px" }}>City</th>
              <th style={{ minWidth: "180px" }}>Actions</th>
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
                <BorrowersTableRow match={match} borrower={borrower} deleteBorrower={deleteBorrower}/>
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
              borrowersPerPage={borrowersPerPage}
              totalBorrowers={borrowers.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Borrowers;
