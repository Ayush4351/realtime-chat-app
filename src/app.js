const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const filterBadWords = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

app.get('/', (req, res) => {
    res.send('index.html');
})

io.on('connection', (socket) => {
    socket.emit('message', 'Welcome!');

    socket.broadcast.emit('message', 'A new user has joined!');

    socket.on('sendMessage', (message, callback) => {
        const filter = new filterBadWords();

        if (filter.isProfane(message)) {
            const cleanedMessage = filter.clean(message);
            return callback(cleanedMessage + ' Profanity is not allowed');
        }

        io.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (location, callback) => {
        io.emit('message', `https://maps.google.com?q=${location.latitude},${location.longitude}`);
        callback();
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A User has left!');
    })
});

module.exports = server;