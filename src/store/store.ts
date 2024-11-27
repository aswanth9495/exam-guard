import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import mobilePairingService from '@/services/mobilePairingService';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    mobilePairingService.middleware
  ),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
