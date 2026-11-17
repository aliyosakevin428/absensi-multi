import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Circle, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';

type Props = {
    latitude: number | null;
    longitude: number | null;
    radius: number;
    showRadius: boolean;
};

const pinIcon = L.divIcon({
    className: '',
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:#ef4444;border:3px solid #fff;box-shadow:0 0 0 2px rgba(0,0,0,.35)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

function FitToArea({ lat, lng, radius }: { lat: number; lng: number; radius: number }) {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();

        const bounds = L.latLng(lat, lng).toBounds(radius * 2);
        map.fitBounds(bounds, { padding: [24, 24], maxZoom: 19 });
    }, [map, lat, lng, radius]);

    return null;
}

export default function LocationViewer({ latitude, longitude, radius = 100, showRadius = true }: Props) {
    const position: [number, number] = [latitude, longitude];

    return (
        <div className="relative isolate z-0 h-75 overflow-hidden rounded-md border">
            <MapContainer center={position} zoom={17} maxZoom={21} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    className="dark:[filter:invert(1)_hue-rotate(180deg)_brightness(0.95)_contrast(0.9)]"
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    maxNativeZoom={19}
                    maxZoom={21}
                />

                <Marker position={position} icon={pinIcon} />

                {showRadius && <Circle center={position} radius={radius} pathOptions={{ color: '#3b82f6', fillOpacity: 0.15 }} /> }

                <FitToArea lat={latitude} lng={longitude} radius={radius} />

            </MapContainer>
        </div>
    );
}
