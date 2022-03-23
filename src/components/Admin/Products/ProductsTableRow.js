import { Link } from "react-router-dom";
function ProductsTableRow({ match, product, deleteProduct }) {
  return (
    <tr role="row">      

      <td>{product.id}</td>
      <td>{product.name}</td>
      <td>{product.category}</td>
      <td>{product.per_day_rent}</td> 
      <td>{product.per_week_rent}</td>
      <td>{product.vendor_name}</td>
      <td>
        <Link to={`${match.url}/view/${product.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">View</button>
        </Link>
        <Link to={`${match.url}/edit/${product.id}`}>
          <button className="btn btn-sm btn-outline-dark mr-1">
            Edit
          </button>
        </Link>
        <button
          className="btn btn-sm btn-outline-dark"
          onClick={(e) => deleteProduct(product.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ProductsTableRow;
