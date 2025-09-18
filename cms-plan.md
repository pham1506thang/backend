# Kế Hoạch Phát Triển Hệ Thống CMS Báo Chí

Tài liệu này phác thảo kế hoạch phát triển các tính năng cho hệ thống CMS dựa trên nền tảng NestJS đã có và tệp `permissions.ts` đã được định nghĩa.

## 1. Tổng Quan

- **Nền tảng hiện tại**: Đã có một nền tảng vững chắc bao gồm xác thực (Authentication), quản lý người dùng (User), và quản lý vai trò/quyền hạn (Role/Permission).
- **Mục tiêu**: Phát triển các module nghiệp vụ cốt lõi của một trang báo điện tử, bám sát theo các `DOMAINS` đã được định nghĩa.
- **Kiến trúc**: Tiếp tục tuân thủ kiến trúc module hóa của NestJS, sử dụng lại các thành phần chung (common) như `BaseRepository`, các `guards`, `decorators` đã có để đảm bảo code nhất quán và bảo mật.

## 2. Phân Tích Các Domain & Lộ Trình Phát Triển

Các `DOMAINS` trong `permissions.ts` được chia thành các nhóm chức năng. Chúng ta sẽ xây dựng theo lộ trình ưu tiên từ cốt lõi đến nâng cao.

### **Giai Đoạn 1: Xây Dựng Nền Tảng Nội Dung Cốt Lõi**

Đây là những module cơ bản nhất để hệ thống có thể bắt đầu tạo ra và quản lý nội dung.

#### **Module 1: `MEDIAS` (Quản lý Media)**

- **Mục tiêu**: Lưu trữ, quản lý hình ảnh, video và các tài nguyên khác.
- **Các bước thực hiện**:
  1.  **Tạo Module**: `nest g module medias`
  2.  **Tạo Entity `Media`**: `id`, `fileName`, `url`, `mimeType`, `size`, `uploaderId`.
  3.  **Tích hợp lưu trữ**: Cấu hình service để upload file lên server hoặc các dịch vụ cloud storage (S3, Google Cloud Storage).
  4.  **Controller**: Xây dựng endpoint cho `upload`, `delete`, và `view`. Bảo vệ các endpoint này bằng permission `medias.upload`, `medias.delete`...

#### **Module 2: `ARTICLES` (Quản lý Bài viết)**

Đây là module quan trọng nhất.

- **Mục tiêu**: Cho phép phóng viên, biên tập viên tạo, sửa, xóa, xuất bản và quản lý vòng đời của bài viết.
- **Các bước thực hiện**:
  1.  **Tạo Module**: `nest g module articles`
  2.  **Tạo Entity `Article`**:
      - `id`, `title`, `slug` (unique), `content` (dạng longtext), `excerpt` (mô tả ngắn).
      - `authorId` (liên kết tới `User`), `categoryId` (liên kết tới `Category`).
      - `status` (enum: `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`, `ARCHIVED`).
      - `publishedAt`, `createdAt`, `updatedAt`.
      - `featuredImage` (URL tới media).
  3.  **Tạo DTOs**: `CreateArticleDto`, `UpdateArticleDto`, `QueryArticleDto` (hỗ trợ filter, pagination).
  4.  **Tạo Repository**: `ArticleRepository` kế thừa `BaseRepository<Article>`.
  5.  **Tạo Service `ArticleService`**: Implement các logic nghiệp vụ tương ứng với `actions` trong `permissions.ts` (create, edit, publish, archive...).
  6.  **Tạo Controller `ArticleController`**:
      - Xây dựng các endpoints RESTful (`GET /articles`, `POST /articles`, `PUT /articles/:id`, `DELETE /articles/:id`).
      - Áp dụng `ControllerFeatureGuard` và `@RolePermission(...)` decorator để bảo vệ từng endpoint tương ứng với các `actions` (ví dụ: `DELETE` cần quyền `articles.delete_all` hoặc `articles.delete_own`).

#### **Module 3: `CATEGORIES` & `TAGS` (Quản lý Danh mục & Thẻ)**

- **Mục tiêu**: Phân loại và gom nhóm các bài viết.
- **Các bước thực hiện**:
  1.  **Tạo Modules**: `categories` và `tags`.
  2.  **Tạo Entities `Category` & `Tag`**:
      - `id`, `name`, `slug` (unique), `description`.
      - `Category` có thể có `parentId` để làm danh mục đa cấp.
  3.  **DTOs, Repository, Service, Controller**: Tương tự như module `Articles`.
  4.  **Quan hệ**: Thiết lập quan hệ Many-to-Many giữa `Article` và `Tag`.

### **Giai Đoạn 2: Tương Tác & Quy Trình**

Sau khi có nền tảng nội dung, chúng ta sẽ xây dựng các tính năng về quy trình làm việc và tương tác.

#### **Module 4: `WORKFLOW` (Quy trình duyệt bài)**

- **Mục tiêu**: Tự động hóa quy trình từ lúc phóng viên viết bài (`DRAFT`) đến lúc được xuất bản (`PUBLISHED`).
- **Các bước thực hiện**:
  1.  **Mở rộng `ArticleService`**: Thêm các phương thức như `submitForReview()`, `approve()`, `reject()`.
  2.  **Tạo `WorkflowHistory` Entity**: Ghi lại lịch sử các bước chuyển trạng thái của một bài viết (ai, lúc nào, hành động gì).
  3.  **Tích hợp `Notifications`**: Gửi thông báo cho người dùng liên quan khi có một hành động trong workflow (ví dụ: thông báo cho biên tập viên khi có bài mới cần duyệt).

#### **Module 5: `COMMENTS` (Quản lý Bình luận)**

- **Mục tiêu**: Cho phép độc giả tương tác và ban quản trị kiểm duyệt bình luận.
- **Các bước thực hiện**:
  1.  **Tạo Module**: `comments`.
  2.  **Tạo Entity `Comment`**: `id`, `content`, `authorId` (nếu user đăng nhập), `guestName`, `articleId`, `parentId` (để reply), `status` (`PENDING`, `APPROVED`, `SPAM`).
  3.  **Xây dựng Service & Controller**: Implement các chức năng `create`, `moderate`, `approve`, `delete`...

### **Giai Đoạn 3: Tính Năng Nâng Cao & Mở Rộng**

Đây là các module giúp trang báo trở nên chuyên nghiệp và mạnh mẽ hơn.

- **`SEO` & `SETTINGS`**: Xây dựng các API để quản lý cấu hình chung của trang web, thông tin SEO, sitemap...
- **`REPORTS` & `ANALYTICS`**: Xây dựng các endpoint để tổng hợp dữ liệu về lượt xem, hiệu suất nội dung, hành vi người dùng.
- **`BREAKING_NEWS` & `LIVE_UPDATES`**: Tạo các module chuyên biệt cho tin nóng và tường thuật trực tiếp.
- **`ADVERTISEMENTS`**: Module quản lý các chiến dịch quảng cáo.
- **`SOCIAL_MEDIA`**: Tích hợp API để tự động đăng bài lên mạng xã hội.
- **`BACKUPS`, `LOGS`, `WEBHOOKS`**: Các công cụ dành cho quản trị viên hệ thống.

## 3. Kết Luận

Kế hoạch này cung cấp một lộ trình phát triển rõ ràng, đi từ các tính năng cốt lõi đến nâng cao. Bằng cách bám sát vào `permissions.ts` và tái sử dụng các cấu trúc đã có, quá trình phát triển sẽ diễn ra nhanh chóng, nhất quán và an toàn.
