import { apiClient } from "../api/axiosInstance";

export interface FilteredArtist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
}

export const searchService = {
  getSearch: async (query: string, page = 1): Promise<FilteredArtist[]> => {
    const { data } = await apiClient.get(`/lastfm/search?q=${query}`, {
      params: {
        page: page,
        limit: 30,
      },
    });

    console.log(data, 1);

    if (!data) return [];

    return data;
  },
};
