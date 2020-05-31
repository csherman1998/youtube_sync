const path = require('path');
const http = require('http');
const express = require('express');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser} = require('./utils/users')
const app = express();
const server = http.createServer(app);   
//clean this up ^^^


const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'Admin'
//run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        console.log('new web socket connection...');
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //greet user
        socket.emit('message', formatMessage(adminName,'welcome to chat'));
    
        //broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(adminName,`${user.username} has entered your channel`));
    });
    //listen for chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        //dynamically assing name l8r
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //runs when client disconnects
    socket.on('disconnect', () => {
        //replace me with dynamic username
        io.emit('message', formatMessage(adminName, 'A user has left your channel'));
    });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));