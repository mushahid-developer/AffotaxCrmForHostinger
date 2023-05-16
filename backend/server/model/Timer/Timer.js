const mongoose = require('mongoose');

var TimerSchema = new mongoose.Schema({
    startTime:{
        type: String,
    },
    endTime:{
        type: String,
    },
    notes:{
        type: String,
    },
    type:{
        type: String
    },
    client_id:{
        type: mongoose.Types.ObjectId,
        ref: 'client'
    },
    job_id:{
        type: mongoose.Types.ObjectId,
        ref: 'jobs'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    }
});

const Timerdb = mongoose.model('timer', TimerSchema);

module.exports = Timerdb;