# 🎓 PES Connect - Complete Project Guide

A modern, full-stack web application for campus connectivity featuring a beautiful UI with orange, blue, and white color scheme.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Design System](#design-system)

## ✨ Features

### Frontend
- 🎨 Beautiful gradient design with orange, blue, and white theme
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Modern React with React Router for navigation
- 🎯 Reusable component library (Button, Input, Card)
- 🔐 Token-based authentication with localStorage
- ✅ Form validation and error handling
- 🌟 Smooth animations and transitions
- 🎪 Hero sections and feature cards

### Backend
- 🔒 Secure JWT authentication
- 🗄️ MongoDB database with Mongoose ODM
- 🛡️ Password hashing with bcrypt
- 🌐 CORS-enabled API
- ✨ Clean RESTful architecture
- 📝 Comprehensive error handling

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 - UI framework
- **React Router DOM** 7.9.5 - Client-side routing
- **Axios** 1.13.2 - HTTP client
- **Vite** 7.1.7 - Build tool and dev server
- **CSS3** - Styling with CSS variables

### Backend
- **Node.js** - Runtime environment
- **Express** 5.1.0 - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
PES-Connect/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   └── index.js      # Component exports
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── constants/        # Design tokens and theme
│   │   │   └── theme.js
│   │   ├── lib/              # External service configs
│   │   │   └── api.js
│   │   ├── utils/            # Helper functions
│   │   │   └── auth.js
│   │   ├── App.jsx           # Main app component
│   │   ├── App.css           # Component styles
│   │   ├── index.css         # Global styles
│   │   └── main.jsx          # Entry point
│   ├── public/               # Static assets
│   ├── .env                  # Environment variables
│   ├── package.json
│   ├── vite.config.js
│   └── DESIGN_SYSTEM.md      # Design documentation
│
├── server/                    # Backend application
│   ├── models/               # Database models
│   │   └── User.js
│   ├── routes/               # API routes
│   │   └── auth.js
│   ├── index.js              # Server entry point
│   └── package.json
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PES-Connect
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up Environment Variables**
   
   Create `.env` in the server directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://127.0.0.1:27017/pes_connect
   JWT_SECRET=your-secret-key-change-in-production
   CLIENT_ORIGIN=http://localhost:5173
   ```

   The client `.env` file is already configured:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the Backend**
   ```bash
   cd server
   npm run dev
   ```
   Backend will run on `http://localhost:8000`

7. **Run the Frontend** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

8. **Open in Browser**
   Navigate to `http://localhost:5173`

## 🔐 Environment Variables

### Backend (`server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/pes_connect` |
| `JWT_SECRET` | Secret key for JWT tokens | `dev-secret-change-me` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (`client/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/`
Health check endpoint.

**Response (200):**
```json
{
  "status": "ok",
  "service": "MiniProject-PES-Connect API"
}
```

## 🎨 Design System

The project features a comprehensive design system documented in [`client/DESIGN_SYSTEM.md`](client/DESIGN_SYSTEM.md).

### Color Scheme
- **Primary (Orange)**: `#FF6B35`
- **Secondary (Blue)**: `#1E88E5`
- **Neutral (White)**: `#FFFFFF`

### Key Design Features
- Gradient backgrounds and buttons
- Consistent spacing system
- Responsive design patterns
- Reusable component library
- Modern typography (Inter + Poppins)

## 🧩 Component Usage Examples

### Button Component
```jsx
import { Button } from '../components';

<Button variant="primary" size="md" loading={isLoading}>
  Submit
</Button>
```

### Input Component
```jsx
import { Input } from '../components';

<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={handleChange}
  required
/>
```

### Card Component
```jsx
import { Card } from '../components';

<Card title="Welcome" subtitle="Get started today">
  <p>Card content goes here</p>
</Card>
```

## 📱 Pages

### Home (`/`)
- Hero section with gradient
- Feature showcase grid
- Conditional CTA based on auth state

### Login (`/login`)
- Clean login form
- Error handling
- Link to registration

### Register (`/register`)
- User registration form
- Benefits section
- Success messaging with redirect

## 🔒 Authentication Flow

1. User registers via `/register`
2. Backend creates user with hashed password
3. User logs in via `/login`
4. Backend returns JWT token
5. Frontend stores token in localStorage
6. Token is attached to all API requests via Axios interceptor
7. Protected routes check for valid token

## 🚀 Future Enhancements

The project structure is designed for scalability:
- ✅ User profiles
- ✅ Dashboard features
- ✅ Social connectivity
- ✅ Event management
- ✅ Real-time messaging
- ✅ File uploads
- ✅ Notifications

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the existing code style
3. Use the reusable components
4. Maintain the color scheme
5. Test on multiple devices
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- BandosMonkies

## 🙏 Acknowledgments

- PES University
- React community
- Open source contributors

---

**Happy Coding! 🚀**
