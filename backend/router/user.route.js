import express from "express";
import { authUser,registerUser } from "../controllers/user.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",registerUser);
router.post("/login",authUser);

router.get("/test",protect,(req,res) => {
    res.json(req.user)
})

export default router;