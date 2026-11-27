// hiển thị 1 hàng , 7 cột (tên, sku, danh mục, giá, tồn kho (kiểm tra tồn kho), trạng thái(đang bán hoặc đã bán), thao tác) của 1 sản phẩm

import { categoryNames } from "../data/sample.js";

export default function ProductRow({ product }) {
  const categoryName = categoryNames[product.category] || product.category;
  const priceText = `${new Intl.NumberFormat("vi-VN").format(product.price)} ₫`;
  const isActive = product.status === "active";

  return (
    <tr data-testid="product-row">
      <td data-label="Tên" className="fw-semibold">
        {product.name}
      </td>
      <td data-label="SKU">{product.sku}</td>
      <td data-label="Danh mục">{categoryName}</td>
      <td data-label="Giá">{priceText}</td>
      <td data-label="Tồn kho">
        {product.stock === 0 ? (
          <span className="text-danger fw-semibold">Hết hàng</span>
        ) : (
          product.stock
        )}
      </td>
      <td data-label="Trạng thái">
        <span
          data-testid="product-status"
          className={`badge rounded-pill ${
            isActive ? "text-bg-success" : "text-bg-secondary"
          }`}
        >
          {isActive ? "Đang bán" : "Ngừng bán"}
        </span>
      </td>
      <td data-label="Thao tác">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            data-testid="edit-button"
          >
            Sửa
          </button>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            data-testid="delete-button"
          >
            Xoá
          </button>
        </div>
      </td>
    </tr>
  );
}
