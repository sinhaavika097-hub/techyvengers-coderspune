
const express = require('express');
const mongoose = require('mongoose');
const { execFile } = require('child_process');
const path = require('path');
const Employee = require('./models/employee'); // Pulling your schema
require('dotenv').config();

const app = express();
app.use(express.json());

// --- MONGODB CONNECTION ---
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://YOUR_MONGO_URL_HERE')
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- C++ HASHING ENGINE ---
const generateHash = (password) => {
    return new Promise((resolve, reject) => {
        const hasherPath = path.join(__dirname, 'hasher.exe');
        execFile(hasherPath, [password], (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout.trim()); 
        });
    });
};

// ==========================================
// 1. REGISTRATION ROUTE (What you finished earlier)
// ==========================================
app.post('/api/employees', async (req, res) => {
    try {
        const { empId, name, role, password } = req.body;
        const passkey = await generateHash(password);

        const newEmployee = new Employee({
            empId,
            name,
            role,
            passkey,
            isAuthorized: false // Placed in the waiting room
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: "Failed to register employee." });
    }
});

// ==========================================
// 2. ADMIN APPROVAL ROUTE (New)
// ==========================================
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

// ==========================================
// 3. PROGRESSIVE TENURE MIDDLEWARE (New)
// ==========================================
const requireTenure = (requiredMinutes) => {
    return async (req, res, next) => {
        try {
            const { empId } = req.body; 
            const employee = await Employee.findOne({ empId });

            if (!employee) return res.status(404).json({ error: "Employee not found." });
            
            // Is the manager's switch flipped?
            if (!employee.isAuthorized) return res.status(403).json({ error: "Access Denied: Pending Admin Approval." });

            // Calculate tenure in minutes
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

// ==========================================
// 4. KNOWLEDGE HANDOVER TIERS (New)
// ==========================================
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

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});