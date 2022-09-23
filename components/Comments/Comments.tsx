import { formatDistance } from 'date-fns';
import ko from 'date-fns/locale/ko';
import * as React from 'react';
import useSWR from 'swr';
import { ExtendedRecordMap } from '~/packages/notion-types';

interface CommentsProps {
  pageId: string;
  recordMap: ExtendedRecordMap;
}

const Comments = ({ pageId, recordMap }: CommentsProps) => {
  const { data } = useSWR(`/api/comments/${pageId}`);

  const comments = (data?.results || []).map(item => {
    const user = recordMap.notion_user[item.created_by.id]?.value || {
      name: '익명',
      profile_photo: '/comment.png',
    };

    return {
      id: item.id,
      user: user,
      text: item?.rich_text?.[0]?.plain_text || '내용을 불러올 수 없습니다.',
      createdAt: formatDistance(new Date(), new Date(item.created_time), {
        locale: ko,
      }),
    };
  });

  return (
    <div className="notion-comments">
      <h2 className="notion-h notion-h1">Comments</h2>

      <div className="items">
        {comments.map(item => (
          <div key={item.id} className="item">
            <img className="profileImage" src={item.user.profile_photo} alt={item.user.name} />

            <div className="right">
              <div className="content">
                <div className="bg" />
                <div className="texts">
                  {item.text.split('\n').map((text, i) => (
                    <React.Fragment key={i}>
                      {text}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="profile">
                <div className="name">{item.user.name}</div>
                <div className="createdAt">{item.createdAt}전</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
