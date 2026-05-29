import { apiClient } from "../api/axiosInstance";

interface Artist {
  name: string;
  url: string;
}

interface Track {
  name: string;
  duration: number;
  playcount: number;
  listeners: number;
  url: string;
  streamable: boolean;
  artist: Artist;
}



export const tracksService = {
  getChartTopTracks: async (
    page?: string,
    limit?: string,
  ): Promise<Track[]> => {
    const { data } = await apiClient.get<Track[]>("/lastfm/chart/top-tracks", {
      params: {
        page: page || 1,
        limit: limit || 30,
      },
    });

    return data;
  },
};
