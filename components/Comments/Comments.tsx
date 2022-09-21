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
      <hr className="notion-hr" />

      <h1>Comments</h1>

      <div className="items">
        {comments.map(item => (
          <div key={item.id} className="item">
            <div className="profile">
              <img src={item.user.profile_photo} alt={item.user.name} />
              <span className="name">{item.user.name}</span>
              <span className="createdAt">{item.createdAt}전</span>
            </div>

            <div className="content">
              {item.text.split('\n').map(text => (
                <>
                  {text}
                  <br />
                </>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
