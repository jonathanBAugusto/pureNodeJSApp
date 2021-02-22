const envs = {};

envs.dev = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'dev',
  'hashingSecret': 'OMGSecretDev',
  'maxChecks': 5,
};

envs.prod = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'prod',
  'hashingSecret': 'OMGSecretProd',
  'maxChecks': 5,
};


const currentEnv = typeof (process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

const envToExport = typeof (envs[currentEnv]) == 'object' ? envs[currentEnv] : envs.dev;

export default envToExport;
