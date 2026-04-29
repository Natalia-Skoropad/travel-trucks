'use client';

import Button from '@/components/common/Button/Button';

import css from './Pagination.module.css';

//===========================================================================

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

//===========================================================================

function getPages(page: number, totalPages: number) {
  const pages = new Set<number>();

  pages.add(1);
  pages.add(totalPages);
  pages.add(page);

  if (page > 1) pages.add(page - 1);
  if (page < totalPages) pages.add(page + 1);

  return Array.from(pages)
    .filter((item) => item >= 1 && item <= totalPages)
    .sort((a, b) => a - b);
}

//===========================================================================

function Pagination({ page, totalPages, onPageChange, disabled }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav className={css.nav} aria-label="Catalog pagination">
      <Button
        type="button"
        variant="outlineRed"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <ul className={css.list}>
        {pages.map((item) => (
          <li key={item}>
            <button
              type="button"
              className={`${css.pageBtn} ${item === page ? css.active : ''}`}
              disabled={disabled || item === page}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      <Button
        type="button"
        variant="outlineRed"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  );
}

export default Pagination;
