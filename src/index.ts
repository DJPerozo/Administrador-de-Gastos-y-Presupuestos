import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import sequelize from './config/db';

// ruta de Autenticacion...Autenticacion
import authRouter from './router/authRouter';
//ruta de Budgets...Presupuestos
import budgetRouter from './router/bodgetsRouter';
//ruta de Expenses...Gastos
import expensesRouter from './router/expensesRouter';

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/budgets', budgetRouter)
app.use('/api/expenses', expensesRouter)


async function main() {
  try {
    await sequelize.authenticate();
    sequelize.sync()
    console.log(colors.blue.bold('Connection has been established successfully.'));
  } catch (error) {
    console.error(colors.red.bold('Unable to connect to the database:'), error);
  };
};
main()


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(colors.cyan.bold(`El Servidor esta Funcionando en el Puerto ${PORT}.....`));
});