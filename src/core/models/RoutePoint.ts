import {LatLng} from "./LatLng";

export class RoutePoint{
    private readonly _position: LatLng;
    private readonly _timestamp: Date;


    constructor(position: LatLng, timeStamp: Date){
        this._position = position;
        this._timestamp = timeStamp;
    }

    get position(): LatLng{
        return this._position;
    }

    get timeStamp(): Date{
        return this._timestamp;
    }

}