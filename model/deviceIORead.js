const mongoose = require('mongoose');

const deviceReadSchema = new mongoose.Schema({
    DateTime:{type:Date},
    name:{type:String},
    act_di_bool:[{type:Number}],
    act_do_bool : [{type: Number}],
    act_cofi_bit:[{type:Number}],
    act_cofo_bit : [{type: Number}],
    act_tooli_bit:[{type:Number}],
    act_toolo_bit : [{type: Number}],
    ana_io_type : {type:Number},
    std_ana_i0:{type:Number},
    std_ana_i1:{type:Number},
    std_ana_o0 : {type: Number},
    std_ana_o1 : {type: Number},
    tool_ana_i0:{type: Number},
    tool_ana_i1:{type: Number},
})

module.exports = mongoose.model('devicereadio',deviceReadSchema);