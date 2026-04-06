import express from 'express';

export const JSONBodyParser = express.json({ limit: '5mb' });
