const admin = require('firebase-admin');


exports.filesUpload = async (userId, emailId, file) => {
    return new Promise(async (r) => {
        try {
            const bucket = admin.storage().bucket()
            const filePath = bucket.file(`mail/${userId}/attachments/${emailId}/${file.filename}`);        
            await filePath.save(file.content, {
              metadata: {
                contentType: file.contentType
              }
            });
    
            await filePath.makePublic();
            r(`https://storage.googleapis.com/${bucket.name}/mail/${userId}/attachments/${emailId}/${file.filename}`)
        } catch (error) {
            r(false);
        }
    })
}