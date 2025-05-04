import { Table, Column, DataType, Model, Default, AllowNull, HasMany, Unique } from 'sequelize-typescript';
import Budget from './Budgets';
import Expenses from './Expenses';

@Table({
    tableName: 'users'
})


class User extends Model{

    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare name: string

    @AllowNull(false)
    @Column({
        type: DataType.STRING(100)
    })
    declare password: string


    @Unique(true)
    @AllowNull(false)
    @Column({
        type: DataType.STRING(50)
    })
    declare email: string


    @Column({
        type: DataType.STRING(6)
    })
    declare token: string

    @Default(false)
    @Column({
        type: DataType.BOOLEAN
    })
    declare comfirmed: boolean


    @HasMany(() => Budget, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare budget: Budget

    @HasMany(() => Expenses, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    declare expenses: Expenses



};

export default User