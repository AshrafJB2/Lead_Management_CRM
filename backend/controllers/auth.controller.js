import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_KEY,
        { expiresIn: '1800s' }
    );
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email})
    if(!user) return res.status(400).json({ error: 'Invalid credentials : No email found' }); 

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials : Wrong password' });

    const token = generateToken(user);

    res.json(
        {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
}
    )

}

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};