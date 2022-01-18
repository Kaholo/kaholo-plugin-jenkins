var jenkins = require('jenkins'); 

function getJenkinsClient(settings){
	return jenkins({ 
		baseUrl: settings.URL,
		headers: {
			Authorization: `Basic ${Buffer.from(settings.user + ':' + settings.TOKEN).toString('base64')}`
		},
		crumbIssuer: (settings.crumbIssuer && settings.crumbIssuer!=="false")
	});
}

async function waitOnQueue(jenkinsClient, buildQueueNumber) {
	const buildNumber = await new Promise((resolve,reject)=>{
		jenkinsClient.queue.item(buildQueueNumber, async function(err, item) {
		  if (err) return reject(err);
		  
		  if (item.executable) {
			return resolve(item.executable.number);
		  }

		  if (item.cancelled) {
			return reject('cancelled');
		  }
		  resolve(null)
		});
	});

	// If got buildNumber
	if(buildNumber!==null){
		return buildNumber;
	}

	// Wait 500ms and check again
	await new Promise((timeoutResolve)=>setTimeout(timeoutResolve,500));
	return waitOnQueue(jenkinsClient, buildQueueNumber);
}

async function waitUntilEnd(jenkinsClient, job, buildNumber) {
	const build = await new Promise((resolve,reject)=>{
		jenkinsClient.build.get(job, buildNumber, async function(err, item) {
		  if (err) return reject(err);
		  resolve(item);
		});
	});

	if (build.result){
		return build;
	}
	// Wait 500ms and check again
	await new Promise((timeoutResolve)=>setTimeout(timeoutResolve,500));
	return waitUntilEnd(jenkinsClient, job, buildNumber);
}

async function buildJob(action, settings){
	let jenkinsClient = getJenkinsClient(settings);
	let buildOptions = { 
		name: action.params.JOB
	};
	
	if(action.params.PARAMETERS){
		buildOptions.parameters = action.params.PARAMETERS;
	}

	const buildQueueNumber = await new Promise((resolve, reject) => {
		jenkinsClient.job.build(buildOptions, function(err, data) {
			if (err) {
				return reject(err)
			};
			return resolve(data);
		});
	})

	if (!action.params.waitForEnd || action.params.waitForEnd === "false"){
		return {queueNumber: buildQueueNumber};
	}

	const buildNumber = await waitOnQueue(jenkinsClient,buildQueueNumber);

	const build = await waitUntilEnd(jenkinsClient, buildOptions.name, buildNumber);
	
	if(build.result=='FAILURE' && (action.params.failOnFailure === true || action.params.failOnFailure === "true")){
		throw build;
	}

	return build;
}

module.exports = {
	buildJob : buildJob
}
