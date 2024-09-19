import * as R from "./routes/index";
import * as config from "./config/index";
import { errorHandler } from "./middlewares/errorHandler";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path"; // Import path module

const app = express();

dotenv.config();
config.connectDB();
// config.cloudinaryConfig();

// Set the views directory
app.set("views", path.join(__dirname, "views"));


// Set the view engine to EJS
app.set("view engine", "ejs");

// Middlewares
app.use(bodyParser.json({ limit: '90mb' }), cookieParser());
app.use(cors({ credentials: true, origin: true }));

// Routes
app.get("/", (req: Request, res: Response) => res.render('index', { website: process.env.ALLOW_ORIGIN }));
app.use("/css", express.static("public/css"));
app.use("/imgs", express.static("public/imgs"));
app.use("/", express.static("public"), R.Auth, R.Project);

// Error handler middleware
app.use(errorHandler);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server is listening at', `\x1b[33m${process.env.URI}\x1b[0m`));
