const Templatesdb = require("../model/Templates/Templates")
const TemplatesCategoriesdb = require("../model/Templates/TemplatesCategory")
const Userdb = require("../model/Users/Users")

exports.addTemplateCategory = async (req, res) => {
    try{
        TemplatesCategoriesdb.create({
            name: req.body.name
        }).then(
            res.status(200).json({
                message: "Template Category Created Successfully"
            })
        )
    } catch (err) {
        console.error('Error:', err)
    }
}

exports.deleteTemplateCategory = async (req, res) => {
    try{
        const id = req.params.id
        TemplatesCategoriesdb.deleteOne({
            _id: id
        }).then(
            res.status(200).json({
                message: "Template Category Deleted Successfully"
            })
        )
    } catch (err) {
        console.error('Error:', err)
    }
}

exports.getAllTemplates = async (req, res) => {

    try {
        const Templates = await Templatesdb.find().populate('category_id');
        const users_all = await Userdb.find({ isActive: true }).populate('role_id');
        const TemplateCategories = await TemplatesCategoriesdb.find();

        const users = users_all.filter((user) => user.role_id && user.role_id.pages[5] && user.role_id.pages[5].isChecked)

        res.status(200).json({
            Templates: Templates,
            TemplateCategories: TemplateCategories,
            users: users,
        })
        
      } catch (err) {
        console.error('Error:', err);
      }
}

exports.addOneTemplates = async (req, res) => {

    try {
        await Templatesdb.create({
            name: req.body.formData.name,
            description: req.body.formData.description,
            category_id: req.body.formData.category_id,
            template: req.body.formData.template,
        })
        
        res.status(200).json({
            message: "Template Added Successfully"
        })
        
        
      } catch (err) {
        console.error('Error:', err);
      }
}


exports.EditOneTemplate = async (req, res) => {

    const id = req.params.id


    await Templatesdb.findOneAndUpdate({_id: id},{
        name: req.body.formData.name,
        description: req.body.formData.description,
        category_id: req.body.formData.category_id,
        template: req.body.formData.template,
    }).then(
        res.status(200).json({
            message: "Template Updated Successfully"
        })
    )
}

exports.CopyOneTemplate = async (req, res) => {

    const id = req.params.id
    try{
        const TemplateData = await Templatesdb.findOne({_id: id})
    
        await Templatesdb.create({
            name: TemplateData.name,
            description: TemplateData.description,
            category_id: TemplateData.category_id,
            template: TemplateData.template,
        }).then(
            res.status(200).json({
                message: "Template Copied Successfully"
            })
        )
    }catch (err) {
        res.status(400).json({message: err})
    }


}

exports.DeleteOneTemplate = async (req, res) => {

    const id = req.params.id


    await Templatesdb.deleteOne({_id: id}).then(
        res.status(200).json({
            message: "Template Updated Successfully"
        })
    )
}