/* eslint-disable no-console */
var myArgs = process.argv.slice(1);
require('dotenv').config();

const qaseProject = myArgs[1];

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { exit } = require('process');

var today = new Date();
var todayDate = today.toISOString().slice(0, 10);
var time = today.toLocaleTimeString('it-IT');

const directoryPath = path.join(`mochawesome-report/`);
const headerValue = {
	'Token': process.env.QASE_IO_TOKEN,
	'accept': 'application/json',
	'content-type': 'application/json'
};

let files = fs.readdirSync(directoryPath).filter(fn => fn.endsWith('.json'));
if (!files) {
	console.log('Failed! - There is no .json file');
	exit;
}

// Get report summary from mochawesome and distribute to function that need it
const getReport = async function () {
	try {
		const data = await fs.promises.readFile(directoryPath + files[0], { encoding: 'utf-8' });
		let mochaData = JSON.parse(data);
		let detailResults = mochaData.results[0];
		return detailResults;
	} catch (err) {
		console.log('Failed! - There is no Mochawesome file ' + err);
	}
};

// Create new 'test run' every automation api services session finished
const createTestRun = async function () {
	try {
		const response = await axios.post(`${process.env.QASE_API}/v1/run/${qaseProject}`, {
			title: `[AUTOMATION] ${todayDate}-${time}`
		}, {
			headers: headerValue
		});

		return response.data.result.id;
	} catch (error) {
		console.error(error.message);
	}
};

// Update test run into public
const publicTestRun = async function (testRunId) {
	try {
		const response = await axios.patch(`${process.env.QASE_API}/v1/run/${qaseProject}/${testRunId}/public`, {
			status: true
		}, {
			headers: headerValue
		});

		return response.data.result.url;
	} catch (error) {
		console.error(error.message);
	}
};

// Update test run status to Complete
const completeTestRun = async function (testRunId) {
	try {
		await axios.post(`${process.env.QASE_API}/v1/run/${qaseProject}/${testRunId}/complete`, {
			status: true
		}, {
			headers: headerValue
		});
	} catch (error) {
		console.error(error.message);
	}
};

// Update 'test run status' become Passed/Failed of each cases [Failed, Passed]
const updateCaseRunStatus = async function (testRunId, report) {
	let counter = 0;
	console.log('Executing Test Run, please wait the result...');
	for (var i = 0; i < report.suites.length; i++) {
		// for (var j = 0; j < report.suites[i].suites.length; j++) {
			for (var k = 0; k < report.suites[i].tests.length; k++) {
				var splitTitle = report.suites[i].tests[k].title.split(' ');
				var splitqaseId = splitTitle[0].split('-');
				try {
					const response = await axios.post(`${process.env.QASE_API}/v1/result/${splitqaseId[0]}/${testRunId}`, {
						'status': report.suites[i].tests[k].state,
						'case_id': splitqaseId[1]
					}, {
						headers: headerValue
					});
					counter += (response.data.status == true) ? 1 : 0;
				} catch (error) {
					console.error(`Update test run ${splitTitle[0]} status failed, ${error}`);
				}
			}
		// }
	}
	console.log(`${counter} test cases successfully executed`);
};

// Update 'automation status' become Automated of each cases [Not Automated, To be Automated, Automated]
const updateCaseStatus = async function (report) {
	let counter = 0;
	console.log('Updating Test Cases, please wait the result...');
	for (var i = 0; i < report.suites.length; i++) {
		// for (var j = 0; j < report.suites[i].suites.length; j++) {
			for (var k = 0; k < report.suites[i].tests.length; k++) {
				var splitTitle = report.suites[i].tests[k].title.split(' ');
				var splitqaseId = splitTitle[0].split('-');
				try {
					const response = await axios.patch(`${process.env.QASE_API}/v1/case/${splitqaseId[0]}/${splitqaseId[1]}`, {
						automation: 2
					}, {
						headers: headerValue
					});
					counter += (response.data.status == true) ? 1 : 0;
				} catch (error) {
					console.error(`Update test case status failed, ${error}`);
				}
			}
		// }
	}
	console.log(`${counter} test cases successfully updated to Automated`);
};

// Calculate and compare automated cases with cases in Qase.io
const testCaseCoverage = async function (report, testRunURL) {
	let reportCounter = 0;
	let qaseCounter = 0;

	for (var i = 0; i < report.suites.length; i++) {
		// for (var j = 0; j < report.suites[i].suites.length; j++) {
			for (var k = 0; k < report.suites[i].tests.length; k++) {
				reportCounter++;
			}
		// }
	}

	try {
		const response = await axios.get(`${process.env.QASE_API}/v1/case/${qaseProject}`, {
			params: {
				limit: 100,
				offset: 0
			},
			headers: headerValue
		});
		qaseCounter = response.data.result.entities.length;
	} catch (error) {
		console.error(error.message);
	}

	let tcCoverage = Number((reportCounter / qaseCounter) * 100);

	let coverage = {
		'automatedCases': reportCounter,
		'qaseIOCases': qaseCounter,
		'tcCoverage': tcCoverage,
		'testRunURL': testRunURL
	};

	_pushNotificationMattermost(coverage);
	console.log(`Test case coverage : ${tcCoverage} %`);
};

// Send Qase.io coverage to Mattermost
const _pushNotificationMattermost = async function (coverage) {
	// let lastCommit = [];
	// const headers = {
	// 	'X-GitHub-Api-Version': '2022-11-28',
	// 	Authorization: `token ${process.env.GITHUB_TOKEN}`
	// };
	// const url = [
	// 	`https://api.github.com/repos/ralali/${repo}/branches/development`,
	// 	'https://api.github.com/repos/ralali/rll-automation-api/branches/master'
	// ];
	// try {
	// 	for (let i = 0; i < 2; i++) {
	// 		const response = await axios.get(url[i], { headers });
	// 		lastCommit.push(response.data.commit.html_url);
	// 	}
	// } catch (error) {
	// 	console.error(`Error: ${error.response.statusText}`);
	// }

	let message = `Qase.io Test case coverage\n<!channel>\nTest case coverage: ${coverage.tcCoverage}%\nAutomated Cases: ${coverage.automatedCases} cases\nQase.io Cases: ${coverage.qaseIOCases} cases\nTest Run URL: <${coverage.testRunURL}|Qase.io Public Test Run Result>`;
	const notifPayload = {
		'username': 'at-api-notifications',
		'icon_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrvVqEapXsm3wyIBCj0j6GwUMwEpsUElyGSA&s',
		'text': message
	};
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

// Sequentional run
const mainIntegration = async function () {
	await getReport().then(function (reportResult) {
		createTestRun().then(function (testRunId) {
			updateCaseRunStatus(testRunId, reportResult).then(function () {
				publicTestRun(testRunId).then(function (testRunURL) {
					testCaseCoverage(reportResult, testRunURL);
					completeTestRun(testRunId);
				});
			});
		});
		updateCaseStatus(reportResult);
	});
};

mainIntegration();
