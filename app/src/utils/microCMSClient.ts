import { createClient } from 'microcms-js-sdk';

const microCMSClient = createClient({
  serviceDomain: 'calendar',
  apiKey: process.env.API_KEY || ''
});

export default microCMSClient;
