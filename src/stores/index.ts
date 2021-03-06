import { configureStore } from '@reduxjs/toolkit'

import { productApi, skinConcernApi, skinTypeApi, authApi, bannerApi, articleApi } from '../services'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [skinTypeApi.reducerPath]: skinTypeApi.reducer,
    [skinConcernApi.reducerPath]: skinConcernApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [articleApi.reducerPath]: articleApi.reducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch