import axios from "axios";
import initializeDb from "../db.js";
import Project from "../models/project.models.js";
import Tag from "../models/tag.models.js";
import Team from "../models/team.models.js";
import User from "../models/user.models.js";


initializeDb();

const projectData = [
    { "name": "E-Commerce Platform", "description": "An online platform for selling products" },
    { "name": "Task Management App", "description": "A tool for managing tasks and projects" },
    { "name": "Weather Tracker", "description": "An app to track real-time weather data" },
    { "name": "Social Media App", "description": "A platform for connecting with friends and sharing updates" },
    { "name": "Fitness Tracker", "description": "An app to monitor and record fitness activities" },
    { "name": "Blogging Platform", "description": "A CMS for bloggers to create and manage content" },
    { "name": "Expense Tracker", "description": "An app to manage personal or business expenses" }
  ]
  
const tagData = [
    { "name": "frontend" },
    { "name": "backend" },
    { "name": "urgent" },
    { "name": "low-priority" },
    { "name": "bug" },
    { "name": "feature" },
    { "name": "documentation" },
    { "name": "testing" },
    { "name": "design" },
    { "name": "research" }
  ]

const teamData = [
    { "name": "Frontend Developers", "description": "Handles UI/UX design and development" },
    { "name": "Backend Engineers", "description": "Responsible for server-side logic and APIs" },
    { "name": "QA Team", "description": "Ensures the quality of deliverables through testing" },
    { "name": "DevOps Team", "description": "Manages deployments and cloud infrastructure" },
    { "name": "Product Team", "description": "Works on requirements and product vision" },
    { "name": "Support Team", "description": "Handles customer issues and provides solutions" },
    { "name": "Mobile App Developers", "description": "Focuses on mobile app development" }
  ]

  
const userData = [
    { "name": "John Doe", "email": "john.doe@example.com", "password": "hashedpassword123" },
    { "name": "Jane Smith", "email": "jane.smith@example.com", "password": "hashedpassword456" },
    { "name": "Alice Johnson", "email": "alice.johnson@example.com", "password": "hashedpassword789" },
    { "name": "Bob Brown", "email": "bob.brown@example.com", "password": "hashedpassword321" },
    { "name": "Charlie White", "email": "charlie.white@example.com", "password": "hashedpassword654" },
    { "name": "Emma Green", "email": "emma.green@example.com", "password": "hashedpassword987" },
    { "name": "Liam Black", "email": "liam.black@example.com", "password": "hashedpassword111" },
    { "name": "Olivia Grey", "email": "olivia.grey@example.com", "password": "hashedpassword222" },
    { "name": "Noah Blue", "email": "noah.blue@example.com", "password": "hashedpassword333" },
    { "name": "Sophia Red", "email": "sophia.red@example.com", "password": "hashedpassword444" }
  ]
  
  
const insertProject = async() => {
    try{
        
        const result = await Project.insertMany(projectData);
        console.log("Inserted projects data", result)
       
    }catch(error){
        console.log(`error inserting project data`,error)
    }
}

const insertTag = async() => {
    try{
        const result = await Tag.insertMany(tagData);
        console.log("tag data",result) 
    }catch(error){
        console.log(`error inserting  data`,error)
    }
}

const insertTeam = async () => {
    try{
        const result = await Team.insertMany(teamData);
        console.log("team data",result) 
    }catch(error){
        console.log(`error inserting  data`,error)
    }
}

const insertUser = async() => {
    try{
        const result = await Promise.all(
            userData.map((user)=>{
                axios.post('http://localhost:3000/api/auth/signup',
                    {name:user.name,email:user.email,password:user.password})
            })
        )
        console.log("inserted all users")
    }catch(error){
        console.log(`error inserting user data`,error)
    }
}

// insertProject();
// insertTag();
// insertTeam();

// insertUser();

