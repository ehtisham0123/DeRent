import { Link } from "react-router-dom";
function VendorsTableRow({match,vendor,deleteVendor}) {
  return (
      <tr role="row">
      <td className="img_cont">
        <img
            style = {{marginTop:"-5px",marginBottom:"-5px"}}
           src={`${process.env.React_App_Url}/uploads/${vendor.avatar}`} alt={vendor.name}
           className="user_img"
        />
      </td>
      <td>{vendor.firstname} {vendor.lastname}</td>
      <td>{vendor.email}</td>
      <td>{vendor.contact}</td>
      <td>{vendor.gender}</td>
      <td>{vendor.city}</td>
      <td>
        <Link to={`${match.url}/profile/${vendor.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            View
          </button>
        </Link>
        <Link to={`${match.url}/edit/${vendor.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteVendor(vendor.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default VendorsTableRow;
