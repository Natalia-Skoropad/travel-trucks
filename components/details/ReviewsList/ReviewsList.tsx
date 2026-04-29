import { Star } from 'lucide-react';

import type { Review } from '@/types/review';

import css from './ReviewsList.module.css';

//===========================================================================

type Props = {
  reviews: Review[];
  className?: string;
};

//===========================================================================

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}

function ReviewsList({ reviews, className }: Props) {
  if (!reviews.length) {
    return (
      <p className={`${css.empty} ${className ?? ''}`}>
        No reviews yet for this camper.
      </p>
    );
  }

  return (
    <ul className={`${css.list} ${className ?? ''}`}>
      {reviews.map((review) => (
        <li key={review.id} className={css.item}>
          <div className={css.head}>
            <span className={css.avatar} aria-hidden="true">
              {getInitial(review.reviewer_name)}
            </span>

            <div>
              <h3 className={css.name}>{review.reviewer_name}</h3>

              <div
                className={css.rating}
                aria-label={`Rating ${review.reviewer_rating} out of 5`}
              >
                {Array.from({ length: 5 }, (_, index) => {
                  const isActive = index < review.reviewer_rating;

                  return (
                    <Star
                      key={index}
                      className={`${css.star} ${
                        isActive ? css.starActive : ''
                      }`}
                      aria-hidden="true"
                    />
                  );
                })}
              </div>
            </div>
          </div>

          <p className={css.comment}>{review.comment}</p>
        </li>
      ))}
    </ul>
  );
}

export default ReviewsList;
