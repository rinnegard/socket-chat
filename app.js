const express = require('express');
const app = express();

const mongo = require('mongodb').MongoClient;

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.origins(['https://me-jsramverk.rinnegard.me:443']);

mongo.connect('mongodb://localhost:27017', function(error, client){
    if(error){
        throw error;
    }
    console.log("Mongo Connected");
    io.on('connection', function (socket) {
        console.info("Socket connected");
        let db = client.db('chat');
        let messages = db.collection('messages');

        socket.on('load', function (id) {
            messages.find().toArray(function(error, res){
                if(error){
                    throw err;
                }
                io.to(id).emit('messages', res);
            });
        });

        socket.on('new user', function (message) {
            io.emit('new user', message);
        });

        socket.on('chat message', function (message) {
            messages.insert({
                 username: message.username,
                 message: message.message,
                 time: message.time,
             }, function(){
                io.emit('chat message', message);
            });

        });
    });

});

server.listen(3000);
