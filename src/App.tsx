import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./cities-fr.json";
import axios from "axios";
import TableDisplay from "./tableDisplay";

interface IDATA {
  main: {
    temp_min: number;
    temp_max: number;
    temp: number;
  };
  weather: [{ id: string }];
}

interface ITEMP {
  today: IDATA;
  tomorrow: IDATA;
  afterTomorrow: IDATA;
}

function App() {
  const apikey = "8ef813d0af9fbc9574013c0de4ce76d0";
  const [datas] = useState(data);
  const [myCity, setMycity] = useState("");

  const [dataOpenWeather, setDataOpenWeather] = useState<ITEMP>({
    today: {
      main: {
        temp_min: 0,
        temp_max: 0,
        temp: 0,
      },
      weather: [{ id: "" }],
    },
    tomorrow: {
      main: {
        temp_min: 0,
        temp_max: 0,
        temp: 0,
      },
      weather: [{ id: "" }],
    },
    afterTomorrow: {
      main: {
        temp_min: 0,
        temp_max: 0,
        temp: 0,
      },
      weather: [{ id: "" }],
    },
  });

  //In order to initialize the weather data when the page is loaded
  useEffect(() => {
    getDataFromAPI(datas[0]);
    setMycity(datas[0].nm.toUpperCase());
  }, []);

  function showSelectedCity(cityID: any) {
    const myCity = datas.find((city) => {
      return city.id == cityID;
    });
    if (myCity) {
      setMycity(myCity.nm.toUpperCase());
    }

    getDataFromAPI(myCity);
  }
  async function getDataFromAPI(selectedCity: any) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity?.lat}&lon=${selectedCity?.lon}&appid=${apikey}`
      )
      .then((result) => {
        getforcastWeather(selectedCity.id);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function getforcastWeather(cityId: any) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&cnt=20&appid=${apikey}`
      )
      .then((result) => {
        setDataOpenWeather((prevState) => ({
          ...prevState,
          today: result.data.list[0],
        }));
        setDataOpenWeather((prevState) => ({
          ...prevState,
          tomorrow: result.data.list[8],
        }));
        setDataOpenWeather((prevState) => ({
          ...prevState,
          afterTomorrow: result.data.list[16],
        }));
        console.log(dataOpenWeather);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  return (
    <div className="weather">
      <label>selectionner votre ville </label>
      <select
        onChange={(e) => {
          showSelectedCity(e.target.value);
        }}
      >
        {datas.map((city) => {
          return (
            <option key={city.id} value={city.id}>
              {city.nm}
            </option>
          );
        })}
      </select>
      <div id="city">{myCity}</div>
      <div key={dataOpenWeather.today.weather[0].id} id="weatherInfo">
        <div>
          <i className={`wi wi-icon-${dataOpenWeather.today.weather[0].id}`} />
        </div>
        <div id="temp">{Math.round(dataOpenWeather.today.main.temp - 273)}</div>
      </div>

      <TableDisplay dataOpenWeather={dataOpenWeather} />
    </div>
  );
}

export default App;
