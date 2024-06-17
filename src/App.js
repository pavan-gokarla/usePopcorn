import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { List } from "./List";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { Box } from "./Box";
import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { MovieDetails } from "./MovieDetails";
import { Summary } from "./Summary";

export const apiKey = "906245cc";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState("");
  const [selectedId, setSelectedId] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setIsError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
            {
              signal: controller.signal,
            }
          );
          if (!res.ok) throw new Error("Something Went Wrong");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie Not found");
          setMovies(data.Search);
          setIsError("");
        } catch (e) {
          if (e.name !== "AbortError") setIsError(e.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setIsError("");
        return;
      }
      handleCloseId();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  function handleOnSelect(id) {
    setSelectedId(id);
  }

  function handleCloseId() {
    setSelectedId(null);
  }

  function handleAddToWatched(newMovie) {
    setWatched((watched) => [...watched, newMovie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar query={query} setQuery={setQuery} movies={movies}></Navbar>
      <main className="main">
        <Box key={0}>
          {isLoading && <Loader></Loader>}
          {!isError && !isLoading && (
            <List movies={movies} onSelecedId={handleOnSelect} />
          )}
          {isError && <ErrorMessage message={isError}></ErrorMessage>}
        </Box>
        <Box key={1}>
          {selectedId ? (
            <MovieDetails
              onClose={handleCloseId}
              selectedId={selectedId}
              onAdding={handleAddToWatched}
              watched={watched}
            ></MovieDetails>
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedMoviesList
                movies={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}
