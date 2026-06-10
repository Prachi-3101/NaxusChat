import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoutes from "./router/user.route.js";
import chatRoutes from "./router/chat.route.js"; 
import messageRoutes from "./router/message.routes.js";
import { Server } from "socket.io"

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,DELETE,PATCH,PUT,HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);
app.use("/api/message",messageRoutes);

const PORT = 5000;

connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`server is listening at port ${PORT}`);
    });
    const io = new Server(server,{
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:5173",
        },
    });
    io.on("connection",(socket) => {
        console.log("user connected:",socket.id);

        socket.on("setup",(userData) => {
            socket.join(userData._id);
            console.log("Joined room:",userData._id);
            socket.emit("connected");
        });

        socket.on("join chat",(room) => {
            socket.join(room);
            console.log("Joined chat room:",room);
        });
        socket.on("new message",(newMessageReceived) => {
            const chat = newMessageReceived.chat;

            if(!chat.users){
                console.log("chat users not defined");
                return;
            }
            chat.users.forEach((user) => {
                // Don't send the message back to sender
                if (
                    user._id.toString() ===
                    newMessageReceived.sender._id.toString()
                ) {
                    return;
                }

                socket
                    .in(user._id.toString())
                    .emit("message received", newMessageReceived);
            });
        })
        socket.on("disconnect",() => {
            console.log("User disconnected");
        });
    });
});