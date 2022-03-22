import { Status } from "../enums/statusenum";

export class BasicResponse {

    private status: number;
    private data: object;

    constructor(status: number, data ?: object){
        this.status = status;
        this.data = data;
    }
    
    public getData(){
        return this.data
    }

    public getStatusString() {
        return Status[this.status];
    }
    
}