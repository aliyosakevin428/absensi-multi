import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Button } from './ui/button';
import { Circle } from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: iconUrl, shadowUrl: shadowUrl });

type Props = {
    latitude: number | null;
    longitude: number | null;
    radius: number;
    onChange: (lat: number, lng: number, address?: string) => void;
};

const DEFAULT_CENTER: [number, number] = [-1.2379, 116.8529]; // for Balikpapan city

function ClickToSet({ onPick }: { onPick: (lat: number, lng: number)
    => void }) {
        useMapEvents({
            click(e) {
                onPick(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    }

function FlyTo({ lat, lng,  zoom }: { lat: number; lng: number; zoom?: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
}


function FixSize() {
    const map = useMap();
    useEffect(() => {
        const el = map.getContainer();
        const ro = new ResizeObserver(() => map.invalidateSize());
        ro.observe(el);
        const t = setTimeout(() => map.invalidateSize(), 300);
        return () => {
            ro.disconnect();
            clearTimeout(t);
        };
    }, [map]);
    return null;
}

export default function LocationPicker({ latitude, longitude, radius, onChange }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasPoint = latitude !== null && longitude !== null;

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, { headers: { 'Accept-Language': 'id' } },
            );
            const json = await res.json();
            return json.display_name as string | undefined;
        } catch {
            return undefined;
        }
    };

    const setPoint = async (lat: number, lng: number) => {
        const address = await reverseGeocode(lat, lng);
        onChange(Number(lat.toFixed(7)), Number(lng.toFixed(7)), address);
    };

    const useMyLocation = () => {
        setError(null);
        if (!navigator.geolocation) {
            setError('Browser tidak mendukung GPS');
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (p) => {
                await setPoint(p.coords.latitude, p.coords.longitude);
                setLoading(false);
            },
            (err) => {
                setError(err.message || 'Gagal mengambil lokasi. Pastikan izin lokasi telah diaktifkan.');
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
    };

    return (
        <div className="space-y-2">
            <Button type="button" variant="outline" onClick={useMyLocation} disabled={loading} className='mb-2 px-3 py-1 text-sm'>
                {loading ? 'Mengambil lokasi...' : 'Gunakan lokasi saya(GPS)'}
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="relative isolate z-0 h-72 overflow-hidden rounded-md border">
                <MapContainer
                    center={hasPoint ? [latitude!, longitude!] : DEFAULT_CENTER}
                    zoom={hasPoint ? 17 : 13}
                    minZoom={3}
                    maxZoom={21}
                    scrollWheelZoom
                    className="h-full w-full"
                >
                    <TileLayer
                        attribution='&copy; OpenSteetMap contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maxNativeZoom={19}
                        maxZoom={21}
                    />
                    <FixSize />
                    <ClickToSet onPick={setPoint} />
                    {hasPoint && (
                        <>
                            <FlyTo lat={latitude!} lng={longitude!} zoom={17} />
                            <Marker
                                position={[latitude!, longitude!]}
                                draggable
                                eventHandlers={{
                                    dragend: (e) => {
                                        const { lat, lng } = (e.target as L.Marker).getLatLng();
                                        setPoint(lat, lng);
                                    },
                                 }}
                            />
                            <Circle
                                center={[latitude!, longitude!]}
                                radius={radius}
                            />
                        </>
                    )}
                </MapContainer>
            </div>

            {hasPoint && (
                <p className="text-xs opacity-70">
                    Koordinat: {latitude}, {longitude}. Geser pin atau klik peta untuk menyesuaikan titik lokasi.
                </p>
            )}
        </div>
    );
}
