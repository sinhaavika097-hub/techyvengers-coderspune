const express = require('express');
const cors = require('cors');

const app = express();

// 1. Enable CORS so your GitHub Pages frontend can fetch this data
app.use(cors());

// 2. Load your existing local JSON file
const dashboardData = require('../dashboard_data.json');

// 3. Create the Dynamic API Endpoint
app.get('/api/handover', (req, res) => {
    // This sends your JSON data to the frontend whenever it asks
    res.json(dashboardData);
});

// 4. Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Dynamic REST API is running on port ${PORT}`);
});