import axios from "axios";

// "https://moviemri-backend-9qom8.ondigitalocean.app/api"

const client = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default client;
