import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./api";
import toast from "react-hot-toast";

export const notesApi = createApi({
  reducerPath: "notesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["Notes"], // Define tag types globally
  endpoints: (builder) => ({
    // Fetch notes for a specific lead
    getNotesByLead: builder.query({
      query: (leadId) => `/lead/${leadId}/notes`,
      providesTags: (result, error, leadId) => [{ type: "Notes", id: leadId }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Notes Fetch Error:", error);
          toast.error("Failed to fetch notes.");
        }
      },
    }),

    // Fetch all notes
    getAllNotes: builder.query({
      query: ({ page = 1, itemsPerPage = 3, searchQuery = "" } = {}) => 
        `/notes?page=${page}&itemsPerPage=${itemsPerPage}&search=${searchQuery}`,
      providesTags: ["Notes"], 
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          toast.error("Failed to fetch all notes!");
          console.error("Fetch All Notes Error:", error);
        }
      },
    }),

    // Add a new note to a specific lead
    addNoteToLead: builder.mutation({
      query: ({ leadId, noteContent }) => ({
        url: `/lead/${leadId}/notes`,
        method: "POST",
        body: { notes: noteContent },
      }),
      invalidatesTags: ["Notes"], // Ensures updated notes are fetched again
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Note added successfully!");
        } catch (error) {
          console.error("Add Note Error:", error);
          toast.error("Failed to add note.");
        }
      },
    }),
  }),
});

// Export Hooks
export const { 
  useGetNotesByLeadQuery, 
  useGetAllNotesQuery, 
  useAddNoteToLeadMutation 
} = notesApi;
