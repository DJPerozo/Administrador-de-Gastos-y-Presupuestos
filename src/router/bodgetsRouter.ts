import express from 'express';
import BudgetsController from '../controllers/BodgetsControllers';
import { compareBudgetUser, validateBudgetExis, validateBudgetID, validateBudgetInput } from '../middleware/budgets';
import { handleInputErrors } from '../middleware/validateData';
import { verifyJWT } from '../middleware/authJWT';

const budgetRouter = express.Router();

budgetRouter.use(verifyJWT)

budgetRouter.param('budgetId', validateBudgetID);
budgetRouter.param('budgetId', validateBudgetExis);



budgetRouter.get('/', BudgetsController.getAll);


budgetRouter.post('/', 
    validateBudgetInput,
    handleInputErrors,
    BudgetsController.create
);


budgetRouter.get('/:budgetId', 
    compareBudgetUser,
    BudgetsController.getById
);


budgetRouter.put('/:budgetId', 
    compareBudgetUser,
    validateBudgetInput, 
    handleInputErrors,
    BudgetsController.updateById
);


budgetRouter.delete('/:budgetId', 
    compareBudgetUser,
    BudgetsController.deleteById);


export default budgetRouter;