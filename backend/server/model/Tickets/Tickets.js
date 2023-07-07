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
    isOpen: {
        type: Boolean,
        default: true
    },
    
});

const Ticketsdb = mongoose.model('tickets', TicketsSchema);

module.exports = Ticketsdb;