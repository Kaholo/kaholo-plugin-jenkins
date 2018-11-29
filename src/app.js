var jenkins = require('jenkins'); 

function _initJenkins(action){
	return jenkins({ baseUrl: action.params.URL, crumbIssuer: true });
}

function _handleParams(PARAMETERS){
	if (typeof PARAMETERS == 'string')
		return JSON.parse(PARAMETERS);
	else 
		return PARAMETERS;
}

function buildJob(action){
	let _jenkins = _initJenkins(action);
	return new Promise((resolve, reject) => {
		let buildOptions = { 
			name: action.params.JOB,
			token: action.params.TOKEN,
		};

		if(action.params.PARAMETERS){
			try{
				buildOptions.parameters = _handleParams(action.params.PARAMETERS);
			} catch (err) {
				return reject(new Error("Error parsing parmeters : " + err.message))
			}
		}

		_jenkins.job.build(buildOptions, function(err, data) {
			if (err) {
				console.log('hey')
				return reject(err)
			};
			return resolve(data);
		});
	})
}


module.exports = {
	buildJob : buildJob
}
