import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { STATUS_CODES } from './constants.js';

const { OK, SERVER_ERROR } = STATUS_CODES;

const app = express();
const PORT = process.env.PORT || 3000;
const PROMPT_SECURITY_API = process.env.PROMPT_SECURITY_API;
const APP_ID = process.env.APP_ID;

app.use(cors());
app.use(express.json());

app.post('/inspect', async (req, res) => {
  const { prompt, fileName } = req.body;
  console.log(`[${new Date().toISOString()}] Inspecting file "${fileName}"`);

  try {
    const response = await axios.post(
      PROMPT_SECURITY_API,
      { prompt },
      {
        headers: {
          'APP-ID': APP_ID,
          'Content-Type': 'application/json'
        }
      }
    );

    const safePrompt = response.status === OK && response.data?.result?.prompt?.passed;
    console.log('Inspection result:', safePrompt ? 'No secrets found' : 'Secrets detected');
    res.json({ safePrompt, conversation_id: response.data?.result?.conversation_id });
  } catch (err) {
    console.error('Error calling Prompt Security API:', err.message);
    res.status(SERVER_ERROR).json({ error: 'Inspection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
