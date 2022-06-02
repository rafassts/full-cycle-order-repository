import Order from "./order";
import OrderItem from "./order_Item";


describe("order unit tests",() => {
    
    it("should throw error when id is empty",() =>{
        expect(() => {
            let order = new Order("","123",[]);
        }).toThrowError("Id is required");
     
    });

    it("should throw error when customer id is empty",() =>{
        expect(() => {
            let order = new Order("123","",[]);
        }).toThrowError("Customer id is required");
     
    });

    it("should calculate total",() =>{
        
        const item = new OrderItem("123","123","Celular",1,1000);
        const item2 = new OrderItem("123","123","Teclado Mecânico",2,300);
        const order = new Order("1","1",[item,item2]);

        expect(order.total()).toBe(1600);
     
    });

    it("should throw error if item qtd is greater than 0",() =>{
        
        expect(() => {
            const item = new OrderItem("123","123","Celular",0,100);
        }).toThrowError("Qtd should be greater than 0");
     
    });


});