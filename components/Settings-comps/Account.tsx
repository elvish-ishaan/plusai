"use client";

import { BadgeCheck, Rocket, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Account() {
  return (
    <section className=" dark:bg-card  text-foreground dark:text-foreground pr-10">
      <div className="text-2xl font-bold mb-6 flex justify-between items-center">
        <p> Upgrade to Pro</p>
        <p>$8/month</p>
      </div>

      {/* Pro Cards */}
      <div className="grid md:grid-cols-3 gap-4 text-sm font-medium mb-6">
        <div className="rounded-xl border border-border dark:border-border p-4 bg-accent dark:bg-accent">
          <div className="flex items-center gap-2 mb-2">
            <Rocket size={18} />
            <h3 className="font-semibold">Access to All Models</h3>
          </div>
          <p>
            Get access to our full suite of models including Claude,
            o3-mini-high, and more!
          </p>
        </div>

        <div className="rounded-xl border border-border dark:border-border p-4 bg-accent dark:bg-accent">
          <div className="flex items-center gap-2 mb-2">
            <BadgeCheck size={18} />
            <h3 className="font-semibold">Generous Limits</h3>
          </div>
          <p>
            Receive <strong>1500 standard credits</strong> per month, plus{" "}
            <strong>100 premium credits</strong>*.
          </p>
        </div>

        <div className="rounded-xl border border-border dark:border-border p-4 bg-accent dark:bg-accent">
          <div className="flex items-center gap-2 mb-2">
            <Headphones size={18} />
            <h3 className="font-semibold">Priority Support</h3>
          </div>
          <p>
            Get faster responses and dedicated assistance from the T3 team
            whenever you need help!
          </p>
        </div>
      </div>

      {/* Upgrade button */}
      <div className="flex justify-start mb-2">
        <Button className="bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer">
          Upgrade Now
        </Button>
      </div>

      <p className="text-xs text-foreground dark:text-muted-foreground">
        *Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3.
        Additional Premium credits can be purchased separately.
      </p>

      {/* Danger Zone */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2 text-destructive dark:text-destructive">
          Danger Zone
        </h3>
        <p className="text-sm mb-3">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="destructive" className="cursor-pointer">Delete Account</Button>
      </div>
    </section>
  );
}
