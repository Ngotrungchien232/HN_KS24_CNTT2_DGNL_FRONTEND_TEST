import ProductRow from "./ProductRow.jsx";

export default function ProductTable({ products }) {
  return (
    <table
      className="table table-hover bg-white align-middle product-table"
      data-testid="product-table"
    >
      <thead className="table-light">
        <tr>
          <th>Tên</th>
          <th>SKU</th>
          <th>Danh mục</th>
          <th>Giá</th>
          <th>Tồn kho</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </tbody>
    </table>
  );
}
