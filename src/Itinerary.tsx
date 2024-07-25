import React from 'react';

import itineraryData from './assets/data.json';

interface ItineraryProps {
	country: string;
}

interface ItineraryDay {
  Activity: string;
  Description: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ country }) => {

	const isCountryAvailable = (country: PropertyKey) => {
		return itineraryData.hasOwnProperty(country);
	};

	return (
		<div className="container mt-5">
			<h1 className="mb-4">Travel Itinerary</h1>
			{isCountryAvailable(country) ? (
				Object.entries(itineraryData[country]).map(([day, value]) => (
					<div key={day} className="card d-flex flex-row bg-dark text-white mb-3">
						<div className="card-header">{day}</div>
						<div className="card-body">
							<h5 className="card-title">{(value as ItineraryDay)?.Activity}</h5>
							<p className="card-text">{(value as ItineraryDay)?.Description}</p>
						</div>
					</div>
				))
			) : (
				<p>No itinerary available for the selected country.</p>
			)}
		</div>)
};

export default Itinerary;

