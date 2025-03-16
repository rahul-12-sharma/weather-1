import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BounceLoader } from 'react-spinners'; // For loading animation

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [searching, setSearching] = useState(false);
  const [showErrorAnimation, setShowErrorAnimation] = useState(false);

  const apiKey = `13da1e043dcca8a214313df3ca8429ac`;  // Replace with your OpenWeatherMap API key

  const getWeatherByCity = async (cityName) => {
    try {
      setSearching(true);
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: cityName,
          appid: apiKey,
          units: 'metric',
        },
      });
      setWeatherData(response.data);
      setLoading(false);
      setSearching(false);
    } catch (err) {
      setError('Failed to fetch weather data for this city');
      setLoading(false);
      setSearching(false);
      setShowErrorAnimation(true); // Trigger error animation on failure
      setTimeout(() => setShowErrorAnimation(false), 1000); // Remove animation after 1 second
    }
  };

  const getWeatherByLocation = async (lat, lon) => {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: 'metric',
        },
      });
      setWeatherData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
      setSearching(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError('Unable to retrieve location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city) {
      getWeatherByCity(city);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      getWeatherByLocation(location.latitude, location.longitude);
    }
  }, [location]);

  const getWeatherIcon = (iconCode) => {
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black p-6 font-sans transition-all ease-in-out duration-500 bg-cover bg-center"
      style={{
        backgroundImage: weatherData ? `url(https://source.unsplash.com/1600x900/?${weatherData.weather[0].description})` : 'url(https://source.unsplash.com/1600x900/?weather)',
      }}
    >
      <h1 className="text-5xl font-bold mb-6 drop-shadow-lg text-center transition duration-300 ease-in-out">Weather App</h1>

      <form onSubmit={handleSearch} className="flex space-x-4 mb-6 p-4 bg-white bg-opacity-60 rounded-xl shadow-xl transition duration-300 ease-in-out hover:bg-blue-50 transform hover:scale-105">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="p-4 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition duration-300 "
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex justify-center items-center">
          <BounceLoader size={50} color="#ffffff" loading={loading} />
        </div>
      )}
      {error && !loading && showErrorAnimation && (
        <div className="text-red-400 font-semibold animate-shake">{error}</div>
      )}

      {weatherData && !searching && !loading && (
        <div
          className="bg-white text-gray-800 p-8 rounded-xl shadow-xl max-w-lg w-full text-center transform transition duration-500 ease-in-out hover:scale-105 bg-opacity-80"
        >
          <h2 className="text-3xl font-semibold mb-4">{weatherData.name}</h2>
          <div className="flex justify-center mb-4">
            <img
              src={getWeatherIcon(weatherData.weather[0].icon)}
              alt={weatherData.weather[0].description}
              className="w-20 h-20"
            />
          </div>
          <p className="text-2xl mb-2">
            Temperature: <span className="font-semibold text-4xl">{weatherData.main.temp}°C</span>
          </p>
          <p className="text-lg mb-2">
            Weather: <span className="font-semibold capitalize">{weatherData.weather[0].description}</span>
          </p>
          <p className="text-lg mb-2">
            Humidity: <span className="font-semibold">{weatherData.main.humidity}%</span>
          </p>
          <p className="text-lg mb-4">
            Wind Speed: <span className="font-semibold">{weatherData.wind.speed} m/s</span>
          </p>
          <div className="text-sm text-gray-500">{new Date().toLocaleString()}</div>
        </div>
      )}
    </div>
  );
};

export default App;
