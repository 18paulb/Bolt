// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the License);
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an AS IS BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

import util from 'util'
import {config} from './config.js'
import rbmApiHelper from '@google/rcsbusinessmessaging'
import privateKey from './rbm-credentials.json' assert {type: 'json'};


rbmApiHelper.initRbmApi(privateKey);
rbmApiHelper.setAgentId(config.agentId);

export function sendReviewTemplate(reviewTemplate, phoneNumber) {

    let suggestions = []

    for (let i = 0; i < reviewTemplate.suggestedResponses.length; ++i) {
        suggestions.push({
            reply: {
                'text': reviewTemplate.suggestedResponses[i],
                'postbackData': 'REVIEW_ANSWER_' + i
            },
        })
    }

    const params = {
        messageText: reviewTemplate.messageText,
        messageDescription: reviewTemplate.messageDescription,
        msisdn: phoneNumber,
        suggestions: suggestions,
        imageUrl: reviewTemplate.imageUrl,
        height: 'MEDIUM'
    }

    // Send the card to the device
    // TODO: Consider wrapping a promise so that the callback function is waited upon until we can tell if it was successful or not
    rbmApiHelper.sendRichCard(params, function (response, err) {
            if (err !== undefined) {
                // console.log(
                //     util.inspect(err, {showHidden: false, depth: null, colors: true}));
                throw new Error(err.response.data.error.message)
            }
            if (response !== undefined) {
                console.log(
                    util.inspect(response, {showHidden: false, depth: null, colors: true}));
            }
        }
    );
}
