import express from 'express';
import { body, param } from 'express-validator';
import AuthController from '../controllers/AuthControllers';
import { handleInputErrors } from '../middleware/validateData';
import { verifyJWT } from '../middleware/authJWT';

const authRouter = express.Router();

authRouter.post('/create-account', 
  body('name')
    .notEmpty().withMessage('El nombre es requerido'),
  body('password')
    .notEmpty().withMessage('El no puede ir vacio')
    .isLength({min: 8}).withMessage('El password es muy corto, minimo 8 Caracteres'),
  body('email')
    .notEmpty().withMessage('El Email no puede ir Vacio')
    .isEmail().withMessage('Email no Valido'),
  handleInputErrors,
  AuthController.createAccount
);

authRouter.post('/confirm-account', 
  body('token')
    .notEmpty().withMessage('El token es requerido')
    .isLength({min: 6, max: 6}).withMessage('token no valido'),
  handleInputErrors, 
  AuthController.comfirmAccount
);

authRouter.post('/login', 
  body('password')
    .notEmpty().withMessage('El password no puede estar vacio'),
  body('email')
    .notEmpty().withMessage('El Email no puede ir vacio')
    .isEmail().withMessage('Email no valido'),
  handleInputErrors,  
  AuthController.login
);

authRouter.post('/forgot-password', 
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email no valido'),
  handleInputErrors,
  AuthController.forgotPassword
);

authRouter.post('/validate-token', 
  body('token')
    .notEmpty().withMessage('El token es Requerido')
    .isLength({min: 6, max: 6}).withMessage('Token no valido'),
  handleInputErrors,  
  AuthController.validateToken);

authRouter.post('/reset-password/:token', 
  param('token')
    .notEmpty().withMessage('El token es requerido')
    .isLength({min: 6, max:6}).withMessage('token no valido'),
  body('password')
    .notEmpty().withMessage('El password no Puede ir vacio')
    .isLength({min: 8}).withMessage('El nuevo password es muy corto, minimo 8 caracteres'),  
  handleInputErrors,    
  AuthController.resetPassword
);

authRouter.get('/user', 
  verifyJWT,
  AuthController.user
);

authRouter.post('/update-password', 
  verifyJWT,
  body('current_password')
    .notEmpty().withMessage('El password actual es requerido'),
  body('newpassword')
    .notEmpty().withMessage('El nuevo Password es Requerido')
    .isLength({min: 6}).withMessage('El Nuevo Password es muy corto, minimo 8 Caracteres'),
  handleInputErrors,    
  AuthController.updatePassword
);



export default authRouter;