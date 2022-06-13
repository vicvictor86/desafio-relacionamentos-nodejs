import { Request, Response } from 'express';

import { container } from 'tsyringe';

import CreateOrderService from '@modules/orders/services/CreateOrderService';
import FindOrderService from '@modules/orders/services/FindOrderService';
import OrdersProducts from '../../typeorm/entities/OrdersProducts';

interface IResponse {  
  id: string;

  created_at: Date;

  updated_at: Date;

  customer: {
    email: string;
    id: string;
    name: string;
  };

  order_products: OrdersProducts[];
}

export default class OrdersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const id = request.params.id;

    const findOrderService = container.resolve(FindOrderService);

    const order = await findOrderService.execute({ id });

    return response.status(200).json(order);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { customer_id, products } = request.body;

    const createOrderService = container.resolve(CreateOrderService);

    const { customer, order_products, id, created_at, updated_at } = await createOrderService.execute({ customer_id, products });

    const formattedOrder = {
      id,
      created_at,
      updated_at,

      customer : {
        email: customer.email,
        id: customer.id,
        name: customer.name,
      },

      order_products,
    } as IResponse;

    return response.status(200).json(formattedOrder);
  }
}
