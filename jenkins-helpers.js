const jenkins = require("jenkins");
const { promisify } = require("util");

const delay = (ms) => new Promise((res) => {
  setTimeout(res, ms);
});

const getJenkinsClient = ({
  URL: baseUrl,
  TOKEN: token,
  user,
  crumbIssuer,
}) => jenkins({
  baseUrl,
  crumbIssuer,
  headers: {
    Authorization: `Basic ${Buffer.from(`${user}:${token}`).toString("base64")}`,
  },
});

async function waitOnQueue(jenkinsClient, buildQueueNumber) {
  const queueItem = await promisify(
    (...args) => jenkinsClient.queue.item(...args),
  )(buildQueueNumber);

  if (queueItem.cancelled) {
    throw new Error("Build was cancelled");
  }

  const buildNumber = queueItem.executable?.number;
  if (buildNumber) {
    return buildNumber;
  }

  await delay(500);
  return waitOnQueue(jenkinsClient, buildQueueNumber);
}

async function waitForJobEnd(jenkinsClient, job, buildNumber) {
  const build = await promisify(
    (...args) => jenkinsClient.build.get(...args),
  )(job, buildNumber);

  if (build.result) {
    return build;
  }

  await delay(500);
  return waitForJobEnd(jenkinsClient, job, buildNumber);
}

module.exports = {
  waitOnQueue,
  waitForJobEnd,
  getJenkinsClient,
};
