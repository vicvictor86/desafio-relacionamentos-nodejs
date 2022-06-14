import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';
import AppError from '@shared/errors/AppError';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({name, price, quantity});

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where:{
        name
      },
    });

    return product;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productsArray = await this.ormRepository.findByIds(products);

    if(!productsArray){
      return [];
    }

    return productsArray;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const productsDatabase = await this.ormRepository.findByIds(products);

    if(!productsDatabase){
      return [];
    }
    
    productsDatabase.map( async productDatabaseBase => {
      const productReq = products.find(productReq => productReq.id === productDatabaseBase.id);
      
      if(!productReq){
        throw new AppError('Product not found');
      }

      productDatabaseBase.quantity -= productReq.quantity;
      await this.ormRepository.save(productDatabaseBase);
    })

    return productsDatabase;
  }
}

export default ProductsRepository;
