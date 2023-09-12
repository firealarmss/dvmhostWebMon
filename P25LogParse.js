/*
* Caleb, KO4UYJ
* DVMHost web interface
*/
class P25LogParse {
    parseMultiple(logs) {
        const logLines = logs.trim().split('\n');
        const results = logLines.map(this.parseSingle.bind(this)).filter(Boolean);
        return results;
    }

    parseSingle(log) {
        let regex, match;
        /*
         * Gotta give google credit for the regex. i aint that good
         */
        // RF voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF RF voice transmission from (\d+) to TG (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'RF voice transmission'
            };
        }

        // RF End voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF RF end of transmission, (\d+\.\d+) seconds, (\d+)% packet loss/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                duration: match[2],
                packetLoss: match[3],
                eventType: 'end of transmission'
            };
        }

        // NET voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?Net network voice transmission from (\d+) to TG (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'NET voice transmission'
            };
        }

        // End of Transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?Net network end of transmission, (\d+\.\d+) seconds, (\d+)% packet loss/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                duration: match[2],
                packetLoss: match[3],
                eventType: 'end of transmission'
            };
        }

        // RF group affiliation request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF group affiliation request from (\d+) to TG\s+(\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'RF group affiliation'
            };
        }
        // RF group grant request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF group grant request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'RF Grp Grant Request'
            };
        }
        // call alert request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?call alert request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'call alert'
            };
        }

        // RF ack response
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?ack response from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'ack response'
            };
        }
        // RF call alert request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF call alert request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'call alert request'
            };
        }

        // RF unit deregistration request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF unit deregistration request from (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                eventType: 'unit deregistration'
            };
        }

        // RF unit registration request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF unit registration request from (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                eventType: 'unit registration'
            };
        }

        // RF radio inhibit
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF radio inhibit request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'rf rid inhibit'
            };
        }
        // RF radio inhibit response
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF radio inhibit response from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'rf rid inhibit response'
            };
        }
        // RF radio uninhibit
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF radio uninhibit request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'rf rid uninhibit'
            };
        }

        // RF radio uninhibit response
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF radio uninhibit response from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'rf rid uninhibit response'
            };
        }

        return null;
    }
}

module.exports = P25LogParse;