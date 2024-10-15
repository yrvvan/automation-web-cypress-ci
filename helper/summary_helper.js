const fs = require('fs');
require('dotenv').config();
const util = require('util');
const axios = require('axios');
const readFile = util.promisify(fs.readFile);

const paramBuilder = async function () {
    try {
        const data = await readFile('./mochawesome-report/mochawesome.json', { encoding: 'utf-8' });

        const summary = JSON.parse(data);
        const stats = summary.stats;

        const information = {
            'test_duration': Number(stats.duration / 1000 / 60).toFixed(2),
            'test_success_rate': stats.passPercent,
            'test_passed': stats.passes,
            'test_failed': stats.failures,
            'test_skipped': stats.skipped,
            'total_test_cases': stats.tests
        };
        return information;
    } catch (error) {
        console.log('Failed! - There is no Json file', error);
        throw error; // rethrow the error to be handled elsewhere if needed
    }
}

const _pushNotificationMattermost = async function () {
    let payload = await paramBuilder();
    let message = `<!channel>\nPlatform Name: Cypress - Visit Cypress Example site\nAutomation Type: Automation API\nSuccess Rate: ${payload.test_success_rate}%\nTest Passed: ${payload.test_passed}\nTest Failed: ${payload.test_failed}\nTest Skipped: ${payload.test_skipped}\nTotal test case: ${payload.total_test_cases}\nDuration: ${payload.test_duration} min\n`;
    const notifPayload = {
        'channel': '#notification',
        'icon_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrvVqEapXsm3wyIBCj0j6GwUMwEpsUElyGSA&s',
        'text': message
    }
    const webhookMattermost = process.env.MATTERMOST_WEBHOOK;
    const options = {
        method: 'POST',
        url: webhookMattermost,
        headers: {
            'Content-Type': 'application/json'
        },
        data: notifPayload,
        responseType: 'json'
    };

    axios(options)
        .then(response => {
            console.log(`Successfully - Pushed into Mattermost, ${response.data}.!`);
        })
        .catch(error => {
            console.log(`Failed! - Pushed into Mattermost, ${error.message}.!`);
        });
};

_pushNotificationMattermost();