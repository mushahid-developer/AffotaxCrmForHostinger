const ConstructionDb = require("../model/Construction/Construction")
const HosueNoDb = require("../model/Construction/HouseNoForList")
const Userdb = require("../model/Users/Users")

exports.addHouseNo = async (req, res) => {
    try{
        await HosueNoDb.create({
            name: req.body.name
        })
            
        res.status(200).json({
            message: "Hosue No Created Successfully"
        })
        
    } catch (err) {
        res.status(200).json({
            message: "Hosue No Not Created Successfully"
        })
    }
}



exports.deleteHouseNo = async (req, res) => {
    try{
        const id = req.params.id

        await HosueNoDb.deleteOne({
            _id: id
        })
        
        res.status(200).json({
            message: "Hosue No Deleted Successfully"
        })
        
    } catch (err) {
        res.status(200).json({
            message: "Hosue No Not Deleted Successfully"
        })
    }
}

exports.getAllConstruction = async (req, res) => {

    try {
        const Construction = await ConstructionDb.find().populate('Manager').populate('Jobholder_id').populate('supervisor_id').populate('houseNoList_id');
        const users = await Userdb.find({ isActive: true });
        const HouseNo = await HosueNoDb.find();

        res.status(200).json({
            Construction: Construction,
            users: users,
            HouseNo: HouseNo
        })
        
    } catch (err) {
        console.error('Error:', err);
    }

}


exports.AddOneConstruction = async (req, res) => {
    try {

        const startDate = new Date(req.body.formData.startDate)
        const completationDate = new Date(req.body.formData.completationDate)
        const JobDate = new Date(req.body.formData.JobDate)
        const completationDateActual = new Date(req.body.formData.completationDateActual)

        await ConstructionDb.create({
            houseNoList_id: req.body.formData.houseNoList_id,
            Task: req.body.formData.Task,
            supervisor_id: req.body.formData.supervisor_id,
            Jobholder_id: req.body.formData.Jobholder_id,
            startDate: startDate != 'Invalid Date' ? startDate : null,
            completationDate: completationDate != 'Invalid Date' ? completationDate : null,
            completationDateActual: completationDateActual != 'Invalid Date' ? completationDateActual : null,
            JobDate: JobDate != 'Invalid Date' ? JobDate : null,
            Note: req.body.formData.Note,
            budgetPlan: req.body.formData.budgetPlan,
            budgetActual: req.body.formData.budgetActual,
            status: req.body.formData.status,
            Manager: req.body.formData.Manager,
            comments: req.body.formData.comments,
        })
        
        res.status(200).json({
            message: "Project Added Successfully"
        })
    } catch (err) {
        console.error('Error:', err);
    }
}



exports.EditOneConstruction = async (req, res) => {

    try {
        const id = req.params.id

        const startDate = new Date(req.body.formData.startDate)
        const completationDate = new Date(req.body.formData.completationDate)
        const JobDate = new Date(req.body.formData.JobDate)
        const completationDateActual = new Date(req.body.formData.completationDateActual)


        await ConstructionDb.findOneAndUpdate({_id: id},{
            houseNoList_id: req.body.formData.houseNoList_id,
            Task: req.body.formData.Task,
            supervisor_id: req.body.formData.supervisor_id,
            Jobholder_id: req.body.formData.Jobholder_id,
            startDate: startDate != 'Invalid Date' ? startDate : null,
            completationDate: completationDate != 'Invalid Date' ? completationDate : null,
            completationDateActual: completationDateActual != 'Invalid Date' ? completationDateActual : null,
            JobDate: JobDate != 'Invalid Date' ? JobDate : null,
            Note: req.body.formData.Note,
            budgetPlan: req.body.formData.budgetPlan,
            budgetActual: req.body.formData.budgetActual,
            status: req.body.formData.status,
            Manager: req.body.formData.Manager,
            comments: req.body.formData.comments,
        })
            
        res.status(200).json({
            message: "Task Updated Successfully"
        })

} catch (err) {
    console.error('Error:', err);
}
    
}


exports.deleteOneConstruction = async (req, res) => {

    try {
        const id = req.params.id;
        
        await ConstructionDb.deleteOne({ _id: id });
        
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete main task" });
    }
}

exports.CopyOneConstruction = async (req, res) => {

    const id = req.params.id

    const projects = await ConstructionDb.findById( id );

    await ConstructionDb.create({
        houseNoList_id: projects.houseNoList_id,
        Task: projects.Task,
        supervisor_id: projects.supervisor_id,
        Jobholder_id: projects.Jobholder_id,
        startDate: projects.startDate,
        completationDate: projects.completationDate,
        completationDateActual: projects.completationDateActual,
        JobDate: projects.JobDate,
        Note: projects.Note,
        budgetPlan: projects.budgetPlan,
        budgetActual: projects.budgetActual,
        status: projects.status,
        Manager: projects.Manager,
        comments: projects.comments,
    }).then(
        res.status(200).json({
            message: "Project Added Successfully"
        })
    )
}