import { Link } from "react-router-dom";
function HiredProductsTableRow({ match, borrower, deleteEnrollment }) {
  return (
    <tr role="row">
      <td>{borrower.id}</td>
      <td className="img_cont">
        <img
            style = {{marginTop:"-5px",marginBottom:"-5px"}}
           src={`${process.env.React_App_Url}/uploads/${borrower.avatar}`} alt={borrower.name}
           className="user_img"
        />
      </td>
      <td>{borrower.firstname} {borrower.lastname}</td>
      <td>{borrower.email}</td>
      <td style={{ display: "flex" }}>
       <Link to={`/vendor/products/borrower-profile/${borrower.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            View Borrower Profile
          </button>
        </Link>
       <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteEnrollment(borrower.id)}
        >
          Delete Enrollment
        </button>
      </td>
    </tr>
  );
}

export default HiredProductsTableRow;
