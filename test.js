const dbConnect = require('./config/database')
const Steamming = require('./model/streaming')

const express = require('express');
const app = express();
const cors = require('cors')
const os = require("os");
const {networkInterfaces } = require("os");
const nets = networkInterfaces(); 
const ip_add = nets['Ethernet'][1]['address'];

app.use(cors());
app.use(express.json());


dbConnect.connect();
let _apiProp = {};
const actual = 'actual_q';
const target = 'target_q';

_apiProp = {..._apiProp,[actual]:1,[target]:1};



//async function asyncCall() {
//    const _steamming = await Steamming.find().select(_apiProp);
//    console.log(_steamming);
//}

app.put("/steaming",async(req,res)=>{
    
    let _apiProp = {};
    const actual = 'target_qd';
    const target = 'target_qd';

_apiProp = {..._apiProp,[actual]:1,[target]:1};
    const _steamming = await Steamming.find().select(_apiProp)
    res.status(200).json(_steamming);
    console.log(req.body);
});

app.get("/hello",async(req,res)=>{

    const data = 'Hello World';
    res.status(200).send(data);

});



const port = process.env.PORT || 3000;
const hostName = os.hostname();
app.listen(port,()=>{
    console.log('Connect to server...')
    console.log('\t'+ip_add+':'+ port);
    console.log('\t'+hostName+':'+ port);
    console.log('---------------------------');
});