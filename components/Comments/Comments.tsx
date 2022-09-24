import { formatDistance } from 'date-fns';
import ko from 'date-fns/locale/ko';
import * as React from 'react';
import useSWR from 'swr';
import { ExtendedRecordMap } from '~/packages/notion-types';
import cs from 'classnames';

interface CommentsProps {
  pageId: string;
  recordMap: ExtendedRecordMap;
}

const Comments = ({ pageId, recordMap }: CommentsProps) => {
  const { data } = useSWR(`/api/comments/${pageId}`);

  const comments = (data?.results || []).map(item => {
    const user = recordMap.notion_user[item.created_by.id]?.value || {
      id: 'guest',
      name: '익명',
      profile_photo: '/comment.png',
    };

    return {
      id: item.id,
      user: user,
      text: item?.rich_text?.[0]?.plain_text || '내용을 불러올 수 없습니다.',
      isOwner: user?.id !== 'guest',
      createdAt: formatDistance(new Date(), new Date(item.created_time), {
        locale: ko,
      }),
    };
  });

  return (
    <div className="notion-comments">
      <h2 className="notion-h notion-h1">댓글</h2>

      <div className="items">
        {comments.map(item => (
          <div key={item.id} className={cs('item', item.isOwner && 'reverse')}>
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
                <div className="name">
                  {item.isOwner && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z"></path>
                      <path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z"></path>
                    </svg>
                  )}
                  {item.user.name}
                </div>

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
