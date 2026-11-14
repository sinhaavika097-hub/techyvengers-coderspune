
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { execFile } = require('child_process');
const path = require('path');
const Employee = require('./models/employee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.post('/api/employees', (req, res) => {
    // Now accepting the raw password from the frontend/test script
    const { empId, name, role, password } = req.body;

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    // Point to your compiled C++ executable
    const hasherPath = path.join(__dirname, 'hasher.exe');
    
    // Run the C++ file in the background and pass it the raw password
    execFile(hasherPath, [password], async (error, stdout, stderr) => {
        if (error) {
            console.error("Hashing failed:", stderr);
            return res.status(500).json({ error: "Internal Hashing Error" });
        }
        
        // Capture the encrypted output from C++
        const hashedPasskey = stdout.trim(); 

        try {
            const newEmployee = new Employee({ 
                empId, 
                name, 
                role, 
                passkey: hashedPasskey // Saving the secure hash to the database
            });
            await newEmployee.save();
            res.status(201).json(newEmployee);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
