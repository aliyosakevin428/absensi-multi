export type GeoFix = { lat: number; lng: number; accuracy: number };

type Options = {
    targetAccuracy?: number;
    maxWaitMs?: number;
    onProgress?: (fix: GeoFix) => void;
};

export function getBestPosition({ targetAccuracy = 30, maxWaitMs = 12000, onProgress }: Options = {}): Promise<GeoFix>{
    return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
            reject(new Error('Browser tidak mendukung geolokasi GPS'));
            return;
        }

        let best: GeoFix | null = null;
        let settled = false;
        let watchId = 0;

        const cleanup = () => {
            navigator.geolocation.clearWatch(watchId);
            clearTimeout(timer);
        };

        const finish = () => {
            if (settled) return;
            settled = true;
            cleanup();
            if (best) resolve(best);
            else reject(new Error('Tidak dapat menemukan lokasi'));
        };

        const timer = setTimeout(finish, maxWaitMs);

        watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const fix: GeoFix = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                    accuracy: pos.coords.accuracy,
                };

                if (!best || fix.accuracy < best.accuracy) {
                    best = fix;
                    onProgress?.(fix);
                }

                if (fix.accuracy <= targetAccuracy) finish();
            },
            (err) => {
                if (settled) return;
                if (best) return finish();
                settled = true;
                cleanup();
                reject(err);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
    });
}
