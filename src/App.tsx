import React, { useState, useEffect } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize'
import Select, { MultiValue } from "react-select";
import Leaflet from './Leaflet';
import Confetti from 'react-confetti'
import { Wheel } from 'react-custom-roulette';
import { ReactNotifications, Store } from 'react-notifications-component'

import './App.css';
import Itinerary from './Itinerary';

interface Country {
  label: string;
  value: number;
  latlng: [number, number];
}

interface CountryOption {
  name: {
    common: string;
  },
  latlng: [number, number];
}

const App: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<MultiValue<Country | null>>([]);
  const [result, setResult] = useState<Country | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState<number | null>(null);

  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        const countryData = data
          .sort((a: CountryOption, b: CountryOption) => a.name.common.localeCompare(b.name.common))
          .map((country: CountryOption, index: number) => ({
            label: country.name.common,
            value: index,
            latlng: country.latlng
          }))
        setCountries(countryData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const pickRandomCountry = () => {
    const filteredCountries = getCountries();
    if (filteredCountries.length < 2) {
      Store.addNotification(
        {
          title: 'Warning',
          message: 'You need to select at least 2 countries!',
          type: 'warning',
          insert: 'top',
          container: 'bottom-right',
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 3000,
            onScreen: true
          }
        }
      );
    } else if (filteredCountries.length > 1) {
      const newPrize = Math.floor(Math.random() * filteredCountries.length) + 1;
      setPrizeNumber(newPrize);
      setTimeout(() => {
        setMustSpin(true);
      }, 1000);
    }
  };

  const handleStopSpinning = () => {
    const filteredCountries = selectedCountries.filter(country => country !== null) as Country[];
    setResult(filteredCountries[prizeNumber as number - 1]);
  };

  const getCountries = () => {
    return selectedCountries.filter(country => country !== null).map(country => ({
      option: country!.label,
    }))
  };

  return (
    <div className="app-container">
      <ReactNotifications />
      {!!result && (
        <Confetti
          width={width}
          height={height}
        />
      )}
      <h1>Črt's & Emily's Random Country Picker</h1>
      <div className="options-container mb-4">
        <Select
          defaultValue={selectedCountries}
          onChange={setSelectedCountries}
          className='react-select-container'
          classNamePrefix={'react-select'}
          isDisabled={!!prizeNumber}
          isMulti
          options={countries.filter(country => !selectedCountries?.includes(country))}
        />
      </div>
      {!!prizeNumber && (
        <div className='row row-cols-1 row-cols-lg-2 align-items-stretch g-4 py-5'>
          <div className='col'>
            <div className='card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg'>
              <div className="my-4 d-flex justify-content-center">
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber - 1}
                  data={getCountries()}
                  backgroundColors={['#ffe000', '#40E0D0', '#65c465']}
                  textColors={['#000000']}
                  outerBorderColor={'#ffffff'}
                  innerBorderWidth={8}
                  radiusLineWidth={0}
                  onStopSpinning={handleStopSpinning}
                />
              </div>
            </div>
          </div>
          {result && (
            <div className='col'>
              <div className='card card-cover h-100 overflow-hidden text-bg-dark rounded-4 shadow-lg'>
                <h2 className='pt-2'>{result.label}</h2>
                <div className='px-2'>
                  <Leaflet latlng={result.latlng} />
                </div>
              </div>
            </div>
          )}
        </div>
        // <div className="mt-4 d-flex justify-content-center">
        // </div>
      )}

      {!prizeNumber && <button className="btn btn-primary mb-4" onClick={pickRandomCountry}>Pick Our Trip!</button>}
      {!!result && <Itinerary country={result.label} />}
    </div>
  );
};

export default App;

