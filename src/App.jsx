import "bootstrap/dist/css/bootstrap.min.css";
import { Navigate, Route, Routes } from "react-router-dom";
import ProductTable from "./components/ProductTable.jsx";
import sampleProducts from "./data/sample.js";

function ProductListPage() {
  const products = [...sampleProducts].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Sản phẩm</h1>
        <button
          type="button"
          className="btn btn-danger"
          data-testid="add-button"
        >
          Thêm sản phẩm
        </button>
      </div>

      <ProductTable products={products} />
    </>
  );
}

export default function App() {
  return (
    <div>
      <header className="bg-danger text-white py-3 fw-bold fs-5">
        <div className="container">OfficeMart Admin</div>
      </header>

      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
        </Routes>
      </main>
    </div>
  );
}
