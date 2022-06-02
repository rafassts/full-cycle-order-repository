import { where } from "sequelize/types";
import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
    
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.Id,
            name: entity.Name,
            price: entity.Price
        });
    }
    async update(entity: Product): Promise<void> {
        await ProductModel.update({
            name: entity.Name,
            price: entity.Price
        },
        {
             where: 
             {
                id: entity.Id
             }
        });
    }
    async find(id: string): Promise<Product> {
        const prod = await ProductModel.findOne({where: {id}});
        return new Product(prod.id, prod.name,prod.price);
    }
    async findAll(): Promise<Product[]> {
        const prods = await ProductModel.findAll();
        return prods.map((p) => new Product(p.id,p.name,p.price));
    }

}