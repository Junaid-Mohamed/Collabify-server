import cors from "cors";
import express from "express";
import initializeDb from "./db.js";

const app = express();

//  import routes
import { verifyToken } from "./middleware/verifyToken.js";
import authRoutes from './routes/authRoutes.js';
import projectRoutes from "./routes/projectRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import taskRoutes from './routes/taskRoutes.js';
import teamRoutes from "./routes/teamRoutes.js";

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("Hi World");
})

app.use('/api/auth', authRoutes)
app.use('/api/tasks',verifyToken, taskRoutes)
app.use('/api/tags',verifyToken, tagRoutes)
app.use('/api/teams',verifyToken, teamRoutes)
app.use('/api/projects',verifyToken, projectRoutes)
app.use('/api/reports',verifyToken, reportRoutes)

initializeDb();

app.listen(3000, ()=>console.log('app listening on port 3000'))
