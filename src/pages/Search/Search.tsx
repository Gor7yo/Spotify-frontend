import { useEffect, useState, type JSX } from "react";
import { NavMenuSide } from "../../components/NavMenuSide/NavMenuSide";
import style from "./Search.module.css";
import { SearchTracks } from "../../components/SearchTracks/SearchTracks";
import { useArtistStore } from "../../store/artistStore";
import { Link } from "react-router";
import { searchService } from "../../services/searchService";

export const Search = (): JSX.Element => {
  const [page, setPage] = useState(2);
  const [isAvalibale, setIsAvalible] = useState(false);
  const { addArtists, artistSearch, artists } = useArtistStore();

  useEffect(() => {
    if (artists.length == 0) {
      setIsAvalible((state) => state = true);
    }
    if (artists.length > 0) {
      setIsAvalible((state) => state = false);
    }
  }, [artists]);

  useEffect(() => {
    if (artists.length == 0) {
      setIsAvalible((state) => state = true);
    }
    if (artists.length > 0) {
      setIsAvalible((state) => state = false);
    }
  }, []);

  const handleSeeMore = async () => {
    setPage((page) => (page += 1));
    try {
      const result = await searchService.getSearch(artistSearch, page);
      addArtists(result, artistSearch);
    } catch (error) {}
  };

  return (
    <div className={style.Search}>
      <NavMenuSide />

      <div className={style.Search__main}>
        <SearchTracks />
        <div className={style.main__artists}>
          {artists.map((artist) => (
            <Link className={style.artist} to={artist.url}>
              {artist.name}
            </Link>
          ))}
          <button
            className={`${style.moreBtn} ${isAvalibale ? style.disabled : ""}`}
            onClick={() => handleSeeMore()}
            disabled={isAvalibale}
          >
            More
          </button>
        </div>
      </div>
    </div>
  );
};
