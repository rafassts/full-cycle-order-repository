import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/entity/address';
import Customer from '../../domain/entity/customer';
import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order_Item';
import Product from '../../domain/entity/product';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import ProductModel from '../db/sequelize/model/product.model';
import CustomerRepository from './customer.repository';
import OrderRepository from './order.repository';
import ProductRepository from './product.repository';


describe("Order repository test", () => {
    let seq: Sequelize;

    beforeEach(async () => {
        seq = new Sequelize({
           dialect: "sqlite",
           storage: ":memory:",
           logging: false,
           sync: {force: true},

        });

        seq.addModels([OrderModel, CustomerModel, OrderItemModel, ProductModel]);  
        await seq.sync();
    }); 

    afterEach(async () => {
        await seq.close();
    });

    it("should create a new order", async () => {
        
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123","customer");
        const address = new Address("rua",1,"123456","cidade");
        customer.setAddress(address);
        await customerRepo.create(customer);

        const productRepo = new ProductRepository();
        const product = new Product("123","produto 1", 100);
        await productRepo.create(product);

        const orderRepo = new OrderRepository();
        const item = new OrderItem("123", product.Id, product.Name, 1, 100);
        const order = new Order("123", customer.Id,[item]);

        await orderRepo.create(order);

        //trazer com a navegação de item
        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.Id,
            total: order.total(),
            items: [
               {
                id: item.id,
                order_id: order.id,
                product_id: product.Id,
                quantity: item.quantity,
                name: item.name,
                price: item.price
               }
            ]
        });

    });

    it("should update an order", async () => {
        
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123","customer");
        const address = new Address("rua",1,"123456","cidade");
        customer.setAddress(address);
        await customerRepo.create(customer);

        const productRepo = new ProductRepository();
        const product = new Product("123","produto 1", 100);
        await productRepo.create(product);

        const orderRepo = new OrderRepository();
        const item = new OrderItem("123", product.Id, product.Name, 1, 100);
        const order = new Order("123", customer.Id,[item]);

        await orderRepo.create(order);
        
        //update
        const product2 = new Product("456","produto 1", 300);
        await productRepo.create(product2);

        const item2 = new OrderItem("456", product2.Id, product2.Name, 3, product2.Price);
        order.addItem(item2);
        order.removeItem(item.id);
            
        await orderRepo.update(order);

        //trazer com a navegação de item
        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.Id,
            total: order.total(),
            items: [
               {
                id: item2.id,
                order_id: order.id,
                product_id: product2.Id,
                quantity: item2.quantity,
                name: item2.name,
                price: item2.price
               }
            ]
        });

    });

    it("should find an order", async () => {
       
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123","customer");
        const address = new Address("rua",1,"123456","cidade");
        customer.setAddress(address);
        await customerRepo.create(customer);

        const productRepo = new ProductRepository();
        const product = new Product("123","produto 1", 100);
        await productRepo.create(product);

        const orderRepo = new OrderRepository();
        const item = new OrderItem("123", product.Id, product.Name, 1, 100);
        const order = new Order("123", customer.Id,[item]);

        await orderRepo.create(order);

        //trazer com a navegação de item
        const orderModel = await OrderModel.findOne({
            where: {id: order.id},
            include: ["items"]
        });

        const search = await orderRepo.find("123");

        expect(orderModel.toJSON()).toStrictEqual({
            id: search.id,
            customer_id: search.customerId,
            total: search.total(),
            items: [
               {
                id: search.items[0].id,
                order_id: search.id,
                product_id: search.items[0].productId,
                quantity: search.items[0].quantity,
                name: search.items[0].name,
                price: search.items[0].price
               }
            ]
        });

        expect(search.items).toHaveLength(1);
    });


    it("should find all orders", async () => {
       
        //customers
        const customerRepo = new CustomerRepository();
        const customer = new Customer("123","customer");
        const address = new Address("rua",1,"123456","cidade");
        customer.setAddress(address);
        await customerRepo.create(customer);

        const cust2 = new Customer("456","customer");
        const add2 = new Address("rua 2",2,"1234567","cidade 2");
        cust2.setAddress(add2);
        await customerRepo.create(cust2)

        //products
        const productRepo = new ProductRepository();
        const product = new Product("123","produto 1", 100);
        await productRepo.create(product);

        const product2 = new Product("456","produto 2", 200);
        await productRepo.create(product2);

        //orders
        const orderRepo = new OrderRepository();

        const item = new OrderItem("123", product.Id, product.Name, 1, product.Price);
        const order = new Order("123", customer.Id,[item]);
        await orderRepo.create(order);

        const item2 = new OrderItem("456", product2.Id, product2.Name, 1, product2.Price);
        const order2 = new Order("456", cust2.Id,[item2]);
        await orderRepo.create(order2);

        const search = await orderRepo.findAll();
        const orderList = [order, order2]

        expect(orderList).toEqual(search);
        expect(search).toHaveLength(2);

    });

})