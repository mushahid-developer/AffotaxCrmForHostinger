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
            // var readStatus = await threadData.messages[0].labelIds;
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
                      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                        encodedText += part.body.data;
                      } else if (part.mimeType === 'text/html' && part.body && part.body.data) {
                        encodedHtml += part.body.data;
                      } else if (part.parts) {
                        processParts(part.parts);
                      }
                    }
                  };

                // if (message.payload.body && message.payload.body.data) {
                //     encodedHtml = message.payload.body.data;
                // } else
                 if (message.payload.parts && message.payload.parts.length > 0) {
                    processParts(message.payload.parts);
                }
                

                if (encodedHtml) {

                    var decodedMessage = Buffer.from(encodedHtml, "base64").toString("utf-8");

                    decodedMessage = decodedMessage.split('\n\n')[0];

                    decodedMessage = decodedMessage.replace(/[^\x20-\x7E]+/g, '');

                    // Remove the reply section using regular expressions
                    const regex = /On .+, .* wrote:(.*\n)*>/;
                    decodedMessage = decodedMessage.replace(regex, '');

                    var sentByMe = false;
                    var fromHeader = message.payload.headers.find(header => header.name === 'From');
                    if (fromHeader && fromHeader.value && (fromHeader.value === 'info@affotax.com' || fromHeader.value === 'Affotax Team <info@affotax.com>' || fromHeader.value === 'Affotax <info@affotax.com>')) {
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
                return null;
              } else {
                throw new Error(error.message);
              }
            throw new Error(error.message);
        }
    }

    
    // Method to get attachment data
    getAttachment = async (attachmentId, messageId, accessToken) => {
        try {
        var config = {
            method: 'get',
            url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
            headers: {
            'Authorization': `Bearer ${accessToken}`
            },
            responseType: 'arraybuffer'  // Ensure response data is received as ArrayBuffer
        };
    
        var response = await axios(config);
        var attachmentData = Buffer.from(response.data, 'base64');  // Convert data to Buffer
    
        return attachmentData;
        } catch (error) {
        throw new Error(error.message);
        }
    }

    getAllEmails = async (TicketsList) => {
        try {
            // var threads = await this.getAllThreads();
            // var threadIds = threads.map(thread => thread.id);
            // var threadIds = threads.map(thread => thread.id);
            var threadIds = TicketsList;
            
            var accessToken = await this.getAccessToken();
            
            var detailedThreads = await Promise.all(threadIds.map(async (threadId) => {
                
                var response = await this.getDetailedThreads(threadId, accessToken);
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
            throw new Error(error.message);
        }
    }

    markThreadAsRead = async (messageId) => {
        try {
            
            var accessToken = await this.getAccessToken();

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
            const accessToken = await this.getAccessToken();

            const emailData = {
                to: EmailComingData.email,
                subject: EmailComingData.subject,
                message: EmailComingData.message
            };
        
            const emailMessage = [
                'From: Affotax <info@affotax.com>',
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
    
    
    replyToThread = async (EmailComingData) => {
        
        try {
            const accessToken = await this.getAccessToken();
            const threadId = EmailComingData.threadId; // Replace with the actual thread ID
            const messageId = EmailComingData.messageId; // Replace with the actual message Id
            const replyText = EmailComingData.message;
            const subjectToReply = EmailComingData.subjectToReply;
            const emailSendTo = EmailComingData.emailSendTo;
        
            const emailMessage = [
                'From: Affotax <info@affotax.com>',
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
}

module.exports = new GmailApi();
