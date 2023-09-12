/*
* Caleb, KO4UYJ
* DVMHost web interface
*/
const RESTClient = require('./RESTClient');
const P25LogParse = require('./P25LogParse');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ejs = require('ejs');
const yaml = require("js-yaml");
const fs = require('fs');
const readLastLines = require('read-last-lines');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const client = new RESTClient();
const parser = new P25LogParse();

app.set('view engine', 'ejs');

const configFilePathIndex = process.argv.indexOf('-c');
if (configFilePathIndex === -1 || process.argv.length <= configFilePathIndex + 1) {
    console.error('Please provide the path to the configuration file using -c argument.');
    process.exit(1);
}

const configFilePath = process.argv[configFilePathIndex + 1];

const configFile = fs.readFileSync(configFilePath, 'utf8');
const config = yaml.load(configFile);

const httpPort = config.server.httpBindPort || 3000;
const logFiles = config.server.logFiles || ['log.activity.log'];
const rconEnable = config.server.enableRcon || true;
const address = config.rest.address || '192.168.1.128';
const port = config.rest.port || 9990;
const password = config.rest.password || "ChangeMe";
const debug = config.rest.debug || false;

const watchAndEmitLastLine = (socket, dirs) => {
    dirs.forEach(dir => {
        fs.watch(dir, (eventType, filename) => {
            if (debug) {
                console.log(`Event ${eventType} on file ${filename}`);
            }
            if (eventType === 'change') {
                readLastLines.read(dir, 1).then((line) => {
                    const parsedLog = parser.parseSingle(line);
                    socket.emit('newLog', parsedLog);
                }).catch((error) => {
                    console.error("Error reading the last line from", dir, error);
                });
            }
        });
    });
};
async function getAffiliations(){
    const method = 'get';
    const endpoint = '/affs';
    const req = {}
    try {
        const response = await client.send(address, port, password, method, endpoint, req, debug);
        if (response.status === 200){
            return response;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
async function sendCmd(cmd, dstId, srcId){
    if (debug) {
        console.log(`send rmt cmd ${cmd} : ${dstId}`)
    }
    const method = 'PUT';
    const endpoint = '/p25/rid';
    const req = {
        command: cmd,
        dstId: dstId,
        srcId: srcId
    }
    try {
        const response = await client.send(address, port, password, method, endpoint, req, debug);
        if (response.status === 200){
            return response;
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}
async function main() {
 // await sendCmd("page", 9042);
//     const logs = `
// A: 2023-09-12 04:44:27.407 P25 RF ack response from 9035 to 9042
// A: 2023-09-12 04:46:13.649 P25 RF call alert request from 16777212 to 9042
// A: 2023-09-12 04:52:01.683 P25 RF group affiliation request from 9035 to TG  6801
// A: 2023-09-12 04:52:06.712 P25 RF unit deregistration request from 9035
// A: 2023-09-12 04:52:12.896 P25 RF unit registration request from 9035
// A: 2023-09-12 04:52:15.483 P25 RF group affiliation request from 9035 to TG  31611
// `;
//
//     const parsedLogs = parser.parseMultiple(logs);
//     console.log(parsedLogs);
    /*
    *   Routes
    */
    app.get('/', async (req, res) => {
        res.render('activity');
    });
    app.get('/affs', async (req, res) => {
        let response = await getAffiliations();
        if (debug) {
            console.log(response)
        }
        res.render('affiliations', { response });
    });
    app.get('/remote', async (req, res) => {
        if (rconEnable === true) {
            res.render('remote');
        } else {
            res.send("RCON NOT ENABLED BY OWNER");
        }
    });
    /*
    *  Socket listeners
    */
    io.on('connect', (socket)=>{
        watchAndEmitLastLine(socket, logFiles);
        if (rconEnable === true) {
            socket.on("DVM_REMOTE_COMMAND", async (data) => {
                await sendCmd(data.command, parseInt(data.rid));
            });
        }
    });

    setInterval(async ()=>{
        let aff_list = await getAffiliations();
        io.emit("UPDATE_AFF_LIST", aff_list);
        if (debug) {
            console.log("Sending updated aff list")
        }
    },5000);

    server.listen(httpPort, '0.0.0.0',() => {
        console.log(`Server is running on port ${httpPort}`);
    });
}

main().then(r => ()=>{
    console.log(r);
});