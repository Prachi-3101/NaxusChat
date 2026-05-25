import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

//************Send message *************** 

const sendMessage = async(req,res) => {
    try {
        const { content, chatId} = req.body;
        if(!content || !chatId) {
            return res.status(400).json({
                message: "Invalid data passed",
            });
        }

        //create message
        let newMessage = {
            sender: req.user._id,
            content,
            chat: chatId,
        };

        //save message
        let message = await Message.create(newMessage);

        //populate chat
        message = await message.populate("chat");

        //populate chat user
        message = await User.populate(message,{
            path: "chat.users",
            select: "name picture email",
        });

        //update latest message
        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        });
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//************Fetch all messages************

const allMessages = async(req,res) => {
    try {
        const messages = await Message.find({
            chat: req.params.chatId,
        })
        .populate("sender","name picture email")
        .populate("chat");

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};

export {sendMessage,allMessages};