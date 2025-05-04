import type { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Budget from '../models/Budgets';
import Expenses from '../models/Expenses';

declare global{
  namespace Express{
    interface Request{
      expenses?: Expenses
    }
  }
}

export const validateExpensesID = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  await param('expensesId')
    .isInt().withMessage('ID no valido')
    .custom(value => value > 0).withMessage('ID no valido')
    .run(req)
  
  const error = validationResult(req)
  if (!error.isEmpty()) {
    res.status(400).json({error: error.array()});
    return;
  };
  next()  
    
};

export const validateExpensesInput = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  await body('name')
    .notEmpty().withMessage('El nombre de la cantidad es Requerido')
    .run(req)
  await body('amount')
    .notEmpty().withMessage('la Cantidad es requerida')
    .isNumeric().withMessage('cantidad no valida')
    .custom(value => value > 0).withMessage('cantidad no valida debe de ser mayor a 0')
    .run(req)
  await body('budgetId')
    .notEmpty().withMessage('El ID del presupuesto no puede estar vacio')
    .custom((value) => typeof value === 'number').withMessage('El ID no el valido debe de ser un numero entero')
    .isInt({min: 1}).withMessage('el ID debe de ser mayor a 0')
    .run(req)

  next();    
};

export const validateExpensesUpdate = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  await body('name')
    .notEmpty().withMessage('El nombre de la cantidad es Requerido')
    .run(req)
  await body('amount')
    .notEmpty().withMessage('la Cantidad es requerida')
    .isNumeric().withMessage('cantidad no valida')
    .custom(value => value > 0).withMessage('cantidad no valida')
    .run(req)
  next();    
};


export const validateExpensesExis = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const expensesId = req.params.expensesId;
  try {
    const expenses = await Expenses.findByPk(expensesId);
    if (!expenses) {
      const error = new Error('no se encontraron gastos');
      res.status(404).json({msg: error.message});
      return;
    };

    req.expenses = expenses
    next()

  } catch (error) {
    console.error(('algo salio mal'),error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  }
};

