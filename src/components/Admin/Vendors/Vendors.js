import { useState, useEffect } from "react";
import VendorsTableRow from "./VendorsTableRow";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Pagination from "./Pagination";
import Spinner from '../../Spinner.png';

function Vendors({ match, location }) {
  const token = reactLocalStorage.get("token");
  const [loading, setLoading] = useState(false);
  const [vendor, setVendors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorPerPage, setVendorsPerPage] = useState(5);
  const indexOfLastVendor = currentPage * vendorPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorPerPage;
  const currentVendors = vendor.slice(
    indexOfFirstVendor,
    indexOfLastVendor
  );

  useEffect(() => {
    setLoading(true);
    let getUsersData = async () => {
      await axios
        .get(`${process.env.React_App_Url}/admin/vendors/`,{
          headers: {
            token: token,
          },
        })
        .then((response) => {
          if (response.data) {
            setVendors(response.data.result);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getUsersData();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const deleteVendor = async (id) => {
    await axios.delete(`${process.env.React_App_Url}/admin/vendors/${id}`,{
          headers: {
            token: token,
          },
        }).then((res) => {
      const newVendors = vendor.filter((vendor) => vendor.id !== id);
      setVendors(newVendors);
    });
  };

  const searchVendor = async (name) => {
    setLoading(true);
    await axios
      .get(`${process.env.React_App_Url}/admin/vendors/${name}`,{
          headers: {
            token: token,
          }
        })
      .then((response) => {
        if (response.data) {
          setVendors(response.data.result);
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
        <h3 className="card-title text-center">Vendors table</h3>
        <div className="row d-flex align-items-center justify-content-between  mr-1">
          <div>
            <input
              type="search"
              className="form-control search_bar ml-3"
              placeholder="Search"
              onChange={(e) => searchVendor(e.target.value)}
            />
          </div>
          <Link to={`${match.url}/create`}>
            <button className="btn btn-outline-dark mr-1">
              <i className="fa fa-user-plus"></i> Add Vendor
            </button>
          </Link>
        </div>

        <table
          className="table table-responsive dataTable mt-3"
          role="grid"
          style={{ minHeight: "350px"}}
        >
          <thead> 
            <tr role="row" >
              <th style={{ minWidth: "50px" }}>Photo</th>
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
           
              {currentVendors.map((vendor) => (
                <VendorsTableRow match={match} vendor={vendor} deleteVendor={deleteVendor}/>
              ))}
          </tbody>
            )}
        </table>

        <div className="row d-flex align-items-center">
          <div className="col-8 col-md-3 ">
            Showing {indexOfFirstVendor + 1} to {indexOfLastVendor} of{" "}
            {vendor.length} entities
          </div>
          <div class="col-4">
            <label>
              <select
                class="form-control select"
                onChange={(e) => {
                  setVendorsPerPage(e.target.value);
                }}
                value={vendorPerPage}
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
              vendorsPerPage={vendorPerPage}
              totalVendors={vendor.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vendors;
