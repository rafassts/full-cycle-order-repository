import Product from "../entity/product";

export default class ProductService {
    static increasePrice(products: Product[], percentage: number): Product[] {
        products.forEach(product => {
            let price = product.Price;
            product.changePrice(price * (percentage/100) + price);
        });

        return products;
    }
}