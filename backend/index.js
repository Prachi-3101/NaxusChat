import express from "express";
import cors from "cors";

const app = express();

const corsOptions = {
    origin: "http://localhost:5173",
    methods: "GET,POST,DELETE,PATCH,PUT,HEAD",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = 5000;
