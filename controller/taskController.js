import Project from "../models/project.models.js";
import Tag from "../models/tag.models.js";
import Task from "../models/task.models.js";
import Team from "../models/team.models.js";
import User from "../models/user.models.js";


export const createTask = async(req,res)=>{
    try{
        const {project,team,owners,tags} = req.body;
        const relatedQueries = [];
        relatedQueries.push(Project.findOne({name:project}));
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
            name:req.body.name,
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
        const {owner, team, tags, project, status} = req.query;
        const filter = {};
        const relatedQueries = [];

        if(owner){
            relatedQueries.push(User.findOne({name:owner}))
        }
        if(team){
            relatedQueries.push(Team.findOne({name:team}))
        }
        if(project){
            relatedQueries.push(Project.findOne({name:project}))
        }
        if(tags){
            const tagNames = tags.split(',');
            relatedQueries.push(Tag.find({name: {$in: tagNames}}))
        }
        
        //  execute all related queries.
        // const result = await Promise.all(relatedQueries);

        const [ownerData,teamData,projectData,tagsData] = await Promise.all(relatedQueries)
        if(ownerData){
            filter.owners = ownerData._id;
        }
        if(teamData){
            filter.team = teamData._id;
        }
        if(projectData){
            filter.project = projectData._id;
        }
        if(tagsData){
            filter.tags = {$in: tagsData.map(tag=>tag._id)}
        }

        // console.log(ownerData,teamData,projectData,tagsData)
        // console.log(filter);
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