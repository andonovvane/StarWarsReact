import axios from "axios";

export const api = axios.create({
    baseURL: "https://swapi.constructor-learning.com/api"
});

// https://swapi.constructor-learning.com/api/films/