import Product from "./product";

describe("Product unit tests", () => {
    
    it("should throw error when id is empty",() => {
        expect(() => {
            const product = new Product("","Product 1",100)
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty",() => {
        expect(() => {
            const product = new Product("123","",100)
        }).toThrowError("Name is required");
    });

    it("should throw error when price not greater than zero",() => {
        expect(() => {
            const product = new Product("123","Product 1",-2)
        }).toThrowError("Price must be greater than 0");
    });

    it("should change name", () => {
        const product = new Product("123","Product 1",100);
        product.changeName("Product 1x");
        expect(product.Name).toBe("Product 1x");
    });

    it("should change price", () => {
        const product = new Product("123","Product 1",100);
        product.changePrice(150);
        expect(product.Price).toBe(150);
    });

});