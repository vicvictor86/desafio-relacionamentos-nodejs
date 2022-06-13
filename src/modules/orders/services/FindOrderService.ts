import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
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
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    return undefined;
    // let order = await this.ordersRepository.findById(id);

    // if(!order) {
    //   throw new AppError('Order not found');
    // }

    // const products = await this.productsRepository.findAllById(order.order_products);

    // const customer = await this.customersRepository.findById(order.customer_id);

    // if(!customer){
    //   throw new AppError('Customer not found');
    // }

    // if(!products){
    //   throw new AppError('Products not found');
    // }

    // const modifyProduct = {
    //   product_id: productDatabase.id,
    //   quantity: productReq.quantity,
    //   price: productDatabase.price,
    // } as IProductOrder;

    // order = {
    //   ...order,
    //   customer,
    //   order_products: modifyProduct,
    // }

    // return order;
  }
}

export default FindOrderService;
