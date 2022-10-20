import PQueue from 'p-queue';

import { ExtendedRecordMap, PageMap } from 'notion-types';
import { parsePageId } from './parse-page-id';

/**
 * Performs a traversal over a given Notion workspace starting from a seed page.
 *
 * Returns a map containing all of the pages that are reachable from the seed
 * page in the space.
 *
 * If `rootSpaceId` is not defined, the space ID of the root page will be used
 * to scope traversal.
 *
 *
 * @param rootPageId - Page ID to start from.
 * @param rootSpaceId - Space ID to scope traversal.
 * @param getPage - Function used to fetch a single page.
 * @param opts - Optional config
 */
export async function getAllPagesInSpace(
  rootPageId: string,
  rootSpaceId: string | undefined,
  getPage: (pageId: string) => Promise<ExtendedRecordMap>,
  {
    concurrency = 4,
    traverseCollections = true,
    targetPageId = null,
  }: {
    concurrency?: number;
    traverseCollections?: boolean;
    targetPageId?: string;
  } = {},
): Promise<PageMap> {
  const pages: PageMap = {};
  const pendingPageIds = new Set<string>();
  const queue = new PQueue({ concurrency });
  const allowCollectionItemIds = new Set<string>();

  async function processPage(pageId: string) {
    if (targetPageId && pendingPageIds.has(targetPageId)) {
      return;
    }

    pageId = parsePageId(pageId) as string;

    if (pageId && !pages[pageId] && !pendingPageIds.has(pageId)) {
      pendingPageIds.add(pageId);

      queue.add(async () => {
        try {
          if (targetPageId && pendingPageIds.has(targetPageId) && pageId !== targetPageId) {
            return;
          }

          const page = await getPage(pageId);

          // console.log(
          //   `\n---------- ${pageId} / "${
          //     page.block[pageId].value.properties['title'] || '???'
          //   }" ----------\n`,
          // );

          if (!page) {
            return;
          }

          const spaceId = page.block[pageId]?.value?.space_id;

          if (spaceId) {
            if (!rootSpaceId) {
              rootSpaceId = spaceId;
            } else if (rootSpaceId !== spaceId) {
              return;
            }
          }

          // CUSTOM: 데이터베이스의 보기는 첫번째것만 표시되므로 사이트맵 추출도 첫번째것만 추출 (필터링된 글은 추출이 안되도록 처리)
          Object.values(page.block).forEach(({ value: block }) => {
            if (!block || !block?.type) {
              return;
            }

            if (block.type === 'collection_view') {
              const defaultViewId = block.view_ids[0];

              const collectionId =
                block.collection_id ||
                page?.collection_view?.[defaultViewId]?.value?.format?.collection_pointer?.id;

              const collectionChildPageIds =
                page.collection_query?.[collectionId]?.[defaultViewId]?.collection_group_results
                  ?.blockIds || [];

              // console.log('--');
              // console.log('block:', block);
              // console.log('collectionId: ', collectionId);
              // console.log('block.view_ids: ', block.view_ids);
              // console.log('page.collection_query: ', page.collection_query);
              // console.log(
              //   'page.collection_query.find: ',
              //   page.collection_query?.[collectionId]?.[defaultViewId]?.collection_group_results,
              // );
              // console.log('collectionView', page.collection_view[defaultViewId].value);
              // console.log('collectionChildPageIds', collectionChildPageIds);

              collectionChildPageIds.forEach(blockId => {
                allowCollectionItemIds.add(blockId);
              });
            }
          });

          Object.keys(page.block)
            .filter(key => {
              const block = page.block[key]?.value;

              if (!block) return false;

              if (block.type !== 'page' && block.type !== 'collection_view_page') {
                return false;
              }

              // the space id check is important to limit traversal because pages
              // can reference pages in other spaces
              if (rootSpaceId && block.space_id && block.space_id !== rootSpaceId) {
                return false;
              }

              // CUSTOM: 데이터베이스의 보기는 첫번째것만 표시되므로 사이트맵 추출도 첫번째것만 추출 (필터링된 글은 추출이 안되도록 처리)
              if (block.parent_table === 'collection') {
                if (!allowCollectionItemIds.has(block.id)) {
                  return false;
                }
              }

              // console.log(block.id, block.properties.title);

              return true;
            })
            .forEach(subPageId => processPage(subPageId));

          // CUSTOM: 위 커스텀 코드로 인해 이 코드 필요가 없어짐
          // traverse collection item pages as they may contain subpages as well
          // if (traverseCollections) {
          //   for (const collectionViews of Object.values(page.collection_query)) {
          //     for (const collectionData of Object.values(collectionViews)) {
          //       const { blockIds } = collectionData;

          //       if (blockIds) {
          //         for (const collectionItemId of blockIds) {
          //           processPage(collectionItemId);
          //         }
          //       }
          //     }
          //   }
          // }

          pages[pageId] = page;

          // console.log('\n----------------------------------------------\n\n');
        } catch (err) {
          console.warn(
            'page load error',
            { pageId, spaceId: rootSpaceId },
            err.statusCode,
            err.message,
          );
          pages[pageId] = null;
        }

        pendingPageIds.delete(pageId);
      });
    }
  }

  await processPage(rootPageId);
  await queue.onIdle();

  return pages;
}
