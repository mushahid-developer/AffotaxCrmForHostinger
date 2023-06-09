const Clientdb = require("../model/Client/client")
const Goalsdb = require("../model/Goals/Goals")
const Jobsdb = require("../model/Jobs/jobs")
const LeadDb = require("../model/Leads/Leads")

exports.addGoal = async (req, res) => {
    try{

        const startDate = new Date(req.body.formData.startDate)
        const endDate = new Date(req.body.formData.endDate)
        
        await Goalsdb.create({
            subject: req.body.formData.subject,
            achievement: req.body.formData.achievement,
            startDate: startDate != 'Invalid Date' ? startDate : null,
            endDate: endDate != 'Invalid Date' ? endDate : null,
            goalType: req.body.formData.goalType,
            
        })

        res.status(200).json({message: "Success"})
        
        
    } catch (err) {
        console.error('Error:', err)
        res.status(400).json({message: "Failed"})
    }
}

exports.editGoal = async (req, res) => {
    try{

        const idd = req.params.id

        const startDate = new Date(req.body.formData.startDate)
        const endDate = new Date(req.body.formData.endDate)
        
        await Goalsdb.findByIdAndUpdate( idd,  {
            subject: req.body.formData.subject,
            achievement: req.body.formData.achievement,
            startDate: startDate != 'Invalid Date' ? startDate : null,
            endDate: endDate != 'Invalid Date' ? endDate : null,
            goalType: req.body.formData.goalType,
            
        })

        res.status(200).json({message: "Success"})
        
        
    } catch (err) {
        console.error('Error:', err)
        res.status(400).json({message: "Failed"})
    }
}

exports.getAllGoal = async (req, res) => {
    try{

        const goalsFinalData = [];

        const goalsPreData = await Goalsdb.find();
        const clientsPreData = await Clientdb.find();
        const departmentsPreData = await Jobsdb.find();
        const LeadsPreData = await LeadDb.find();

        goalsPreData.forEach((goal)=>{
            const startDate = new Date(goal.startDate);
            const endDate = new Date(goal.endDate);

            if(goal.goalType === 'Increase Clients'){
                const filteredClients = clientsPreData.filter((obj) =>{
                    if (obj.book_start_date){
                        const bookStartDate = new Date(obj.book_start_date);
                        return bookStartDate >= startDate && bookStartDate <= endDate;
                    }
                    return false;
                })


                const noOfClients = filteredClients.length;
                const percentage = ((+noOfClients / +goal.achievement) * 100).toFixed(0)


                goalsFinalData.push({
                    _id: goal._id,
                    subject: goal.subject,
                    achievement: goal.achievement,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    goalType: goal.goalType,
                    __v: goal.__v,
                    percentage
                })

            }

            if(goal.goalType === 'Increase Fee'){

                const filteredClientsId = []
                var totalFee = 0;
                
                clientsPreData.forEach((obj) =>{
                    if (obj.book_start_date){
                        const bookStartDate = new Date(obj.book_start_date);
                        if(bookStartDate >= startDate && bookStartDate <= endDate){
                            filteredClientsId.push(obj._id.toString())
                        };
                    }
                })


                departmentsPreData.forEach((obj)=>{
                    if(filteredClientsId.includes(obj.client_id.toString())){
                        totalFee = totalFee + +obj.fee
                    }
                })

                const percentage = ((+totalFee / +goal.achievement) * 100).toFixed(0)


                goalsFinalData.push({
                    _id: goal._id,
                    subject: goal.subject,
                    achievement: goal.achievement,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    goalType: goal.goalType,
                    __v: goal.__v,
                    percentage
                })

            }

            if(goal.goalType === 'Increase Leads'){

                const filteredLeads = LeadsPreData.filter((obj) =>{
                    if (obj.createDate){
                        const createDate = new Date(obj.createDate);
                        return createDate >= startDate && createDate <= endDate;
                    }
                    return false;
                })


                const noOfLeads = filteredLeads.length;
                const percentage = ((+noOfLeads / +goal.achievement) * 100).toFixed(0)


                goalsFinalData.push({
                    _id: goal._id,
                    subject: goal.subject,
                    achievement: goal.achievement,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    goalType: goal.goalType,
                    __v: goal.__v,
                    percentage
                })

            }

            if(goal.goalType === 'Leads Won'){

                const filteredLeads = LeadsPreData.filter((obj) =>{
                    if (obj.createDate){
                        const createDate = new Date(obj.createDate);
                        return createDate >= startDate && createDate <= endDate && obj.status === "Won";
                    }
                    return false;
                })


                const noOfLeadsWon = filteredLeads.length;
                const percentage = ((+noOfLeadsWon / +goal.achievement) * 100).toFixed(0)


                goalsFinalData.push({
                    _id: goal._id,
                    subject: goal.subject,
                    achievement: goal.achievement,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    goalType: goal.goalType,
                    __v: goal.__v,
                    percentage
                })

            }
        })

        res.status(200).json({message: "Success", data: goalsFinalData})
        
        
    } catch (err) {
        console.error('Error:', err)
        res.status(400).json({message: "Failed"})
    }
}