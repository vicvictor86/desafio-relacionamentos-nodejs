import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import { IProductOrder } from '@modules/orders/dtos/ICreateOrderDTO';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);
    
    if(!customer) {
      throw new AppError('Customer does not exist');
    }

    const productsDatabase = await this.productsRepository.findAllById(products);

    if(productsDatabase.length !== products.length){
      throw new AppError('One of the products not exists');
    }

    const modifyArrayProduct = await Promise.all(productsDatabase.map(async productDatabase => {
      const productReq = products.find(productReq => productReq.id === productDatabase.id)

      if(!productReq){
        throw new AppError('Product Not Found');
      }

      if(productReq.quantity > productDatabase.quantity){
        throw new AppError('Request to many products');
      }

      await this.productsRepository.updateQuantity(products);

      const modifyProduct = {
        product_id: productDatabase.id,
        quantity: productReq.quantity,
        price: productDatabase.price,
      } as IProductOrder;

      return modifyProduct;
    }));

    const order = await this.ordersRepository.create({ customer, products: modifyArrayProduct});

    return order;
  }
}

export default CreateOrderService;
