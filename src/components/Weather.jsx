import React, { useEffect, useRef, useState } from 'react'
import { SearchIcon } from '@heroicons/react/outline'; // Import Heroicons Search Icon
import humidity from '../assets/humidity.png'
import wind from '../assets/wind.png'

const Weather = () => {

  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(false);

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }

      // Extract the icon code and weather description from the API response
      const iconCode = data.weather[0].icon;  // e.g., "10d"
      const weatherDescription = data.weather[0].description; // e.g., "light rain"

      // Construct the icon URL
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // Update weather data with the icon and description
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconUrl,
        description: weatherDescription // Store the description here
      });
    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }
  }

  useEffect(() => {
    search("new york");
  }, [])

  return (
    <div id='weather' className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-8">
      <div id='search-bar' className="flex items-center space-x-4 bg-white p-4 rounded-full shadow-xl w-96 mb-8">
        <input ref={inputRef} type="text" placeholder='Enter City Name' className="flex-grow p-3 rounded-full outline-none text-lg font-semibold placeholder-gray-400 focus:ring-2 focus:ring-blue-300" />
        
        {/* Replace the image with Heroicons Search Icon */}
        <SearchIcon 
          className="w-8 h-8 text-blue-500 cursor-pointer hover:text-blue-700 transition-colors duration-300" 
          onClick={() => search(inputRef.current.value)} 
        />
      </div>

      {weatherData ? (
        <div className="bg-white p-6 rounded-3xl shadow-2xl w-96 text-center transform hover:scale-105 transition-transform duration-500 ease-in-out">
          <img src={weatherData.icon} alt="weather icon" className="w-32 mx-auto mb-4 hover:rotate-12 transition-transform duration-300" />
          <p id='temperature' className="text-6xl font-extrabold text-gray-800">{weatherData.temperature}°C</p>
          <p id='location' className="text-2xl font-medium text-gray-600">{weatherData.location}</p>
          <p id='weather-description' className="text-xl text-gray-500 mt-2 capitalize">{weatherData.description}</p>

          <div id='weather-data' className="flex justify-between mt-6 text-gray-600">
            <div className="flex flex-col items-center space-y-2">
              <img src={humidity} alt="humidity" className="w-10" />
              <p className="text-2xl font-semibold">{weatherData.humidity}%</p>
              <span className="text-sm">Humidity</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <img src={wind} alt="wind speed" className="w-10" />
              <p className="text-2xl font-semibold">{weatherData.windSpeed} Km/h</p>
              <span className="text-sm">Wind Speed</span>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white text-2xl font-semibold">Fetching weather data...</p>
      )}
    </div>
  )
}

export default Weather
