import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://reklamaproject.onrender.com/api",
    credentials: "include", // agar backend cookie/CSRFlik bo‘lsa foydali
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("marketing1");
      if (token) {
        // Backendga qarab quyidagini tanlang:
        headers.set("Authorization", `Bearer ${token}`); // ko‘pincha shunday
        // headers.set("Authorization", `Token ${token}`); // agar DRF TokenAuth bo‘lsa
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getStation: builder.query({
      query: (id) => `stations/${id}`,
    }),
  }),
});

// Hooklarni avtomat yaratadi:
export const { useGetStationQuery } = api;
