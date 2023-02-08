import axios from "axios";

// "https://moviemri-backend.onrender.com/api"

const client = axios.create({
  baseURL: "https://moviemri-backend.onrender.com/api",
});

export default client;
