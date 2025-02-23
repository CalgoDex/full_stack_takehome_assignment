// pages/api/data.ts

import { MOCK_DATA } from "@/src/consts/data";
import { NextApiRequest, NextApiResponse } from "next";

const handleGetRequest = () => {
  return MOCK_DATA;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(handleGetRequest());
  }
}
