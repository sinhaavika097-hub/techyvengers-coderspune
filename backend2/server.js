
const express = require('express');
const mongoose = require('mongoose');
const { execFile } = require('child_process');
const path = require('path');
const Employee = require('./models/employee'); 
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://YOUR_MONGO_URL_HERE')
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


const generateHash = (password) => {
    return new Promise((resolve, reject) => {
        const hasherPath = path.join(__dirname, 'hasher.exe');
        execFile(hasherPath, [password], (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout.trim()); 
        });
    });
};
app.post('/api/employees', async (req, res) => {
    try {
        const { empId, name, role, password } = req.body;
        const passkey = await generateHash(password);

        const newEmployee = new Employee({
            empId,
            name,
            role,
            passkey,
            isAuthorized: false 
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: "Failed to register employee." });
    }
});
app.put('/api/employees/approve/:empId', async (req, res) => {
    try {
        const { empId } = req.params;
        const updatedEmployee = await Employee.findOneAndUpdate(
            { empId: empId },
            { isAuthorized: true },
            { new: true } 
        );

        if (!updatedEmployee) return res.status(404).json({ error: "Employee not found." });

        res.json({ 
            message: `✅ Employee ${empId} successfully approved for Knowledge Handover.`, 
            status: updatedEmployee.isAuthorized 
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during approval." });
    }
});
const requireTenure = (requiredMinutes) => {
    return async (req, res, next) => {
        try {
            const { empId } = req.body; 
            const employee = await Employee.findOne({ empId });

            if (!employee) return res.status(404).json({ error: "Employee not found." });
            
            if (!employee.isAuthorized) return res.status(403).json({ error: "Access Denied: Pending Admin Approval." });
            const now = new Date();
            const accountCreated = new Date(employee.createdAt);
            const diffInMinutes = Math.floor((now - accountCreated) / 60000);

            if (diffInMinutes < requiredMinutes) {
                return res.status(403).json({ 
                    error: `Tenure too low. Tier requires ${requiredMinutes} mins of service.`,
                    currentTenure: `${diffInMinutes} mins`
                });
            }
            
            next(); // Passed all checks, let them in!
        } catch (err) {
            res.status(500).json({ error: "Server error during tenure check." });
        }
    };
};
app.post('/api/vault/tier1', requireTenure(2), (req, res) => {
    res.json({ message: "🔓 Tier 1: Accessing Basic System Architecture & Repositories." });
});

app.post('/api/vault/tier2', requireTenure(5), (req, res) => {
    res.json({ message: "🔓 Tier 2: Accessing Backend API Documentation & Postman Collections." });
});

app.post('/api/vault/tier3', requireTenure(10), (req, res) => {
    res.json({ message: "🔓 Tier 3: Accessing Cloud Database Schemas & Infrastructure Keys." });
});

app.post('/api/vault/tier4', requireTenure(15), (req, res) => {
    res.json({ message: "🔓 Tier 4: Accessing Root Admin Credentials & Security Protocols." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});