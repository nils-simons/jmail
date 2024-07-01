const { simpleParser } = require('mailparser');
const admin = require('firebase-admin');
const email = require('./email');

const interceptor = async (stream, session, cb) => {
    const parsedEmail = await simpleParser(stream);

    parsedEmail.to.value.forEach(async (to) => {
        const mail_domain = to.address.split('@')[1];

        if (mail_domain !== process.env.MAIL_DEFAULT) {
            return
        }

        console.log(to.address)

        const alias = to.address.split('@')[0].split('.')[0];

        console.log(alias)

        const querySnap = await admin.firestore().collection('users').where('alias', '==', alias).get();

        if (querySnap.empty) {
            return
        }


        await email.logEmail(querySnap.docs[0].ref, parsedEmail)        
    });

    cb()
}

exports.interceptor = interceptor;

