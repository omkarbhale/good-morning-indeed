require("dotenv").config();
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { connect } = require("./src/connectDB");
const { sendGreetings } = require('./src/logic');

// Create a new client instance
const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({dataPath: ".data"})
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
    const minutes = 60 * 1000;
    setInterval(() => {
        sendGreetings(client);
    }, 15 * minutes);
});

// When the client received QR-Code
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('message_create', message => {
    if (message.body === '!ping') {
        // send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});

// Start your client
(async () => {
    await connect();
    client.initialize();
})();
