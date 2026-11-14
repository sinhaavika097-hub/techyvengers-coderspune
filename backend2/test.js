require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/employee');

async function approveDirectly() {
    try {
        // Connect straight to MongoDB Atlas, bypassing the network block
        await mongoose.connect(process.env.MONGO_URI);
        
        const updated = await Employee.findOneAndUpdate(
            { empId: 'DEV-003' },
            { isAuthorized: true },
            { new: true }
        );

        console.log(`✅ Admin Response: Employee ${updated.empId} successfully approved!`);
        process.exit(0);
    } catch (error) {
        console.log("Error:", error.message);
        process.exit(1);
    }
}

approveDirectly();