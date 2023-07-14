// pages/api/get_data.ts
import fetch from 'node-fetch';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    }).then((response) => response.json());

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return "NU E OK"
  }
}