import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Grp204WeatherApp() {
  const [input, setInput] = useState('');
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [forecast, setForecast] = useState([]); 
  const [history, setHistory] = useState([]); 
  const [favorites, setFavorites] = useState([]);



  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];
    const savedFavorites = JSON.parse(localStorage.getItem('cityFavorites')) || [];
    setHistory(savedHistory);
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('cityHistory', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('cityFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toDateFunction = () => {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août',
      'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const WeekDays = [
      'Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'
    ];
    const currentDate = new Date();
    const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
    return date;
  };

  const search = async (city) => {
    setInput('');
    setWeather({ ...weather, loading: true });

    const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
    const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
    const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    try {
     
      const weatherRes = await axios.get(weatherUrl, {
        params: {
          q: city || input,
          units: 'metric',
          appid: api_key,
        },
      });

   
      const forecastRes = await axios.get(forecastUrl, {
        params: {
          q: city || input,
          units: 'metric',
          appid: api_key,
        },
      });

      setWeather({ data: weatherRes.data, loading: false, error: false });

     
      const forecastData = forecastRes.data.list.filter(item => item.dt_txt.includes("12:00:00")); 
      setForecast(forecastData);


    } catch (error) {
      setWeather({ ...weather, data: {}, error: true });
      setInput('');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search();
    }
  };

  const handleCityClick = (city) => {
    search(city);
  };

  const addToFavorites = (city) => {
    if (!favorites.includes(city)) {
      const updatedFavorites = [city, ...favorites];
      setFavorites(updatedFavorites); 
      localStorage.setItem('cityFavorites', JSON.stringify(updatedFavorites)); 
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Discover Weather In Your City With App Grp 203</h1>
      
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      

 
      {favorites.length > 0 && (
        <div className="favorites-container">
          <h3>Villes favorites</h3>
          <ul className="favorites-list">
            {favorites.map((city, index) => (
              <li key={index} onClick={() => handleCityClick(city)} className="favorites-item">
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}

      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}
      
      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </span>
      )}

      {weather && weather.data.weather && weather.data.main && (
        <div>
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
         
          <button className="favorite-button" onClick={() => addToFavorites(weather.data.name)}>
            Ajouter aux favoris
          </button>
        </div>
      )}

   
      {forecast.length > 0 && (
        <div className="forecast">
          <h3>Prévisions sur 5 jours :</h3>
          <div className="forecast-container">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt_txt).toLocaleDateString('fr-FR', {
                  weekday: 'long', day: 'numeric', month: 'long'
                })}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Grp204WeatherApp;

