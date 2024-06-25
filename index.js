const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');

const express = require('express');
const app = express();

const admin = require('firebase-admin');

const serviceAccount = require('./configs/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
  onData: emailStreamHandler,

  // Handle errors
  onError(err) {
    console.error('Error:', err);
  }
});

async function emailStreamHandler(stream, session, cb) {
  const parsed = await simpleParser(stream);
  console.log(parsed);
  cb()
}
// Listen on port 25 for incoming connections
server.listen(25, () => {
  console.log('JMAIL MAIL SERVER *:25');
});