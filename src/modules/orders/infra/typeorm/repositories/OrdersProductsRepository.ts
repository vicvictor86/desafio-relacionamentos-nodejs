import { getRepository, Repository } from 'typeorm';

import IOrdersProductsRepository from '@modules/orders/repositories/IOrdersProductsRepository';
import ICreateOrdersProductsDTO from '@modules/orders/dtos/ICreateOrdersProductsDTO';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersProductsRepository implements IOrdersProductsRepository {
  private ormRepository: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(OrdersProducts);
  }

  public async create({ order, product, price, quantity }: ICreateOrdersProductsDTO): Promise<OrdersProducts> {
    const orderProduct = this.ormRepository.create({
      order_id: order.id,
      order: order,
      product_id: product.id,
      product,
      price,
      quantity,
    })

    await this.ormRepository.save(orderProduct);

    return orderProduct;
  }

  public async findById(id: string): Promise<OrdersProducts | undefined> {
    const orderProduct = await this.ormRepository.findOne(id);

    return orderProduct;
  }

  public async findByProductOrderId(product_id: string, order_id: string): Promise<OrdersProducts | undefined> {
    const orderProduct = await this.ormRepository.findOne({
      where: {
        product_id,
        order_id,
      }
    });

    return orderProduct;
  }

  public async findByOrderId(order_id: string): Promise<OrdersProducts[] | undefined> {
    const orderProduct = await this.ormRepository.find({
      where: {
        order_id,
      }
    });

    return orderProduct;
  }

  public async findByProductId(product_id: string): Promise<OrdersProducts[] | undefined> {
    const orderProduct = await this.ormRepository.find({
      where: {
        product_id,
      }
    });

    return orderProduct;
  }
}

export default OrdersProductsRepository;
