const Clientdb = require("../model/Client/client")
const Jobsdb = require("../model/Jobs/jobs")
const Userdb = require("../model/Users/Users")
const mongoose = require('mongoose');


exports.addNewClientPreData = async (req, res) => {
  const users_all = await Userdb.find({ isActive: true }).populate('role_id');


  if (!users_all) {
    return res.status(400).json({
        message: "Some Error, Please try again later",
    })
}

const users = users_all.filter((user) => user.role_id.pages[9] && user.role_id.pages[9].isChecked)

res.json(users);
}


exports.addNewClient = async (req, res) => {

    const { client_name, company_name, partner, source, email, client_type, total_hours, hourly_rate, book_start_date, phone, auth_code, utr, tr_login, vat_login, paye_login, ct_login, company_number, address, country, department_list } = req.body.data
      
    
    
      if (!client_name || !company_name || !partner || !source || !client_type) {
        return res.status(400).json({ message: "Please Fill Required Fields" })
      }

      try{
  
        

        await Clientdb.create({
            client_name,
            company_name,
            partner,
            source,
            email,
            client_type,
            total_hours,
            hourly_rate,
            book_start_date,
            phone,
            auth_code,
            utr,
            tr_login,
            vat_login,
            paye_login,
            ct_login,
            company_number,
            address,
            country,
        }).then(async user =>
            {
                const clientId = user._id

                var arrayLength = department_list.length;
                for (var i = 0; i < arrayLength; i++) {

                  const year_end = department_list[i].year_end && new Date(department_list[i].year_end )
                  const job_deadline = department_list[i].job_deadline && new Date(department_list[i].job_deadline )
                  const work_deadline = department_list[i].work_deadline && new Date(department_list[i].work_deadline )

                    await Jobsdb.create({
                        job_name: department_list[i].job_name ? department_list[i].job_name : "",
                        year_end: year_end,
                        job_deadline: job_deadline,
                        work_deadline: work_deadline,
                        hours: department_list[i].hours ?  department_list[i].hours : "",
                        fee: department_list[i].fee ?  department_list[i].fee : "",
                        manager_id: department_list[i].manager_id ?  department_list[i].manager_id : null,
                        job_holder_id: department_list[i].job_holder_id ? department_list[i].job_holder_id : null,
                        subscription: department_list[i].subscription ? department_list[i].subscription : null,
                        client_id: clientId,

                    })
                }

                res.status(200).json({
                  message: "Data successfully added"
                })
            }
        )

      } catch (err) {

        res.status(401).json({
          message: "Data not successful added",
          error: err,
        })

      }
  }

  exports.getJobPlanning = async (req, res) => {

    const jobs = await Jobsdb.find().populate('client_id').populate('job_holder_id').populate('manager_id');
     
        if (!jobs) {
            return res.status(400).json({
                message: "Some Error, Please try again later",
            })
        }

        res.json(jobs);
  }

  exports.editJobPlanning = async (req, res) => {
    
    const year_end = new Date(req.body.year_end)
    const job_deadline = new Date(req.body.job_deadline)
    const work_deadline = new Date(req.body.work_deadline)
    

      try{
  
        Jobsdb.findOneAndUpdate({_id:req.body._id}, {
          //data here
          job_holder_id: req.body.job_holder_id,
          hours: req.body.hours,
          year_end: year_end,
          job_deadline: job_deadline,
          work_deadline:  work_deadline,
          notes: req.body.notes,
          job_status: req.body.job_status,
          manager_id: req.body.manager_id,
          fee: req.body.fee

        }, function (err, place) {
          Clientdb.findOneAndUpdate({_id:req.body.client_id}, {
            //data here
            vat_login: req.body.vat_login,
            payee_login: req.body.payee_login,
            ct_login: req.body.ct_login,
            tr_login:  req.body.tr_login,
            utr: req.body.utr,
            auth_code: req.body.auth_code,
            email: req.body.email,
            phone: req.body.phone
  
          }, function (err, place) {
            res.status(200).json({
              message: "Data successfully Updated"
            })
          });
        });
            

      } catch (err) {

        res.status(401).json({
          message: "Data not successful Updated",
          error: err,
        })

      }
  }


  exports.getAllClients = async (req, res) => {
    try {
      const clientsPromise = Clientdb.find().lean().exec();
      const jobsPromise = Jobsdb.aggregate([
        {
          $group: {
            _id: "$client_id",
            totalHours: { $sum: { $convert: { input: "$hours", to: "double", onError: 0 } } },
            totalFee: { $sum: { $convert: { input: "$fee", to: "double", onError: 0 } } }
          }
        }
      ]).exec();
      const [clients, jobs] = await Promise.all([clientsPromise, jobsPromise]);
      const jobMap = new Map(jobs.map(({ _id, totalHours, totalFee }) => [_id.toString(), { totalHours, totalFee }]));
      const finalArr = clients.map(({ _id, book_start_date, company_name, client_name, isActive, source, partner }) => {
        const { totalHours = 0, totalFee = 0 } = jobMap.get(_id.toString()) || {};
        return {
          _id,
          book_start_date,
          company_name,
          client_name,
          isActive,
          total_hours: totalHours,
          total_fee: totalFee,
          source,
          partner
        };
      });
      res.json(finalArr);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  

  exports.getOneClient = async (req, res) => {

    const users = await Userdb.find({ isActive: true });
    const client = await Clientdb.findOne({_id:req.params.id});
    const departments = await Jobsdb.find({client_id: req.params.id});

    if (!client || !users) {
        return res.status(400).json({
            message: "Some Error, Please try again later",
        })
    }

      res.json({users: users, client: client, departments:departments});
  }
  
  
  exports.updateOneClient = async (req, res) => {

    const { client_name, company_name, partner, source, email, client_type, total_hours, hourly_rate, book_start_date, phone, auth_code, utr, tr_login, vat_login, paye_login, ct_login, company_number, address, country } = req.body.data
    const departments = req.body.departments


    try{
  
        

      await Clientdb.findOneAndUpdate({_id:req.params.id},{
          client_name,
          company_name,
          partner,
          source,
          email,
          client_type,
          total_hours,
          hourly_rate,
          book_start_date,
          phone,
          auth_code,
          utr,
          tr_login,
          vat_login,
          paye_login,
          ct_login,
          company_number,
          address,
          country,
      }).then(async user =>
          {

    Jobsdb.find({client_id:req.params.id}, async (err, doc) => {
      console.log('doc', doc)
      if (err) {
        // console.error(err);
        // Handle error here
      } else if (doc.length !== 0) {

        var docArrayLength = doc.length;
        for (var a = 0; a < docArrayLength; a++) {
          var doc_id = doc[a]._id
          const match = !departments.find((obj) => obj._id === doc_id.toString());
            console.log("match", match)
            if (doc && !departments.find((obj) => obj._id === doc_id.toString()) ) {
              console.log("deleted")
              Jobsdb.deleteOne({ _id: doc_id.toString() }, (err) => {
                if (err) {
                  // console.error(err);
                  // Handle error here
                } else {
                  // Do something after the document is deleted
                }
              });
            }
        }

        
          var arrayLength = departments.length;
          for (var i = 0; i < arrayLength; i++) {


            var job_id = departments[i]._id


            const year_end = departments[i].year_end && new Date(departments[i].year_end )
            const job_deadline = departments[i].job_deadline && new Date(departments[i].job_deadline )
            const work_deadline = departments[i].work_deadline && new Date(departments[i].work_deadline )
            
              

              if(job_id)
                {
                  console.log("updated", departments)
                  Jobsdb.findOneAndUpdate(
                    {_id: job_id},
                    {
                      year_end: year_end,
                      job_deadline: job_deadline,
                      work_deadline: work_deadline,
                      hours: departments[i].hours ? departments[i].hours : "",
                      fee: departments[i].fee ? departments[i].fee : "",
                      manager_id: departments[i].manager_id ? departments[i].manager_id : null,
                      job_holder_id: departments[i].job_holder_id ? departments[i].job_holder_id : null,
                      subscription: departments[i].job_name === "Billing" ? departments[i].subscription : null,
                    },
                    {new: true}, // Set the `new` option to `true` to return the updated document
                    (err, updatedJob) => {
                      if (err) {
                        console.log(err);
                        // Handle the error appropriately (e.g., return an error response to the user)
                        return;
                      }
                      console.log(updatedJob);
                      // Handle the updated document appropriately (e.g., return the updated document to the user)
                    }
                  );
                }
                else if(job_id === undefined){
                  console.log("added")
                  Jobsdb.create({
                    job_name: departments[i].job_name ? departments[i].job_name : "",
                    year_end: year_end,
                    job_deadline: job_deadline,
                    work_deadline: work_deadline,
                    hours: departments[i].hours ?  departments[i].hours : "",
                    fee: departments[i].fee ?  departments[i].fee : "",
                    manager_id: departments[i].manager_id ?  departments[i].manager_id : null,
                    job_holder_id: departments[i].job_holder_id ? departments[i].job_holder_id : null,
                    subscription: departments[i].job_name === "Billing" ? departments[i].subscription : null,
                    client_id: req.params.id,

                  })
                }
              }


                res.status(200).json({
                  message: "Data successfully Updated"
                })
      } else {
        var arrayLength = departments.length;
                for (var i = 0; i < arrayLength; i++) {

                  const year_end = departments[i].year_end && new Date(departments[i].year_end )
                  const job_deadline = departments[i].job_deadline && new Date(departments[i].job_deadline )
                  const work_deadline = departments[i].work_deadline && new Date(departments[i].work_deadline )

                  Jobsdb.create({
                        job_name: departments[i].job_name ? departments[i].job_name : "",
                        year_end: year_end,
                        job_deadline: job_deadline,
                        work_deadline: work_deadline,
                        hours: departments[i].hours ?  departments[i].hours : "",
                        fee: departments[i].fee ?  departments[i].fee : "",
                        manager_id: departments[i].manager_id ?  departments[i].manager_id : null,
                        job_holder_id: departments[i].job_holder_id ? departments[i].job_holder_id : null,
                        subscription: departments[i].job_name === "Billing" ? departments[i].subscription : null,
                        client_id: req.params.id,

                    })
                }


              res.status(200).json({
                message: "Data successfully Updated"
              })
            }
          })
    })
  } catch (err) {

      res.status(401).json({
        message: "Data not successful updated",
        error: err,
      })

    }
}

exports.deleteOneClient = async (req, res) => {

  const id = req.params.id;

  

  Clientdb.deleteOne({ _id: id.toString() }, (err, product) => {
      if (err) {
        console.log(err);
        res.json({message:"Failed to delete"});
      }
      
      res.json({message:"Successfully Deleted"});
      
  });

  Jobsdb.deleteMany({ client_id: id.toString() }, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully deleted all clients with clientId 1');
    }
  });

}

exports.activeInactive = async (req, res) => {

  const id = req.params.id;

  

  Clientdb.findOneAndUpdate({ _id: id.toString() }, { $set: { isActive: req.body.status } },
  { new: true }, (err, product) => {
      if (err) {
        console.log(err);
        res.json({message:"Failed to Change Status"});
      }
      
      res.json({message:"Successfully Changed Status"});
      
  });


}


exports.editManyJobPlanning = async (req, res) => {
  const idsToUpdate = req.body.data.idToUpdate;

  const updateObject = {
    ...(req.body.data.FormData.deadline !== null && req.body.data.FormData.deadline !== '' && { job_deadline: req.body.data.FormData.deadline }),
    ...(req.body.data.FormData.hours !== null && req.body.data.FormData.hours !== '' && { hours: req.body.data.FormData.hours }),
    ...(req.body.data.FormData.job_date !== null && req.body.data.FormData.job_date !== '' && { work_deadline: req.body.data.FormData.job_date }),
    ...(req.body.data.FormData.job_holder !== null && req.body.data.FormData.job_holder !== '' && { job_holder_id: req.body.data.FormData.job_holder }),
    ...(req.body.data.FormData.job_status !== null && req.body.data.FormData.job_status !== '' && { job_status: req.body.data.FormData.job_status }),
    ...(req.body.data.FormData.note !== null && req.body.data.FormData.note !== '' && { notes: req.body.data.FormData.note }),
    ...(req.body.data.FormData.year_end !== null && req.body.data.FormData.year_end !== '' && { year_end: req.body.data.FormData.year_end }),
  };

  try {
    await Jobsdb.updateMany({ _id: { $in: idsToUpdate } }, updateObject);
    res.json({ message: "Successfully Data Edited" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Update Data" });
  }
};

// exports.getAllClients = async (req, res) => {

//   const clients = await Clientdb.find();
//   var finalArr = [];

//   for (var cli of clients){

//     const jobb = await Jobsdb.find( {client_id:cli._id} );

//     var totalHours = 0;
//     var totalFee = 0;
//     if(jobb){
//       for (var jobas of jobb){
//         totalHours = totalHours + +jobas.hours
//         totalFee = totalFee + +jobas.fee
//       }
//     }

//     var obj = {
//       _id: cli._id,
//       book_start_date: cli.book_start_date,
//       company_name: cli.company_name,
//       client_name: cli.client_name,
//       isActive: cli.isActive,
//       total_hours: totalHours,
//       total_fee: totalFee
//     }

//     finalArr.push(obj)
//   }
   
//       if (!clients) {
//           return res.status(400).json({
//               message: "Some Error, Please try again later",
//           })
//       }

//       res.json(finalArr);
// }
