import React, { useState, useEffect } from "react";
import "./App.css";
import data from "./cities-fr.json";
import axios from "axios";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";

import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

function App() {
  const apikey = "8ef813d0af9fbc9574013c0de4ce76d0";
  const [datas, setDatas] = useState(data);
  const [myCity, setMycity] = useState("");
  const [firstCity, setfirtsCity] = useState(0);
  const [selectedCity, setSelectedCity] = useState({});
  const [selectedCityWeather, setSelectedCityWeather] = useState([]);
  const [selectedCityMain, setSelectedCityMain] = useState(0);
  const [selectedCityId, setSelectedCityId] = useState(0);
  const [forcastWeatherToday, setForcastWeatherToday] = useState({
    temp_min: 0,
    temp_max: 0,
  });
  const [forcastWeatherToomorow, setForcastWeatherToomorow] = useState({
    temp_min: 0,
    temp_max: 0,
  });
  const [forcastWeatherAfterToomorow, setForcastWeatherAfterToomorow] =
    useState({
      temp_min: 0,
      temp_max: 0,
    });
  const [test, setTest] = useState([]);
  console.log("test", test);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date();
  let today = weekday[d.getDay()];
  let tomorrow = weekday[d.getDay() + 1];
  let afterTomorrow = weekday[d.getDay() + 2];

  //In order to initialize the weather data when the page is loaded
  useEffect(() => {
    setSelectedCity(datas[0]);
    getDataFromAPI(datas[0]);
    setMycity(datas[0].nm.toUpperCase());
    if (datas.length > 0) {
      setfirtsCity(datas[0].id);
    }
  }, []);

  function showSelectedCity(cityID: any) {
    const myCity = datas.find((city) => {
      return city.id == cityID;
    });
    if (myCity) {
      setMycity(myCity.nm.toUpperCase());
      setSelectedCity(myCity);
    }

    getDataFromAPI(myCity);
  }
  async function getDataFromAPI(selectedCity: any) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity?.lat}&lon=${selectedCity?.lon}&appid=${apikey}`
      )
      .then((result) => {
        setSelectedCityWeather(result.data.weather);

        if (result.data.main.temp) {
          const tempInCelsius = Math.round(result.data.main.temp - 273.15);
          setSelectedCityMain(tempInCelsius);
        }
        setSelectedCityId(result.data.id);
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
        setForcastWeatherToday(result.data.list[0].main);
        setForcastWeatherToomorow(result.data.list[8].main);
        setForcastWeatherAfterToomorow(result.data.list[16].main);

        console.log(result.data.list);
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
      {selectedCityWeather.map((w: any) => {
        return (
          <div key={w.id} id="weatherInfo">
            <div className="">
              <i className={`wi wi-icon-${w.id}`} />
            </div>
            <div id="temp">{selectedCityMain} &#xB0;</div>
          </div>
        );
      })}

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">{today}</TableCell>
              <TableCell align="center">{tomorrow}</TableCell>
              <TableCell align="right">{afterTomorrow}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                {Math.round(forcastWeatherToday.temp_min - 273)}
              </TableCell>
              <TableCell align="center" component="th" scope="row">
                {Math.round(forcastWeatherToomorow.temp_min - 273)}
              </TableCell>
              <TableCell align="right" component="th" scope="row">
                {Math.round(forcastWeatherAfterToomorow.temp_min - 273)}
              </TableCell>
            </TableRow>
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="left" component="th" scope="row">
                {Math.round(forcastWeatherToday.temp_max - 273)}
              </TableCell>
              <TableCell align="center" component="th" scope="row">
                {Math.round(forcastWeatherToomorow.temp_max - 273)}
              </TableCell>
              <TableCell align="right" component="th" scope="row">
                {Math.round(forcastWeatherAfterToomorow.temp_max - 273)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
