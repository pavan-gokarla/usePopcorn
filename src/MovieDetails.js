import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Loader";
import { apiKey } from "./App";

export function MovieDetails({ selectedId, onClose, onAdding, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState();
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const callBack = (e) => {
      if (e.code === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", callBack);
    return () => {
      document.removeEventListener("keydown", callBack);
    };
  }, [onClose]);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    }
    fetchMovieDetails();
  }, [selectedId]);
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);
  function handleAdd() {
    const newMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: userRating, // Default user rating; adjust as needed
    };
    onAdding(newMovie);
    onClose();
  }

  if (isLoading) return <Loader></Loader>;

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={() => onClose()}>
          &larr;
        </button>
        <img src={poster} alt={`Post of ${movie}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {isWatched ? (
            <p>You have already rated this</p>
          ) : (
            <>
              <StarRating
                onSetRating={setUserRating}
                maxRating={10}
                size={24}
              ></StarRating>
              {userRating && (
                <button className="btn-add" onClick={() => handleAdd()}>
                  Add to List
                </button>
              )}
            </>
          )}
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed By {director} </p>
      </section>
    </div>
  );
}
