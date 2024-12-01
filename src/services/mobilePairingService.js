import {
  createApi, fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const baseMobilePairingQuery = fetchBaseQuery({
  baseUrl: window.location.origin,
});

const mobilePairingService = createApi({
  reducerPath: 'mobilePairing',
  tagTypes: [],
  baseQuery: baseMobilePairingQuery,
  endpoints: (build) => ({
    getQrCode: build.query({
      query: ({ endpoint, payload }) => ({
        method: 'GET',
        url: endpoint || 'api/v3/proctoring/dual_camera/qr_code',
        params: {
          ...payload,
        },
      }),
    }),
    getPollingData: build.query({
      query: ({ endpoint, payload }) => ({
        method: 'GET',
        url: endpoint || 'api/v3/proctoring/dual_camera/poll',
        params: {
          ...payload,
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
