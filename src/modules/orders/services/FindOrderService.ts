import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import IOrdersProductsRepository from '../repositories/IOrdersProductsRepository';
import AppError from '@shared/errors/AppError';
import { IProductOrder } from '../dtos/ICreateOrderDTO';

interface IRequest {
  id: string;
}

interface IResponse {
  order: Order;
  
  customer: {
    id: string;
    name: string;
    email: string;
  }

  orderProducts: {
    product_id: string;
    price: string;
    quantity: number;
  };
}

@injectable()
class FindOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
    @inject('OrdersProductsRepository')
    private OrdersProductsRepository: IOrdersProductsRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    const order = await this.ordersRepository.findById(id);

    if(!order) {
      throw new AppError('Order does not exist');
    }

    const customer = await this.customersRepository.findById(order.customer_id);
    
    const ordersProducts = await this.OrdersProductsRepository.findByOrderId(order.id);

    if(!ordersProducts){
      throw new AppError('Order does not exist');
    }

    const responseOrder = {
      ...order,
      customer,
      order_products: ordersProducts,
    }as Order;
    
    console.log(responseOrder);

    return responseOrder;
  }
}

export default FindOrderService;
