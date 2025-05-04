import type { Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import Budget from '../models/Budgets';

declare global{
  namespace Express{
    interface Request{
      budget?: Budget
    }
  }
}

export const validateBudgetID = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  await param('budgetId')
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

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  await body('name')
    .notEmpty().withMessage('El nombre de la cantidad es Requerido')
    .run(req)
  await body('amount')
    .notEmpty().withMessage('la Cantidad es requerida')
    .isNumeric().withMessage('cantidad no valida')
    .custom(value => value > 0).withMessage('cantidad no valida debe de ser mayor a 0')
    .run(req)
  next();    
};

export const validateBudgetExis = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const budgetId = req.params.budgetId;
  try {
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      const error = new Error('No se encontro Presupuestos')
      res.status(404).json({msg: error.message});
      return;
    };

    req.budget = budget
    next()

  } catch (error) {
    console.error('algo salio mal',error);
    res.status(500).json({msg: 'algo salio mal'});
    return;
  };

};


export const compareBudgetUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  if (req.user.id !== req.budget.userId) {
    const error = new Error('Este Presupuesto pertenece a otro Usuario');
    res.status(409).json({msg: error.message});
    return;
  };
  next()
}

