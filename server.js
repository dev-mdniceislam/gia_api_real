const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const responseHandler = require('./src/middlewares/responseHandler');
const connectDB = require('./src/config/db');

//Routes Imports
const webshellRoute = require('./src/routes/webShellRoutes/homeItemShowRoute');
const homeRoute = require('./src/routes/homeRoutes/homeRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes/galleryRoutes');

//load env vars
dotenv.config();
connectDB();

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

// Routes handler
app.use((req, res, next) => {
  const error = new Error(`Can't find ${req.originalUrl} on this server`);
  error.statusCode = 404;
  next(error);
});

//Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.error(statusCode, message, null);
});

//server run
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
