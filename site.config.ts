import { siteConfig } from './lib/site-config';

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: 'd1e89e9e42eb4ebf9486ae0374039efc',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: '2skydev blog',
  domain: 'blog.2skydev.com',
  author: '2skydev',

  // open graph metadata (optional)
  description: '2skydev blog - developer blog',

  // social usernames (optional)
  // twitter: 'transitive_bs',
  github: '2skydev',
  // linkedin: 'fisch2',
  // newsletter: '#', // optional newsletter URL
  // youtube: '#', // optional youtube channel name or `channel/UCGbXXXXXXXXXXXXXXXXXXXXXX`

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon:
    'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0d2daa37-61d0-45b6-b333-9a2bd0bdc3ee%2Fprofile_%25E1%2584%2580%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AA%25E1%2584%258C%25E1%2585%25B5%25E1%2586%25AF_circle.png?table=block&id=d1e89e9e-42eb-4ebf-9486-ae0374039efc&spaceId=2eb5336b-2edb-42d0-bc6c-95d72d4d1b74&width=250&userId=bef10e95-202b-4b6b-9626-7af866b6f9ba&cache=v2',
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  isRedisEnabled: false,

  // map of notion page IDs to URL paths (optional)
  // any pages defined here will override their default URL paths
  // example:
  //
  // pageUrlOverrides: {
  //   '/foo': '067dd719a912471ea9a3ac10710e7fdf',
  //   '/bar': '0be6efce9daf42688f65c76b89f8eb27'
  // }
  pageUrlOverrides: null,

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: '카테고리',
      pageId: '36400db511474331b5c1de6918212469',
    },
    {
      title: '카테고리',
      pageId: '36400db511474331b5c1de6918212469',
      menuPage: true,
    },
  ],

  // -------- custom configs (2skydev) -------------

  // date-fns format string
  dateformat: 'yyyy년 MM월 dd일',

  // post page - hidden properties
  hiddenPostProperties: ['설명', '상태', '최하위 정렬'],

  // contentPosition (table of contents) text align
  contentPositionTextAlign: 'left',

  // default theme color
  defaultTheme: 'system',

  // enable comment
  enableComment: true,
});
