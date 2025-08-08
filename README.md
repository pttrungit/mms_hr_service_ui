# MMS HR Service UI

A React.js frontend application for MMS Human Resource Management System with leave request management functionality and Spring Boot backend integration.

## Features

- **Leave Request Management**
  - Create new leave requests
  - Select request type and reason  
  - Set duration with start and end dates
  - Partial day selection support
  - Approval workflow with approver and supervisor assignment
  - Real-time leave balance tracking
- **Modern UI/UX**
  - Responsive design matching corporate standards
  - Clean and intuitive interface
  - Form validation and error handling

## Tech Stack

- **Frontend**: React.js 18+ with functional components and hooks
- **Styling**: CSS Modules for component-specific styling
- **HTTP Client**: Axios for API communication
- **Date Handling**: date-fns library
- **Backend**: Spring Boot REST API (separate repository)

## Prerequisites

- Node.js 16+ and npm/yarn
- Spring Boot backend running on port 8080

## Installation & Setup

### Step 1: Create React Application
```bash
# Tạo React app mới với tên đúng
npx create-react-app mms_hr_service_ui
cd mms_hr_service_ui
```

### Step 2: Install Dependencies
```bash
# Cài đặt các thư viện cần thiết
npm install axios date-fns
```

### Step 3: Setup Project Structure
Tạo cấu trúc thư mục như sau:
```
mms_hr_service_ui/
├── public/
├── src/
│   ├── components/
│   │   └── LeaveRequest/
│   │       ├── LeaveRequestForm.js
│   │       └── LeaveRequestForm.module.css
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── constants.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Step 4: Copy Source Files
Copy tất cả các file đã được generate vào đúng vị trí:

1. **src/components/LeaveRequest/LeaveRequestForm.js** - Main leave request form component
2. **src/components/LeaveRequest/LeaveRequestForm.module.css** - Styles for leave request form
3. **src/services/api.js** - API service for backend communication
4. **src/utils/constants.js** - Application constants and enums
5. **src/App.js** - Main application component
6. **src/App.css** - Global application styles
7. **src/index.js** - Application entry point
8. **src/index.css** - Global CSS reset and base styles
9. **package.json** - Project configuration and dependencies
10. **.env.example** - Environment variables template
11. **.gitignore** - Git ignore configuration

### Step 5: Environment Configuration
```bash
# Tạo file environment từ template
cp .env.example .env

# Sửa file .env theo cấu hình của bạn
# REACT_APP_API_BASE_URL=http://localhost:8080/api
```

### Step 6: Start Development Server
```bash
# Chạy ứng dụng ở chế độ development
npm start
```

Ứng dụng sẽ mở tại [http://localhost:3000](http://localhost:3000)

### Step 7: Build for Production
```bash
# Build ứng dụng cho production
npm run build
```

## API Endpoints

Frontend này kết nối với các API endpoints sau từ Spring Boot backend:

- `GET /api/leave-types` - Lấy danh sách loại nghỉ phép
- `GET /api/leave-reasons` - Lấy danh sách lý do nghỉ phép  
- `GET /api/users` - Lấy danh sách users cho việc chọn approver/supervisor
- `GET /api/leave-balance/{userId}` - Lấy số ngày phép còn lại của user
- `POST /api/leave-requests` - Tạo leave request mới
- `GET /api/leave-requests/user/{userId}` - Lấy danh sách leave requests của user
- `PATCH /api/leave-requests/{requestId}/status` - Cập nhật trạng thái leave request

## Development

### File Structure Details

```
src/
├── components/
│   └── LeaveRequest/
│       ├── LeaveRequestForm.js          # Form component chính
│       └── LeaveRequestForm.module.css  # CSS modules cho form
├── services/
│   └── api.js                          # Axios configuration và API calls
├── utils/
│   └── constants.js                    # Constants, enums, validation messages
├── App.js                             # Main app component với routing logic
├── App.css                            # Global styles cho app
├── index.js                           # React DOM render entry point
└── index.css                          # CSS reset và base styles
```

### Adding New Features

1. **Tạo component mới**: Tạo trong `src/components/`
2. **Thêm API methods**: Cập nhật `src/services/api.js`
3. **Thêm constants**: Cập nhật `src/utils/constants.js`
4. **Styling**: Sử dụng CSS modules cho component-specific styles

### Code Standards

- Sử dụng functional components với React Hooks
- CSS Modules cho styling isolation
- Axios interceptors để handle authentication và errors
- Form validation với custom error messages
- Responsive design với mobile-first approach

## Available Scripts

- `npm start` - Chạy app ở development mode
- `npm run build` - Build app cho production
- `npm test` - Chạy test suite
- `npm run eject` - Eject từ Create React App (không khuyến nghị)

## Troubleshooting

### Common Issues

1. **CORS Error**: Đảm bảo Spring Boot backend có cấu hình CORS đúng
2. **API Connection**: Kiểm tra `REACT_APP_API_BASE_URL` trong file `.env`
3. **Dependencies**: Chạy `npm install` nếu thiếu packages

### Development Tips

- Sử dụng browser dev tools để debug API calls
- Check console cho error messages
- Đảm bảo backend đang chạy trước khi test frontend

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions about this project, please contact the development team.

## API Endpoints

The application expects the following Spring Boot endpoints:

- `GET /api/leave-types` - Get available leave types
- `GET /api/leave-reasons` - Get leave reasons
- `GET /api/users` - Get users for approver/supervisor selection
- `GET /api/leave-balance/{userId}` - Get user's remaining leave balance
- `POST /api/leave-requests` - Create new leave request

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## Usage

1. Fill in the request details:
   - Select request type (Annual Leave, Sick Leave, etc.)
   - Choose reason for leave
   - Set start and end dates
   - Select partial day if needed

2. Choose approver and supervisor from dropdown
3. Add detailed reason in the text area
4. Submit the request

## Development

To add new features:

1. Create new components in `src/components/`
2. Add API service methods in `src/services/api.js`
3. Update constants in `src/utils/constants.js`

## Building for Production

```bash
npm run build
```

This creates a `build/` directory with optimized production files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License