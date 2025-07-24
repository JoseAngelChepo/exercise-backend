import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
import axios from 'axios';
import https from 'https';
dotenv.config();

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
const generateRefreshToken = id => jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

let refreshTokens = [];

export const registerUser = async (req, res, next) => {
  const { name, lastName, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      res.status(400);
      throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    await User.create({ name, lastName, email, password: hashed, role: 'user' });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400);
      throw new Error('Invalid credentials');
    }
    const accessToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    refreshTokens.push(refreshToken);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, path: '/api/auth/refresh', maxAge: 7*24*60*60*1000 });
    res.json({ accessToken, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    res.status(401);
    return next(new Error('No refresh token'));
  }
  if (!refreshTokens.includes(token)) {
    res.status(403);
    return next(new Error('Refresh token not found'));
  }
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403);
      return next(err);
    }
    res.json({ accessToken: generateToken(decoded.id) });
  });
};

export const logoutUser = (req, res) => {
  const token = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter(t => t !== token);
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ message: 'Logged out successfully' });
};

export const oauthToken = async (req, res) => {
  try {
    console.log(req.body);
    const {
      code,
      code_verifier,
      redirect_uri,
      client_id,
    } = req.body;

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", redirect_uri);
    params.append("client_id", client_id);
    params.append("code_verifier", code_verifier);

    const tokenRes = await axios.post("https://127.0.0.1:9443/oauth2/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false, // por ser localhost con cert autofirmado
      }),
    });

    res.json(tokenRes.data);
  } catch (err) {
    console.error(err?.response?.data || err);
    res.status(500).json({ error: "Token exchange failed" });
  }
};