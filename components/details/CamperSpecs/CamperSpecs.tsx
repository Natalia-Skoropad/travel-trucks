import Link from 'next/link';

import type { Camper } from '@/types/camper';
import { hrefByForm } from '@/lib/utils/catalogNav';
import type { VehicleForm } from '@/lib/constants/catalogFilters';

import {
  buildFeatureBadges,
  formatVehicleForm,
} from '@/lib/utils/camperBadges';

import FeatureBadges from '@/components/common/FeatureBadges/FeatureBadges';
import css from './CamperSpecs.module.css';

//===========================================================================

const DETAILS = [
  { key: 'form', label: 'Form' },
  { key: 'length', label: 'Length' },
  { key: 'width', label: 'Width' },
  { key: 'height', label: 'Height' },
  { key: 'tank', label: 'Tank' },
  { key: 'consumption', label: 'Consumption' },
] as const;

//===========================================================================

function CamperSpecs({
  camper,
  className,
}: {
  camper: Camper;
  className?: string;
}) {
  const badges = buildFeatureBadges(camper);

  return (
    <section className={`${css.card} ${className ?? ''}`}>
      <h2 className="visually-hidden">Vehicle Features</h2>

      <FeatureBadges items={badges} />

      <h3 className={css.title}>Vehicle details</h3>
      <div className={css.divider} />

      <dl className={css.details}>
        {DETAILS.map(({ key, label }) => (
          <div key={key} className={css.row}>
            <dt className={css.dt}>{label}</dt>

            <dd className={css.dd}>
              {key === 'form' && camper.form ? (
                <Link
                  href={hrefByForm(camper.form as VehicleForm)}
                  className={css.formLink}
                >
                  {formatVehicleForm(camper.form)}
                </Link>
              ) : (
                camper[key]
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default CamperSpecs;
