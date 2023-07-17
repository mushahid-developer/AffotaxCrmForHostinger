const mongoose = require('mongoose');

var TicketsSchema = new mongoose.Schema({
    
    client_id: {
        type: mongoose.Types.ObjectId,
        ref: 'client'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    mail_thread_id: {
        type: String,
    },
    notes: {
        type: String,
        default: ''
    },
    isOpen: {
        type: Boolean,
        default: true
    },
    company_name: {
        type: String
    },
    company_email: {
        type: String
    }
    
});

const Ticketsdb = mongoose.model('tickets', TicketsSchema);

module.exports = Ticketsdb;