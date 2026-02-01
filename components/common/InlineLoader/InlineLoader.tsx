import css from './InlineLoader.module.css';

//===============================================================

type Props = {
  text?: string;
  className?: string;
};

//===============================================================

function InlineLoader({ text = 'Loading…', className }: Props) {
  return (
    <div
      className={`${css.wrap} ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={css.spinner} aria-hidden="true" />
      <p className={css.text}>{text}</p>
    </div>
  );
}

export default InlineLoader;
