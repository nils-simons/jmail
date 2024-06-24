const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');

const server = new SMTPServer({
  // Disable authentication
  authOptional: true,

  // Handle the incoming mail
  onData(stream, session, callback) {
    simpleParser(stream)
      .then(parsed => {
        console.log('Email received:');
        console.log('From:', parsed.from.text);
        console.log('To:', parsed.to.text);
        console.log('Subject:', parsed.subject);
        console.log('Text:', parsed.text);
      })
      .catch(err => {
        console.error('Error parsing email:', err);
      })
      .finally(() => {
        callback(); // Always call the callback when processing the stream
      });
  },

  // Handle errors
  onError(err) {
    console.error('Error:', err);
  }
});

// Listen on port 25 for incoming connections
server.listen(25, () => {
  console.log('Mail server is listening on port 25');
});
