import axios from "axios";

const client = axios.create({ baseURL: "https://moviemri-backend-9qom8.ondigitalocean.app/api" });

export default client;
