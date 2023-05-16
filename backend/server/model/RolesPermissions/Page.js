const mongoose = require('mongoose');

var PageSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        required: true 
    },
    // permissions: [{
    //     type: mongoose.Types.ObjectId,
    //     ref: 'permissions'
    // }]
});

const Pagedb = mongoose.model('page', PageSchema);

module.exports = Pagedb;