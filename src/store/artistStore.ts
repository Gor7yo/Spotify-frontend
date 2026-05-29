import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Artist {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
}

interface ArtistStore {
  artistSearch: string;
  artists: Artist[];

  setArtists: (artist: Artist[], artistSearch: string) => void;
  addArtists: (artist: Artist[], artistSearch: string) => void;
  getArtists: () => Artist[];
  getArtistSearch: () => string;
  clearArtists: () => void;
}

export const useArtistStore = create<ArtistStore>()(
  persist(
    (set, get) => ({
      artistSearch: "",
      artists: [],

      setArtists: (artists, artistSearch) =>
        set({
          artistSearch,
          artists,
        }),

      addArtists: (artistsAdd, artistSearch) => {
        set({
          artistSearch,
          artists: [...get().artists, ...artistsAdd],
        });
      },

      getArtists: () => get().artists,

      getArtistSearch: () => get().artistSearch,

      clearArtists: () =>
        set({
          artistSearch: "",
          artists: [],
        }),
    }),
    {
      name: "artists-storage",
      partialize: (state) => ({
        artistSearch: state.artistSearch,
        artists: state.artists,
      }),
    },
  ),
);
