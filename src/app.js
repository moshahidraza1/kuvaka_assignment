import express from "express";
import cors from "cors";

import inputRoutes from './routes/inputRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/input', inputRoutes);

export {app};