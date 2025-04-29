import {RoutePoint} from "../../../src/core/models/RoutePoint";
import {LatLng} from "../../../src/core/models/LatLng";

describe("RoutePoint", () =>{
    const testPosition: LatLng = {latitude: 37.7784, longitude: -122.4145};
    const testTimeStamp = new Date("2025-04-23T11:30:00Z");
    const testAccuracy = Number.POSITIVE_INFINITY;

    test("create a RoutePoint with default accuracy", () =>{
        const point = new RoutePoint(testPosition, testTimeStamp);
        expect(point.position).toEqual(testPosition);
        expect(point.timestamp).toEqual(testTimeStamp);
        expect(point.accuracy).toEqual(testAccuracy);
    });

    test("create a RoutePoint with custom accuracy", () =>{
        const accuracy = 0.5;
        const point = new RoutePoint(testPosition, testTimeStamp, {accuracy: 0.5});

        expect(point.accuracy).toEqual(accuracy);
    });

    test("accuracy cannot be negative", ()=> {
        expect(() => {
           new RoutePoint(testPosition, testTimeStamp, {accuracy: -1});
        }).toThrow('Accuracy cannot be negative');
    });

    test("should return true for equal points", () => {
        const point1 = new RoutePoint(testPosition, testTimeStamp, {accuracy:10});
        const point2 = new RoutePoint({latitude: 37.7784, longitude: -122.4145},
            new Date("2025-04-23T11:30:00Z"), {accuracy:10});

        expect(point1.equals(point2)).toBe(true);
    });

    test("should return false for different points", () => {
        const point1 = new RoutePoint(testPosition, testTimeStamp, {accuracy:10});
        const point2 = new RoutePoint({latitude: 37.7785, longitude: -122.4150},
            new Date("2025-04-23T11:30:00Z"), {accuracy:50});

        expect(point1.equals(point2)).toBe(false);
    });
});