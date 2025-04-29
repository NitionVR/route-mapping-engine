import {LocationService} from "../../../src/core/Services/LocationService";
import {PermissionStatus} from "../../../src/core/models/PermissionStatus";

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
        Object.defineProperty(global.navigator, 'geolocation',{
            value: undefined,
            configurable: true,
        })
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

});