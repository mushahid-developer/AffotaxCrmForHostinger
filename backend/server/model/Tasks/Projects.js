const mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
    projectname_id: {
        type: mongoose.Types.ObjectId,
        ref: 'projectName'
    },
    description: {
        type: String,
    },
    startDate: {
        type: String
    },
    deadline: {
        type: String
    },
    Jobholder_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users'
    },
    status: {
        type: String
    },
    task_id: [{
        type: mongoose.Types.ObjectId,
        ref: 'mainTask'
    }],
    isActive:{
        type: Boolean,
        default: true
    }
});

const ProjectDb = mongoose.model('project', ProjectSchema);

module.exports = ProjectDb;