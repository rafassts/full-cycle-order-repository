import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/entity/address';
import Customer from '../../domain/entity/customer';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';

describe("Customer repository test", () => {
    let seq: Sequelize;

    beforeEach(async () => {
        seq = new Sequelize({
           dialect: "sqlite",
           storage: ":memory:",
           logging: false,
           sync: {force: true},

        });

        seq.addModels([CustomerModel]);
        await seq.sync();
    });

    afterEach(async () => {
        await seq.close();
    });

    it("should create a customer", async () => {
        const repo = new CustomerRepository();
        const cust = new Customer("123","customer");
        const add = new Address("rua",1,"123456","cidade");
        cust.setAddress(add);
        await repo.create(cust);

        const model = await CustomerModel.findOne({where: {id: "123"}});

        expect(model.toJSON()).toStrictEqual({
            id: "123",
            name: cust.Name,
            active: cust.isActive(),
            rewardPoints: cust.rewardPoints,
            street: add.street,
            number: add.number,
            zipcode: add.zip,
            city: add.city
        });

    });

    it("should update a customer", async () => {
        const repo = new CustomerRepository();
        const cust = new Customer("123","customer");
        const add = new Address("rua",1,"123456","cidade");
        cust.setAddress(add);
        await repo.create(cust);

        cust.changeName("customer alterado")
        cust.addRewardPoints(5);

        repo.update(cust);

        const model = await CustomerModel.findOne({where: {id: "123"}});

        expect(model.toJSON()).toStrictEqual({
            id: "123",
            name: cust.Name,
            active: cust.isActive(),
            rewardPoints: cust.rewardPoints,
            street: add.street,
            number: add.number,
            zipcode: add.zip,
            city: add.city
        });
    });

    it("should find a customer", async () => {
        const repo = new CustomerRepository();
        const cust = new Customer("123","customer");
        const add = new Address("rua",1,"123456","cidade");
        cust.setAddress(add);
        await repo.create(cust);

        const model = await CustomerModel.findOne({where: {id: "123"}});
        const search = await repo.find("123");

        expect(model.toJSON()).toStrictEqual({
            id: "123",
            name: search.Name,
            active: search.isActive(),
            rewardPoints: search.rewardPoints,
            street: search.address.street,
            number: search.address.number,
            zipcode: search.address.zip,
            city: search.address.city
        });

    });

    it("should find all customers", async () => {
        const repo = new CustomerRepository();
        const cust = new Customer("123","customer");
        const add = new Address("rua",1,"123456","cidade");
        cust.setAddress(add);
        await repo.create(cust)

        const cust2 = new Customer("456","customer");
        const add2 = new Address("rua 2",2,"1234567","cidade 2");
        cust2.setAddress(add2);
        await repo.create(cust2)


        const search = await repo.findAll();
        const customers = [cust, cust2]

        expect(search).toEqual([cust, cust2]);
        expect(search).toHaveLength(2);

    });

    it("should thrown an error when customer is not found", () => {
        const repo = new CustomerRepository();
        expect(async () => {
            await repo.find("abc1231");
        }).rejects.toThrow("Customer not found");
    });

})