/*
* Caleb, KO4UYJ
* DVMHost web interface
* Some lingo is directly from https://github.com/DVMProject/dvmhost/blob/master/src/remote/RESTClient.cpp
*/
const axios = require('axios');
const crypto = require('crypto');

class RESTClient {
    constructor() {
        this.debug = false;
    }

    async send(address, port, password, method, endpoint, payload, debug = false) {
        if (!address) {
            throw new Error("ERRNO_NO_ADDRESS");
        }
        if (port <= 0) {
            throw new Error("ERRNO_NO_PORT");
        }
        if (!password) {
            throw new Error("ERRNO_NO_PASSWORD");
        }

        this.debug = debug;
        const baseURL = `http://${address}:${port}`;

        try {
            const hash = crypto.createHash('sha256').update(password).digest('hex');

            const authResponse = await axios({
                method: 'PUT',
                url: `${baseURL}/auth`,
                data: {
                    auth: hash
                }
            });

            const { status, token } = authResponse.data;
            if (status !== 200 || !token) {
                throw new Error(`ERRNO_BAD_AUTH_RESPONSE. Server said: ${JSON.stringify(authResponse.data)}`);
            }

            // Send the actual API request with the token
            const apiResponse = await axios({
                method,
                url: `${baseURL}${endpoint}`,
                headers: {
                    'X-DVM-Auth-Token': token
                },
                data: payload
            });

            if (this.debug) {
                console.log(`REST Response: ${JSON.stringify(apiResponse.data)}`);
            }

            return apiResponse.data;

        } catch (error) {
            console.error("Error:", error.message);
            throw new Error("ERRNO_INTERNAL_ERROR");
        }
    }
}

module.exports = RESTClient;
