const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const homeRoute = require('./routes/homeRoute');
const userRoutes = require('./routes/userRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

/* Init */
const app = express();
dotenv.config();
app.use(express.json()); // bodyParser
connectDB();

/* API Routes */
app.use('/', homeRoute);
app.use('/api/users', userRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/candidate', candidateRoutes);

/* Error Control */
app.use(notFound);
app.use(errorHandler);

/* listen */
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
