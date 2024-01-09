// Reference to RBM API helper
import rbmApiHelper from '@google/rcsbusinessmessaging'
import privateKey from './rbm-credentials.json' assert { type: 'json' };
import {config} from "./config.js";
rbmApiHelper.initRbmApi(privateKey);
rbmApiHelper.setAgentId(config.agentId);

// Send a capability check to the device
export async function checkBulkCompatibility(phoneNumbers) {
    let result = await rbmApiHelper.getUsers(phoneNumbers, null);
    return result.data.reachableUsers;
}
