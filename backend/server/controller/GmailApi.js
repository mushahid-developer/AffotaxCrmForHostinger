var axios = require('axios');
var qs = require('qs');

class GmailApi {
    getAccessToken = async () => {
        try {
            var data = qs.stringify({
                'client_id': '975523241395-2p6s8m51ac4vj1ktlb5mh5h9m34abdq6.apps.googleusercontent.com',
                'client_secret': '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',
                'refresh_token': '1//03hBL3r77ngkwCgYIARAAGAMSNwF-L9IrUB9tnvcmV3nOrLZ6e5zn48sfBkB7svweIgxjL8guEhGHu_wQoTuXZswQerGRzU4AN00',
                'grant_type': 'refresh_token'
            });
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://accounts.google.com/o/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
            var response = await axios(config)

            var accessToken = await response.data.access_token;
            return accessToken
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getOutsourceAccessToken = async () => {
        try {
            var data = qs.stringify({
                'client_id': '902822249198-35omnv2esshomojr08js6udg7jtgtn94.apps.googleusercontent.com',
                'client_secret': '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',
                'refresh_token': '1//03bEEXaA-j3HNCgYIARAAGAMSNwF-L9Ir0nIb2FvaVaLFhQW46VLYpsqXerPNgquOeDP78qWsZsSmuwM6WS0_iq-iVZdRkON4dC0',
                'grant_type': 'refresh_token'
            });
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://accounts.google.com/o/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
            var response = await axios(config)

            var accessToken = await response.data.access_token;
            return accessToken
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getOnlineTaxationAccessToken = async () => {
        try {
            var data = qs.stringify({
                'client_id': '541004799248-ad7pidjubliojkn4vf3s07ca534fmiq9.apps.googleusercontent.com',
                'client_secret': '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',
                'refresh_token': '1//03BdMiWUv2QcgCgYIARAAGAMSNgF-L9IrWknR_seCtY_31ojZ_38L9p5GEvQNN5cOlWhpAYiYfthtDU_dduWKmEZIORIbKtfV3w',
                'grant_type': 'refresh_token'
            });
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://accounts.google.com/o/oauth2/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data
            };
            var response = await axios(config)

            var accessToken = await response.data.access_token;
            return accessToken
        } catch (error) {
            throw new Error(error.message);
        }
    };

    getAllThreads = async () => {
        try {
            var accessToken = await this.getAccessToken();

            var config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=10',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            var response = await axios(config);
            return response.data.threads;

        } catch (error) {
            throw new Error(error.message);
        }
    };

    getDetailedThreads = async (threadId, accessToken) => {
        try {
            // var accessToken = await this.getAccessToken();

            var config = {
                method: 'get',
                url: `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            };

            var response = await axios(config);
            var threadData = await response.data;

            var subject = await threadData.messages[0].payload.headers.find(header => header.name === 'Subject' || header.name === "subject") ? threadData.messages[0].payload.headers.find(header => header.name === 'Subject' || header.name === "subject").value : "No Subject Found";
            var readStatus = await threadData.messages[threadData.messages.length - 1].labelIds && threadData.messages[threadData.messages.length - 1].labelIds.length > 0 ? threadData.messages[threadData.messages.length - 1].labelIds.includes('UNREAD') ? 'Unread' : threadData.messages[threadData.messages.length - 1].labelIds.includes('SENT') ? 'Sent' : 'Read' : "No Status Found";
            
            var recipientHeaders = await threadData.messages[0].payload.headers.filter(header => header.name === 'To' || header.name === 'to' || header.name === 'Cc' || header.name === 'Bcc');
            var recipients = await recipientHeaders.length > 0 ? recipientHeaders.map(header =>  header.value) : "No Recipient Found";


            var latestMessage = threadData.messages[threadData.messages.length - 1];
            var date = new Date(parseInt(latestMessage.internalDate));
            var formattedDate = date.toLocaleDateString();
            var formattedTime = date.toLocaleTimeString();

            
            var decryptedMessages = await Promise.all(threadData.messages.map(async (message) => {
                var encodedHtml = null;
                var encodedText = null;

                var processParts = (parts) => {
                    for (var part of parts) {
                     if (part.mimeType === 'text/html' && part.body && part.body.data) {
                        encodedHtml += part.body.data;
                      } else if (part.parts) {
                        processParts(part.parts);
                      }
                    }
                  };

                  var decodedMessage = "";

                if (message.payload.body && message.payload.body.data) {
                    encodedText = message.payload.body.data;
                    if(encodedText){
                        decodedMessage = Buffer.from(encodedText, "base64").toString('utf-8');
                    }

                    const onIndex = decodedMessage.indexOf('On ');
                    if (onIndex !== -1) {
                        decodedMessage = decodedMessage.substring(0, onIndex);
                    }
                    decodedMessage = decodedMessage.replace(/(\r\n|\r|\n)/g, '<br/>')

                } else if (message.payload.parts && message.payload.parts.length > 0) {
                    await processParts(message.payload.parts);
                    if(encodedHtml){
                        decodedMessage = Buffer.from(encodedHtml, "base64").toString('utf-8');
                        decodedMessage = decodedMessage.replace(/<p class=MsoNormal><o:p>&nbsp;<\/o:p><\/p><div style='border:none;border-top:solid #E1E1E1 1.0pt;padding:3.0pt 0cm 0cm 0cm'>[\s\S]*?<\/div><p class=MsoNormal>[\s\S]*?<o:p><\/o:p><\/p><\/div>/gs, '');
                    }
                    
                }
                
                
                if (decodedMessage) {
                    
                    decodedMessage = decodedMessage.split('\n\n')[0];

                    var sentByMe = false;
                    var fromHeader = message.payload.headers.find(header => header.name === 'From');
                    if (fromHeader && fromHeader.value && (fromHeader.value === 'info@affotax.com' || fromHeader.value === 'Affotax Team <info@affotax.com>' || fromHeader.value === 'Affotax <info@affotax.com>' || fromHeader.value === 'Outsource Accountings <admin@outsourceaccountings.co.uk>' || fromHeader.value === 'admin@outsourceaccountings.co.uk' || fromHeader.value === 'Online Taxation <rashid@onlinetaxation.co.uk>' || fromHeader.value === 'rashid@onlinetaxation.co.uk')) {
                        sentByMe = true;
                    }

                    var attachments = [];

                    // Process attachments if present
                    if (message.payload.parts && message.payload.parts.length > 0) {
                      attachments = message.payload.parts.filter(part => part.filename && part.body && part.body.attachmentId);
                    }
                    var messageAttachments = [];
                    // // Download attachments
                    if(attachments){
                        for (const attachment of attachments) {
                            var AttachDetails = {
                                attachmentId: attachment.body.attachmentId,
                                attachmentMessageId: message.id,
                                attachmentFileName: attachment.filename
                            }
                            messageAttachments.push(AttachDetails)  
                        }
                    }
      
                  return {
                    ...message,
                    payload: {
                      ...message.payload,
                      body: {
                        ...message.payload.body,
                        data: decodedMessage,
                        sentByMe: sentByMe,
                        messageAttachments: messageAttachments
                      }
                    }
                  };
                } else {
                  return message;
                }
              }));

            var finalResp = await {
                decryptedMessages: decryptedMessages,
                threadData: threadData,
                threadId: threadId,
                subject: subject,
                readStatus: readStatus,
                recipients: recipients,
                formattedDate: formattedDate,
                formattedTime: formattedTime
            }

            return finalResp

        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Mail not found, skip this thread ID
                return [];
            } else {
                throw new Error(error.stack);
            }
        }
    }

    getAttachment = async (attachmentId, messageId, company_name) => {
        
        try {
            var accessToken = "";
            if(company_name === "Affotax"){
                accessToken = await this.getAccessToken();
            } else if(company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
            } else if(company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
            }

            const url = `https://www.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`;
    
            const config = {
            method: 'get',
            url: url,
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            responseType: 'arraybuffer',
            };
    
            const response = await axios(config);
            const attachmentData = response.data;

            // Determine the file format based on the attachment's MIME type
            const contentType = response.headers['content-type'];

            return attachmentData
            
    
            
        } catch (error) {
            throw new Error(error.message);
        }
        
        
        // try {
        // var config = {
        //     method: 'get',
        //     url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
        //     headers: {
        //     'Authorization': `Bearer ${accessToken}`
        //     },
        //     responseType: 'arraybuffer'  // Ensure response data is received as ArrayBuffer
        // };
    
        // var response = await axios(config);
        // var attachmentData = Buffer.from(response.data, 'base64');  // Convert data to Buffer
    
        // return attachmentData;
        // } catch (error) {
        // throw new Error(error.message);
        // }
    }

    getAllEmails = async (TicketsList) => {
        try {
            var threadIds = TicketsList;
            
            var accessToken = await this.getAccessToken();
            var accessTokenOutsource = await this.getOutsourceAccessToken();
            var accessTokenOnlineTaxation = await this.getOnlineTaxationAccessToken();
            
            var detailedThreads = await Promise.all(threadIds.map(async (threadId) => {
                
                var response = await this.getDetailedThreads(threadId.thread_id, threadId.company_name === "Affotax" ? accessToken : threadId.company_name === "Outsource" ? accessTokenOutsource : accessTokenOnlineTaxation);
                return response;
            }));

            // Filter out null values (skipped thread IDs)
            detailedThreads = detailedThreads.filter((thread) => thread !== null);
            
            var unreadCount = detailedThreads.reduce((count, thread) => {
                if (thread.readStatus === 'Unread') {
                  return count + 1;
                }
                return count;
              }, 0);
          
              return {
                detailedThreads: detailedThreads,
                unreadCount: unreadCount
              };
        } catch (error) {
            throw new Error(error.stack);
        }
    }

    markThreadAsRead = async (messageId, company_name) => {
        try {
            var accessToken = "";
            if(company_name === "Affotax"){
                accessToken = await this.getAccessToken();
            } else if(company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
            } else if(company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
            }

            var config = {
                method: 'post',
                url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    removeLabelIds: ['UNREAD']
                })
            };

            await axios(config);
            return "Success";
            
        } catch (error) {
            throw new Error(error.message);
        }
    }

    sendEmail = async (EmailComingData) => {
        
        try {
            
            var accessToken = ""
            var fromVar = ""
            if(EmailComingData.company_name === "Affotax"){
                accessToken = await this.getAccessToken();
                fromVar = 'Affotax <info@affotax.com>'
            } else if(EmailComingData.company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
                fromVar = 'Outsource Accountings <admin@outsourceaccountings.co.uk>'
            } else if(EmailComingData.company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
                fromVar = 'Online Taxation <rashid@onlinetaxation.co.uk>'
            }

            const emailData = {
                to: EmailComingData.email,
                subject: EmailComingData.subject,
                message: EmailComingData.message
            };
        
            const emailMessage = [
                `From: ${fromVar}`,
                'Content-Type: text/html; charset="UTF-8"',
                'MIME-Version: 1.0',
                'Content-Transfer-Encoding: 7bit',
                `To: ${emailData.to}`,
                `Subject: ${emailData.subject}`,
                '',
                emailData.message
            ].join('\n');
        
            const encodedMessage = Buffer.from(emailMessage).toString('base64');
        
            const config = {
                method: 'post',
                url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    raw: encodedMessage
                })
            };
        
            const resp = await axios(config);
            return resp;
        } catch (error) {
            throw new Error(error.message);
        }

    }

    sendEmailWithAttachments = async (EmailData) => {
        try {
            var accessToken = ""
            var fromVar = ""

           if(EmailData.company_name === "Affotax"){
                accessToken = await this.getAccessToken();
                fromVar = 'Affotax <info@affotax.com>'
            } else if(EmailData.company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
                fromVar = 'Outsource Accountings <admin@outsourceaccountings.co.uk>'
            } else if(EmailData.company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
                fromVar = 'Online Taxation <rashid@onlinetaxation.co.uk>'
            }


            const emailMessageParts = [];

            emailMessageParts.push('From: ' + fromVar);
            emailMessageParts.push('To: ' + EmailData.email);
            emailMessageParts.push('Subject: ' + EmailData.subject);
            emailMessageParts.push('MIME-Version: 1.0');
            emailMessageParts.push('Content-Type: multipart/mixed; boundary="boundary_example"');
            emailMessageParts.push('');
        
            emailMessageParts.push('--boundary_example');
            emailMessageParts.push('Content-Type: text/html; charset="UTF-8"');
            emailMessageParts.push('Content-Transfer-Encoding: 7bit');
            emailMessageParts.push('');
            emailMessageParts.push(EmailData.message);
            emailMessageParts.push('');
        
            for (const attachment of EmailData.attachments) {
              emailMessageParts.push('--boundary_example');
              emailMessageParts.push('Content-Type: application/octet-stream');
              emailMessageParts.push('Content-Disposition: attachment; filename="' + attachment.filename + '"');
              emailMessageParts.push('Content-Transfer-Encoding: base64');
              emailMessageParts.push('');
              emailMessageParts.push(attachment.content);
              emailMessageParts.push('');
            }
        
            emailMessageParts.push('--boundary_example--');
        
            const emailMessage = emailMessageParts.join('\n');
            const encodedMessage = Buffer.from(emailMessage).toString('base64');
        
            const config = {
              method: 'post',
              url: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
              },
              data: JSON.stringify({
                raw: encodedMessage
              })
            };
        
            const resp = await axios(config);
            return resp;
          } catch (error) {
            throw new Error(error.message);
          }

    }
    
    
    replyToThread = async (EmailComingData) => {
        
        try {
            var accessToken = "";
            var fromVar = "";
            if(EmailComingData.company_name === "Affotax"){
                accessToken = await this.getAccessToken();
                fromVar = 'Affotax <info@affotax.com>'
            } else if(EmailComingData.company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
                fromVar = 'Outsource Accountings <admin@outsourceaccountings.co.uk>'
            } else if(EmailComingData.company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
                fromVar = 'Online Taxation <rashid@onlinetaxation.co.uk>'
            }

            const threadId = EmailComingData.threadId; // Replace with the actual thread ID
            const messageId = EmailComingData.messageId; // Replace with the actual message Id
            const replyText = EmailComingData.message;
            const subjectToReply = EmailComingData.subjectToReply;
            const emailSendTo = EmailComingData.emailSendTo;
        
            const emailMessage = [
                `From: ${fromVar}`,
                `To: ${emailSendTo}`,
                `Subject: ${subjectToReply}`,
                'Content-Type: text/html; charset=utf-8',
                'MIME-Version: 1.0',
                'Content-Transfer-Encoding: 7bit',
                '',
                replyText
              ].join('\n');
            
              const encodedMessage = Buffer.from(emailMessage).toString('base64');
            
              const config = {
                method: 'post',
                url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  raw: encodedMessage,
                  threadId: threadId
                })
              };
            
              const resp = await axios(config);
              return resp;
           
            
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }



    }
    
    
    replyToThreadWithAttachment = async (EmailComingData) => {
        
        try {
            var accessToken = "";
            var fromVar = "";
            if(EmailComingData.company_name === "Affotax"){
                accessToken = await this.getAccessToken();
                fromVar = 'Affotax <info@affotax.com>'
            } else if(EmailComingData.company_name === "Outsource"){
                accessToken = await this.getOutsourceAccessToken();
                fromVar = 'Outsource Accountings <admin@outsourceaccountings.co.uk>'
            } else if(EmailComingData.company_name === "Online Taxation"){
                accessToken = await this.getOnlineTaxationAccessToken();
                fromVar = 'Online Taxation <rashid@onlinetaxation.co.uk>'
            }


            const threadId = EmailComingData.threadId; // Replace with the actual thread ID
            const messageId = EmailComingData.messageId; // Replace with the actual message Id
            const replyText = EmailComingData.message;
            const subjectToReply = EmailComingData.subjectToReply;
            const emailSendTo = EmailComingData.emailSendTo;

            console.log(EmailComingData.attachments.length)

            const emailMessageParts = [];

            emailMessageParts.push('From: ' + fromVar);
            emailMessageParts.push('To: ' + emailSendTo);
            emailMessageParts.push('Subject: ' + subjectToReply);
            emailMessageParts.push('MIME-Version: 1.0');
            emailMessageParts.push('Content-Type: multipart/mixed; boundary="boundary_example"');
            emailMessageParts.push('');
        
            emailMessageParts.push('--boundary_example');
            emailMessageParts.push('Content-Type: text/html; charset="UTF-8"');
            emailMessageParts.push('Content-Transfer-Encoding: 7bit');
            emailMessageParts.push('');
            emailMessageParts.push(replyText);
            emailMessageParts.push('');

            for (const attachment of EmailComingData.attachments) {
                emailMessageParts.push('--boundary_example');
                emailMessageParts.push('Content-Type: application/octet-stream');
                emailMessageParts.push('Content-Disposition: attachment; filename="' + attachment.filename + '"');
                emailMessageParts.push('Content-Transfer-Encoding: base64');
                emailMessageParts.push('');
                emailMessageParts.push(attachment.content);
                emailMessageParts.push('');
            }

            emailMessageParts.push('--boundary_example--');

            const emailMessage = emailMessageParts.join('\n');
            const encodedMessage = Buffer.from(emailMessage).toString('base64');
        
            
              const config = {
                method: 'post',
                url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                  raw: encodedMessage,
                  threadId: threadId
                })
              };
            
              const resp = await axios(config);
              return resp;
           
            
        } catch (error) {
            console.log(error.message);
            throw new Error(error.message);
        }



    }
}

module.exports = new GmailApi();
