import {PermissionStatus} from "../models/PermissionStatus";

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
                        default:
                            reject(error);
                    }
                }
            )
        });
    }

}