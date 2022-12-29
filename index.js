require('./config/database').connect();
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors')


const os = require("os");
const {networkInterfaces } = require("os");
const nets = networkInterfaces(); 
const ip_add = nets['Ethernet'][1]['address'];

const Performance = require('./model/performance')
const Steamming = require('./model/streaming')



app.use(cors());
app.use(express.json());

// Global Variable //
let allLog = [];
let LogTime = [];

/*function sftpDownloadFile()
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
    });
}*/

function ReadDataLog(){
    let LogStIndex = 0;
    let LogEndIndex = 0;
    let numberID = 0;
    let descriptData = [];
    let stateOfDesc = false;

    fs.readFile('log_history.txt', 'utf8', (err, data) => {
        
        if (err) {
          console.error(err);
          return;
        }
        allLog = data.split('\n');
        allLog.forEach((element,index) => {
            if(element.length > 50 && stateOfDesc == false){
                stateOfDesc = true;
                LogStIndex = index;
                
            }else if((element.length == 48 || element.length == 50) && stateOfDesc == true){
                LogEndIndex = index-1;
                let dataScript = {
                    "StartIndex" : LogStIndex,
                    "StopIndex"  :LogEndIndex
                }
                stateOfDesc = false;
                descriptData.push(dataScript);
            }
            else if(index == (allLog.length-1)){
                LogEndIndex = index-1;
                let dataScript = {
                    "StartIndex" : LogStIndex,
                    "StopIndex"  :LogEndIndex
                }
                stateOfDesc = false;
                descriptData.push(dataScript);
            }
        });
        //console.log(descriptData);
        //console.log(descriptData.length);
        descriptData.forEach((element,index) =>{
            if(allLog[element.StartIndex-2].length == 50 && allLog[element.StopIndex+1].length == 48){
                let log =
                {
                    "startLog" : allLog[element.StartIndex-2],
                    "Index" : element.StartIndex,
                    "endIndex" : element.StopIndex,
                    "id" : numberID
                }
                numberID = numberID + 1;
                LogTime.push(log);
            }else if(allLog[element.StartIndex-2].length == 50 && allLog[element.StopIndex+1].length == 50){
                let log =
                {
                    "startLog" : allLog[element.StartIndex-2],
                    "Index" : element.StartIndex,
                    "endIndex" : element.StopIndex,
                    "id" : numberID
                }
                numberID = numberID + 1;
                LogTime.push(log);
            }else if(allLog[element.StartIndex-2].length == 48 && allLog[element.StopIndex+1].length == 48){
                let log =
                {
                    "startLog" : LogTime[LogTime.length-1].startLog,
                    "Index" : element.StartIndex,
                    "endIndex" : element.StopIndex,
                    "id" : numberID
                }
                numberID = numberID + 1;
                LogTime.push(log);
            }else if(allLog[element.StartIndex-2].length == 50 && element.StopIndex+2 == allLog.length ){
                let log =
                {
                    "startLog" : allLog[element.StartIndex-2],
                    "Index" : element.StartIndex,
                    "endIndex" : element.StopIndex,
                    "id" : numberID
                }
                numberID = numberID + 1;
                LogTime.push(log);
            }
        });
        //console.log(LogTime);
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

app.put("/datalogger",async(req,res)=>{
    let findSelect = req.body;
    let loger = []
    for (let index = findSelect.index+2; index < findSelect.endindex; index++) 
    {
        let response = {
            "descript" : allLog[index]
        }
        loger.push(response);
    }
    res.status(200).json(loger);
});

const port = process.env.PORT || 3000;
const hostName = os.hostname();
app.listen(port,()=>{
    console.log('Connect to server...')
    ReadDataLog();
    console.log('\t'+ip_add+':'+ port);
    console.log('\t'+hostName+':'+ port);
    console.log('---------------------------');
});


