import React from 'react'
import L from 'leaflet'; // 1. Import the Leaflet library
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

//  Define the emoji icon
const deliveryBoyIcon = L.divIcon({
    html: '<span style="font-size: 30px;">🛵</span>', // Your emoji string
    className: 'custom-emoji-icon', // Class to remove default background/borders
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Centers the icon over the coordinate
});

const deliveryAddressIcon = L.divIcon({
    html: '<span style="font-size: 30px;">📍</span>',
    className: 'custom-emoji-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

function DeliveryBoyTracking({ data }) {
    console.log("Current Data:", data);

    const riderLocLat = data?.deliveryBoyLocation?.lat;
    const riderLocLon = data?.deliveryBoyLocation?.lon;

    const deliveryLocLat = data?.deliveryAddress?.latitude;
    const deliveryLocLon = data?.deliveryAddress?.longitude;

    console.log(deliveryLocLat, deliveryLocLon)

    // Check if coordinates exist before proceeding
    if (!riderLocLat || !riderLocLon || !deliveryLocLat || !deliveryLocLon) {
        return (
            <div className="mt-3 h-48 flex items-center justify-center bg-gray-100 border rounded-lg">
                <p className="text-sm text-gray-500">Waiting for location data...</p>
            </div>
        );
    }

    const deliveryPath = [
        [riderLocLat, riderLocLon],
        [deliveryLocLat, deliveryLocLon]
    ]

    const centreMap = [riderLocLat, riderLocLon];

    return (
        <div className="mt-3 h-48 rounded-lg overflow-hidden border">
            <MapContainer
                style={{ height: "100%", width: "100%" }} // <--- This is the most important fix
                center={centreMap}
                zoom={15}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={centreMap} icon={deliveryBoyIcon}>
                    <Popup>Rider is here</Popup>
                </Marker>

                {deliveryLocLat && (
                    <Marker position={[deliveryLocLat, deliveryLocLon]} icon={deliveryAddressIcon}>
                        <Popup>Delivery Address</Popup>
                    </Marker>
                )}

                {/* The Navigator Line */}
                <Polyline
                    positions={deliveryPath}
                    color="blue"
                    dashArray="10, 10" //makes the line dashed
                    weight={3}
                />

            </MapContainer>
        </div>
    )
}

export default DeliveryBoyTracking;
