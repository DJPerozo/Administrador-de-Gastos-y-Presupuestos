import type { Request, Response } from 'express';
import colors from 'colors';
import Budget from '../models/Budgets';
import Expenses from '../models/Expenses';

class ExpensesController{
  static create = async (req: Request, res: Response):Promise<void> => {
    const {name, amount, budgetId} = req.body;
    try {
      const budget = await Budget.findByPk(budgetId);
      if (!budget) {
        const error = new Error('El ID del Presupuesto no existe');
        res.status(404).json({msg: error.message});
        return;
      };

      if (req.user.id !== budget.userId) {
        const error = new Error('Este Presupuesto pertenece a hotro Usuario, No estas Autorizado para agregar Gastos');
        res.status(409).json({msg: error.message});
        return;
      };
      
      const expenses = new Expenses({name, amount, budgetId});
      expenses.budgetId = budget.id;
      expenses.userId = req.user.id;
      await expenses.save();
      res.status(201).json({msg: 'exito gasto creado', data: expenses});
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };
  };

  static updateById = async (req: Request, res: Response):Promise<void> => {
    const {name, amount} = req.body;
    try {
      if (req.user.id !== req.expenses.userId) {
        const error = new Error('Este Gasto Pertenece a hotro Usuario, No Autorizado para realizar esta accion');
        res.status(409).json({msg: error.message});
        return;
      };

      const newExpenses = await req.expenses.update({name, amount});
      res.status(200).json({msg: 'exito gasto actualizado', data: newExpenses});
      return;
  
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
    
  };

  static deleteById = async (req: Request, res: Response):Promise<void> => {
    try {
      if (req.user.id !== req.expenses.userId) {
        const error = new Error('Este Gasto Pertenece a hotro Usuario, No Autorizado para realizar esta accion');
        res.status(409).json({msg: error.message});
        return;
      };

      await req.expenses.destroy();
      res.status(200).json({msg: 'exito gasto eliminado'});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }

  };


};

export default ExpensesController;
