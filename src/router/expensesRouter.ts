import express from 'express';
import ExpensesController from '../controllers/ExpensesControllers';
import { verifyJWT } from '../middleware/authJWT';
import {  validateExpensesExis, validateExpensesID, validateExpensesInput, validateExpensesUpdate } from '../middleware/expenses';
import { handleInputErrors } from '../middleware/validateData';

const expensesRouter = express.Router();
expensesRouter.use(verifyJWT)

expensesRouter.param('expensesId', validateExpensesID);
expensesRouter.param('expensesId', validateExpensesExis);



expensesRouter.post('/', 
    validateExpensesInput,
    handleInputErrors,
    ExpensesController.create
);

expensesRouter.put('/:expensesId', 
    validateExpensesUpdate,
    handleInputErrors,
    ExpensesController.updateById
);

expensesRouter.delete('/:expensesId', ExpensesController.deleteById);



export default expensesRouter;