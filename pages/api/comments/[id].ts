import { Client } from '@notionhq/client';

import { NextApiRequest, NextApiResponse } from 'next';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

// Next.js에서 제공하는 res.json은 \n을 자동으로 추가하기 때문에 새로 만든 함수입니다.
const responseJSON = (res: NextApiResponse, status: number, json: any) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').send(json);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, cursor } = req.query;

  if (req.method === 'POST') {
    if (!req.body.content) {
      return responseJSON(res, 400, { message: 'content is required' });
    }

    try {
      const result = await notion.comments.create({
        parent: {
          page_id: id as string,
        },
        rich_text: [
          {
            text: {
              content: req.body.content,
            },
          },
        ],
      });

      return responseJSON(res, 200, result);
    } catch (error) {
      return responseJSON(res, error.status, error.body);
    }
  } else if (req.method === 'GET') {
    try {
      const result = await notion.comments.list({
        block_id: id as string,
        ...(cursor && { start_cursor: cursor as string }),
      });

      return responseJSON(res, 200, result);
    } catch (error) {
      return responseJSON(res, error.status, error.body);
    }
  }

  return responseJSON(res, 405, { message: 'method not allowed' });
};
