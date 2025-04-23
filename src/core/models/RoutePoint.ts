import {LatLng} from "./LatLng";

export class RoutePoint{
    private readonly _position: LatLng;
    private readonly _timestamp: Date;
    private readonly _accuracy: number;


    constructor(position: LatLng, timeStamp: Date, options:{accuracy?: number} = {}){
        if (options.accuracy !== undefined && options.accuracy < 0 ){
            throw new Error('Accuracy cannot be negative');
        }

        this._position = position;
        this._timestamp = timeStamp;
        this._accuracy = options.accuracy ?? Number.POSITIVE_INFINITY;
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

    equals(other: RoutePoint): boolean{
        return(
            this._position.latitude === other._position.latitude &&
                this._position.longitude === other._position.longitude &&
                this._timestamp.getTime() === other._timestamp.getTime() &&
                this.accuracy === other._accuracy
        );
    }

    toString() : string{
        return `RoutePoint(positions : {lat: ${this._position.latitude}, long: ${this.position.longitude}
            timestamp: ${this._timestamp}, accuracy: ${this._accuracy})`
    }

}