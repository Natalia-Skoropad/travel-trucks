import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';

import { buildCatalogSeoText } from '@/lib/seo/catalogSeo';

import css from './CatalogSeoText.module.css';

//===========================================================================

type Props = {
  filters: CatalogFiltersValue;
};

//===========================================================================

function CatalogSeoText({ filters }: Props) {
  const { descriptionParts } = buildCatalogSeoText(filters);

  return (
    <section className={css.section} aria-label="Catalog information">
      <p className={css.text}>
        {descriptionParts.map((part, index) =>
          part.highlighted ? (
            <strong key={index}>{part.text}</strong>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </p>
    </section>
  );
}

export default CatalogSeoText;
