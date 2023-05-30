const mongoose = require('mongoose');

var TemplatesSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    template: {
        type: String,
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'templates_categories'
    }
});

const Templatesdb = mongoose.model('templates', TemplatesSchema);

module.exports = Templatesdb;