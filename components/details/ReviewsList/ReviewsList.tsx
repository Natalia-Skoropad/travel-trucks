import type { Review } from '@/types/review';

import SvgIcon from '@/components/common/SvgIcon/SvgIcon';
import css from './ReviewsList.module.css';

//===========================================================================

type Props = {
  reviews?: Review[];
  className?: string;
};

//===========================================================================

function clampRating(value: number) {
  return Math.min(5, Math.max(0, Math.round(value)));
}

function getInitial(name: string) {
  const value = name.trim();

  return value ? value[0].toUpperCase() : '?';
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
            {Array.from({ length: 5 }).map((_, index) => (
              <SvgIcon
                key={index}
                name="icon-star"
                size={16}
                aria-hidden="true"
                className={`${css.star} ${
                  index < stars ? css.starOn : css.starOff
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
          {list.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </ul>
      )}
    </section>
  );
}

export default ReviewsList;
