import * as React from 'react';
import cs from 'classnames';
import { IoSunnyOutline } from '@react-icons/all-files/io5/IoSunnyOutline';
import { IoMoonSharp } from '@react-icons/all-files/io5/IoMoonSharp';
import { Header, Breadcrumbs, Search, useNotionContext } from 'react-notion-x';
import * as types from 'notion-types';

import { useDarkMode } from 'lib/use-dark-mode';
import { navigationStyle, navigationLinks, isSearchEnabled } from 'lib/config';

import styles from './styles.module.css';

export const ToggleThemeButton = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode();
  }, [toggleDarkMode]);

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  );
};

export const NotionPageHeader: React.FC<{
  block: types.CollectionViewPageBlock | types.PageBlock;
}> = ({ block }) => {
  const { components, mapPageUrl } = useNotionContext();

  if (navigationStyle === 'default') {
    return <Header block={block} />;
  }

  return (
    <header className="notion-header">
      <div className="notion-nav-header">
        <Breadcrumbs block={block} />

        <div className="notion-nav-header-rhs breadcrumbs">
          {navigationLinks
            ?.map((link, index) => {
              if ((!link.pageId && !link.url) || link.menuPage) {
                return null;
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button', 'notion-nav-header-wide')}
                  >
                    {link.title}
                  </components.PageLink>
                );
              } else if (link.url) {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(styles.navLink, 'breadcrumb', 'button', 'notion-nav-header-wide')}
                  >
                    {link.title}
                  </components.Link>
                );
              }
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}

          {navigationLinks
            ?.map((link, index) => {
              if (!link.pageId && !link.url) {
                return null;
              }

              if (link.menuPage == true) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(
                      styles.navLink,
                      'breadcrumb',
                      'button',
                      'notion-nav-header-mobile',
                    )}
                  >
                    <svg
                      strokeWidth="0"
                      width="14px"
                      height="14px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                    </svg>
                  </components.PageLink>
                );
              }
            })
            .filter(Boolean)}
        </div>
      </div>
    </header>
  );
};
