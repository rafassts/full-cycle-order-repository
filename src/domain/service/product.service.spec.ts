import Product from "../entity/product";
import ProductService from "./product.service";

describe("Product service unit tests",() => {

    it("should change prices of all products",() => {
        const product1 = new Product("1","Celular",1200);
        const product2 = new Product("2","Teclado Mecânico",300);
 
        const productsX = ProductService.increasePrice([product1,product2], 100);

        expect(productsX[0].Price).toBe(2400);
        expect(productsX[1].Price).toBe(600);
    });

});