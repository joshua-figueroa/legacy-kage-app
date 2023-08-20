import axios from "axios";

const instance = axios.create({
    baseURL: "https://kitsu.io/api/edge",
});

export default instance;
