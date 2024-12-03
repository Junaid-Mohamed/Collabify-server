import Project from "../models/project.models.js";
import Tag from "../models/tag.models.js";
import Task from "../models/task.models.js";
import Team from "../models/team.models.js";
import User from "../models/user.models.js";


export const createTask = async(req,res)=>{
    try{
        const {projectName,team,owners,tags} = req.body;
        // console.log(project);
        const relatedQueries = [];
        relatedQueries.push(Project.findOne({name:projectName}));
        relatedQueries.push(Team.findOne({name:team}));
        relatedQueries.push(User.find({name:{$in:owners}}))
        relatedQueries.push(Tag.find({name:{$in: tags}}))
        const [projectData,teamData,userData,tagData] = await Promise.all(relatedQueries);
        if(!projectData){
            res.status(404).json({message:'Project name not found please give project which exists.'})
            return;
        }
        if(!teamData){
            res.status(404).json({message:'Team name not found please give Team which exists.'})
            return;
        }
        if(!userData){
            res.status(404).json({message:'give Owners for the task.'})
            return;
        }
        if (userData && userData.length !== owners.length) {
            const missingOwners = owners.filter(owner => !userData.some(user => user.name === owner));
            res.status(404).json({ message: `Owner(s) not found: ${missingOwners.join(', ')}` });
            return;
        }
        
        if (tags && tagData.length !== tags.length) {
            const missingTags = tags.filter(tag => !tagData.some(tagObj => tagObj.name === tag));
            res.status(404).json({ message: `Tag(s) not found: ${missingTags.join(', ')}` });
            return;
        }
        
        const newTask = new Task({
            name:req.body.taskName,
            project:projectData._id,
            team:teamData._id,
            owners: userData.map(user=>user._id),
            tags: tagData.map(tag=>tag._id),
            timeToComplete: req.body.timeToComplete,
            status:req.body.status
        });
        // const createdTask = new Task(newTask);
        // await createdTask.save();
        await newTask.save();
        res.status(201).json({message:"task created successfully"});
    }catch(error){
        res.status(500).json({error:`Error creating task: ${error.message}`});
    }
}

export const getAllTasks = async(req,res)=>{
    try{
        const {owners, team, tags, project, status} = req.query;
        const filter = {};
        const relatedQueries = [];

        if (owners) {
            const ownerNames = owners.split(",");
            const ownerDocs = await Promise.all(
                ownerNames.map((o) => User.findOne({ name: o }))
            );
            const ownerIds = ownerDocs.filter(Boolean).map((o) => o._id);
            if (ownerIds.length > 0) {
                filter.owners = { $in: ownerIds };
            }
        }

        if (team) {
            const teamData = await Team.findOne({ name: team });
            if (!teamData) {
                return res.status(404).json({ message: "Team not found" });
            }
            filter.team = teamData._id;
        }

        if (project) {
            const projectData = await Project.findOne({ name: project });
            if (!projectData) {
                return res.status(404).json({ message: "Project not found" });
            }
            filter.project = projectData._id;
        }

        if (tags) {
            const tagNames = tags.split(",");
            const tagDocs = await Tag.find({ name: { $in: tagNames } });
            const tagIds = tagDocs.map((t) => t._id);
            if (tagIds.length > 0) {
                filter.tags = { $in: tagIds };
            }
        }


        if(status){
            filter.status = status
        }
        const allTasks = await Task.find(filter)
            .populate('tags','name -_id')
            .populate('team','name -_id')
            .populate('owners','name -_id')
            .populate('project','name -_id')
        res.status(200).json(allTasks);
    }catch(error){
        res.status(500).json({error:`Error fetching all tasks ${error.message}`});
    }
}

export const getTaskById = async(req,res) => {
    try{
        const taskId = req.params.id;
        const task = await Task.findById(taskId)
            .populate('tags','name -_id')
            .populate('team','name -_id')
            .populate('owners','name -_id')
            .populate('project','name -_id')
        if(!task){
            res.status(404).json({message: `Task not found`});
            return;
        }
        res.status(200).json(task);
    }catch(error){

    }
}

export const updateTask = async(req,res)=>{
    try{
        const newData = req.body;
        const taskId = req.params.id;
        const updatedData = await Task.findByIdAndUpdate(taskId,newData, {new:true})
        // Handle case where no task is found
        if (!updatedData) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.status(200).json({message:"task updated successfully.",updatedTask: updatedData})
    }catch(error){
        res.status(500).json({error:`Error updating task ${error.message}`});
    }
}

export const deleteTask = async(req,res)=>{
    try{
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId)
        // Handle case where no task is found
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found." });
        }
        res.status(200).json({message:"task deleted successfully.",deletedTask: deletedTask})
    }catch(error){
        res.status(500).json({error:`Error updating task ${error.message}`});
    }
}