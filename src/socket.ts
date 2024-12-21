  import {Server} from "socket.io"
  import {createServer} from "http" // createServer from "http"
  import express from "express"
  import dotenv from "dotenv";

  
 dotenv.config();


  const app = express();
  // Attach Socket.IO server to the HTTP server
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.PROD, 
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      credentials: true, 
    },
  });

  const userSocketMap: { [key: string]: string } = {};
  export const getRecipientSocketId = (receiverId:string)=>{
    return userSocketMap[receiverId]
  }


  io.on("connection", (socket) => {
    // console.log("user connected",socket.id);

      const userId = socket.handshake.query.userId;
      if (typeof userId === "string") {
      
        userSocketMap[userId] = socket.id;
        socket.on("error", (error) => {
          console.error("Socket error:", error);
        });

        socket.on("disconnect",() => {
          // console.log("user disconnected",socket.id);
          delete userSocketMap[userId];
        })
      } 

  })


  export { app, io, httpServer, userSocketMap };