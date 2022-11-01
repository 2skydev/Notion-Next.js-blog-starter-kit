import * as React from 'react';
import BodyClassName from 'react-body-classname';
// core notion renderer
import { NotionRenderer } from 'react-notion-x';
import TweetEmbed from 'react-tweet-embed';
import { useSearchParam } from 'react-use';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import cs from 'classnames';
import * as config from 'lib/config';
import { mapImageUrl } from 'lib/map-image-url';
import { mapPageUrl, getCanonicalPageUrl } from 'lib/map-page-url';
import { searchNotion } from 'lib/search-notion';
import * as types from 'lib/types';
import { useDarkMode } from 'lib/use-dark-mode';
import { PageBlock } from 'notion-types';
// utils
import { getBlockTitle, getPageProperty, formatDate } from 'notion-utils';

import Comments from './Comments';
// components
import { Loading } from './Loading';
// import { Footer } from './Footer';
import { NotionPageHeader, ToggleThemeButton } from './NotionPageHeader';
import { Page404 } from './Page404';
import { PageAside } from './PageAside';
import { PageHead } from './PageHead';
import styles from './styles.module.css';

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('react-notion-x/third-party/code').then(async m => {
    // add / remove any prism syntaxes here
    await Promise.all([
      import('prismjs/components/prism-markup-templating.js'),
      import('prismjs/components/prism-markup.js'),
      import('prismjs/components/prism-bash.js'),
      import('prismjs/components/prism-c.js'),
      import('prismjs/components/prism-cpp.js'),
      import('prismjs/components/prism-csharp.js'),
      import('prismjs/components/prism-docker.js'),
      import('prismjs/components/prism-java.js'),
      import('prismjs/components/prism-js-templates.js'),
      import('prismjs/components/prism-coffeescript.js'),
      import('prismjs/components/prism-diff.js'),
      import('prismjs/components/prism-git.js'),
      import('prismjs/components/prism-go.js'),
      import('prismjs/components/prism-graphql.js'),
      import('prismjs/components/prism-handlebars.js'),
      import('prismjs/components/prism-less.js'),
      import('prismjs/components/prism-makefile.js'),
      import('prismjs/components/prism-markdown.js'),
      import('prismjs/components/prism-objectivec.js'),
      import('prismjs/components/prism-ocaml.js'),
      import('prismjs/components/prism-python.js'),
      import('prismjs/components/prism-reason.js'),
      import('prismjs/components/prism-rust.js'),
      import('prismjs/components/prism-sass.js'),
      import('prismjs/components/prism-scss.js'),
      import('prismjs/components/prism-solidity.js'),
      import('prismjs/components/prism-sql.js'),
      import('prismjs/components/prism-stylus.js'),
      import('prismjs/components/prism-swift.js'),
      import('prismjs/components/prism-wasm.js'),
      import('prismjs/components/prism-yaml.js'),
    ]);
    return m.Code;
  }),
);

const Collection = dynamic(() =>
  import('react-notion-x/third-party/collection').then(m => m.Collection),
);
const Equation = dynamic(() => import('react-notion-x/third-party/equation').then(m => m.Equation));
const Pdf = dynamic(() => import('react-notion-x/third-party/pdf').then(m => m.Pdf), {
  ssr: false,
});
const Modal = dynamic(
  () =>
    import('react-notion-x/third-party/modal').then(m => {
      m.Modal.setAppElement('.notion-viewport');
      return m.Modal;
    }),
  {
    ssr: false,
  },
);

const Tweet = ({ id }: { id: string }) => {
  return <TweetEmbed tweetId={id} />;
};

const propertyLastEditedTimeValue = ({ block, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long',
    })}`;
  }

  return defaultFn();
};

const propertyDateValue = ({ data, schema, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date;

    if (publishDate) {
      return `Published ${formatDate(publishDate, {
        month: 'long',
      })}`;
    }
  }

  return defaultFn();
};

const propertyTextValue = ({ schema, pageHeader }, defaultFn: () => React.ReactNode) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>;
  }

  return defaultFn();
};

export const NotionPage: React.FC<types.PageProps> = ({
  site,
  recordMap,
  error,
  pageId,
  draftView,
}) => {
  const router = useRouter();
  const lite = useSearchParam('lite');

  const components = React.useMemo(
    () => ({
      nextImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue,
      PageLink: ({ children, href, ...rest }) => (
        <Link href={href} {...rest}>
          {children}
        </Link>
      ),
    }),
    [],
  );

  // lite mode is for oembed
  const isLiteMode = lite === 'true';

  const { isDarkMode } = useDarkMode();

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {};
    if (lite) params.lite = lite;

    const searchParams = new URLSearchParams(params);
    return mapPageUrl(site, recordMap, searchParams, draftView);
  }, [site, recordMap, lite, draftView]);

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost = block?.type === 'page' && block?.parent_table === 'collection';

  const showTableOfContents = !!isBlogPost;
  const minTableOfContentsItems = 1;

  const pageAside = React.useMemo(
    () => <PageAside block={block} recordMap={recordMap} isBlogPost={isBlogPost} />,
    [block, recordMap, isBlogPost],
  );

  // const footer = React.useMemo(() => <Footer />, []);

  if (router.isFallback) {
    return null;
  }

  if (error || !site || !block) {
    return <Page404 site={site} pageId={pageId} error={error} />;
  }

  const title = getBlockTitle(block, recordMap) || site.name;

  if (!config.isServer) {
    // add important objects to the window global for easy debugging
    const g = window as any;
    g.pageId = pageId;
    g.recordMap = recordMap;
    g.block = block;
  }

  const canonicalPageUrl = !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  const socialImage = mapImageUrl(
    getPageProperty<string>('Social Image', block, recordMap) ||
      (block as PageBlock).format?.page_cover ||
      config.defaultPageCover,
    block,
  );

  const socialDescription = getPageProperty<string>('설명', block, recordMap) || config.description;

  const isIndexPage = pageId === site.rootNotionPageId;

  const hasCollectionView = Object.keys(recordMap.collection_query).length;

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={title}
        description={socialDescription}
        image={socialImage}
        url={canonicalPageUrl}
      />
      {isLiteMode && <BodyClassName className="notion-lite" />}

      <NotionRenderer
        className={cs(isIndexPage ? 'indexPage' : 'childPage', { hasCollectionView })}
        bodyClassName={cs(styles.notion, isIndexPage && 'index-page')}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : null}
        pageAside={pageAside}
        pageFooter={
          config.enableComment ? (
            !isBlogPost ? null : (
              <Comments pageId={pageId} recordMap={recordMap} />
            )
          ) : null
        }
        footer={null}
      />
    </>
  );
};
