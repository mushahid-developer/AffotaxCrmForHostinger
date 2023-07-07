const Clientdb = require('../model/Client/client');
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

        if( User.role_id.name === 'Admin'){
            Tickets = await Ticketsdb.find().populate('client_id').populate("user_id");
            UsersList = await Userdb.find();
        }
        else{
            Tickets = await Ticketsdb.find({user_id: userId}).populate('client_id').populate("user_id");
            UsersList.push(User);
        }

        TicketsList = await Tickets.map(ticket => ticket.mail_thread_id)
        
        
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
        
        await gmail.markThreadAsRead(messageId);
            
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
        
        const EmailData = {
            email: client.email,
            subject: req.body.formData.subject,
            message: req.body.formData.message,
        }
    
        const resp = await gmail.sendEmail(EmailData);

        const userId = req.user._id
        const ThreadId = resp.data.threadId
        

        await Ticketsdb.create({
            client_id: ClientId,
            user_id: userId,
            mail_thread_id: ThreadId
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

exports.replyToTicket = async (req, res) => {
    
    try{
        const threadId = req.body.formData.threadId
        const messageId = req.body.formData.messageId
        const subjectToReply = req.body.formData.subjectToReply
        const emailSendTo = req.body.formData.emailSendTo
        
        const EmailData = {
            threadId: threadId,
            messageId: messageId,
            subjectToReply: subjectToReply,
            emailSendTo: emailSendTo,
            message: req.body.formData.message,
        }
    
        const resp = await gmail.replyToThread(EmailData);

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