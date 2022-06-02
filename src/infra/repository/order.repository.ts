import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_Item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {

        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity
            })),
        },
        {
            include: [{model: OrderItemModel}] //insere junto
        });
    }
   
    async find(id: string): Promise<Order> {
        try{
            const orderModel = await OrderModel.findOne({
                where: {id: id},
                include: ["items"]
            });
            const order = new Order(
                orderModel.id, 
                orderModel.customer_id,
                orderModel.items.map((item) => {
                    return new OrderItem(item.id,item.product_id, item.name,item.quantity,item.price);
                })
            );

            order.total();

            return order;
        }catch(error){
            throw new Error("Order not found");
        }
    }
    
    async findAll(): Promise<Order[]> {
        try{
            const orderModel = await OrderModel.findAll({
                include: ["items"]
            });

            const list = orderModel.map((ord) => {
                const order = new Order(
                    ord.id, 
                    ord.customer_id,
                    ord.items.map((item) => {
                        return new OrderItem(item.id,item.product_id, item.name,item.quantity,item.price);
                    })
                );
    
                order.total();
    
                return order;
            });

            return list;
           
        }catch(error){
            throw new Error("Orders not found");
        }
    }

    async update(entity: Order): Promise<void> {
        const seq = OrderModel.sequelize;
        
        await seq.transaction(async t => {

            await OrderItemModel.destroy({
                where: { order_id: entity.id },
                transaction: t,
            });

            const items = entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id,
            }));
            
            await OrderItemModel.bulkCreate(items, { transaction: t });

            //atualização somente do total do pedido
            await OrderModel.update(
                { total: entity.total() },
                { where: { id: entity.id }, transaction: t}
            );
        });
    }

}