import express from "express";
import {accessChat, fetchData,renameGroup,addToGroup,removeFromGroup } from "../controllers/chat.controller.js";
import  protect  from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protect,accessChat);
router.get("/",protect,fetchData);
router.put("/rename",protect,renameGroup);
router.put("/groupadd",protect,addToGroup);
router.put("/groupremove",protect,removeFromGroup);

export default router;