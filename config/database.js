const mongoose = require('mongoose');
const urlDB = "mongodb://localhost:27017/MachinePerformance"
exports.connect = () =>{
    mongoose.connect(urlDB,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    })
    .then(()=>{
        
        console.log("Successfully connected to database");
    })
    .catch((error)=>{
        console.log("Error connecting to database")
        console.error(error);
        process.exit(1)
    });
}