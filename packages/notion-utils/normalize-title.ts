export const normalizeTitle = (title?: string | null): string => {
  return (
    (title || '')
      .replace(/ /g, '-')
      // CUSTOM: 한국어도 slug 사용 가능하도록 수정
      .replace(/[^a-zA-Z0-9-\u4e00-\u9fa5ㄱ-힣]/g, '')
      .replace(/--/g, '-')
      .replace(/-$/, '')
      .replace(/^-/, '')
      .trim()
      .toLowerCase()
  );
};
