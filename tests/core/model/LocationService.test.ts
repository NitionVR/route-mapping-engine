import {LocationService} from "../../../src/core/Services/LocationService";
import {PermissionStatus} from "../../../src/core/models/PermissionStatus";
import {RoutePoint} from "../../../src/core/models/RoutePoint";

const mockGeoLocation = () =>{
    const getCurrentPositionMock = jest.fn();
    const watchPositionMock = jest.fn();
    const clearWatchMock = jest.fn();

    Object.defineProperty(global.navigator, 'geolocation', {
        value:{
            getCurrentPosition: getCurrentPositionMock,
            watchPosition: watchPositionMock,
            clearWatch: clearWatchMock
        },
        configurable: true
    });

    return{
        getCurrentPositionMock,
        watchPositionMock,
        clearWatchMock
    };
};

const mockPermissions = (state = 'granted') =>{
    const permissionMock = jest.fn().mockResolvedValue({state});

    Object.defineProperty(global.navigator, 'permissions', {
        value: {
            permission: permissionMock
        },
        configurable: true
    });

    return permissionMock;
};

function disableLocation() {
    Object.defineProperty(global.navigator, 'geolocation', {
        value: undefined,
        configurable: true,
    })
}

describe('LocationService', ()=>{

    let locationService: LocationService;
    let mockGeo: ReturnType<typeof mockGeoLocation>

    beforeEach(()=>{
        locationService = new LocationService();
        mockGeo = mockGeoLocation()
    });

    // As a user, I want to determine if GeoLocation API is available in the browser
    // So that I can proceed with location-based functionality

    test('isAvailable should return true when geolocation is available', ()=>{
        expect(locationService.isAvailable()).toBe(true);
    });


    test('isAvailable should return false when geolocation is not available', ()=>{
        disableLocation();
        expect(locationService.isAvailable()).toBe(false);
    });

    // As a user, I want to request permission to access my location so that I can use
    // location-based functionality

    test("requestPermission should return GRANTED when permission  is granted", async () => {
        mockPermissions('granted');

        mockGeo.getCurrentPositionMock.mockImplementation((success)=>{
           success({
               coords: {
                   latitude: 0,
                   longitude: 0,
                   accuracy: 0,
                   altitude: null,
                   altitudeAccuracy: null,
                   heading: null,
                   speed: null,
               },
               timestamp: 0,
           });
        });
        const result = await locationService.requestPermission();
        expect(result).toBe(PermissionStatus.GRANTED);
    });

    test('requestPermission should return DENIED when permissions API returns denied', async()=>{
        mockPermissions('denied');

        mockGeo.getCurrentPositionMock.mockImplementation((success, error)=>{
            error({code: 1, message: 'User denied location permissions'})
        });
        const result = await locationService.requestPermission();
        expect(result).toBe(PermissionStatus.DENIED);
    });

    test('requestPermission should reject with error when position is unavailable', async()=>{
        mockGeo.getCurrentPositionMock.mockImplementation((success, error)=>{
            error({code: 2, message: 'Position unavailable'});
        });
        await expect(locationService.requestPermission()).rejects.toThrow('Location cannot be determined.' +
            'Ensure GPS is enabled and location services are turned on.');
    });

    test('requestPermission should return reject with error when time out', async()=>{
        mockGeo.getCurrentPositionMock.mockImplementation((success, error)=>{
            error({code: 3, message: 'Timeout'});
        });
        await expect(locationService.requestPermission()).rejects.toThrow('The request to get user location ' +
            'timed out.');
    });

    test('requestPermission should return reject with original when unknown error when time out', async()=>{
        const unknownError = new Error("Unknown error");
        mockGeo.getCurrentPositionMock.mockImplementation((success, error)=>{
            error(unknownError);
        });
        await expect(locationService.requestPermission()).rejects.toThrow(unknownError);
    });


    // As a user, I want to access my current location so that I can use
    // location-based functionality

    test('getCurrentLocation should return a RoutePoint when successful', async () => {
        mockGeo.getCurrentPositionMock.mockImplementation((success) => {
            success({
                coords: {
                    latitude: 37.7749,
                    longitude: -122.4194,
                    accuracy: 10,
                    altitude: null,
                    altitudeAccuracy: null,
                    heading: null,
                    speed: null
                },
                timestamp: 1672574400000
            });
        });

        const result = await locationService.getCurrentLocation();

        expect(result).toBeInstanceOf(RoutePoint);
        expect(result?.position.latitude).toBe(37.7749);
        expect(result?.position.longitude).toBe(-122.4194);
        expect(result?.accuracy).toBe(10);
        expect(result?.timestamp).toEqual(new Date(1672574400000));
    });


    test('getCurrentLocation should return an error when location is not available', async() =>{
        disableLocation();
        await expect(locationService.getCurrentLocation()).rejects.toThrow(Error('Geolocation API is not available'));
    });

});