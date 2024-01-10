import {config} from './config.js'
import rbmApiHelper from '@google/rcsbusinessmessaging'
import privateKey from './rbm-credentials.json' assert {type: 'json'};

rbmApiHelper.initRbmApi(privateKey);
rbmApiHelper.setAgentId(config.agentId);

export async function sendCarousel(cartData) {
    let cardContents = []

    let card2Image = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA4L3Jhd3BpeGVsX29mZmljZV8yNV9waG90b19vZl93aGl0ZV9tYWxlX3RzaGlydF9tb2NrdXBfd2hpdGVfdHNoaV85YjNmOWZjZS03MTZkLTQxYmUtODkzZS05MzkwZWY1NmZiZmFfMi5qcGc.jpg';

    for (let i = 0; i < cartData.length; ++i) {
        let item = cartData[i]
        cardContents.push(
            {
                title: item.name,
                description: `Priced at $${item.price}`,
                suggestions: [
                    {
                        action: {
                            text: item.cartUrl,
                            postbackData: `card_${i}`,
                            openUrlAction: {
                                url: item.cartUrl
                            }
                        }
                    }
                ],
                media: {
                    height: 'MEDIUM',
                    contentInfo: {
                        fileUrl: card2Image,
                        forceRefresh: false,
                    },
                },
            }
        )
    }

    // Definition of carousel card
    let params = {
        msisdn: config.phoneNumber,
        cardContents: cardContents,
    };

    // Send the device the carousel card defined above
    rbmApiHelper.sendCarouselCard(params, function (response) {
        console.log(response);
    });
}
