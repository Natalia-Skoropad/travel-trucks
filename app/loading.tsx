export default function Loading() {
  return (
    <main className="container">
      <div className="appLoader" role="status" aria-live="polite">
        <div className="appLoaderSpinner" aria-hidden="true" />
        <p className="appLoaderText">Loading…</p>
      </div>
    </main>
  );
}
