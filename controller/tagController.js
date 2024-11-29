import Tag from "../models/tag.models.js";

export const createTag =  async(req,res)=>{
    try{
        const newTag = new Tag(req.body);
        await newTag.save();
        res.status(201).json({message:"Tag created successfully."})
    }catch(error){
        res.status(500).json({error:`error creating tag`,error})
    }
}

export const getAllTags = async(req,res)=>{
    try{
        const allTags = await Tag.find();
        if(!allTags){
            res.status(400).json({message:'no tags found'})
        }
        res.status(200).json(allTags);
    }catch(error){
        res.status(500).json({error:`error fethcing tags`,error})
    }
}