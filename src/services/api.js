import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://192.168.10.41:9000/api",
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
      query: ({ stationId, page = 1, limit = 10, search = "" }) => {
        let url = `/positions/?station=${stationId}&page=${page}&limit=${limit}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`;
        }
        return url;
      },
      providesTags: ["Positions"],
    }),
    // position qo‘shish
    createPosition: builder.mutation({
      query: (body) => ({
        url: `/positions/`,
        method: "POST",
        body, // { station_id: 1, number: 9 }
      }),
      invalidatesTags: ["Positions"],
    }),
    // position tahrirlash
    updatePosition: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/positions/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Positions"],
    }),
    // position o‘chirish
    deletePosition: builder.mutation({
      query: (id) => ({
        url: `/positions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Positions"],
    }),

    getAdvent: builder.query({
      query: () => "/advertisements/",
    }),

    createAdvent: builder.mutation({
      query: (formData) => ({
        url: "/advertisements/",
        method: "POST",
        body: formData,
        // MUHIM: headers ni qo'ymang, fetch avtomatik Content-Type ni o'rnatadi
      }),
      invalidatesTags: ["Advertisements"],
    }),
    updateAdvent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/advertisements/${id}/`,
        method: "PUT", // yoki PATCH
        body: formData,
      }),
      invalidatesTags: ["Advertisements"], // queryni refetch qiladi
    }),
    deleteAdvent: builder.mutation({
      query: (id) => ({
        url: `/advertisements/${id}/`,
        method: "DELETE",
      }),
    }),
    postPdf: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("schema_image", file); // 🔑 backend kutilayotgan field nomi

        return {
          url: `/stations/${id}/update-image/`,
          method: "PUT",
          body: formData,
        };
      },
    }),
    // arviv
    getArchive: builder.query({
      query: ({ page = 1, limit = 7, search = "" }) => ({
        url: `/advertisements-archive/`,
        params: { page, limit, search },
      }),
    }),
    getShowArchive: builder.query({
      query: (ida) => ({
        url: `/advertisements-archive/${ida}/`,
      }),
    }),
    getArchiveExcel: builder.query({
      query: () => ({
        url: "/advertisements/export-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
    getArchiveShowExcel: builder.query({
      query: () => ({
        url: "/advertisements-archive/export-excel/",
        responseHandler: async (response) => {
          const blob = await response.blob();
          return blob;
        },
      }),
    }),
  }),
});

// Hooklar
export const {
  useGetArchiveShowExcelQuery,
  useGetArchiveExcelQuery,
  useGetShowArchiveQuery,
  useGetArchiveQuery,
  usePostPdfMutation,
  useCreateAdventMutation,
  useCreatePositionMutation,
  useGetStationQuery,
  useGetPositionsByStationQuery,
  useDeletePositionMutation,
  useUpdatePositionMutation,
  useGetAdventQuery,
  useUpdateAdventMutation,
  useDeleteAdventMutation,
} = api;
