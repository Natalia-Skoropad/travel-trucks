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

      <p className={css.text}>{seo.text}</p>
    </section>
  );
}

export default CatalogSeoText;
