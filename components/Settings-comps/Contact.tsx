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
    <section className=" dark:bg-[#1c131b]  text-[#77347c] dark:text-white mb-4 ">
      <h1 className="text-3xl font-semibold mb-4 text-[#501854] dark:text-white">
        We&apos;re here to help
      </h1>
      <div className="space-y-4">
        {links.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 border rounded-lg bg-[#f9e2f0] dark:bg-[#191117] hover:bg-[#f1d7ef] dark:hover:bg-[#251d26] border-[#f4c6e3] dark:border-[#32212d]"
          >
            <div className="pt-1 text-[#e33f86] dark:text-[#a3004c]">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-[#501854]  dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-[#ba3e83] dark:text-[#c0acb9] ">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
