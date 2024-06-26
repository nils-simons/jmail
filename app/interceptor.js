const { simpleParser } = require('mailparser');
const admin = require('firebase-admin');


const interceptor = async (stream, session, cb) => {
    const parsed = await simpleParser(stream);

    const db = admin.firestore();


    parsed.to.value.forEach(async (to) => {
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

        
    });

    cb()
}

exports.interceptor = interceptor;

