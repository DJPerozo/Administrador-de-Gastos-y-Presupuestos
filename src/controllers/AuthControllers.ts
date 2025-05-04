import type { Request, Response } from 'express';
import colors from 'colors';
import User from '../models/User';
import { comparePassword, hashPassword } from '../helpers/authbcrypt';
import { generateToken } from '../helpers/authToken';
import { generateJWT } from '../helpers/authJWT';

class AuthController{
  static createAccount = async (req: Request, res: Response):Promise<void> => {
    const { name, password, email } = req.body;
    try {
      const userExis = await User.findOne({
        where: {email}
      });
      if (userExis) {
        const error = new Error('Ya existe una cuenta registrada con ese Email');
        res.status(409).json({msg: error.message});
        return;
      };

      const user = new User({name, password, email});
      user.password = await hashPassword(password);
      user.token = generateToken();
      await user.save();

      res.status(201).json({msg: 'Revise su email le emos mandado un codigo para que confirme su cuenta'});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };

  };

  static comfirmAccount = async (req: Request, res: Response):Promise<void> => {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        where: {token}
      });
      if (!user) {
        const error = new Error('Token no valido');
        res.status(403).json({msg: error.message});
        return;
      };

      user.comfirmed = true;
      user.token = null;
      await user.save();

      res.status(200).json({msg: 'cuenta confirmada correctamente'});
      return;
      
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static login = async (req: Request, res: Response):Promise<void> => {
    const { password, email } = req.body;
    try {
      const user = await User.findOne({
        where: {email}
      });
      if (!user) {
        const error = new Error('No estas Autenticado')
        res.status(401).json({msg: error.message});
        return;
      };

      if (!user.comfirmed) {
        const error = new Error('La cuenta no a sido confirmada');
        res.status(403).json({msg: error.message});
        return;
      };

      const ExisPassword = await comparePassword(password, user.password);
      if (!ExisPassword) {
        const error = new Error('No estas Autenticado');
        res.status(401).json({msg: error.message});
        return;
      };

      const token = await generateJWT(user.id);
      res.status(200).json({msg: 'Usuario Autenticado', token});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static forgotPassword = async (req: Request, res: Response):Promise<void> => {
    const { email } = req.body;
    try {
      const user = await User.findOne({
        where: {email}
      });
      if (!user) {
        const error = new Error('Email no encontrado');
        res.status(403).json({msg: error.message});
        return;
      };

      user.token = generateToken();
      await user.save();

      res.status(200).json({msg: 'Revisa tu Email para Intrucciones'});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    };


  };

  static validateToken = async (req: Request, res: Response):Promise<void> => {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        where: {token}
      });
      if (!user) {
        const error = new Error('Token no Valido');
        res.status(403).json({msg: error.message});
        return;
      };

      res.status(200).json({msg: 'exito token valido'});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static resetPassword = async (req: Request, res: Response):Promise<void> => {
    const token = req.params.token;
    const { password } = req.body;
    try {
      const user = await User.findOne({
        where: {token}
      });
      if (!user) {
        const error = new Error('Token no valido');
        res.status(403).json({msg: error.message});
        return;
      };

      user.password = await hashPassword(password);
      user.token = null;
      await user.save()
      res.status(200).json({msg: 'Exito Password Reestablesido correctamente'});
      return

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static user = async (req: Request, res: Response):Promise<void> => {
    try {
      res.status(200).json(req.user)
      return;
    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };

  static updatePassword = async (req: Request, res: Response):Promise<void> => {
    const { current_password, newpassword } = req.body;
    const { id } = req.user
    try {
      const user = await User.findByPk(id)
      if (!user) {
        res.status(403).json({msg: 'No Autorizado'});
        return;
      };

      const passwordExis = await comparePassword(current_password, user.password);
      if (!passwordExis) {
        res.status(401).json({msg: 'No Autorizado'});
        return;
      };

      user.password = await hashPassword(newpassword);
      await user.save();

      res.status(200).json({msg: 'exito password actualizado'});
      return;

    } catch (error) {
      console.error(colors.red.bold('algo salio mal'),error);
      res.status(500).json({msg: 'algo salio mal'});
      return;
    }
  };


};

export default AuthController;
