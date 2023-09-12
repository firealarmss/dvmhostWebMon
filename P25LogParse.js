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
                eventType: 'RF Voice Transmission'
            };
        }

        //RF RF encrypted voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF RF encrypted voice transmission from (\d+) to TG (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'RF Encrypted Voice Transmission'
            };
        }

        // RF End voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF RF end of transmission, (\d+\.\d+) seconds, BER: (\d+\.\d+)%/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                duration: match[2],
                BER: match[3],
                eventType: 'RF End of Transmission'
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
                eventType: 'NET Voice Transmission'
            };
        }

        // NET encrypted voice transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?Net network encryted voice transmission from (\d+) to TG (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'NET Voice Transmission'
            };
        }

        // NET End of Transmission
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?NET network end of transmission, (\d+\.\d+) seconds, (\d+\.\d+)% packet loss/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                duration: match[2],
                BER: match[3],
                eventType: 'NET End of Transmission'
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
                eventType: 'RF Group Affiliation'
            };
        }
        // RF group grant request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF group grant request from (\d+) to TG (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'RF Group Grant Request'
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
                eventType: 'Call Alert'
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
                eventType: 'ACK Response'
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
                eventType: 'Call Alert Request'
            };
        }

        //RF radio check request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF radio check request from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'Radio Check Request'
            };
        }

        // RF radio check response
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?radio check response from (\d+) to (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                dstId: match[3],
                eventType: 'Radio Check Response'
            };
        }
        // RF unit deregistration request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF unit deregistration request from (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                eventType: 'Unit Deregistration Request'
            };
        }

        // RF unit registration request
        regex = /.*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}).*?RF unit registration request from (\d+)/;
        match = log.match(regex);
        if (match) {
            return {
                timestamp: match[1],
                srcId: match[2],
                eventType: 'Unit Registration Request'
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
                eventType: 'RF Radio Inhibit'
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
                eventType: 'RF Radio Inhibit Response'
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
                eventType: 'RF Radio Uninhibit'
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
                eventType: 'RF Radio Uninhibit Response'
            };
        }

        return null;
    }
}

module.exports = P25LogParse;