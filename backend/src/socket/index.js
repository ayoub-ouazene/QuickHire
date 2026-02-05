const {Server} = require("socket.io")

const {ChatSocket} = require("./socket.chat")

let io;

function initSocket(server){

    io = new Server(server,{
        cors: {
            origin : "*",
        },
    });

    io.use((socket, next) => {
            const { id, type } = socket.handshake.auth;

            if (!id || !type) {
                return next(new Error("Missing socket auth data"));
            }

            socket.user = {
                id: Number(id),
                type  : type
            };

            

       

            next();
            });


    io.on("connection", (socket)=>{
        
     
          
         ChatSocket(socket , io);

        socket.on("disconnect",()=>{
            
        })
    })
}


module.exports = { initSocket, io }