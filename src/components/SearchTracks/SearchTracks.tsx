import { type JSX } from "react";
import style from "./SearchTracks.module.css";
import { IoIosSearch } from "react-icons/io";
import { useForm, type SubmitHandler } from "react-hook-form";
import { searchService } from "../../services/searchService";
import { useArtistStore } from "../../store/artistStore";

type Input = {
  search: string;
};

export const SearchTracks = (): JSX.Element => {
  const { register, handleSubmit } = useForm<Input>();
  const { setArtists, artists } = useArtistStore();

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      const result = await searchService.getSearch(data.search);
      setArtists(result, data.search);
      console.log(result, artists);
    } catch (error) {}
  };

  return (
    <div className={style.SearchTracks}>
      <form
        className={style.SearchTracks__form}
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className={style.form__input}
          {...register("search")}
          type="text"
          placeholder="Search..."
        />

        <button className={style.form__btn} type="submit">
          <IoIosSearch className={style.btn__icon} />
        </button>
      </form>
    </div>
  );
};
