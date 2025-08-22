export default function APIKeysCard() {
  return (
    <section className="">
      <h2 className="text-xl font-bold text-foreground dark:text-foreground mb-1">
        API Keys
      </h2>
      <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6">
        Bring your own API keys for select models.
      </p>

      <div className="rounded-lg border border-border  dark:bg-card dark:bg-none dark:border-border bg-gradient-to-b from-accent via-accent to-accent  p-6 text-center">
        <h3 className="text-lg font-semibold text-foreground dark:text-foreground mb-2">
          Pro Feature
        </h3>
        <p className="text-sm text-primary dark:text-primary mb-4">
          Upgrade to Pro to access this feature.
        </p>
        <button className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-2 rounded-md text-sm shadow-md transition cursor-pointer">
          Upgrade to Pro - $8/month
        </button>
      </div>
    </section>
  );
}
