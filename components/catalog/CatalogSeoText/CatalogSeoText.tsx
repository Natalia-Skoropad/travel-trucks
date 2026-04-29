import type { CatalogFiltersValue } from '@/lib/constants/catalogFilters';
import { buildCatalogSeoText } from '@/lib/seo/catalogSeo';

import css from './CatalogSeoText.module.css';

//===========================================================================

type Props = {
  filters: CatalogFiltersValue;
};

//===========================================================================

function CatalogSeoText({ filters }: Props) {
  const seo = buildCatalogSeoText(filters);

  return (
    <section className={css.section} aria-labelledby="catalog-seo-title">
      <h2 id="catalog-seo-title" className={css.title}>
        {seo.title}
      </h2>

      <p className={css.text}>
        {seo.descriptionParts.map((part, index) =>
          part.highlighted ? (
            <strong key={index} className={css.highlight}>
              {part.text}
            </strong>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </p>
    </section>
  );
}

export default CatalogSeoText;
