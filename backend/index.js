import express from "express";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRoutes from "./router/user.route.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,DELETE,PATCH,PUT,HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/user",userRoutes);

const PORT = 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`server is listening at port ${PORT}`);
    })
})