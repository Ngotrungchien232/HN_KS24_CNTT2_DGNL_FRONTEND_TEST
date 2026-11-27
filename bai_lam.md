# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:**
- **Lớp:**
- **Link repository:**
- **Hệ điều hành (Windows/macOS):**
- **Mã commit P2 đã nộp trước phút 90 (gõ `git log --oneline -1`):**
- **Phiên bản Node.js (gõ `node -v`):**

## 4.1. Giao diện danh sách sản phẩm

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin. Đánh dấu `[x]` vào các mục đã làm để tự kiểm tra.

- [ X] 4.1.1. Bố cục trang
- [ X] 4.1.2. Bảng sản phẩm
- [ ] 4.1.3. Định dạng dữ liệu
- [ ] 4.1.4. Hiển thị trên điện thoại

## 4.2. Thêm, sửa, xoá sản phẩm qua API

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin.

- [x] 4.2.1. Tải danh sách
- [ ] 4.2.2. Form thêm sản phẩm
- [ ] 4.2.3. Gửi form
- [ ] 4.2.4. Sửa sản phẩm
- [ ] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

- [x] 4.3.1. Tìm kiếm và lọc
- [x] 4.3.2. Phân trang
- [x] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

Các bước thao tác:

```text
1. Chạy API ở chế độ chậm: npm run api:cham (request có q bắt đầu bằng "ban" trễ 2,5 giây, request khác trễ 0,1 giây).
2. Gắn hook src/ai/useProductSearch_ai.js vào trang danh sách và mở http://localhost:5173/products.
3. Gõ từ khoá "ban" vào ô tìm kiếm để gửi request GET /api/products?q=ban.
4. Ngay sau đó (trước khi hết 2,5 giây), xoá nhanh và gõ từ khoá "chuot" để gửi request GET /api/products?q=chuot.
```

Kết quả hiển thị:

```text
Sau khoảng 0,1 giây, danh sách hiển thị đúng 24 sản phẩm chứa "chuot" (ví dụ "Chuột trackball T50 Pro"). Nhưng khoảng 2,5 giây sau, request "ban" gửi trước đó mới trả về và ghi đè lên màn hình thành 48 sản phẩm của "ban" (ví dụ "Bàn làm việc trẻ em Pro"), trong khi ô tìm kiếm vẫn đang hiển thị "chuot".
```

Kết quả đúng:

```text
Danh sách phải luôn khớp với từ khoá mới nhất trong ô tìm kiếm ("chuot"), kết quả của request cũ ("ban") phải bị huỷ hoặc bỏ qua.
```

#### b) Vì sao hook hiển thị sai

Trong `src/ai/useProductSearch_ai.js`, `useEffect` không huỷ request cũ (hoặc không bỏ qua kết quả của request cũ) khi `params` thay đổi. Do đó xảy ra xung đột thứ tự phản hồi (race condition): request gửi trước (`"ban"`) phản hồi chậm hơn request gửi sau (`"chuot"`), khi hoàn thành vẫn gọi `setData(res.data.data)` và ghi đè lên dữ liệu mới nhất.

#### c) Hook đã sửa

> Chấm trực tiếp trên file src/hooks/useProductSearch.js và trang danh sách.

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

> Ghi ít nhất 2 lần dùng AI có ảnh hưởng đến mã nộp. Không dùng AI trong Pha 2 thì xoá bảng và ghi "Không sử dụng AI trong Pha 2".

| Lần | Câu lệnh chính gửi cho AI | Đoạn mã hoặc ý AI đưa ra (file) | Quyết định (giữ/sửa/loại bỏ) | Lý do | Bằng chứng kiểm chứng (chạy thử gì, kết quả) |
| --- | --- | ------------------------------- | ---------------------------- | ----- | -------------------------------------------- |
| 1   | Viết custom hook `useProductSearch` khắc phục lỗi race condition bằng `AbortController` và xử lý lỗi huỷ request với axios (`src/hooks/useProductSearch.js`). | Hook `useProductSearch` tạo `AbortController`, truyền `signal`, bắt `axios.isCancel(err)` và trả về `data, total, loading, error` (`src/hooks/useProductSearch.js`). | Sửa | Bổ sung kiểm tra `if (!controller.signal.aborted)` trong `finally` để request bị huỷ không tắt nhầm trạng thái `loading` của request mới đang chạy, đồng thời thêm hàm `reload` cho nút Thử lại. | Kiểm thử trực tiếp với `mock-api/server.js --mode cham`: gửi `q=ban` rồi huỷ bằng `AbortController` và gửi `q=chuot`, request `ban` bị abort (`aborted: true`), chỉ còn kết quả `chuot` (24 sản phẩm). |
| 2   | Hướng dẫn triển khai tìm kiếm debounce 400ms, lọc danh mục/trạng thái, phân trang và đồng bộ URL `useSearchParams` hỗ trợ Back/Forward trong `src/App.jsx`. | Đọc `q, category, status, page` từ `useSearchParams`, dùng `setTimeout` 400ms cho `searchText`, đổi bộ lọc thì đặt `page: 1` (`src/App.jsx`). | Sửa | Thêm điều kiện `if (trimmed === urlQ) return` trước khi chạy debounce và đồng bộ `setSearchText(urlQ)` khi URL đổi để khi mở thẳng link hoặc bấm Back/Forward không bị tự reset `page` về 1; giữ lại nút và class Bootstrap đồng bộ với Pha 1. | Chạy `npm run tu-kiem-tra` (3/3 test pass), `vite build` thành công (90 modules), kiểm tra API lọc `q=chuot&category=mouse&status=active&page=2` trả về `total: 19`, trang 2 có `9` sản phẩm. |

## Ghi chú (không tính điểm)

- **Từ khoá chỉ có khoảng trắng:** Trong `src/App.jsx`, luôn gọi `searchText.trim()` trước khi đối chiếu với `urlQ` và cập nhật URL nên gõ toàn khoảng trắng không gửi request thừa.
- **Số trang âm hoặc không hợp lệ (`page=-3`, `page=abc`):** Kiểm tra `Number.isInteger(rawPage) && rawPage >= 1`; nếu không hợp lệ thì dùng `page = 1` và chuẩn hoá lại URL bằng `{ replace: true }`.
- **Số trang vượt quá tổng số trang (`page=999`):** Sau khi tải dữ liệu có `total > 0`, nếu `page > totalPages` thì tự động cập nhật URL về `totalPages` bằng `{ replace: true }`.
