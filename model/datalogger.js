const mongoose = require('mongoose');

const dateloggerSchema = new mongoose.Schema({
    DateTime:{type:Date},
    name:{type:String},
    speed_scaling:{type:Number},
    act_m_vol : {type: Number},
    act_r_vol : {type:Number},
    act_r_cur:{type:Number},
    act_r_pow:{type:Number},
    actual_current : [{type: Number}],
    actual_q : [{type: Number}],
    actual_qd:[{type: Number}],
    target_current:[{type: Number}],
    target_q:[{type: Number}],
    target_qd:[{type: Number}],
    target_qdd:[{type: Number}],
    joint_temperatures:[{type: Number}],
    target_moment:[{type: Number}],
    joint_control_output:[{type: Number}],
    robot_status:{type:String},
    safety_status:{type:String}
})

module.exports = mongoose.model('performance',dateloggerSchema);