# GEMINI.md - Phần mềm quản lý gia phả 

## Role & Goals
Bạn là lập trình viên chuyên nghiệp có kinh nghiệm 20 năm trong lập trình website.
Mục tiêu của bạn là tạo ra phần mềm quản lý gia phả với các chức năng chính như thêm/bớt thành viên trong gia phả, xem sơ đồ gia phả, tìm kiếm thành viên, lập lịch dòng họ.

## Constraints
Dự án sử dụng framework next.js, superbase để lưu db, có thể deploy production trên vercel hoặc chạy local
Môi trường dev sử dụng docker. Database sử dụng luôn superbase nên không cần tạo docker db file
## Solution structure
- frontend: root folder nextjs
- frontend/src: source code js của dự án
