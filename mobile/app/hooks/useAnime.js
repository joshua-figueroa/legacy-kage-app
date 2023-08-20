import api from "../api/client";

export default function useAnime() {
    const fetchAnime = async () => {
        const response = await api.get("/new-release");

        if (!response.data || response.status === 400) return;

        return response.data;
    };

    return { fetchAnime };
}
