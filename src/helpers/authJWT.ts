import JWT from 'jsonwebtoken';

export const generateJWT = async (id: number) => {
  const token = JWT.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
  return token;    
};