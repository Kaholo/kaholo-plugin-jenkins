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
    jenkinsClient.job.build.bind(jenkinsClient.job),
  )(buildOptions);

  if (waitForEnd || failOnFailure) {
    const buildNumber = await waitInQueue(jenkinsClient, buildQueueNumber);
    const build = await waitForJobEnd(jenkinsClient, buildOptions.name, buildNumber);

    if (build.result === "FAILURE" && failOnFailure) {
      throw build;
    }

    build.buildLog = await promisify(
      jenkinsClient.build.log.bind(jenkinsClient.build),
    )(buildOptions.name, buildNumber);

    return build;
  }

  return { queueNumber: buildQueueNumber };
}

module.exports = kaholoPluginLibrary.bootstrap({
  buildJob,
});
