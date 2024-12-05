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
    sendProctorEvent: build.mutation({
      query: ({
        eventName,
        endpoint,
        payload,
        extraData = {},
      }) => ({
        url: endpoint || 'api/v3/proctoring/dual_camera/events',
        method: 'POST',
        params: {
          ...payload,
        },
        body: {
          events: [{
            type: 'desktop_client',
            name: eventName,
            data: extraData,
          }],
        },
      }),
    }),
  }),
});

export const {
  useGetQrCodeQuery,
  useGetPollingDataQuery,
  util: mobilePairingEvent,
  useSendProctorEventMutation,
} = mobilePairingService;

export default mobilePairingService;
