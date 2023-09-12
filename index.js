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
const axios = require('axios');

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
const discordWebHookUrl = config.server.discordWebHookUrl || ''
const address = config.rest.address || '192.168.1.128';
const port = config.rest.port || 9990;
const password = config.rest.password || "ChangeMe";
const debug = config.rest.debug || false;

const watchAndEmitLastLine = (socket, dirs, webhook) => {
    dirs.forEach(dir => {
        fs.watch(dir, (eventType, filename) => {
            if (debug) {
                console.log(`Event ${eventType} on file ${filename}`);
            }
            if (eventType === 'change') {
                readLastLines.read(dir, 1).then((line) => {
                    const parsedLog = parser.parseSingle(line);
                    if (socket) {
                        socket.emit('newLog', parsedLog);
                    } else if (webhook){
                        sendDiscord(parsedLog, ).then(r => ()=>{});
                    }
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
async function sendDiscord(message) {
    if (discordWebHookUrl) {
        const webhookUrl = discordWebHookUrl;
        let color;
        let embed;
        if (!message || !message.eventType){
            return;
        }
        if (message.eventType == "rf rid inhibit" || message.eventType == "rf rid uninhibit"){
            color = "15548997"
        } else if(message.eventType == "NET voice transmission" || message.eventType == "RF voice transmission"){
            color = "1752220"
        } else {
            color = "3447003"
        }
        if (message.srcId && message.dstId) {
             embed = {
                title: 'Centrunk Last Heard',
                // description: message.toString(),
                color: color,
                timestamp: message.timestamp,
                fields: [
                    {
                        name: "SRC ID",
                        value: message.srcId
                    },
                    {
                        name: "DST ID",
                        value: message.dstId
                    },
                    {
                        name: "Event",
                        value: message.eventType
                    }
                ]
            };
        } else if (message.BER && message.duration){
            embed = {
                title: 'Centrunk Last Heard',
                // description: message.toString(),
                color: color,
                timestamp: message.timestamp,
                fields: [
                    {
                        name: "BER",
                        value: message.BER
                    },
                    {
                        name: "Duration",
                        value: message.duration
                    },
                    {
                        name: "Event",
                        value: message.eventType
                    }
                ]
            };
        }

        const data = {
            embeds: [embed]
        };

        try {
            const response = await axios.post(webhookUrl, data);
            if (debug) {
                console.log('Webhook sent successfully:', response);
            }
        } catch (error) {
            console.log(discordWebHookUrl)
            console.error('Error sending webhook:', error.message);
        }
    }
}
async function main() {
    watchAndEmitLastLine(false, logFiles, true);
    /*
     *  Routes
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