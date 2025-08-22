"use client";

import {
  Sparkles,
  Bug,
  AlertCircle,
  Shield,
  FileText,
  Users,
} from "lucide-react";

export default function Contact() {
  const links = [
    {
      icon: <Sparkles size={20} />,
      title: "Have a cool feature idea?",
      description: "Vote on upcoming features or suggest your own",
    },
    {
      icon: <Bug size={20} />,
      title: "Found a non-critical bug?",
      description: "UI glitches or formatting issues? Report them here :)",
    },
    {
      icon: <AlertCircle size={20} />,
      title: "Having account or billing issues?",
      description: (
        <>
          Email us for priority support –{" "}
          <a href="mailto:support@ping.gg" className="underline">
            support@ping.gg
          </a>
        </>
      ),
    },
    {
      icon: <Users size={20} />,
      title: "Want to join the community?",
      description:
        "Come hang out in our Discord! Chat with the team and other users",
    },
    {
      icon: <Shield size={20} />,
      title: "Privacy Policy",
      description: "Read our privacy policy and data handling practices",
    },
    {
      icon: <FileText size={20} />,
      title: "Terms of Service",
      description: "Review our terms of service and usage guidelines",
    },
  ];

  return (
    <section className=" dark:bg-card  text-foreground dark:text-foreground mb-4 ">
      <h1 className="text-3xl font-semibold mb-4 text-foreground dark:text-foreground">
        We&apos;re here to help
      </h1>
      <div className="space-y-4">
        {links.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border rounded-lg bg-accent dark:bg-accent hover:bg-accent/80 dark:hover:bg-accent/80 border-border dark:border-border"
          >
            <div className="pt-1 text-primary dark:text-primary">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground  dark:text-foreground">
                {item.title}
              </h3>
              <p className="text-sm text-primary dark:text-muted-foreground ">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
