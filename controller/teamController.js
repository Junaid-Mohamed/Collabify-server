import Team from "../models/team.models.js";

export const createTeam =  async(req,res)=>{
    try{
        const newTeam = new Team(req.body);
        await newTeam.save();
        res.status(201).json({message:"Team created successfully."})
    }catch(error){
        res.status(500).json({error:`error creating team`,error})
    }
}

export const getAllTeam = async(req,res)=>{
    try{
        const allTeams = await Team.find();
        if(!allTeams){
            res.status(400).json({message:'no teams found'})
        }
        res.status(200).json(allTeams);
    }catch(error){
        res.status(500).json({error:`error fethcing teams`,error})
    }
}

export const getAllTeamNames = async(req,res)=>{
    try{
        const allTeams = await Team.find();
        if(!allTeams){
            res.status(400).json({message:'no teams found'})
        }
        res.status(200).json(allTeams.map(team=>team.name));
    }catch(error){
        res.status(500).json({error:`error fethcing teams`,error})
    }
}
