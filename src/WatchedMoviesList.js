import { WatchedMovie } from "./WatchedMovie";

export function WatchedMoviesList({ movies, onDeleteWatched }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}
