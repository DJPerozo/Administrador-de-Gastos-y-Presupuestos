import type { Request, Response } from 'express';
import colors, { trap } from 'colors'
import Budget from '../models/Budgets';
import Expenses from '../models/Expenses';

class BudgetsController{
  static getAll = async (req: Request, res: Response):Promise<void> => {
    try {
      const budget = await Budget.findAll({
        order:[ ['createdAt', 'DESC'] ],
        where: { userId: req.user.id }
      });
      if (budget.length === 0) {
        const error = new Error('No se encontraron Presupuestos');
        res.status(404).json({msg: error.message});
        return;
      };

      res.status(200).json({msg: 'exito', data: budget});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static create = async (req: Request, res: Response):Promise<void> => {
    const { name, amount } = req.body;
    try {
      const budget = new Budget({name, amount});
      budget.userId = req.user.id;
      await budget.save();
      res.status(201).json({msg: 'presupuesto creado correctamente'});
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static getById = async (req: Request, res: Response):Promise<void> => {
    try {
      const budget =  await Budget.findByPk(req.budget.id, {
        include: [Expenses]
      });
      res.status(200).json({msg: 'exito', data: budget});
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
    
  };

  static updateById = async (req: Request, res: Response):Promise<void> => {
    const { name, amount } = req.body;
    try {
      const budget = await req.budget.update({name, amount});
      res.status(200).json({msg: 'exito presupuesto acutualizado', data: budget});
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static deleteById = async (req: Request, res: Response):Promise<void> => {
    try {
      await req.budget.destroy();
      res.status(200).json({msg: 'exito Presupuesto eliminado'});
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }

  };


};

export default BudgetsController;