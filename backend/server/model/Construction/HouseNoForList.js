const mongoose = require('mongoose');

var HosueNoSchema = new mongoose.Schema({
    name: {
        type: String
    },
});

const HosueNoDb = mongoose.model('HouseNoList', HosueNoSchema);

module.exports = HosueNoDb;