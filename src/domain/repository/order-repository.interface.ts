import Order from "../entity/order";
import OrderItem from "../entity/order_Item";
import RepositoryInterface from "./repository-interface";

export default interface OrderRepositoryInterface extends RepositoryInterface<Order> {
}