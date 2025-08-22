import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.10.41:9000/api",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("marketing1");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Positions"], // ✅ bu shart
  endpoints: (builder) => ({
    getStation: builder.query({
      query: (id) => `stations/${id}/`,
    }),
    getPositionsByStation: builder.query({
      query: (stationId) => `positions/?station=${stationId}`,
      providesTags: ["Positions"], // ✅ cache bog‘lanadi
    }),
    deletePosition: builder.mutation({
      query: (id) => ({
        url: `positions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"], // ✅ o‘chirsa query avtomatik yangilanadi
    }),
  }),
});

// Hooklar
export const {
  useGetStationQuery,
  useGetPositionsByStationQuery,
  useDeletePositionMutation,
} = api;
