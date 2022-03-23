import { Link } from "react-router-dom";
function EnrolledProductsTableRow({ deleteEnrollment , match, product ,  }) {
  return (
    <tr role="row">
      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.per_day_rent}</td> 
      <td>{product.per_week_rent}</td>
     <td>
        <Link to={`/borrower/products/view/${product.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">View</button>
        </Link>   
          <button 
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteEnrollment(product.id)}
        >
          Drop Product
        </button>  
      </td>
    </tr>
  );
}

export default EnrolledProductsTableRow;
