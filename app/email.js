const admin = require('firebase-admin');
const files = require('./files');

exports.logEmail = (userRef, email) => {
    return new Promise(async (r) => {

        const emailDoc = await userRef.collection('emails').doc();

        const atts = [];

        for (let i = 0; i < email.attachments.length; i++) {
            const att = email.attachments[i];
            const url = files.filesUpload(emailDoc._path.segments[1], emailDoc._path.segments[3], att);
            att.url = url;
            delete att.content;
            atts.push(att);
        }

        const to = [];

        for (let i = 0; i < email.to.value.length; i++) {
            to.push(email.to.value[i].address)
        }

        await emailDoc.set({
            date: email.date,
            from: email.from.value[0].address,
            to: to,
            html: email.html,
            subject: email.subject,
            text: email.text,
            textAsHtml: email.textAsHtml,
            attachments: atts

        });
        r(true);
    })
}