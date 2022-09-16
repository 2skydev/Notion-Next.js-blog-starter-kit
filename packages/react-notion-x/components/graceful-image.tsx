import * as React from 'react';
import { ImgProps } from 'react-image';

export const GracefulImage = (props: ImgProps) => {
  // if (isBrowser) {
  //   return <Img {...props} />;
  // } else {
  //   // @ts-expect-error (must use the appropriate subset of props for <img> if using SSR)
  //   return <img {...props} />;
  // }

  // CUSTOM: 다크모드 전환시 페이지 작동 멈춤 현상이 있어서 일단 react-image 사용 중지
  // @ts-ignore
  return <img {...props} />;
};
