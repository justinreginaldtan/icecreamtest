# Sweet Solutions Backend

REST API backend for Sweet Solutions scheduling and payroll management system.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate limiting

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=3001
DATABASE_URL=mongodb://localhost:27017/sweet-solutions
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Production

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Shifts
- `GET /api/shifts` - Get all shifts
- `GET /api/shifts/:id` - Get shift by ID
- `POST /api/shifts` - Create new shift
- `PUT /api/shifts/:id` - Update shift
- `DELETE /api/shifts/:id` - Delete shift

### Time-off Requests
- `GET /api/requests` - Get all requests
- `GET /api/requests/:id` - Get request by ID
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `PUT /api/requests/:id/approve` - Approve request
- `PUT /api/requests/:id/deny` - Deny request

### Payroll
- `GET /api/payroll` - Get payroll data
- `GET /api/payroll/export` - Export payroll CSV

## Project Structure

```
src/
├── controllers/        # Route controllers
├── models/            # Database models
├── routes/            # API routes
├── middleware/        # Custom middleware
├── utils/             # Utility functions
├── config/            # Configuration files
└── server.js          # Main server file
```

## Database Models

- **User**: Authentication and user data
- **Employee**: Employee information
- **Shift**: Work shift scheduling
- **TimeOffRequest**: Time-off requests
- **Payroll**: Payroll calculations

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": { ... }
}
```

## Testing

```bash
npm test
```

## Deployment

1. Set up MongoDB Atlas or similar
2. Update environment variables
3. Deploy to Railway, Heroku, or similar platform
4. Update frontend API URL

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request
