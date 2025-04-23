import {LatLng} from "./LatLng";

export class RoutePoint{
    private readonly _position: LatLng;
    private readonly _timestamp: Date;
    private readonly _accuracy: number;


    constructor(position: LatLng, timeStamp: Date, accuracy?:number){
        this._position = position;
        this._timestamp = timeStamp;

        this._accuracy = accuracy ?? Number.POSITIVE_INFINITY;
    }

    get position(): LatLng{
        return this._position;
    }

    get timeStamp(): Date{
        return this._timestamp;
    }

    get accuracy(): number{
        return this._accuracy;
    }

}