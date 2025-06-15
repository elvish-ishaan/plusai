// components/AccountSettingsPage.tsx
"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Switch from "../ui/Switch";

export default function Customization() {
  const [traits, setTraits] = useState<string[]>([
    "friendly",
    "witty",
    "concise",
    "curious",
    "empathetic",
    "creative",
    "patient",
  ]);
  const [traitInput, setTraitInput] = useState("");

  const addTrait = (trait: string) => {
    if (trait && !traits.includes(trait)) {
      setTraits([...traits, trait]);
    }
    setTraitInput("");
  };

  return (
    <div className=" space-y-5 text-[#501854] dark:text-white">
      {/* Customize T3 Chat Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Customize T3 Chat</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">What should T3 Chat call you?</p>
            <Input
              maxLength={50}
              placeholder="Enter your name"
              className="mt-1 border border-[#e7c1dc]  "
            />
          </div>

          <div>
            <p className="font-medium">What do you do?</p>
            <Input
              maxLength={100}
              placeholder="Engineer, student, etc."
              className="mt-1"
            />
          </div>

          <div>
            <p className="font-medium">What traits should T3 Chat have?</p>
            <Input
              maxLength={50}
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTrait(traitInput)}
              placeholder="Type a trait and press Enter or Tab..."
              className="mt-1 border-[#e7c1dc] "
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {traits.map((trait) => (
                <span
                  key={trait}
                  className="bg-[#3e3343] text-white px-2 py-1 rounded-full text-sm"
                >
                  {trait} +
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">
              Anything else T3 Chat should know about you?
            </p>
            <Textarea
              placeholder="Interests, values, or preferences to keep in mind"
              maxLength={3000}
              className="mt-1 border-[#e7c1dc] "
            />
          </div>

          <div className="flex gap-4">
            <Button variant="secondary">Load Legacy Data</Button>
            <Button className="bg-[#a74576] hover:bg-[#913d68]">
              Save Preferences
            </Button>
          </div>
        </div>
      </section>

      {/* Visual Options Section */}
      <section className="space-y-6 text-[#77347c] dark:text-white">
        <h2 className="text-xl font-bold">Visual Options</h2>

        <div className="space-y-4">
          {[
            {
              title: "Boring Theme",
              desc: "If you think the pink is too much, turn this on to tone it down.",
            },
            {
              title: "Hide Personal Information",
              desc: "Hides your name and email from the UI.",
            },
            {
              title: "Disable Thematic Breaks",
              desc: "Hides horizontal lines in chat messages. (Some browsers have trouble rendering these, turn off if you have bugs with duplicated lines)",
            },
            {
              title: "Stats for Nerds",
              desc: "Enables more insights into message stats including tokens per second, time to first token, and estimated tokens in the message.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-[#ac1668] dark:text-[#e7d0dd]">
                  {item.desc}
                </p>
              </div>
              <Switch />
            </div>
          ))}
        </div>

        {/* Font selection and preview (unchanged, from earlier) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div>
              <p className="font-medium">Main Text Font</p>
              <p className="text-sm text-[#ac1668] dark:text-[#e7d0dd]">
                Used in general text throughout the app.
              </p>
              <select className="bg-[#f5ddef] border border-[#e7c1dc]  dark:bg-[#1e1b20] p-2 rounded-md w-full mt-1 text-[#77347c] dark:text-white">
                <option>System Font</option>
                <option>Sans-serif</option>
                <option>Serif</option>
              </select>
            </div>

            <div>
              <p className="font-medium">Code Font</p>
              <p className="text-sm text-[#ac1668] dark:text-[#e7d0dd]">
                Used in code blocks and inline code in chat messages.
              </p>
              <select className="bg-[#f5ddef] border border-[#e7c1dc]  dark:bg-[#1e1b20] p-2 rounded-md w-full mt-1 text-[#77347c] dark:text-white">
                <option>Select font</option>
                <option>Monospace</option>
                <option>Fira Code</option>
              </select>
            </div>
          </div>

          <div>
            <p className="font-medium">Fonts Preview</p>
            <div className="border border-dashed border-[#e9c7e2]  dark:border-[#302029]  rounded-md p-4 text-sm bg-[#f0ddf4] dark:bg-[#2d2530]">
              <div className="mb-2 bg-[#f5d0ea] dark:bg-[#362d3d] p-2 rounded">
                <p className="text-[#77347c] dark:text-white">
                  Can you write me a simple hello world program?
                </p>
              </div>
              <p className="mb-1">Sure, here you go:</p>
              <div className="bg-white dark:bg-[#3a2e3f] rounded font-mono text-xs">
                <div className="bg-[#f1c4e6] dark:bg-[#362d3d] dark:text-white text-[#77347c] pl-2 text-sm  font-normal w-full inline-block rounded-t p-1">
                  typescript
                </div>
                <pre className="pt-2 text-sm p-2 bg-white dark:bg-[#17141c]">
                  <span className="text-purple-600 dark:text-purple-400">
                    function{" "}
                  </span>
                  <span className="text-pink-600 dark:text-pink-400">
                    greet
                  </span>
                  (
                  <span className="text-cyan-600 dark:text-cyan-400">
                    name: string
                  </span>
                  ) {"{"}
                  <br />
                  <span className="ml-4 text-[#77347c] dark:text-white">
                    console.log(`Hello, $&#123;name&#125;`);
                  </span>
                  <br />
                  {"}"}
                  <br />
                  <span className="text-pink-600 dark:text-pink-300">
                    return true;
                  </span>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
