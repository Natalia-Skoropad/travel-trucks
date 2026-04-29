'use client';

import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import {
  Formik,
  Form,
  Field,
  type FormikHelpers,
  type FieldProps,
} from 'formik';

import { createBookingRequest } from '@/lib/api/campersApi';

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

const NAME_MAX = 20;
const EMAIL_MAX = 64;

//===============================================================

function clampText(value: string, max: number) {
  return value.length <= max ? value : value.slice(0, max);
}

//===============================================================

function BookingForm({ camperId }: Props) {
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  const initialValues: Values = {
    name: '',
    email: '',
  };

  async function onSubmit(values: Values, helpers: FormikHelpers<Values>) {
    setToast(null);

    try {
      const response = await createBookingRequest(camperId, {
        name: values.name.trim(),
        email: values.email.trim(),
      });

      helpers.resetForm();

      setToast({
        type: 'success',
        message:
          response.message || 'Booking request sent! We will contact you soon.',
      });
    } catch {
      setToast({
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
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            isSubmitting,
            isValid,
          }) => {
            const canSubmit =
              isValid &&
              values.name.trim().length > 0 &&
              values.email.trim().length > 0 &&
              !isSubmitting;

            const nameHasError = Boolean(touched.name && errors.name);
            const emailHasError = Boolean(touched.email && errors.email);

            return (
              <Form className={css.form} noValidate>
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
                        onChange={(event) => {
                          const next = clampText(event.target.value, NAME_MAX);
                          void setFieldValue('name', next, true);
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
                        onChange={(event) => {
                          const next = clampText(event.target.value, EMAIL_MAX);
                          void setFieldValue('email', next, true);
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
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      ) : null}
    </section>
  );
}

export default BookingForm;
