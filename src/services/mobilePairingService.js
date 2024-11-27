import {
  createApi, fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

// To be used later on
// eslint-disable-next-line no-unused-vars
const getIbtspContext = (ibtsp) => ({
  'api_context[id]': ibtsp,
  'api_context[type]': 'interviewbit_test_session_problem',
});

const getIbtContext = (testId) => ({
  'api_context[id]': testId,
  'api_context[type]': 'interviewbit_test',
});

const baseMobilePairingQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
});

const mobilePairingService = createApi({
  reducerPath: 'mobilePairing',
  tagTypes: [],
  baseQuery: baseMobilePairingQuery,
  endpoints: (build) => ({
    getQrCode: build.query({
      query: ({ testId }) => ({
        method: 'GET',
        url: '/v3/proctoring/dual_camera/qr_code',
        params: {
          ...getIbtContext(testId),
        },
      }),
    }),
    getPollingData: build.query({
      query: ({ testId }) => ({
        method: 'GET',
        url: '/v3/proctoring/dual_camera/poll',
        params: {
          ...getIbtContext(testId),
        },
      }),
    }),
  }),
});

export const {
  useGetQrCodeQuery,
  useGetPollingDataQuery,
  util: mobilePairingEvent,
} = mobilePairingService;

export default mobilePairingService;
