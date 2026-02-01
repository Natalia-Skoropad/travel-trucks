import type { Camper } from '@/types/camper';
import CamperCard from '@/components/catalog/CamperCard/CamperCard';
import InlineLoader from '@/components/common/InlineLoader/InlineLoader';

import css from './CampersList.module.css';

//===============================================================

type Props = {
  campers: Camper[];
  isLoading?: boolean;
  className?: string;
  emptyText?: string;
};

//===============================================================

function CampersList({
  campers,
  isLoading = false,
  className,
  emptyText = 'No campers found for your request.',
}: Props) {
  if (isLoading && !campers?.length) {
    return <InlineLoader text="Loading campers…" />;
  }

  if (!campers?.length) {
    return (
      <div className={`${css.empty} ${className ?? ''}`} role="status">
        {emptyText}
      </div>
    );
  }

  return (
    <ul className={`${css.list} ${className ?? ''}`}>
      {campers.map((camper) => (
        <li key={camper.id} className={css.item}>
          <CamperCard item={camper} />
        </li>
      ))}
    </ul>
  );
}

export default CampersList;
