import Task from "../models/task.models.js";


export const taskCompletedLastWeek = async(req,res)=>{
    try{
        const onWeekAgo = new Date();
        onWeekAgo.setDate(onWeekAgo.getDate()-7)
        const tasks = await Task.find({status:'Completed', updatedAt: {$gte: onWeekAgo}});
        if(tasks.length === 0){
            res.status(400).json({message:'No tasks were completed last week'})
            return
        }
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({error:"something wrong in fetching last week tasks",error})
    }
}

export const taskPending = async(req,res)=>{
    try{
        // Fetch total days of work pending for all tasks
        const pendingTasks = await Task.find({status: {$ne:`Completed`}})
        const totalDaysWorkPending = pendingTasks.reduce((acc,curr)=>acc+curr.timeToComplete,0);
        res.status(200).json({days:totalDaysWorkPending});
    }catch(error){
        res.status(500).json({error:`something wrong in fetching pending tasks ${error.message}`,})
    }
}

export const reportClosedTasks = async(req,res)=>{
    try{
        const groupBy = req.query.groupBy || 'team'; // Default to 'team' if no query param is provided

        let groupByField;
        let lookupStage;
        if (groupBy === 'owner') {
            groupByField = '$owners';
            lookupStage = {
                $lookup: {
                    from: 'users', // The name of the collection storing users
                    localField: 'owners', // Field in task model
                    foreignField: '_id', // Foreign field in the users collection
                    as: 'ownerDetails', // Name of the field to hold the result
                },
            };
        } else if (groupBy === 'project') {
            groupByField = '$project';
            lookupStage = {
                $lookup: {
                    from: 'projects', // The name of the collection storing projects
                    localField: 'project', // Field in task model
                    foreignField: '_id', // Foreign field in the projects collection
                    as: 'projectDetails', // Name of the field to hold the result
                },
            };
        } else {
            groupByField = '$team';
            lookupStage = {
                $lookup: {
                    from: 'teams', // The name of the collection storing teams
                    localField: 'team', // Field in task model
                    foreignField: '_id', // Foreign field in the teams collection
                    as: 'teamDetails', // Name of the field to hold the result
                },
            };
        }
        
        const pipeline = [
            { $match: { status: "Completed" } },
            lookupStage, // Perform lookup based on the groupBy value
            {
                $unwind: {
                    path: `$${groupBy}Details`, // Unwind to get the details from the lookup
                    preserveNullAndEmptyArrays: true, // If no match, don't remove the task
                },
            },
            {
                $group: {
                    _id: `$${groupBy}Details.name`, // Group by the 'name' field from the lookup result
                    closedTasksCount: { $sum: 1 },
                },
            },
            // This is the important part where we rename _id to name
            {
                $project: {
                    [groupBy]: '$_id', // Rename _id to name
                    closedTasksCount: 1, // Keep the closedTasksCount field
                    _id: 0, // Remove the _id field from the result
                },
            },
        ];
        
        // Run the aggregation
        const result = await Task.aggregate(pipeline);
        res.status(200).json(result);
        

    }catch(error){
        res.status(500).json({error:`something wrong in fetching closed tasks ${error.message}`,})
    }
}