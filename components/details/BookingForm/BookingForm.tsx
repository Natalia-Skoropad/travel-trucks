'use client';

import { useMemo } from 'react';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Formik,
  Form,
  Field,
  type FormikHelpers,
  type FieldProps,
} from 'formik';

import { useBookingFormStore } from '@/lib/store/bookingFormStore';
import Button from '@/components/common/Button/Button';
import Toast from '@/components/common/Toast/Toast';

import css from './BookingForm.module.css';

//===============================================================

type Values = {
  name: string;
  email: string;
  bookingDate: Date | null;
  comment: string;
};

//===============================================================

const NAME_MAX = 20;
const EMAIL_MAX = 64;
const COMMENT_MAX = 500;

//===============================================================

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function clampText(value: string, max: number) {
  return value.length <= max ? value : value.slice(0, max);
}

function isoToDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

//===============================================================

function BookingForm() {
  const toast = useBookingFormStore((s) => s.toast);
  const showToast = useBookingFormStore((s) => s.showToast);
  const hideToast = useBookingFormStore((s) => s.hideToast);

  const draft = useBookingFormStore((s) => s.draft);
  const setDraft = useBookingFormStore((s) => s.setDraft);
  const resetDraft = useBookingFormStore((s) => s.resetDraft);

  const minDate = useMemo(() => startOfToday(), []);
  const maxDate = useMemo(() => addDays(startOfToday(), 365), []);

  const schema = useMemo(
    () =>
      Yup.object({
        name: Yup.string()
          .trim()
          .min(2, 'Minimum 2 characters')
          .max(NAME_MAX, `Maximum ${NAME_MAX} characters`)
          .required('Required'),
        email: Yup.string()
          .trim()
          .email('Invalid email')
          .max(EMAIL_MAX, `Maximum ${EMAIL_MAX} characters`)
          .required('Required'),
        bookingDate: Yup.date()
          .typeError('Required')
          .min(minDate, 'Date cannot be in the past')
          .max(maxDate, 'Date must be within 365 days')
          .required('Required')
          .nullable(),
        comment: Yup.string()
          .trim()
          .max(COMMENT_MAX, `Maximum ${COMMENT_MAX} characters`),
      }),
    [minDate, maxDate]
  );

  const initialValues: Values = useMemo(
    () => ({
      name: draft.name ?? '',
      email: draft.email ?? '',
      bookingDate: isoToDate(draft.bookingDate),
      comment: draft.comment ?? '',
    }),
    [draft]
  );

  async function onSubmit(values: Values, helpers: FormikHelpers<Values>) {
    hideToast();

    try {
      await new Promise((r) => setTimeout(r, 900));

      const ok = Math.random() > 0.2;
      if (!ok) throw new Error('Network error');

      helpers.resetForm();
      resetDraft();

      showToast({
        type: 'success',
        message: 'Successfully sent! We will contact you soon.',
      });
    } catch {
      showToast({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <section className={css.section}>
      <h2 className="visually-hidden">Booking form</h2>

      <div className={css.card}>
        <h3 className={css.title}>Book your campervan now</h3>
        <p className={css.subtitle}>
          Stay connected! We are always ready to help you.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={onSubmit}
          validateOnMount
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
            isValid,
          }) => {
            const canSubmit =
              isValid &&
              !!values.name.trim() &&
              !!values.email.trim() &&
              !!values.bookingDate &&
              !isSubmitting;

            const nameHasError = !!(touched.name && errors.name);
            const emailHasError = !!(touched.email && errors.email);
            const dateHasError = !!(touched.bookingDate && errors.bookingDate);
            const commentHasError = !!(touched.comment && errors.comment);

            return (
              <Form className={css.form} noValidate>
                {/* Name */}
                <div
                  className={`${css.field} ${
                    nameHasError ? css.fieldError : ''
                  }`}
                >
                  <label className="visually-hidden" htmlFor="name">
                    Name
                  </label>

                  <Field name="name">
                    {({ field }: FieldProps<string>) => (
                      <input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Name*"
                        className={`${css.input} ${css.withCounter}`}
                        maxLength={NAME_MAX}
                        onChange={(e) => {
                          const next = clampText(e.target.value, NAME_MAX);
                          void setFieldValue('name', next, true);
                          setDraft({ name: next });
                        }}
                      />
                    )}
                  </Field>

                  <span className={css.counterIn} aria-hidden="true">
                    {values.name.length}/{NAME_MAX}
                  </span>

                  {nameHasError ? (
                    <span className={css.error} aria-live="polite">
                      {String(errors.name)}
                    </span>
                  ) : null}
                </div>

                {/* Email */}
                <div
                  className={`${css.field} ${
                    emailHasError ? css.fieldError : ''
                  }`}
                >
                  <label className="visually-hidden" htmlFor="email">
                    Email
                  </label>

                  <Field name="email">
                    {({ field }: FieldProps<string>) => (
                      <input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Email*"
                        className={`${css.input} ${css.withCounter}`}
                        maxLength={EMAIL_MAX}
                        onChange={(e) => {
                          const next = clampText(e.target.value, EMAIL_MAX);
                          void setFieldValue('email', next, true);
                          setDraft({ email: next });
                        }}
                      />
                    )}
                  </Field>

                  <span className={css.counterIn} aria-hidden="true">
                    {values.email.length}/{EMAIL_MAX}
                  </span>

                  {emailHasError ? (
                    <span className={css.error} aria-live="polite">
                      {String(errors.email)}
                    </span>
                  ) : null}
                </div>

                {/* Date */}
                <div
                  className={`${css.field} ${
                    dateHasError ? css.fieldError : ''
                  }`}
                >
                  <label className="visually-hidden" htmlFor="bookingDate">
                    Booking date
                  </label>

                  <DatePicker
                    id="bookingDate"
                    selected={values.bookingDate}
                    onChange={(date: Date | null) => {
                      void setFieldValue('bookingDate', date, true);
                      setDraft({
                        bookingDate: date ? date.toISOString() : null,
                      });
                    }}
                    onBlur={() =>
                      void setFieldTouched('bookingDate', true, true)
                    }
                    onCalendarClose={() =>
                      void setFieldTouched('bookingDate', true, true)
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Booking date*"
                    dateFormat="dd.MM.yyyy"
                    className={css.input}
                    name="bookingDate"
                  />

                  {dateHasError ? (
                    <span className={css.error} aria-live="polite">
                      {String(errors.bookingDate)}
                    </span>
                  ) : null}
                </div>

                {/* Comment */}
                <div
                  className={`${css.field} ${
                    commentHasError ? css.fieldError : ''
                  }`}
                >
                  <label className="visually-hidden" htmlFor="comment">
                    Comment
                  </label>

                  <Field name="comment">
                    {({ field }: FieldProps<string>) => (
                      <textarea
                        {...field}
                        id="comment"
                        placeholder="Comment"
                        className={`${css.textarea} ${css.withCounter}`}
                        maxLength={COMMENT_MAX}
                        onChange={(e) => {
                          const next = clampText(e.target.value, COMMENT_MAX);
                          void setFieldValue('comment', next, true);
                          setDraft({ comment: next });
                        }}
                      />
                    )}
                  </Field>

                  <span
                    className={`${css.counterIn} ${css.counterInTextarea}`}
                    aria-hidden="true"
                  >
                    {values.comment.length}/{COMMENT_MAX}
                  </span>

                  {commentHasError ? (
                    <span className={css.error} aria-live="polite">
                      {String(errors.comment)}
                    </span>
                  ) : null}
                </div>

                <div className={css.actions}>
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? 'Sending…' : 'Send'}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      {toast ? (
        <Toast type={toast.type} message={toast.message} onClose={hideToast} />
      ) : null}
    </section>
  );
}

export default BookingForm;
