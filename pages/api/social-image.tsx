import * as React from 'react';

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import * as siteConfig from 'lib/config';

export const config = {
  runtime: 'experimental-edge',
};

export default async function handler(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const { id } = Object.fromEntries(searchParams);

    const result = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
      },
    });

    const { properties, cover } = await result.json();

    const image = cover?.external?.url || cover?.file?.url || siteConfig.defaultPageCover;
    const title = properties?.['이름']?.title?.[0]?.plain_text || siteConfig.name;
    const description = properties?.['설명']?.rich_text?.[0]?.plain_text || siteConfig.description;
    const tags = (properties?.['태그']?.multi_select || []).map((tag: any) => tag.name);
    const author = siteConfig.author;
    const authorImage = siteConfig.defaultPageIcon;
    const publishedAt = properties?.['작성일']?.created_time;
    const publishedAtString = publishedAt
      ? new Date(publishedAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : siteConfig.domain;

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            padding: '46px',
            background: '#1F2027',
            color: 'white',
            width: '100%',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              height: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '46px', fontWeight: 'bold', paddingTop: '24px' }}>{title}</h1>
              <p style={{ fontSize: '18px', opacity: 0.8 }}>{description}</p>
              <div style={{ display: 'flex', fontSize: '18px', opacity: 0.6 }}>
                {tags.map((tag: string, i) => (
                  <div
                    key={tag}
                    style={{ display: 'flex', marginRight: tags.length === i + 1 ? '' : '10px' }}
                  >
                    #{tag}
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={authorImage}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  borderRadius: '50%',
                  marginRight: '16px',
                }}
              />

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: '32px', opacity: 0.8 }}>{author}</div>
                <div style={{ fontSize: '20px', opacity: 0.8 }}>{publishedAtString}</div>
              </div>
            </div>
          </div>

          {image && (
            <img
              src={image}
              style={{
                width: '35%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                borderRadius: '5px',
                marginLeft: '36px',
              }}
            />
          )}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error(`${e.message}`);

    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
