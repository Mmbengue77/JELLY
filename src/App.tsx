import React, { useState, useEffect } from 'react';
import './App.css';
import './loader.css';
import datas from './cities-fr.json'
import axios from 'axios';
function App() {
    const apikey = "375703f2b2811efd7bd2d2a9f77682b7"
    const [myCity, setMycity] = useState('');
    const [selectedCityWeather, setSelectedCityWeather] = useState([]);
    const [selectedCityMain, setSelectedCityMain] = useState(0);
    const [selectedCityId, setSelectedCityId] = useState(0);
    const [forcastWeatherToday, setForcastWeatherToday] = useState({
        "temp_min": 0,
        "temp_max": 0,
    });
    const [forcastWeatherTmrw, setForcastWeatherTmrw] = useState({
        "temp_min": 0,
        "temp_max": 0,
    });
    const [forcastWeatherAfterTmrw, setForcastWeatherAfterTmrw] = useState({
        "temp_min": 0,
        "temp_max": 0,
    });
    const [forcastWeatherTodayIcon, setForcastWeatherTodayIcon] = useState(0);
    const [forcastWeatherTmrwIcon, setForcastWeatherTmrwIcon] = useState(0);
    const [forcastWeatherAfterTmrwIcon, setForcastWeatherAfterTmrwIcon] = useState(0);

    const [loading, setLoading] = useState(true);

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date();
    let today = weekday[d.getDay()];
    let tomorrow = weekday[d.getDay() + 1];
    let afterTomorrow = weekday[d.getDay() + 2];

    useEffect(() => {
        // To show the loader for 2s, since the cities are loaded from a json file
        const t = setTimeout(() => {
             setLoading(false);
        }, 2000);
        
        return () => {
            clearTimeout(t);
            //In order to initialize the weather data when the page is loaded
            getDataFromAPI(datas[0])
            setMycity(datas[0].nm.toUpperCase())
            getforcastWeather(datas[0].id)
        }
    }, [])



    function showSelectedCity(cityID: any) {
        setLoading(true);
        const myCity = datas.find((city) => {
            return city.id == cityID
        })
        if (myCity) {
            setMycity(myCity.nm.toUpperCase())
        }

        getDataFromAPI(myCity)
    }
    async function getDataFromAPI(selectedCity: any) {
        setLoading(true);
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedCity?.lat}&lon=${selectedCity?.lon}&appid=${apikey}`).then((result) => {
            
        setSelectedCityWeather(result.data.weather)
            if (result.data.main.temp) {
                const tempInCelsius = Math.round(result.data.main.temp - 273.15);
                setSelectedCityMain(tempInCelsius);
            }
            setSelectedCityId(result.data.id);
            getforcastWeather(selectedCityId)
            // To show the loader for 300ms
            const t = setTimeout(() => {
                setLoading(false);

            }, 300);
            return () => {
                clearTimeout(t);
            }
        })
            .catch((err) => {
                console.log(err.message);
            });

    }

    async function getforcastWeather(cityId: any) {
        axios.get(`http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&cnt=3&appid=${apikey}`)
            .then((result) => {
                setForcastWeatherToday(result.data.list[0].main)
                setForcastWeatherTodayIcon(result.data.list[0].weather[0].id)
                setForcastWeatherTmrw(result.data.list[1].main)
                setForcastWeatherTmrwIcon(result.data.list[1].weather[0].id)
                setForcastWeatherAfterTmrw(result.data.list[2].main)
                setForcastWeatherAfterTmrwIcon(result.data.list[2].weather[0].id)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    return (
        <div className='weather'>
            <label>selectionner votre ville </label>
            <select onChange={e => { showSelectedCity(e.target.value) }}>
                {datas.map((city) => {
                    return <option key={city.id} value={city.id}>{city.nm}</option>
                })}
            </select>
           {loading ? <div className="lds-dual-ring"> <div className="center"/></div> :
                <>
                 <div id='city'>
                {myCity}
            </div>
                {selectedCityWeather.map((w: any) => {
                    return (
                        <div key={w.id} id='weatherInfo'>
                            <div className="wi">
                                <i className={`wi-icon-${w.id}`} />
                            </div>
                            <div id="temp">{selectedCityMain} &#xB0;</div>
                        </div>
                    )
                })}
                <table>
                    <thead>
                        <tr>
                            <td>{today}</td>
                            <td>{tomorrow}</td>
                            <td>{afterTomorrow}</td>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className="wi-forcast">
                            <td ><i className={`wi-icon-${forcastWeatherTodayIcon}`}/></td>
                            <td ><i className={`wi-icon-${forcastWeatherTmrwIcon}`}/></td>
                            <td ><i className={`wi-icon-${forcastWeatherAfterTmrwIcon}`}/></td> 
                        </tr>
                        <tr>
                            <td>{Math.round(forcastWeatherToday.temp_min - 273.15)} &#xB0;</td>
                            <td>{Math.round(forcastWeatherTmrw.temp_min - 273.15)} &#xB0;</td>
                            <td>{Math.round(forcastWeatherAfterTmrw.temp_min - 273.15)} &#xB0;</td>
                        </tr>
                        <tr>
                            <td>{Math.round(forcastWeatherToday.temp_max - 273.15)} &#xB0;</td>
                            <td>{Math.round(forcastWeatherTmrw.temp_max - 273.15)} &#xB0;</td>
                            <td>{Math.round(forcastWeatherAfterTmrw.temp_max - 273.15)} &#xB0;</td>
                        </tr>
                    </tbody>
                </table>
                </>
           }
        </div>
    );
}

export default App;
