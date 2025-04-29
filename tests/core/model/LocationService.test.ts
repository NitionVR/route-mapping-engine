import {LocationService} from "../../../src/core/Services/LocationService";

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

describe('LocationService', ()=>{

    // As a user, I want to determine if GeoLocation API is available in the browser
    // So that I can proceed with location-based functionality
    let locationService: LocationService;

    beforeEach(()=>{
        locationService = new LocationService();
    });

    afterEach(() => {
        Object.defineProperty(global.navigator, 'geolocation',{
            value: undefined,
            configurable: true,
        })
    });

    test('isAvailable should return true when geolocation is available', ()=>{
        let mockGeo: ReturnType<typeof mockGeoLocation> = mockGeoLocation();
        expect(locationService.isAvailable()).toBe(true);
    });

    test('isAvailable should return false when geolocation is not available', ()=>{
        expect(locationService.isAvailable()).toBe(false);
    });
});