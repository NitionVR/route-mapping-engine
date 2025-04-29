
export class LocationService{


    isAvailable(): boolean{
        return 'geolocation' in navigator &&
            typeof navigator.geolocation !== 'undefined' &&
            typeof navigator.geolocation.getCurrentPosition === 'function';
    }
}