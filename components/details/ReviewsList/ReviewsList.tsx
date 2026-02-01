import type { Camper } from '@/types/camper';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './ReviewsList.module.css';

//===========================================================================

type Review = Camper['reviews'][number];

type Props = {
  reviews?: Camper['reviews'];
  className?: string;
};

//===========================================================================

function clampRating(n: number) {
  return Math.min(5, Math.max(0, Math.round(n)));
}

function getInitial(name: string) {
  const s = name.trim();
  return s ? s[0].toUpperCase() : '?';
}

//===========================================================================

function ReviewCard({ review }: { review: Review }) {
  const stars = clampRating(review.reviewer_rating);

  return (
    <li className={css.item}>
      <div className={css.header}>
        <div className={css.avatar} aria-hidden="true">
          {getInitial(review.reviewer_name)}
        </div>

        <div className={css.meta}>
          <p className={css.name}>{review.reviewer_name}</p>

          <div
            className={css.stars}
            role="img"
            aria-label={`Rating: ${stars} out of 5`}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <SvgIcon
                key={i}
                name="icon-star"
                size={16}
                aria-hidden="true"
                className={`${css.star} ${
                  i < stars ? css.starOn : css.starOff
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <p className={css.text}>{review.comment}</p>
    </li>
  );
}

//===========================================================================

function ReviewsList({ reviews, className }: Props) {
  const list = reviews ?? [];

  return (
    <section className={`${css.section} ${className ?? ''}`}>
      <h2 className="visually-hidden">Reviews</h2>

      {!list.length ? (
        <p className={css.empty}>No reviews yet.</p>
      ) : (
        <ul className={css.list}>
          {list.map((r, idx) => (
            <ReviewCard
              key={`${r.reviewer_name}-${r.reviewer_rating}-${idx}`}
              review={r}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReviewsList;
