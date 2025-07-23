let isScheduled = false;
const jobs = [];

const processJob = () => {
  while (jobs.length > 0) {
    const job = jobs.shift();
    const result = job();

    Promise.resolve(result).catch((err) => {
      console.error(`[scheduler]: ${err}`);
    });
  }

  isScheduled = false;
};

const scheduleUpdate = () => {
  if (isScheduled) {
    return;
  }

  isScheduled = true;
  queueMicrotask(processJob);
};

export const enqueueJob = (job) => {
  jobs.push(job);
  scheduleUpdate();
};
