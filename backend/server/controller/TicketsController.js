const Clientdb = require('../model/Client/client');
const Templatesdb = require('../model/Templates/Templates');
const Ticketsdb = require('../model/Tickets/Tickets');
const Userdb = require('../model/Users/Users');
var gmail = require('./GmailApi')

exports.getEmails = async (req, res) => {
    
    try{
        const userId = req.user._id
        const Clients = await Clientdb.find();

        Clients.sort((a, b) => {
            const companyNameA = a.company_name.toLowerCase();
            const companyNameB = b.company_name.toLowerCase();
          
            if (companyNameA < companyNameB) {
              return -1;
            } else if (companyNameA > companyNameB) {
              return 1;
            } else {
              return 0;
            }
          });

        const User = await Userdb.findById(userId).populate('role_id');

       

        var Tickets = [];
        var UsersList = []
        var templatesList = [];

        if( User.role_id.name === 'Admin'){
            Tickets = await Ticketsdb.find().populate('client_id').populate("user_id");
            const User_all = await Userdb.find().populate('role_id');
            templatesList = await Templatesdb.find();
            UsersList = User_all.filter((user) => {
                return user.role_id && user.role_id.pages.some((page) => {
                  return page.name === 'Tickets Page' && page.isChecked;
                });
              });
        }
        else{
            Tickets = await Ticketsdb.find({user_id: userId}).populate('client_id').populate("user_id");
            templatesList = await Templatesdb.find({ users_list: { $in: [userId] } });
            UsersList.push(User);
        }

        TicketsList = await Tickets.map(ticket => ({ 
            thread_id: ticket.mail_thread_id,
            company_name: ticket.company_name ? ticket.company_name : "Affotax"
        }))
        
        
        var Emails = await gmail.getAllEmails(TicketsList);
                
        Emails.detailedThreads = Emails.detailedThreads.map(email => {
            const matchingTicket = Tickets.find(ticket => ticket.mail_thread_id === email.threadId);
            if (matchingTicket) {
              // Add ticket information to the email thread
              email.ticketInfo = matchingTicket;
            }
            return email;
          });

          


        const resp = {
            Emails,
            UsersList,
            templatesList,
            Clients
        }
            
        res.json(resp)

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.markAsRead = async (req, res) => {
    
    try{

        const messageId = req.params.id;
        const company_name = req.params.cn;
        
        await gmail.markThreadAsRead(messageId, company_name);
            
          res.json({
            message: "Success",
            data: "Mail Read Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.createNewTicket = async (req, res) => {
    
    try{
        const ClientId = req.body.formData.clientId

        const client = await Clientdb.findById(ClientId);

        var company_email = "";

        if(req.body.formData.company_name === 'Affotax'){
            company_email = "info@affotax.com";
        } else if(req.body.formData.company_name === "Outsource") {
            company_email = "admin@outsourceaccountings.co.uk";
        } else if(req.body.formData.company_name === "Online Taxation") {
            company_email = "rashid@onlinetaxation.co.uk";
        } 
        
        const EmailData = {
            email: client.email,
            subject: req.body.formData.subject,
            message: req.body.formData.message,
            company_name: req.body.formData.company_name,
            company_email: company_email
        }
    
        const resp = await gmail.sendEmail(EmailData);

        const userId = req.user._id
        const ThreadId = resp.data.threadId
        
        

        await Ticketsdb.create({
            client_id: ClientId,
            user_id: userId,
            mail_thread_id: ThreadId,
            company_name: req.body.formData.company_name,
            company_email: company_email
        })

        res.json({
            message: "Success",
            data: "Mail Sent Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.EditOneTicket = async (req, res) => {
    
    try{
        const tickedId = req.params.id;
        const userId = req.body.user_id

        await Ticketsdb.findByIdAndUpdate(tickedId, {
            user_id: userId,
            note: req.body.note,
            job_date: req.body.job_date
        });
        
        res.json({
            message: "Success",
            data: "User Changed Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.createNewTicketWithAttachments = async (req, res) => {
    
    try{

        const ClientId = req.body.clientId
        const client = await Clientdb.findById(ClientId);

        var company_email = "";

        if(req.body.company_name === 'Affotax'){
            company_email = "info@affotax.com";
        } else if(req.body.company_name === "Outsource") {
            company_email = "admin@outsourceaccountings.co.uk";
        } else if(req.body.company_name === "Online Taxation") {
            company_email = "rashid@onlinetaxation.co.uk";
        } 
        

        const attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer.toString('base64')
        }));

        
        const EmailData = {
            email: client.email,
            subject: req.body.subject,
            message: req.body.message,
            attachments: attachments,
            company_name: req.body.company_name,
            company_email: company_email
        }
    
        const resp = await gmail.sendEmailWithAttachments(EmailData);

        const userId = req.user._id
        const ThreadId = resp.data.threadId
        

        await Ticketsdb.create({
            client_id: ClientId,
            user_id: userId,
            mail_thread_id: ThreadId,
            company_name: req.body.company_name,
            company_email: company_email
        })

        res.json({
            message: "Success",
            data: "Mail Sent Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.replyToTicketWithAttachment = async (req, res) => {
    
    try{
        const threadId = req.body.threadId
        const messageId = req.body.messageId
        const subjectToReply = req.body.subjectToReply
        const emailSendTo = req.body.emailSendTo
        const company_name = req.body.company_name
        const company_email = req.body.company_email

        const attachments = req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer.toString('base64')
        }));
        
        const EmailData = {
            threadId: threadId,
            messageId: messageId,
            subjectToReply: subjectToReply,
            emailSendTo: emailSendTo,
            message: req.body.message,
            attachments: attachments,
            company_name: company_name,
            company_email: company_email,
        }
    
        await gmail.replyToThreadWithAttachment(EmailData);

        res.json({
            message: "Success",
            data: "Reply Sent Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.replyToTicket = async (req, res) => {
    
    try{
        const threadId = req.body.formData.threadId
        const messageId = req.body.formData.messageId
        const subjectToReply = req.body.formData.subjectToReply
        const emailSendTo = req.body.formData.emailSendTo
        const company_name = req.body.formData.company_name
        const company_email = req.body.formData.company_email
        
        const EmailData = {
            threadId: threadId,
            messageId: messageId,
            subjectToReply: subjectToReply,
            emailSendTo: emailSendTo,
            message: req.body.formData.message,
            company_name: company_name,
            company_email: company_email,
        }
    
        await gmail.replyToThread(EmailData);

        res.json({
            message: "Success",
            data: "Reply Sent Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.markAsCompleted = async (req, res) => {
    
    try{

        const tickedId = req.params.id;
        
        await Ticketsdb.findByIdAndUpdate(tickedId, {
            isOpen: false
        });
            
          res.json({
            message: "Success",
            data: "Mail Completed Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.DeleteTicket = async (req, res) => {
    
    try{

        const tickedId = req.params.id;
        
        await Ticketsdb.findByIdAndDelete(tickedId);
            
          res.json({
            message: "Success",
            data: "Mail Deleted Successfully"
        })

    } catch(err) {
        res.status(500).json({
            message: "Fail",
            data: err.message
        })
    }

}

exports.DownloadAttachment = async (req, res) => {
    
    try{

        const attachmentId = req.params.id;
        const messageId = req.params.mid;
        const company_name = req.params.cn;
        
        const resp = await gmail.getAttachment(attachmentId, messageId, company_name);
    
        // Send the attachment data in the response
        res.send(resp);
            

    } catch(err) {
        console.error('Error downloading attachment:', err);
        res.status(500).send('Error downloading attachment.');
    }

}