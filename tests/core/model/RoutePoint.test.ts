import {RoutePoint} from "../../../src/core/models/RoutePoint";
import {LatLng} from "../../../src/core/models/LatLng";

describe("RoutePoint", () =>{
    const testPosition: LatLng = {latitude: 37.7784, longitude: -122.4145};
    const testTimeStamp = new Date("2025-04-23T11:30:00Z");
    const testAccuracy = Number.POSITIVE_INFINITY;

    test("create a RoutePoint with default accuracy", () =>{
        const point = new RoutePoint(testPosition, testTimeStamp);
        expect(point.position).toEqual(testPosition);
        expect(point.timeStamp).toEqual(testTimeStamp);
        expect(point.accuracy).toEqual(testAccuracy);

    });
});