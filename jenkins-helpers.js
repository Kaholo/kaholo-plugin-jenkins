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

async function waitInQueue(jenkinsClient, buildQueueNumber) {
  const queueItem = await promisify(
    jenkinsClient.queue.item.bind(jenkinsClient.queue),
  )(buildQueueNumber);

  if (queueItem.cancelled) {
    throw new Error("Build was cancelled");
  }

  const buildNumber = queueItem.executable?.number;
  if (buildNumber) {
    return buildNumber;
  }

  await delay(500);
  return waitInQueue(jenkinsClient, buildQueueNumber);
}

async function waitForJobEnd(jenkinsClient, job, buildNumber) {
  const build = await promisify(
    jenkinsClient.build.get.bind(jenkinsClient.build),
  )(job, buildNumber);

  if (build.result) {
    return build;
  }

  await delay(500);
  return waitForJobEnd(jenkinsClient, job, buildNumber);
}

module.exports = {
  waitInQueue,
  waitForJobEnd,
  getJenkinsClient,
};
