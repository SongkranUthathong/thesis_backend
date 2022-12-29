const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
    DateTime:{type:Date},
    name:{type:String},
    act_m_vol : {type: Number},
    act_r_vol : {type:Number},
    act_r_cur:{type:Number},
    act_r_pow:{type:Number},
    time_stamp:{type:Number},
    robot_status:{type:String},
    safety_status:{type:String}
})

module.exports = mongoose.model('performance',performanceSchema);