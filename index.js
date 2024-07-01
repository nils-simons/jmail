const { SMTPServer } = require('smtp-server');
require('dotenv').config()

const express = require('express');
const app = express();

const admin = require('firebase-admin');

const serviceAccount = require('./configs/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'jmail-mail-interceptor-api.appspot.com'
});

app.use(express.json());


require('./api/router').router(app);

app.listen(7666, () => {
  console.log('JMAIL API SERVER *:7666');
})



// --- MAIL SERVER

const server = new SMTPServer({
  // Disable authentication
  authOptional: true,

  // Handle the incoming mail using the external function
  onData: require('./app/interceptor').interceptor,

  // Handle errors
  onError(err) {
    console.error('Error:', err);
  }
});

server.listen(25, () => {
  console.log('JMAIL MAIL SERVER *:25');
});