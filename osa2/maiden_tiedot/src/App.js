import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'


const CountryList = ({list, handle}) => (
  list && list.length>0
    ? list.length<=10
      ? list.map( f => (
        <div key={f.name.common}>{f.name.common}
          <button name={f.name.common} onClick={handle}>show</button>
        </div>
      ) )
      : <div>Too many matches, specify another filter</div>
    : <div>No countries found matching filter</div>
)

const Invidual = ({info}) => (
  <div>
    <h1>{info.name.common}</h1>
    <div>
      {
        info.capital
          ? info.capital.map( c => <div key={c}>capital: {c}</div> )
          : null
      }
      <div>population: {info.population}</div>
    </div>
    <h2>Spoken languages</h2>
    <div>
      <ul>
        { Object.values(info.languages).map( l => <li key={l}>{l}</li> ) }
      </ul>
    </div>
    <div className="flag">{info.flag}</div>
    { info.capital ? <Weather place={info.capital[0]} /> : null }
  </div>
)

const Weather = ({place}) => {
  const [weather, setWeather] = useState(null);
  const owmAppId = process.env.REACT_APP_OWM_APPID

  useEffect( () => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${owmAppId}`)
      .then( resp => {
        setWeather(resp.data)
      })
  }, [place, owmAppId])
  
  if (weather) return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <div>temperature: {(weather.main.temp-273.15).toFixed(1)}°C</div>
      <div>
        wind: {(weather.wind.speed).toFixed(1)} m/s (
        direction: {weather.wind.deg}°)
      </div>
      { weather.weather.map ( w =>
        <img src={`http://openweathermap.org/img/wn/${w.icon}@4x.png`}
            alt={w.description} key={w.icon} />
      ) }
    </div>
  )
  return null
}

const App = () => {
  const [countries, setCountries] = useState(null);
  const [invidual, setInvidual] = useState(null);
  const [filter, setFilter] = useState("");
  
  useEffect( () => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then( resp => {
        setCountries(resp.data)
      })
  }, [])
  
  const filterHandle = (event) => {
    setFilter(event.target.value)
    setInvidual(null)
  }
  
  const filteredCountries = countries
    ? countries.filter( c => c.name.common.toLowerCase().includes(filter) )
    : null
    
  if (filteredCountries && !invidual && filteredCountries.length===1) {
    setInvidual(filteredCountries[0])  
  }
  
  const invidualHandle = (event) => {
    setInvidual(countries.filter( c => c.name.common === event.target.name)[0])
  }

  return (
    <div>
      <form>
        <div>
          find countries:
          <input value={filter} onChange={filterHandle} />
        </div>
      </form>
      <div>{
        invidual
          ? <Invidual info={invidual} />
          : <CountryList list={filteredCountries} handle={invidualHandle} />
      }</div>
    </div>
  )
}

export default App;