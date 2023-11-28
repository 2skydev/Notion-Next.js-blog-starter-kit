import pRetry from 'p-retry';

type ImportFn = () => Promise<any>;

export const loadPrismComponents = async (importFns: ImportFn[]) => {
  const errorIndexes: number[] = [];

  const results = await Promise.allSettled(importFns.map(fn => fn()));

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      errorIndexes.push(index);
    }
  });

  return {
    results,
    errorIndexes,
  };
};

export const loadPrismComponentsWithRetry = async (importFns: ImportFn[]) => {
  const { errorIndexes } = await loadPrismComponents(importFns);

  if (errorIndexes.length) {
    let retryFns = errorIndexes.map(index => importFns[index]);

    // console.log('[retrying start] load prism components', retryFns);

    try {
      await pRetry(
        async () => {
          const { errorIndexes } = await loadPrismComponents(retryFns);

          if (errorIndexes.length) {
            retryFns = errorIndexes.map(index => importFns[index]);
            throw new Error('retry');
          }
        },
        {
          minTimeout: 100,
          maxTimeout: 1000,
          onFailedAttempt: error => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`,
            );
          },
          retries: 2,
        },
      );

      // console.log('[retrying end] load prism components success');
    } catch (err) {
      console.warn(
        'code block syntax highlighting failed to load, some code blocks may not be properly syntax highlighted',
      );
    }
  }
};
