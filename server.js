const express = require('express');
const app = express();
const authRoutes = require('./src/routes/auth');
require('dotenv').config();

app.use(express.json());

// Use auth routes under /api
app.use('/api', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
