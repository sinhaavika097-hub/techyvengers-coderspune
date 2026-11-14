const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    empId: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    passkey: { type: String, required: true },
    isAuthorized: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);