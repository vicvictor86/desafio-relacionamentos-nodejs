import Product from '@modules/products/infra/typeorm/entities/Product';
import Order from '../infra/typeorm/entities/Order';

interface ICreateOrderDTO {
  order: Order;

  product: Product;

  price: number;

  quantity: number;
}

export default ICreateOrderDTO;
