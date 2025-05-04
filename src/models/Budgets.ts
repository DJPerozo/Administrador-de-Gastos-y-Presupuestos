import { Table, Column, Model, DataType, AllowNull, BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import User from './User';
import Expenses from './Expenses';

@Table({
    tableName: 'budgets'
})

class Budget extends Model{

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

    
    @BelongsTo(() => User)
    declare user: User

    @ForeignKey(() => User)
    declare userId: number

    @HasMany(() => Expenses, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
        
    })
    declare expenses: Expenses


}

export default Budget