import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "./api";
import toast from "react-hot-toast";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: (user) => ({
        url: "/signup",
        method: "POST",
        body: user,
      }),
      async onQueryStarted(User, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User Created Successfully! ");
        } catch (error) {
          toast.error("Error Creating User!");
          console.error("Create User Error:", error);
        }
      },
    }),
    getUsers: builder.query({
      query: ({ page, itemsPerPage, search = "" }) => 
        `/signup?page=${page}&itemsPerPage=${itemsPerPage}&search=${search}`,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          toast.error("Failed to fetch users!");
          console.error("Fetch Users Error:", error);
        }
      },
    }),
    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `/signup/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User Updated Successfully! ");
        } catch (error) {
          toast.error("Error updating user!");
          console.error("Update User Error:", error);
        }
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/signup/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User Deleted Successfully! ");
        } catch (error) {
          toast.error("Error deleting user!");
          console.error("Delete User Error:", error);
        }
      },
    }),
  }),
});

export const { useCreateUserMutation, useGetUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi;
