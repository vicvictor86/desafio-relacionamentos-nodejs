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

    const modifyArrayProduct = productsDatabase.map(productDatabase => {
      const requestProduct = products.find(requestProduct => requestProduct.id === productDatabase.id)

      if(!requestProduct){
        throw new AppError('Product Not Found');
      }

      if(requestProduct.quantity > productDatabase.quantity){
        throw new AppError('Request to many products');
      }

      const modifyProduct = {
        product_id: productDatabase.id,
        quantity: requestProduct.quantity,
        price: productDatabase.price,
      } as IProductOrder;

      productDatabase.quantity -= requestProduct.quantity;
  
      return modifyProduct;
    });
    
    await this.productsRepository.updateQuantity(productsDatabase);

    const order = await this.ordersRepository.create({ customer, products: modifyArrayProduct });

    return order;
  }
}

export default CreateOrderService;
