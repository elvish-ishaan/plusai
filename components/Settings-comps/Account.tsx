"use client";

import { BadgeCheck, Rocket, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <section className="pr-10 text-foreground dark:bg-card dark:text-foreground">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between text-2xl font-bold">
        <p>Upgrade to Pro</p>
        <p>$8/month</p>
      </div>

      {/* Pro Cards */}
      <div className="mb-6 grid gap-4 text-sm font-medium md:grid-cols-3">
        <div className="rounded-xl border border-border bg-accent p-4 dark:border-border dark:bg-accent">
          <div className="mb-2 flex items-center gap-2">
            <Rocket size={18} />
            <h3 className="font-semibold">Access to All Models</h3>
          </div>
          <p>
            Get access to our full suite of models including Claude,
            o3-mini-high, and more!
          </p>
        </div>

        <div className="rounded-xl border border-border bg-accent p-4 dark:border-border dark:bg-accent">
          <div className="mb-2 flex items-center gap-2">
            <BadgeCheck size={18} />
            <h3 className="font-semibold">Generous Limits</h3>
          </div>
          <p>
            Receive <strong>1500 standard credits</strong> per month, plus{" "}
            <strong>100 premium credits</strong>*.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-accent p-4 dark:border-border dark:bg-accent">
          <div className="mb-2 flex items-center gap-2">
            <Headphones size={18} />
            <h3 className="font-semibold">Priority Support</h3>
          </div>
          <p>
            Get faster responses and dedicated assistance from the T3 team
            whenever you need help!
          </p>
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="mb-2 flex justify-start">
        <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/80">
          Upgrade Now
        </Button>
      </div>

      {/* Note */}
      <p className="text-xs text-foreground dark:text-muted-foreground">
        *Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3.
        Additional Premium credits can be purchased separately.
      </p>

      {/* Danger Zone */}
      <div className="mt-10">
        <h3 className="mb-2 text-xl font-semibold text-destructive dark:text-destructive">
          Danger Zone
        </h3>
        <p className="mb-3 text-sm">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="destructive" className="cursor-pointer">
          Delete Account
        </Button>
      </div>
    </section>
  );
}
