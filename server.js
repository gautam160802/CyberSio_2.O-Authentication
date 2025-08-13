const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const licenseRoutes = require('./src/routes/licenseRoutes');
const notifierRoutes = require('./src/routes/notifierRoutes');


const app = express();

// ✅ Make sure this is present BEFORE your routes
app.use(cors());
app.use(express.json()); // <- Important: parses JSON body

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/license', licenseRoutes);
app.use('/api/notifier', notifierRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
