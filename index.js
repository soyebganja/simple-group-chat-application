'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;
const chatHistoryArray = [];


/**
 * to load css files on brawser.
 */
app.use('/', express.static(__dirname + '/views'));


/**
 * Base route to start chat app
 */
app.get('/', (req, res) => {
    res.render('views/index.html');
});


/**
 * Socket channal connection estrablished and their methods
 */
io.sockets.on('connection', socket => {
    try {
        socket.on('username', username => {
            socket.username = username;
            socket.emit('chat_history', chatHistoryArray);
            io.emit('is_online', `🔵 <i> ${socket.username} join the chat..</i>`);
            chatHistoryArray.push(`<li>🔵 <i> ${socket.username} join the chat..</i></li>`);
        });

        socket.on('chat_message', message => {
            chatHistoryArray.push(`<li><strong> ${socket.username} </strong>: ${message}</li>`);
            io.emit('chat_message', `<strong> ${socket.username} </strong>: ${message}`);
        });

        socket.on('disconnect', username => {
            io.emit('is_online', `🔴 <i> ${socket.username || username} left the chat..</i>`);
        });
    } catch (err) {
        console.error('Error: ', err);
        socket.emit('Error', 'Oops! Something went worung.');
    }
});


/**
 * Error handling for Uncaught Exception and Unhandled Rejection
 */
process.on("uncaughtException", e => {
    console.error(`uncaughtException: ${e}`);
    process.exit(1);
}).on("unhandledRejection", (reason, p) => {
    console.error(`${reason} Unhandled Rejection at Promise ${p}`);
    process.exit(1);
});


/**
 * http port lintener method
 */
http.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});