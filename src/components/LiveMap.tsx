"use client";
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProps {
  userLocation: ILocation;
  deliverBoyLocation: ILocation;
}

function Recenter({ positions }: { positions: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (positions[0] !== 0 && positions[1] !== 0) {
      map.setView(positions, 13, {
        animate: true,
      });
    }
  }, [positions, map]);
  return null;
}

const LiveMap = ({ userLocation, deliverBoyLocation }: IProps) => {
  const deliverBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
    popupAnchor: [0, -20],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
    popupAnchor: [0, -20],
  });

  const linePosition = [
    [userLocation.latitude, userLocation.longitude],
    [deliverBoyLocation.latitude, deliverBoyLocation.longitude],
  ];

  const center = [
    (userLocation.latitude + deliverBoyLocation.latitude) / 2,
    (userLocation.longitude + deliverBoyLocation.longitude) / 2,
  ];

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <Recenter positions={center as [number, number]} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup className="rounded-lg px-2 py-1">
            <div className="text-center">
              <p className="font-medium text-gray-800">Your Location</p>
              <p className="text-xs text-gray-500">Delivery Address</p>
            </div>
          </Popup>
        </Marker>

        {/* Delivery Boy Marker */}
        {deliverBoyLocation.latitude !== 0 && (
          <Marker
            position={[
              deliverBoyLocation.latitude,
              deliverBoyLocation.longitude,
            ]}
            icon={deliverBoyIcon}
          >
            <Popup className="rounded-lg px-2 py-1">
              <div className="text-center">
                <p className="font-medium text-gray-800">Delivery Partner</p>
                <p className="text-xs text-gray-500">Moving towards you</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {deliverBoyLocation.latitude !== 0 && (
          <Polyline
            positions={linePosition as any}
            color="#16a34a"
            weight={4}
            opacity={0.7}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Map Overlay Info */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700">
            Live Tracking
          </span>
        </div>

        {deliverBoyLocation.latitude !== 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <p className="text-xs text-gray-600">Est. arrival</p>
            <p className="text-sm font-semibold text-gray-800">10-15 min</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMap;
