# Administrador de Gastos y Presupuestos.

API RESTful para gestión de presupuestos y gastos personales, con autenticación JWT y validaciones. Desarrollada con Node.js, Express, TypeScript, Sequelize y PostgreSQL.

## Características

- **Autenticación JWT**: Registro, confirmación por email, login y recuperación de contraseña.
- **CRUD Completo**: Presupuestos (`budgets`) y gastos (`expenses`) con relaciones usuario → presupuesto → gasto.
- **Validaciones**: Middlewares para datos, y de validaciones para que un usuario no acceda a datos ajenos, y manejo de errores.
- **TypeScript**: Tipado estático en modelos, controladores y rutas.

## 💻 Tecnologías

- **Backend**: Express + TypeScript
- **ORM**: Sequelize (PostgreSQL)
- **Autenticación**: JWT + Bcrypt
- **Validaciones**: express-validator
