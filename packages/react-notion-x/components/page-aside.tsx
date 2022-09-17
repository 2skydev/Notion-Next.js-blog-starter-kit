import * as React from 'react';
import throttle from 'lodash.throttle';
import { TableOfContentsEntry, uuidToId } from 'notion-utils';

import { cs } from '../utils';
import { motion } from 'framer-motion';

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
        <nav className="notion-contentPosition">
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
                {activeSection === id && (
                  <motion.div
                    initial={false}
                    className="activeLine"
                    key="activeLine"
                    layoutId="activeLine"
                  />
                )}

                <motion.div initial={false} animate={{ x: activeSection === id ? -10 : 0 }}>
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
