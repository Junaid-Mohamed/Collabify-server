import Project from "../models/project.models.js";

export const createProject =  async(req,res)=>{
    try{
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json({message:"Project created successfully."})
    }catch(error){
        res.status(500).json({error:`error creating project`,error})
    }
}

export const getAllProjects = async(req,res)=>{
    try{
        const allProjects = await Project.find();
        if(!allProjects){
            res.status(400).json({message:'no projects found'})
        }
        res.status(200).json(allProjects);
    }catch(error){
        res.status(500).json({error:`error fethcing projects`,error})
    }
}

export const getAllProjectsNames = async(req,res)=>{
    try{
        const allProjects = await Project.find();
        if(!allProjects){
            res.status(400).json({message:'no projects found'})
        }
        const projectNames = allProjects.map((pro)=> pro.name)
        res.status(200).json(projectNames);
    }catch(error){
        res.status(500).json({error:`error fethcing projects`,error})
    }
}