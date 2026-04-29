import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchCampersFromServer } from '@/lib/api/campersApi';
import type { CamperListItem } from '@/types/camper';

import css from './CamperPrevNextNav.module.css';

//===============================================================

type Props = {
  currentId: string;
};

//===============================================================

const NAVIGATION_PER_PAGE = 5;

//===============================================================

async function fetchNavigationCampers(): Promise<CamperListItem[]> {
  try {
    const firstPage = await fetchCampersFromServer({
      page: 1,
      perPage: NAVIGATION_PER_PAGE,
    });

    if (firstPage.totalPages <= 1) {
      return firstPage.campers;
    }

    const restPages = await Promise.all(
      Array.from(
        { length: firstPage.totalPages - 1 },
        (_, index) => index + 2
      ).map((page) =>
        fetchCampersFromServer({
          page,
          perPage: NAVIGATION_PER_PAGE,
        })
      )
    );

    return [...firstPage.campers, ...restPages.flatMap((page) => page.campers)];
  } catch {
    return [];
  }
}

//===============================================================

async function CamperPrevNextNav({ currentId }: Props) {
  const items = await fetchNavigationCampers();

  const currentIndex = items.findIndex((camper) => camper.id === currentId);

  if (currentIndex < 0 || items.length < 2) return null;

  const prev = currentIndex > 0 ? items[currentIndex - 1] : null;
  const next = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  return (
    <nav className={css.nav} aria-label="Camper navigation">
      <ul className={css.list}>
        <li>
          {prev ? (
            <Link href={`/catalog/${prev.id}`} className={css.btn}>
              <ChevronLeft className={css.icon} aria-hidden="true" />
              <span className={css.label}>Previous car</span>
            </Link>
          ) : (
            <span className={`${css.btn} ${css.disabled}`}>
              <ChevronLeft className={css.icon} aria-hidden="true" />
              <span className={css.label}>Previous car</span>
            </span>
          )}
        </li>

        <li>
          {next ? (
            <Link href={`/catalog/${next.id}`} className={css.btn}>
              <span className={css.label}>Next car</span>
              <ChevronRight className={css.icon} aria-hidden="true" />
            </Link>
          ) : (
            <span className={`${css.btn} ${css.disabled}`}>
              <span className={css.label}>Next car</span>
              <ChevronRight className={css.icon} aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default CamperPrevNextNav;
