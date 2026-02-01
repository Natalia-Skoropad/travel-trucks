import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { fetchCampers } from '@/lib/api/campersApi';
import css from './CamperPrevNextNav.module.css';

//===============================================================

type Props = {
  currentId: string;
};

//===============================================================

const LIST_LIMIT = 23;

async function CamperPrevNextNav({ currentId }: Props) {
  const data = await fetchCampers({ page: 1, limit: LIST_LIMIT });
  const items = data.items ?? [];

  const idx = items.findIndex((c) => c.id === currentId);
  if (idx < 0 || items.length < 2) return null;

  const prev = idx > 0 ? items[idx - 1] : null;
  const next = idx < items.length - 1 ? items[idx + 1] : null;

  return (
    <nav className={css.nav} aria-label="Camper navigation">
      <ul className={css.list}>
        <li>
          {prev ? (
            <Link href={`/catalog/${prev.id}`} className={css.btn}>
              <ChevronLeft className={css.icon} />
              <span className={css.label}>Previous car</span>
            </Link>
          ) : (
            <span className={`${css.btn} ${css.disabled}`}>
              <ChevronLeft className={css.icon} />
              <span className={css.label}>Previous car</span>
            </span>
          )}
        </li>

        <li>
          {next ? (
            <Link href={`/catalog/${next.id}`} className={css.btn}>
              <span className={css.label}>Next car</span>
              <ChevronRight className={css.icon} />
            </Link>
          ) : (
            <span className={`${css.btn} ${css.disabled}`}>
              <span className={css.label}>Next car</span>
              <ChevronRight className={css.icon} />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default CamperPrevNextNav;
