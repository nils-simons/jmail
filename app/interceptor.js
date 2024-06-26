const { simpleParser } = require('mailparser');


const interceptor = async (stream, session, cb) => {
    const parsed = await simpleParser(stream);

    parsed.to.value.forEach((to) => {
        const mail_domain = to.address.split('@')[1];

        if (mail_domain !== process.env.MAIL_DEFAULT) {
            return
        }

        console.log(to.address)

        const alias = to.address.split('@')[0].split('.')[0];

        console.log(alias)

    });

    cb()
}

exports.interceptor = interceptor;

