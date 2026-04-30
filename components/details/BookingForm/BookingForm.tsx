'use client';

import { useMemo } from 'react';
import * as Yup from 'yup';

import {
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from 'formik';

import { createBookingRequest } from '@/lib/api/campersApi';
import { useBookingFormStore } from '@/lib/store/bookingFormStore';

import Button from '@/components/common/Button/Button';
import Toast from '@/components/common/Toast/Toast';

import css from './BookingForm.module.css';

//===============================================================

type Props = {
  camperId: string;
};

type Values = {
  name: string;
  email: string;
};

//===============================================================

const NAME_MAX = 40;
const EMAIL_MAX = 64;

//===============================================================

function clampText(value: string, max: number) {
  return value.length <= max ? value : value.slice(0, max);
}

//===============================================================

function BookingForm({ camperId }: Props) {
  const toast = useBookingFormStore((state) => state.toast);
  const showToast = useBookingFormStore((state) => state.showToast);
  const hideToast = useBookingFormStore((state) => state.hideToast);

  const draft = useBookingFormStore((state) => state.draft);
  const setDraft = useBookingFormStore((state) => state.setDraft);
  const resetDraft = useBookingFormStore((state) => state.resetDraft);

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
      }),
    []
  );

  const initialValues: Values = useMemo(
    () => ({
      name: draft.name ?? '',
      email: draft.email ?? '',
    }),
    [draft.email, draft.name]
  );

  const handleSubmit = async (
    values: Values,
    helpers: FormikHelpers<Values>
  ) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
    };

    try {
      const response = await createBookingRequest(camperId, payload);

      showToast({
        type: 'success',
        message:
          response.message ||
          'Booking request sent successfully. We will contact you soon.',
      });

      resetDraft();
      helpers.resetForm({
        values: {
          name: '',
          email: '',
        },
      });
    } catch {
      showToast({
        type: 'error',
        message: 'Something went wrong. Please try again.',
      });
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <section className={css.section} aria-labelledby="booking-title">
      <div className={css.card}>
        <div className={css.header}>
          <h2 id="booking-title" className={css.title}>
            Book your campervan and let us prepare your next road trip
          </h2>

          <p className={css.subtitle}>
            Send your contact details and our travel team will help you confirm
            availability, rental conditions, and the next steps for your trip.
          </p>

          <ul className={css.benefits}>
            <li>We contact you by email with booking details.</li>
            <li>Your request is free and does not confirm payment.</li>
            <li>We help you choose the best option for your route.</li>
            <li>We’ll guide you through the booking process step by step.</li>
          </ul>
        </div>

        <Formik<Values>
          initialValues={initialValues}
          validationSchema={schema}
          validateOnMount
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            isValid,
            dirty,
            setFieldValue,
          }) => {
            const canSubmit = isValid && dirty && !isSubmitting;

            return (
              <Form className={css.form} noValidate>
                <Field name="name">
                  {({ field }: FieldProps<string>) => {
                    const hasError = Boolean(touched.name && errors.name);
                    const count = field.value?.length ?? 0;

                    return (
                      <div
                        className={`${css.field} ${
                          hasError ? css.fieldError : ''
                        }`}
                      >
                        <input
                          {...field}
                          type="text"
                          className={css.input}
                          placeholder="Name*"
                          autoComplete="name"
                          maxLength={NAME_MAX}
                          aria-invalid={hasError}
                          onChange={(event) => {
                            const next = clampText(
                              event.target.value,
                              NAME_MAX
                            );

                            void setFieldValue('name', next, true);
                            setDraft({ name: next });
                          }}
                        />

                        <span className={css.counter}>
                          {count}/{NAME_MAX}
                        </span>

                        {hasError ? (
                          <span className={css.error} aria-live="polite">
                            {String(errors.name)}
                          </span>
                        ) : null}
                      </div>
                    );
                  }}
                </Field>

                <Field name="email">
                  {({ field }: FieldProps<string>) => {
                    const hasError = Boolean(touched.email && errors.email);
                    const count = field.value?.length ?? 0;

                    return (
                      <div
                        className={`${css.field} ${
                          hasError ? css.fieldError : ''
                        }`}
                      >
                        <input
                          {...field}
                          type="email"
                          className={css.input}
                          placeholder="Email*"
                          autoComplete="email"
                          maxLength={EMAIL_MAX}
                          aria-invalid={hasError}
                          onChange={(event) => {
                            const next = clampText(
                              event.target.value,
                              EMAIL_MAX
                            );

                            void setFieldValue('email', next, true);
                            setDraft({ email: next });
                          }}
                        />

                        <span className={css.counter}>
                          {count}/{EMAIL_MAX}
                        </span>

                        {hasError ? (
                          <span className={css.error} aria-live="polite">
                            {String(errors.email)}
                          </span>
                        ) : null}
                      </div>
                    );
                  }}
                </Field>

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
