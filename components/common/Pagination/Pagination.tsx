'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import css from './Pagination.module.css';

//===========================================================================

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

type PaginationItem = number | 'start-ellipsis' | 'end-ellipsis';

//===========================================================================

function getPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 'end-ellipsis', totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 'start-ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    'start-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'end-ellipsis',
    totalPages,
  ];
}

//===========================================================================

function Pagination({ page, totalPages, onPageChange, disabled }: Props) {
  if (totalPages <= 1) return null;

  const items = getPaginationItems(page, totalPages);

  return (
    <nav className={css.nav} aria-label="Catalog pagination">
      <button
        type="button"
        className={css.arrowBtn}
        disabled={disabled || page <= 1}
        aria-label="Go to previous page"
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>

      <ul className={css.list}>
        {items.map((item, index) => (
          <li key={`${item}-${index}`}>
            {typeof item === 'number' ? (
              <button
                type="button"
                className={`${css.pageBtn} ${item === page ? css.active : ''}`}
                disabled={disabled || item === page}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            ) : (
              <span className={css.ellipsis} aria-hidden="true">
                …
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={css.arrowBtn}
        disabled={disabled || page >= totalPages}
        aria-label="Go to next page"
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </nav>
  );
}

export default Pagination;
