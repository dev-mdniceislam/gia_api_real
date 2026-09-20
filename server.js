const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
connectDB();
const responseHandler = require('./src/middlewares/responseHandler');
const errorHandler = require('./src/middlewares/errorHandlerMiddleware');

//Routes Imports
const webshellRoute = require('./src/routes/webShellRoutes/webshellRoutes');
const homeRoute = require('./src/routes/homeRoutes/homeRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes/galleryRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes/teacherRoutes');
const ownerRoutes = require('./src/routes/ownerAuthRoutes/ownerAuth');
const noticeRoutes = require('./src/routes/noticeRoutes/noticeRoutes');

//module scaffolding
const app = express();

//security and middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(responseHandler);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/', (req, res) => {
  res.success(
    200,
    'Hey There',
    'Goreya Islami Academy API is running successfully.',
  );
});

//Routes
app.use('/api/v1/webshell', webshellRoute);
app.use('/api/v1/home', homeRoute);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/notice', noticeRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/admin', ownerRoutes);

// Routes handler
app.use((req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

//Error Handler
app.use(errorHandler);

//server run
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
