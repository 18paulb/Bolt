// Reference to RBM API helper
import rbmApiHelper from '@google/rcsbusinessmessaging'
import privateKey from './rbm-credentials.json' assert { type: 'json' };
import {config} from "./config.js";
rbmApiHelper.initRbmApi(privateKey);
rbmApiHelper.setAgentId(config.agentId);

// Send a capability check to the device
export async function checkCompatibility(phoneNumber) {
    await rbmApiHelper.checkCapability(phoneNumber, function (response) {
         return response.status === 200
    });
}
