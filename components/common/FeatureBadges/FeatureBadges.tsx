import Link from 'next/link';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './FeatureBadges.module.css';

//===============================================================

export type FeatureBadgeItem = {
  label: string;
  icon: string;
  href?: string;
};

type Props = {
  items: FeatureBadgeItem[];
  className?: string;
};

//===============================================================

function FeatureBadges({ items, className }: Props) {
  if (!items.length) return null;

  return (
    <div className={css.wrap}>
      <ul className={`${css.list} ${className ?? ''}`}>
        {items.map(({ label, icon, href }) => {
          const content = (
            <>
              <SvgIcon
                name={icon}
                size={20}
                className={css.icon}
                title={label}
              />
              <span className={css.label}>{label}</span>
            </>
          );

          return (
            <li key={`${icon}-${label}`} className={css.item}>
              {href ? (
                <Link
                  href={href}
                  className={css.pill}
                  aria-label={`Filter by ${label}`}
                >
                  {content}
                </Link>
              ) : (
                <div className={css.pill} aria-label={label}>
                  {content}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FeatureBadges;
