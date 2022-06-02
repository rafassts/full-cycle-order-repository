import OrderItem from "./order_Item";

export default class Order {

    private _id: string;
    private _customerId: string;
    private _total: number;
    private _items: OrderItem[] = [];

    constructor(id:string, customerId: string, items: OrderItem[]){
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.total();
        this.validate();
    }

    get id(): string{
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    total(): number {
        return this._items.reduce((acc,item) => acc + item.getTotal(),0);
    }

    calculateTotal() {
        this._total = this._items.reduce((acc,item) => acc + item.getTotal(),0);
    }

    addItem(item: OrderItem) {
        this._items.push(item);
        this.calculateTotal();
    }

    removeItem(itemId: string) {
        this._items.splice(this._items.findIndex(x => x.id == itemId),1);
        this.calculateTotal();
    }

    validate() { 
        if (this._id.length === 0) {
            throw new Error("Id is required")
        }
        if (this._customerId.length === 0) {
            throw new Error("Customer id is required")
        }
    }
}