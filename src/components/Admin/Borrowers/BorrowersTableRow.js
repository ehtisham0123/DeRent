import { Link } from "react-router-dom";
function BorrowersTableRow({match,borrower,deleteBorrower}) {
  return (
      <tr role="row">
      <td className="img_cont">
        <img
            style = {{marginTop:"-5px",marginBottom:"-5px"}}
           src={`${process.env.React_App_Url}/uploads/${borrower.avatar}`} alt={borrower.name}
           className="user_img"
        />
      </td>
      <td>{borrower.firstname} {borrower.lastname}</td>
      <td>{borrower.email}</td>
      <td>{borrower.contact}</td>
      <td>{borrower.gender}</td>
      <td>{borrower.city}</td>
      <td>
        <Link to={`${match.url}/profile/${borrower.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${borrower.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteBorrower(borrower.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default BorrowersTableRow;
