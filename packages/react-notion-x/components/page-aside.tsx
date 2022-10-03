import * as React from 'react';

import { motion } from 'framer-motion';
import throttle from 'lodash.throttle';
import { TableOfContentsEntry, uuidToId } from 'notion-utils';

import { contentPositionTextAlign } from '~/lib/config';

import { cs } from '../utils';

export const PageAside: React.FC<{
  toc: Array<TableOfContentsEntry>;
  activeSection: string | null;
  setActiveSection: (activeSection: string | null) => unknown;
  hasToc: boolean;
  hasAside: boolean;
  pageAside?: React.ReactNode;
  className?: string;
}> = ({ toc, activeSection, setActiveSection, pageAside, hasToc, hasAside, className }) => {
  const throttleMs = 100;
  const actionSectionScrollSpy = React.useMemo(
    () =>
      throttle(() => {
        const sections = document.getElementsByClassName('notion-h');

        let prevBBox: DOMRect = null;
        let currentSectionId = activeSection;

        for (let i = 0; i < sections.length; ++i) {
          const section = sections[i];
          if (!section || !(section instanceof Element)) continue;

          if (!currentSectionId) {
            currentSectionId = section.getAttribute('data-id');
          }

          const bbox = section.getBoundingClientRect();
          const prevHeight = prevBBox ? bbox.top - prevBBox.bottom : 0;
          const offset = Math.max(150, prevHeight / 4);

          // GetBoundingClientRect returns values relative to the viewport
          if (bbox.top - offset < 0) {
            currentSectionId = section.getAttribute('data-id');

            prevBBox = bbox;
            continue;
          }

          // No need to continue loop, if last element has been detected
          break;
        }

        setActiveSection(currentSectionId);
      }, throttleMs),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      // explicitly not taking a dependency on activeSection
      setActiveSection,
    ],
  );

  React.useEffect(() => {
    if (!hasToc) {
      return;
    }

    window.addEventListener('scroll', actionSectionScrollSpy);

    actionSectionScrollSpy();

    return () => {
      window.removeEventListener('scroll', actionSectionScrollSpy);
    };
  }, [hasToc, actionSectionScrollSpy]);

  if (!hasAside) {
    return null;
  }

  return (
    <aside className={cs('notion-aside', className)}>
      {/* CUSTOM: 목차 전체적으로 커스텀 */}
      {hasToc && (
        <nav
          className={cs(
            'notion-contentPosition',
            contentPositionTextAlign === 'right' && 'alignRight',
          )}
        >
          {toc.map(tocItem => {
            const id = uuidToId(tocItem.id);

            return (
              <a
                key={id}
                href={`#${id}`}
                className={cs(
                  'item',
                  `level${tocItem.indentLevel}`,
                  activeSection === id && 'active',
                )}
              >
                {activeSection === id ? (
                  // TODO: 애니메이션 작동시에 scale이 변경되는데 이거 때문에 살짝 흐릿해져 보임
                  <motion.div
                    className="activeLine"
                    key="activeLine"
                    layoutId="activeLine"
                    transition={{ duration: 0.25 }}
                  />
                ) : null}

                <motion.div
                  className="text"
                  initial={false}
                  animate={{
                    x:
                      activeSection === id
                        ? 10 * (contentPositionTextAlign === 'right' ? -1 : 1)
                        : 0,
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {tocItem.text}
                </motion.div>
              </a>
            );
          })}
        </nav>
      )}

      {pageAside}
    </aside>
  );
};
