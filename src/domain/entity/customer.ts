import Address from "./address";

export default class Customer {
    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean;
    private _rewardPoints: number;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this._active = false;
        this._rewardPoints = 0;
        this.validate();
    }

    get Id(): string {
        return this._id;
    }

    get address(): Address {
        return this._address;
    }

    changeName(name: string) {
        this._name = name;
    }

    get Name(): string {
        return this._name;
    }

    activate() {
        if(!this._address){
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    setAddress(address: Address){
        this._address = address;
    }

    isActive(){
        return this._active;
    }

    addRewardPoints(points: number){
        this._rewardPoints += points;
    }

    removeRewardPoints(points:number){
        if (this._rewardPoints - points < 0){
            throw new Error("Cannot remove more than all reward points");
        }
        this._rewardPoints -= points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() { 
        if (this._id.length === 0) {
            throw new Error("Id is required")
        }
        if (this._name.length === 0) {
            throw new Error("Name is required")
        }
    }

}