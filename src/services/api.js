import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://2abfcea964d1.ngrok-free.app/api",
    credentials: "include", // cookie ishlatadi
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("marketing1");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Positions"],

  endpoints: (builder) => ({
    // bitta stansiyani olish
    getStation: builder.query({
      query: (id) => `/stations/${id}/`,
    }),

    // stansiyaga tegishli positionlarni olish
    getPositionsByStation: builder.query({
      query: ({ stationId, page = 1, limit = 10 }) =>
        `/positions/?station=${stationId}&page=${page}&limit=${limit}`,
      providesTags: ["Positions"],
    }),

    // position o‘chirish
    deletePosition: builder.mutation({
      query: (id) => ({
        url: `/positions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),
  }),
});

// Hooklar
export const {
  useGetStationQuery,
  useGetPositionsByStationQuery,
  useDeletePositionMutation,
} = api;
