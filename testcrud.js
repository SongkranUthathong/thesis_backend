const mongoose = require('mongoose');
const urlDB = "mongodb://localhost:27017/ur5e"


async function ReadData(){
    const u5_Schema = new mongoose.Schema({
        name:{String},
        joint_q : [Number],
        joint_tmp : [Number],
        joint_amp:[Number]
    });
        // หลังจากสร้าง Schema ของข้อมูลเสร็จสิ้น ใหทำการใช้คำสั่ง mongose.model เพื่อที่จะทำการ Query ข้อมูลกับ Document ที่เราสนใจ
    const ur5e = mongoose.model("robot_analysis1",u5_Schema);

    const result = await ur5e.find();
    console.log(result[0]);
}



mongoose.connect(urlDB,{
    useNewUrlParser: true,
    useUnifiedTopology:true
})
.then(()=>{
    
    console.log("Successfully connected to database");
    ReadData();
})
.catch((error)=>{
    console.log("Error connecting to database")
    console.error(error);
    process.exit(1)
});



