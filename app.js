const kaholoPluginLibrary = require("@kaholo/plugin-library");
const { promisify } = require("util");
const {
  getJenkinsClient,
  waitInQueue,
  waitForJobEnd,
} = require("./jenkins-helpers");

async function buildJob({
  JOB: jobName,
  PARAMETERS: jobParameters,
  waitForEnd,
  failOnFailure,
  ...jenkinsClientConfig
}) {
  const buildOptions = {
    name: jobName,
  };
  if (jobParameters) {
    buildOptions.parameters = jobParameters;
  }

  const jenkinsClient = getJenkinsClient(jenkinsClientConfig);
  const buildQueueNumber = await promisify(
    (...args) => jenkinsClient.job.build(...args),
  )(buildOptions);

  if (waitForEnd) {
    const buildNumber = await waitInQueue(jenkinsClient, buildQueueNumber);
    const build = await waitForJobEnd(jenkinsClient, buildOptions.name, buildNumber);

    if (build.result === "FAILURE" && failOnFailure) {
      throw build;
    }

    build.buildLog = await promisify(
      (...args) => jenkinsClient.build.log(...args),
    )(buildOptions.name, buildNumber);

    return build;
  }

  return { queueNumber: buildQueueNumber };
}

module.exports = kaholoPluginLibrary.bootstrap({
  buildJob,
});
