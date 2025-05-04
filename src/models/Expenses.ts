import { InstanceDestroyOptions } from 'sequelize';
import { Table, Column, DataType, Model, AllowNull, BelongsTo, ForeignKey } from 'sequelize-typescript';
import Budget from './Budgets';
import User from './User';


@Table({
    tableName: 'expenses'
})

class Expenses extends Model{

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.DECIMAL(10, 2)
    })
    declare amount: number


    @BelongsTo(() => Budget)
    declare budget: Budget

    @ForeignKey(() => Budget)
    declare budgetId: number


    @BelongsTo(() => User)
    declare user: User

    @ForeignKey(() => User)
    declare userId: number

}

export default Expenses