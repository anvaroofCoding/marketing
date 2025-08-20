import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://metro-site.onrender.com/api/",
  }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "comments",
    }),
  }),
});

// Hooklarni avtomat yaratadi:
export const { useGetPostsQuery } = api;
