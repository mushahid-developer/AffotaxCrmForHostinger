const Clientdb = require("../model/Client/client");
const ProposalsDb = require("../model/Proposals/Proposals");
const Userdb = require("../model/Users/Users");

exports.addProposals = async (req, res) => {
    
    try{

        await ProposalsDb.create({
            jobHolder: req.body.formData.jobHolder,
            clientName: req.body.formData.clientName,
            companyName: req.body.formData.companyName,
            subject: req.body.formData.subject,
            detailedSubject: req.body.formData.detailedSubject,
            date: req.body.formData.date,
            deadline: req.body.formData.deadline,
            jobDate: req.body.formData.jobDate,
            note: req.body.formData.note,
            source: req.body.formData.source
        });
            
          res.json({
            message: "Success",
            data: "Proposal Added Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.editProposals = async (req, res) => {
    
    try{
        const id = req.params.id;
        await ProposalsDb.findByIdAndUpdate( id, {
            jobHolder: req.body.formData.jobHolder,
            clientName: req.body.formData.clientName,
            companyName: req.body.formData.companyName,
            subject: req.body.formData.subject,
            detailedSubject: req.body.formData.detailedSubject,
            date: req.body.formData.date,
            deadline: req.body.formData.deadline,
            jobDate: req.body.formData.jobDate,
            note: req.body.formData.note,
            source: req.body.formData.source
        });
            
          res.json({
            message: "Success",
            data: "Proposal Edited Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.copyProposals = async (req, res) => {
    
    try{
        const id = req.params.id;
        const proposal = await ProposalsDb.findOne({_id: id});

        await ProposalsDb.create({
            jobHolder: proposal.jobHolder,
            clientName: proposal.clientName,
            companyName: proposal.companyName,
            date: proposal.date,
            deadline: proposal.deadline,
            jobDate: proposal.jobDate,
            note: proposal.note,
            source: proposal.source
        });
            
          res.json({
            message: "Success",
            data: "Proposal Copied Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.deleteProposals = async (req, res) => {
    
    try{
        const id = req.params.id;
        await ProposalsDb.findByIdAndDelete( id );
            
          res.json({
            message: "Success",
            data: "Proposal Deleted Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.getAllProposals = async (req, res) => {
    try {

        const proposals = await ProposalsDb.find();
        const employees = await Userdb.find();
        const clients = await Clientdb.find();

        const resp = {
            proposals,
            employees,
            clients
        }

        res.status(200).json({
            message: "Success",
            data: resp
        })

        
    } catch (err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }
}