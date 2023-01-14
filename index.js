require('./config/database').connect();
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(cors());


const os = require("os");
const {networkInterfaces } = require("os");
const nets = networkInterfaces(); 
//const ip_add = nets['Ethernet'][1]['address'];
const sftpClient = new Client();
const Performance = require('./model/performance')
const Steamming = require('./model/streaming')
const DeviceReadIO = require('./model/deviceIORead')

app.use(cors());
app.use(express.json());
/*
function sftpDownloadFile()
{
    sftpClient.connect({
        host: '192.168.48.128',
        port: '22',
        username:'ur',
        password:'easybot'
    }).then(()=>{
        return sftpClient.get(pathLog,logHistory);
    }).then((data)=>{
        console.log(data,);
        ReadDataLog();
        sftpClient.end();
    }).then((err)=>{
        console.log(err);
        ReadDataLog();
    });
}*/

// Global Variable //
let listHistory = [];
let listTimeLog = [];

function ReadDataLog(){
    fs.readFile('log_history.txt', 'utf8', (err, data) => {

        listHistory.length = 0;
        listTimeLog.length = 0;
        if (err) {
          console.error(err);
          return;
        }
        let allLog = data.split('\n');
        let date = [];
        let log = [];
        allLog.forEach((item) => {
            if(item.split("::").length == 10)
            {
                log.push(item);
            }else if(item.length == 50){
                date.push(item.split("(")[1].split(" ")[0])
                date = [...new Set(date)] 
            }
        });
        date.forEach((element,index) => {
            let _date = {
                "text":element,
                "value":index
            }
            listTimeLog.push(_date);
        });

        date.forEach(item1 => {
            log.forEach(item2 => {   
            if(new Date(item2.split('::')[2].split(" ")[1]).getTime() == new Date(item1).getTime())
            {
                let _arrset = {
                    "date":item1,
                    "data":item2
                }
                listHistory.push(_arrset);
            }else{return;}
        });
        });
      });
    }

app.get("/performance",async(req,res)=>{
    const names = "ur10e";
    const _performance = await Performance.findOne({names});
    res.status(200).json(_performance);
});

app.put("/steaming",async(req,res)=>{
    let findSelect = req.body;
    const _steamming = await Steamming.find().select(findSelect)
    res.status(200).json(_steamming);
    //console.log(findSelect);
});

app.get("/readdevice",async(req,res)=>{
    const names = "ur10e";
    const _deviceIORead = await DeviceReadIO.findOne({names});
    res.status(200).json(_deviceIORead);
});

app.put("/monitorreq",(req,res)=>{
    
    let _date = req.body.index;
    let _content = req.body.content;
    let _historyRetrun = [];

    console.log(_date);
    console.log(_content);
    listHistory.forEach(element => {
        if(new Date(_date).getTime() == new Date(element.split('::')[2].split(" ")[1]).getTime()){
            let logSplit = element.split("::");
            let err_source = "";
            console.log(true);
/*
            switch (parseInt(logSplit[3].split(" ")[1])) {
                case -5:
                    err_source = "Polyscope";
                    break;
                case -3:
                    err_source = "RTMachine";
                    break;
                case -2:
                    err_source = "RobotInterface";
                    break;
                case 8:
                    err_source = "RTDE";
                    break;
                case 20:
                    err_source = "Safrty A";
                    break;
                case 30:
                    err_source = "Safety B";
                    break;
                case 108:
                    err_source = "108 = TEACH_PENDANT_A";
                    break;
                case 100:
                    err_source = "JOINT_0_FPGA";
                    break;
                case 101:
                    err_source = "JOINT_1_FPGA";
                    break;
                case 102:
                    err_source = "JOINT_2_FPGA";
                    break;
                case 103:
                    err_source = "JOINT_3_FPGA";
                    break;
                case 104:
                    err_source = "JOINT_4_FPGA";
                    break;
                case 105:
                    err_source = "JOINT_5_FPGA";
                    break;
                case 110:
                    err_source = "Polyscope";
                    break;
                case 110:
                    err_source = "JOINT_0_A";
                    break;
                case 111:
                    err_source = "JOINT_1_A";
                    break;
                case 112:
                    err_source = "JOINT_2_A";
                    break;
                case 113:
                    err_source = "JOINT_3_A";
                    break;
                case 114:
                    err_source = "JOINT_4_A";
                    break;
                case 115:
                    err_source = "JOINT_5_A";
                    break;
                case 118:
                    err_source = "EACH_PENDANT_B";
                    break;
                case 120:
                    err_source = "JOINT_0_B";
                    break;
                case 121:
                    err_source = "JOINT_1_B";
                    break;
                case 122:
                    err_source = "JOINT_2_B";
                    break;
                case 123:
                    err_source = "JOINT_3_B";
                    break;
                case 124:
                    err_source = "JOINT_5_B";
                    break;
                case 125:
                    err_source = "JOINT_5_B";
                    break;
                default:
                    err_source = "Null";
                break;
            }
            let response = {
                "DateTime" : logSplit[2],
                "ER_Source" : err_source,
                "ER_Code" : logSplit[4],
                "ER_Category" : logSplit[6],
                "descript" : logSplit[7]
            }
            if(_content[0]==true){
                _historyRetrun.push(response);
                return;
            }else if(_content[1]==true){
                _historyRetrun.push(response);
                return;
            }else if(_content[2]==true){
                _historyRetrun.push(response);
                return;
            }else if(_content[3]==true){
                _historyRetrun.push(response);
                return;
            }else{return;}
            */
        }else{console.log(false);return;}
    });

    res.json(_historyRetrun);
    //console.log(_Date);

});

app.put("/loghistory",(req,res)=>{
    let AllResponse =[];
    let Log_info = [];
    let Log_warning = [];
    let Log_error = [];
    let Log_devmess = [];

    for (let index = req.body.Index; index < req.body.endIndex; index++) 
    {
        let logSplit = allLog[index].split("::");
        let err_source = "";

        //console.log(parseInt(logSplit[6].split(" ")[1]));
        switch (parseInt(logSplit[3].split(" ")[1])) {
            case -5:
                err_source = "Polyscope";
                break;
            case -3:
                err_source = "RTMachine";
                break;
            case -2:
                err_source = "RobotInterface";
                break;
            case 8:
                err_source = "RTDE";
                break;
            case 20:
                err_source = "Safrty A";
                break;
            case 30:
                err_source = "Safety B";
                break;
            case 108:
                err_source = "108 = TEACH_PENDANT_A";
                break;
            case 100:
                err_source = "JOINT_0_FPGA";
                break;
            case 101:
                err_source = "JOINT_1_FPGA";
                break;
            case 102:
                err_source = "JOINT_2_FPGA";
                break;
            case 103:
                err_source = "JOINT_3_FPGA";
                break;
            case 104:
                err_source = "JOINT_4_FPGA";
                break;
            case 105:
                err_source = "JOINT_5_FPGA";
                break;
            case 110:
                err_source = "Polyscope";
                break;
            case 110:
                err_source = "JOINT_0_A";
                break;
            case 111:
                err_source = "JOINT_1_A";
                break;
            case 112:
                err_source = "JOINT_2_A";
                break;
            case 113:
                err_source = "JOINT_3_A";
                break;
            case 114:
                err_source = "JOINT_4_A";
                break;
            case 115:
                err_source = "JOINT_5_A";
                break;
            case 118:
                err_source = "EACH_PENDANT_B";
                break;
            case 120:
                err_source = "JOINT_0_B";
                break;
            case 121:
                err_source = "JOINT_1_B";
                break;
            case 122:
                err_source = "JOINT_2_B";
                break;
            case 123:
                err_source = "JOINT_3_B";
                break;
            case 124:
                err_source = "JOINT_5_B";
                break;
            case 125:
                err_source = "JOINT_5_B";
                break;
            default:
                err_source = "Null";
            break;
        }
        let response = {
            "DateTime" : logSplit[2],
            "ER_Source" : err_source,
            "ER_Code" : logSplit[4],
            "ER_Category" : logSplit[6],
            "descript" : logSplit[7]
        }
        //loger.push(response);
        switch (parseInt(logSplit[6].split(" ")[1])) {
            case 1:
                Log_info.push(response);
            break;
            case 2:
                Log_warning.push(response);
            break;
            case 3:
                Log_error.push(response);
            break;
            case 128:
                Log_devmess.push(response);
            break;
            case 129:
                Log_devmess.push(response);
            break;
            case 130:
                Log_devmess.push(response);
            break;
            case 131:
                Log_devmess.push(response);
            break;
        }
        AllResponse = {
            "info" : Log_info,
            "warning" : Log_warning,
            "error" : Log_error,
            "develop_message" : Log_devmess
        }
    }
    res.json(AllResponse);
});

app.get("/logtime", (req, res) => {

       ReadDataLog();
       res.json(listTimeLog);
   });

const port = process.env.PORT || 3000;
const hostName = os.hostname();
app.listen(port,()=>{
    console.log('Connect to server...')
    //console.log('\t'+ip_add+':'+ port);
    console.log('\t'+hostName+':'+ port);
    console.log('---------------------------');
    ReadDataLog();
});