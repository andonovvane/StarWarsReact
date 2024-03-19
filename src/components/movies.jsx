import './styles.css'
import  { useState, useEffect } from 'react';
import axios from 'axios';
import { api } from '../api/posts';

function MovieList() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [starshipsBtn, setStarshipsBtn]= useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [starshipNames, setStarshipNames] = useState([]);
    const [starshipPilots, setStarshipPilots] = useState([]);
    const [favPilots, setFavPilots] = useState([]);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const response = await api.get('/films/');
                setMovies(response.data.results);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMovies();
    }, []);

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie);
        setStarshipsBtn(true);
        setStarshipPilots([]);
    };

    const fetchStarshipDetails = async (starshipUrl) => {
        try {
            const response = await axios.get(starshipUrl);
            return response.data;
        } catch (error) {
            console.error('Error fetching starship details:', error);
            return null;
        }
    };

    const handleStarshipName = async (starshipUrl) => {
        const starship = await fetchStarshipDetails(starshipUrl);
        return starship.name;
    }

    const fetchPilotDetails = async (pilotUrl) => {
        try {
            const response = await axios.get(pilotUrl);
            return response.data.name;
        } catch (error) {
            console.error('Error fetching pilot details:', error);
            return null;
        }
    };

    const handleStarshipClick = async (starshipUrl) => {
        const starship = await fetchStarshipDetails(starshipUrl)
        setStarshipPilots([]);
        if (starship.pilots.length > 0) {
            Promise.all(starship.pilots.map(fetchPilotDetails))
                .then(pilots => setStarshipPilots(pilots))
                .catch(error => console.error('Error fetching pilots:', error));
        }
    }

    const addFavPilot = (pilot) => {
        setFavPilots(prevFavPilots => [...prevFavPilots, pilot]);
    };

    const delFavPilot = (pilot) => {
        setFavPilots(prevFavPilots => prevFavPilots.filter(favPilot => favPilot !== pilot));
    };

    useEffect(() => {
        // Fetch starship names only when selectedMovie is not null and starshipsBtn is true
        if (selectedMovie && starshipsBtn) {
            Promise.all(selectedMovie.starships.map(handleStarshipName))
            .then(names => setStarshipNames(names))
            .catch(error => console.error('Error fetching starship names:', error));
        } else {
            setStarshipNames([]); // Reset starshipNames if starshipsBtn is false or selectedMovie is null
        }
    }, [selectedMovie, starshipsBtn]);

    

    return (
        <>
            <div className="row">
                <div className="column1">
                    <h1>Star Wars Movies</h1>
                    {loading ? (
                        <p>Loading ... </p>
                    ) : (
                        <ul>
                            {movies
                                .slice()
                                .sort((a, b) => a.episode_id - b.episode_id)
                                .map((movie, index) => (
                                    <li key={index} onClick={() => handleMovieClick(movie)}>
                                        <h2>{movie.title}</h2>
                                        {selectedMovie && selectedMovie.title === movie.title && (
                                            <div className="selected-title">
                                                <h3>Episode: {selectedMovie.episode_id}</h3>
                                                <p>Director: {selectedMovie.director}</p>
                                                <p>Release Date: {selectedMovie.release_date}</p>
                                                <p>Opening Crawl: <br />{selectedMovie.opening_crawl}</p>
                                            </div>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
                <div className="column">
                    <h1>Starships</h1>
                    {starshipNames.length > 0 && (
                        <ul>
                            {starshipNames.map((starshipName, index) => (
                                <li key={index} onClick={() => handleStarshipClick(selectedMovie.starships[index])}>
                                    {starshipName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="column">
                    <h1>Pilot List</h1>
                    {starshipPilots.length > 0 && (
                        <ul>
                            {starshipPilots.map((pilot, index) => (
                                <li key={index} onClick={() => addFavPilot(pilot)}>
                                    {pilot}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="column">
                    <h1>Favourite Pilots</h1>
                    {favPilots.length > 0 && (
                        <ul>
                            {favPilots.map((favPilot, index) => (
                                <li key={index} onClick={() => delFavPilot(favPilot)}>
                                    {favPilot}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

export default MovieList;