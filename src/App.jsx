import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import api from "./api/axiosClient.js";
import ProductTable from "./components/ProductTable.jsx";
import useProductSearch from "./hooks/useProductSearch.js";

const LIMIT = 10;

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc trạng thái tìm kiếm, lọc, phân trang từ URL
  const urlQ = searchParams.get("q") ?? "";
  const urlCategory = searchParams.get("category") ?? "";
  const urlStatus = searchParams.get("status") ?? "";
  const rawPage = Number(searchParams.get("page") || 1);
  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  const [searchText, setSearchText] = useState(urlQ);
  const [categories, setCategories] = useState([]);

  const { data: products, total, loading, error, reload } = useProductSearch({
    q: urlQ,
    category: urlCategory,
    status: urlStatus,
    page,
    limit: LIMIT,
  });

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  // Lấy danh sách danh mục cho ô lọc
  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  // Đồng bộ ô tìm kiếm khi URL thay đổi (mở link trực tiếp hoặc Back/Forward)
  useEffect(() => {
    setSearchText(urlQ);
  }, [urlQ]);

  function updateUrl(changes, options) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value === null || value === undefined) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    }, options);
  }

  // Debounce 400ms cho ô tìm kiếm (đồng thời bỏ khoảng trắng đầu/cuối)
  useEffect(() => {
    const trimmed = searchText.trim();
    if (trimmed === urlQ) return undefined;

    const timer = setTimeout(() => {
      updateUrl({ q: trimmed, page: 1 });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText, urlQ]);

  // Chuẩn hoá page nếu vượt quá totalPages hoặc âm/không hợp lệ trên URL
  useEffect(() => {
    if (searchParams.has("page") && (!Number.isInteger(rawPage) || rawPage < 1)) {
      updateUrl({ page: 1 }, { replace: true });
      return;
    }
    if (!loading && !error && total > 0 && page > totalPages) {
      updateUrl({ page: totalPages }, { replace: true });
    }
  }, [loading, error, total, page, totalPages, rawPage, searchParams]);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Sản phẩm</h1>
        <button type="button" className="btn btn-danger" data-testid="add-button">
          Thêm sản phẩm
        </button>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="search"
            className="form-control"
            data-testid="search-input"
            placeholder="Tìm theo tên hoặc SKU..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            data-testid="category-filter"
            value={urlCategory}
            onChange={(e) =>
              updateUrl({ category: e.target.value, page: 1 })
            }
          >
            <option value="">Tất cả</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select"
            data-testid="status-filter"
            value={urlStatus}
            onChange={(e) => updateUrl({ status: e.target.value, page: 1 })}
          >
            <option value="">Tất cả</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Ngừng bán</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4" data-testid="loading">
          Đang tải dữ liệu...
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" data-testid="error-message">
          <p className="mb-2">{error}</p>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            data-testid="retry-button"
            onClick={reload}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="alert alert-light border" data-testid="empty-state">
          Không tìm thấy sản phẩm nào.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <ProductTable products={products} />

          <div
            className="d-flex justify-content-center align-items-center gap-3 mt-3"
            data-testid="pagination"
          >
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              data-testid="page-prev"
              disabled={page <= 1}
              onClick={() => updateUrl({ page: page - 1 })}
            >
              Trước
            </button>
            <span data-testid="page-current">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              data-testid="page-next"
              disabled={page >= totalPages}
              onClick={() => updateUrl({ page: page + 1 })}
            >
              Sau
            </button>
          </div>
        </>
      )}
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
