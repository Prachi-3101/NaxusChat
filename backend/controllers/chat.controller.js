import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

//*************Access Chat**********

const accessChat = async(req,res) => {
    try {
        const { userId } = req.body;

        //check user id
        if(!userId){
            return res.status(400).json({
                message: "UserId not provided",
            })
        }
        //check if chat exist
        let isChat = await Chat.find({
            isGroupChat: false,

            $and: [
                {users: {$elemMatch: {$eq: req.user._id}}},
                {users: {$elemMatch: {$eq: userId}}},
            ],
        })
        .populate("users","-password")
        .populate("latestMessage");

        //populate latest message sender
        isChat = await User.populate(isChat,{
            path: "latestMessage.sender",
            select: "name picture email",
        });

        //if chat exists
        if(isChat.length > 0){
            return res.status(200).json(isChat[0]);
        }

        //create new chat
        const chatData = {
            chatName : "sender",
            isGroupChat: false,
            users:[req.user._id,userId],
        };
        const createChat = await Chat.create(chatData);

        //Get full chat
        const fullChat = await Chat.findById(createChat._id).populate(
            "users",
            "-password"
        );
        res.status(200).json(fullChat);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//*************Fetch Chat************** 

const fetchData = async(req,res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: {$eq: req.user._id}},
        })
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort( {updatedAt: -1});

        const result = await User.populate(chats,
            {
                path: "latestMessage.sender",
                select:"name picture email", 
            }
        );
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

const renameGroup = async(req,res) =>{
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                new: true,
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!updatedChat){
            return res.status(400).json({
                message: "Chat not found",
            });
        }
        res.status(200).json(updatedChat);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

//**************Add to group *************

const addToGroup = async(req,res) => {
    try {
        const {chatId,userId} = req.body;

        const added = await Chat.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userId },
            },
            {
                new: true,
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!added) {
            return res.status(401).json({
                message: "Chat not found",
            });
        }
        res.status(200).json(added);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

//************Remove from group************
const removeFromGroup = async(req,res) => {
    try {
        const { chatId, userId} = req.body;

        const removed = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId },
            },
            {
                new: true,
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");

        if(!removed) {
            return res.status(404).json({
                message: "Chat not found",
            });
        }
        res.status(200).json(removed);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

export {accessChat,fetchData,renameGroup,addToGroup,removeFromGroup}