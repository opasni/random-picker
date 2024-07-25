import React from 'react';
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from 'leaflet';

import markerIcon from './assets/marker-icon-red.png';
import markerIcon2x from './assets/marker-icon-2x-red.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface LeafletProps {
	latlng: [number, number];
}

const mapStyle = { height: '400px', width: '100%', overflow: 'hidden' };

const customMarkerIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Leaflet: React.FC<LeafletProps> = ({ latlng }) => {
	return (
		<>
			<MapContainer center={latlng} zoom={6} style={mapStyle} className="m-auto">
				{/* <TileLayer
					url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				/> */}
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				<Marker position={latlng} icon={customMarkerIcon}  />
			</MapContainer>
		</>
	);
};

export default Leaflet;
