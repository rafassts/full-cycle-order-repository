import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_Item";
import OrderService from "./order.service";

describe("Order service unit tests", () => {
    it("should sum all order totals",() => {
        const item1 = new OrderItem("123","123","Item 1",2,200);
        const item2 = new OrderItem("123","123","Item 1",3,200);

        const order1 = new Order("123","123",[item1]);
        const order2 = new Order("123","123",[item2]);

        const total = OrderService.getTotalOrders([order1,order2]);

        expect(total).toBe(1000);
        
    });

    it("should place order",() => {
        const customer = new Customer("1","Customer 1");
        const item1 = new OrderItem("123","123","Item 1",1,10);
        
        const order = OrderService.placeOrder(customer,[item1]);
        
        //regra: pontos equivalem a metade do valor da venda
        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });
});