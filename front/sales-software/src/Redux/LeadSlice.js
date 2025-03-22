import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./api";
import toast from "react-hot-toast";

export const leadApi = createApi({
  reducerPath: "LeadApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    // Create Lead
    createLead: builder.mutation({
      query: (lead) => ({
        url: "/lead",
        method: "POST",
        body: lead,
      }),
      async onQueryStarted(lead, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Lead Created Successfully!");
        } catch (error) {
          toast.error("Error Creating Lead!");
          console.error("Create Lead Error:", error);
        }
      },
    }),

    // Get Leads
    getLeads: builder.query({
      query: ({ page = 1, itemsPerPage = 10, search = "" ,startDate = "", endDate = ""}) => ({
        url: `/getlead?page=${page}&itemsPerPage=${itemsPerPage}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          toast.error("Failed to fetch leads!");
          console.error("Fetch Leads Error:", error);
        }
      },
    }),

    // Update Lead
    updateLead: builder.mutation({
      query: ({ id, updatedLead }) => ({
        url: `/lead/${id}`,
        method: "PUT",
        body: updatedLead,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Lead Updated Successfully!");
        } catch (error) {
          toast.error("Error Updating Lead!");
          console.error("Update Lead Error:", error);
        }
      },
    }),

    // Delete Lead (Soft Delete)
    deleteLead: builder.mutation({
      query: (id) => ({
        url: `/lead/${id}`,
        method: "PATCH",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Lead Deleted Successfully!");
        } catch (error) {
          toast.error("Error Deleting Lead!");
          console.error("Delete Lead Error:", error);
        }
      },
    }),
  }),
});

export const { useCreateLeadMutation, useGetLeadsQuery, useUpdateLeadMutation, useDeleteLeadMutation } = leadApi;
