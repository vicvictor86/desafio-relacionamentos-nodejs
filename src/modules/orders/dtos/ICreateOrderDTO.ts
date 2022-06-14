import Customer from '@modules/customers/infra/typeorm/entities/Customer';

interface IProductOrder {
  product_id: string;
  price: number;
  quantity: number;
}

interface ICreateOrderDTO {
  customer: Customer;
  products: IProductOrder[];
}

export { IProductOrder, ICreateOrderDTO };
