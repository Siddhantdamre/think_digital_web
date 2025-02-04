const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    role: { type: String, required: true },
});

const Member = mongoose.model('Member', MemberSchema);
