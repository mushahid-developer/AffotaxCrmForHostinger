const mongoose = require('mongoose');

var ProjectNameSchema = new mongoose.Schema({
    name: {
        type: String
    },
});

const ProjectNameDb = mongoose.model('projectName', ProjectNameSchema);

module.exports = ProjectNameDb;