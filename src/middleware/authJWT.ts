import type { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import User from '../models/User';

declare global{
  namespace Express{
    interface Request{
      user?: User
    }
  }
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
 try {
  const bearer = req.headers.authorization;
  if (!bearer) {
    const error = new Error('token Requerido');
    res.status(400).json({msg: error.message});
    return;
  };

  const [ , token] = bearer.split(' ')
  if (!token) {
    const error = new Error('token Requerido');
    res.status(400).json({msg: error.message});
    return;
  };

  const decoded = JWT.verify(token, process.env.JWT_SECRET);
  if (typeof decoded !== 'object' || !decoded.id) {
    res.status(401).json({msg: 'Token no Valido'});
    return;
  };

  req.user = await User.findOne({
    where: {id: decoded.id},
    attributes: ['id', 'name', 'email']
  });

  next()

 } catch (error) {
  res.status(401).json({msg: 'No Estas Autorizado'});
  return;
 };

};
