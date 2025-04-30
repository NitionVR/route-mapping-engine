import {PermissionStatus} from "../models/PermissionStatus";
import {RoutePoint} from "../models/RoutePoint";
import {LatLng} from "../models/LatLng";

export class LocationService{


    isAvailable(): boolean{
        return 'geolocation' in navigator &&
            typeof navigator.geolocation !== 'undefined' &&
            typeof navigator.geolocation.getCurrentPosition === 'function';
    }

    async requestPermission() : Promise<PermissionStatus> {
        if (!this.isAvailable()) {
            throw new Error('Geolocation API is not available');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('Initial position is: ', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                    resolve(PermissionStatus.GRANTED);
                },
                (error) => {
                    switch(error.code){
                        case 1:
                            resolve(PermissionStatus.DENIED);
                            break;
                        case 2:
                            reject(new Error(
                                'Location cannot be determined.' +
                                'Ensure GPS is enabled and location services are turned on.'
                            ));
                            break;
                        case 3:
                            reject(new Error(
                               'The request to get user location timed out.'
                            ));
                            break;
                        default:
                            reject(error);
                    }
                }
            )
        });
    }

    async getCurrentLocation(): Promise<RoutePoint | null> {
        if (!this.isAvailable()){
            throw new Error('Geolocation API is not available');
        }

        return new Promise((resolve, reject) =>{
            navigator.geolocation.getCurrentPosition((position)=>{
                    const routePoint = this.positionToRoutePoint(position);
                    resolve(routePoint);
            },
                (error) =>{
                    console.error('Error getting location:', error);
                    reject(error);
                },
            );
        })

    }

    private positionToRoutePoint(position: GeolocationPosition) {
        const latLng: LatLng = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }

        let routePoint: RoutePoint;
        routePoint = new RoutePoint(latLng, new Date(position.timestamp)
            , {accuracy: position.coords.accuracy});
        return routePoint;
    }
}