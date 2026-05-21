# Yogastic - MERN Stack Yoga Website

A comprehensive yoga and wellness platform built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring modern UI/UX design.

## 🌟 Features

### Authentication & User Management
- **Passport.js Local Strategy** authentication
- User registration with profile photo upload
- Protected routes and session management
- User profile management

### Frontend Features
- **Material UI v5** with custom theme (purple/gold design)
- Responsive design for all devices
- Beautiful gradient backgrounds and animations
- Modern component library and consistent branding

### Pages & Functionality
- **Home**: Hero section, services showcase, features
- **About**: Company story and mission
- **Services**: Yoga types and wellness programs
- **Contact**: Contact form and business information
- **Authentication**: Login/Register with profile photo upload
- **Blog System**: Ready for CRUD implementation with react-quill

### Backend API
- RESTful API with Express.js
- MongoDB integration with Mongoose
- File upload handling with multer
- Blog and user management endpoints
- Session-based authentication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Backend Setup

1. **Navigate to server directory:**
```bash
cd server
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/yogastic
SESSION_SECRET=your_secret_key_here_change_in_production
PORT=5000
CLIENT_URL=http://localhost:3000
```

4. **Start the server:**
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
```bash
cd client
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

4. **Start the React app:**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
MERN/
├── client/                 # React frontend
│   ├── public/            # Public assets
│   │   ├── components/    # Reusable components
│   │   │   ├── Auth/      # Authentication components
│   │   │   └── Layout/    # Layout components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── theme/         # Material UI theme
│   │   └── App.js         # Main app component
│   └── package.json
└── server/                # Express backend
    ├── config/            # Configuration files
    ├── models/            # Database models
    ├── routes/            # API routes
    ├── uploads/           # File uploads
    └── server.js          # Main server file
```

## 🎨 Design Features

### Color Palette
- **Primary**: Purple (#8B4A9C) - Main brand color
- **Secondary**: Gold/Beige (#D4B896) - Accent color
- **Background**: Clean whites and light beiges

### UI Components
- Custom Material UI theme
- Responsive navigation with mobile drawer
- Gradient backgrounds and hover effects
- Professional typography and spacing
- Form validation and error handling

## 🔧 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /me` - Get current user
- `GET /status` - Check auth status
- `PUT /profile` - Update user profile

### Blog Routes (`/api/blogs`)
- `GET /` - Get all blogs
- `GET /:slug` - Get blog by slug
- `POST /` - Create new blog
- `PUT /:id` - Update blog
- `DELETE /:id` - Delete blog
- `POST /:id/like` - Like/unlike blog

### User Routes (`/api/users`)
- `GET /` - Get all users
- `GET /:id` - Get user by ID

## 🔐 Security Features

- Session-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS configuration
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚧 Next Steps

The application foundation is complete. Ready for implementation:

1. **Blog CRUD with React Quill**
   - Rich text editor for blog content
   - Image upload for blog posts
   - Blog categorization and tagging

2. **User Profile Enhancement**
   - Complete profile management
   - Password change functionality
   - Profile photo management

3. **Advanced Features**
   - Search functionality
   - User roles and permissions
   - Email notifications
   - Social media integration

## 📄 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
GENERATE_SOURCEMAP=false
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 💡 Technologies Used

### Frontend
- React 18
- Material UI v5
- React Router Dom
- React Hook Form
- Axios for API calls
- React Quill (ready for blog editor)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- Passport.js (Local Strategy)
- Multer (File uploads)
- Express Session
- BCrypt for password hashing

---

**Happy coding! 🧘‍♀️✨**

For questions or support, please open an issue or contact the development team.
