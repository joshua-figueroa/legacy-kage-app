import api from "../api/kitsu";

export default function useAnimeSearch() {
    const search = async (anime) => {
        const response = await api.get("/anime", {
            params: {
                "filter[text]": anime,
            },
        });

        if (!response.data) return;

        return response.data.data;
    };

    return { search };
}
