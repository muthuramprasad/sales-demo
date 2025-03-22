import Axios from "axios";
import { io } from "socket.io-client";

export const baseURL = "http://localhost:5000/api"; 
export const socket = io("http://localhost:5000/api"); 

const API = Axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API call to create a user
export const createUser = async (User) => {
  try {
    const response = await API.post("/signup", User);
    socket.emit("userCreated", response.data); // Emit event after user creation
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// API call to fetch users (initial load)
export const getUsers = async (page = 1, itemsPerPage = 10, searchQuery = "", setUsers) => {
  try {
    const response = await API.get(`/signup?page=${page}&itemsPerPage=${itemsPerPage}&search=${searchQuery}`);
    setUsers(response?.data?.users || []); // Store users in state
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


export const DeleteUser = async (id) => {
  if (!id) {
    throw new Error("User ID is required for deletion.");
  }
  try {
    const response = await API.delete(`/signup/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const UpdateUser = async (id, updates) => {
  if (!id) {
    throw new Error("User ID is required for updating.");
  }
  if (!updates || typeof updates !== "object") {
    throw new Error("Invalid updates provided.");
  }
  try {
    const response = await API.patch(`/signup/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};




// API call to create a lead
export const createLead = async (lead) => {
  console.log("Sending Lead Data:", lead);
  try {
    const response = await API.post("/lead", lead);
    console.log("Lead Created Successfully:", response.data);
    socket.emit("leadCreated", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating lead", error.response?.data || error.message);
    throw error;
  }
};

// API call to fetch leads
export const getLeads = async (page = 1, itemsPerPage = 10, searchQuery = "", setLeads) => {
  try {
    const response = await API.get(`/getlead?page=${page}&itemsPerPage=${itemsPerPage}&search=${searchQuery}`);
    setLeads(response?.data?.leads || []);
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

// API call to update a lead
export const updateLead = async (id, updates) => {
  try {
    const response = await API.put(`/lead/${id}`, updates);
    console.log("Lead Updated Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating lead:", error);
    throw error;
  }
};

// API call to delete (soft delete) a lead
export const deleteLead = async (id) => {
  try {
    const response = await API.patch(`/lead/${id}`);
    console.log("Lead Deleted Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting lead:", error);
    throw error;
  }
};




// API call to add notes for a specific lead
export const addNoteToLead = async (leadId, noteContent) => {
  try {
    const response = await API.post(`/lead/${leadId}/notes`, { notes: noteContent });
    console.log("Note Added Successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// API call to fetch notes for a specific lead
export const getNotesByLead = async (leadId) => {
  try {
    const response = await API.get(`/lead/${leadId}/notes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};


// Notes for fetch ALL

export const getAllNotes=async(page=1,itemsPerPage=3,searchQuery='',setNotes)=>{
  try{
    const response=await API.get(`/notes?page=${page}&itemsPerPage=${itemsPerPage}&search=${searchQuery}`)
    setNotes(response?.data?.leads || [])
  }
  catch(error){
    console.error('Error fetching Notes',error)
    throw error;
  }
}

// Listen for user creation event
export const listenForUserUpdates = (setUsers) => {
  socket.on("userCreated", (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]); // Add new user to the list
  });
};

export default API;
