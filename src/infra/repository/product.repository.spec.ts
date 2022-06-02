import { Sequelize } from "sequelize-typescript";
import Product from "../../domain/entity/product";
import ProductModel from "../db/sequelize/model/product.model";
import ProductRepository from "./product.repository";

describe("Product repository test",() => {
    let seq: Sequelize;

    beforeEach(async () => {
        seq = new Sequelize({
           dialect: "sqlite",
           storage: ":memory:",
           logging: false,
           sync: {force: true},

        });

        seq.addModels([ProductModel]);
        await seq.sync();
    });

    afterEach(async () => {
        await seq.close();
    });

    it("should create a product", async () => {
        const repo = new ProductRepository();
        const prod = new Product("123","produto",100);

        await repo.create(prod);

        const productModel = await ProductModel.findOne({where: {id: "123"}});

        expect(productModel.toJSON()).toStrictEqual({
            id: "123",
            name: "produto",
            price: 100
        });

    });

    it("should update a product", async () => {
        const repo = new ProductRepository();
        const prod = new Product("123","produto",100);
        await repo.create(prod);

        prod.changeName("produto alterado");
        prod.changePrice(200);
        await repo.update(prod);

        const productModel = await ProductModel.findOne({where: {id: "123"}});

        expect(productModel.toJSON()).toStrictEqual({
            id: "123",
            name: "produto alterado",
            price: 200
        });
    });

    it("should find a product", async () => {
        const repo = new ProductRepository();
        const prod = new Product("123","produto",100);
        await repo.create(prod);

        const productModel = await ProductModel.findOne({where: {id: "123"}});
        const productTest = await repo.find("123");
        
        expect(productModel.toJSON()).toStrictEqual({
            id: productTest.Id,
            name: productTest.Name,
            price: productTest.Price
        });

    });

    it("should find all products", async () => {
        const repo = new ProductRepository();
        const prod = new Product("123","produto",100);
        const prod2 = new Product("456","produto 2",200);

        await repo.create(prod);
        await repo.create(prod2);

        const productsTest = await repo.findAll();
        const products = [prod, prod2]

        expect(products).toEqual(productsTest);

    });

});