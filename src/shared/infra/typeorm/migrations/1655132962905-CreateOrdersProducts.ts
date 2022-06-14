import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateOrdersProducts1655132962905 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
            await queryRunner.createTable(new Table({
                name: 'orders_products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'order_id',
                        type: 'uuid',
                        isPrimary: true,
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: 'quantity',
                        type: 'integer',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'OrderProductsToProduct',
                        referencedTableName: 'products',
                        referencedColumnNames: ['id'],
                        columnNames: ['product_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    },
                    {
                        name: 'OrderProductsToOrder',
                        referencedTableName: 'orders',
                        referencedColumnNames: ['id'],
                        columnNames: ['order_id'],
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('orders_products');
    }

}
