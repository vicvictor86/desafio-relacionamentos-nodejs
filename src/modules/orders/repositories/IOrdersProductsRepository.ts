import ICreateOrdersProductsDTO from '../dtos/ICreateOrdersProductsDTO';
import OrdersProducts from '../infra/typeorm/entities/OrdersProducts';

export default interface IOrdersRepository {
  create(data: ICreateOrdersProductsDTO): Promise<OrdersProducts>;
  findById(id: string): Promise<OrdersProducts | undefined>;
  findByProductId(product_id: string): Promise<OrdersProducts[] | undefined>;
  findByOrderId(order_id: string): Promise<OrdersProducts[] | undefined>;
  findByProductOrderId(product_id: string, order_id: string): Promise<OrdersProducts | undefined>;
}
