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
    <div className="p-4 md:p-8 space-y-12 text-white">
      {/* Customize T3 Chat Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Customize T3 Chat</h2>

        <div className="space-y-4">
          <div>
            <p className="font-medium">What should T3 Chat call you?</p>
            <Input
              maxLength={50}
              placeholder="Enter your name"
              className="mt-1"
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
              className="mt-1"
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
              className="mt-1"
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
      <section className="space-y-6">
        <h2 className="text-xl font-bold">Visual Options</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Boring Theme</span>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <span>Hide Personal Information</span>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <span>Disable Thematic Breaks</span>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <span>Stats for Nerds</span>
            <Switch />
          </div>

          <div>
            <p className="font-medium">Main Text Font</p>
            <select className="bg-[#1e1b20] p-2 rounded-md w-full mt-1">
              <option>System Font</option>
              <option>Sans-serif</option>
              <option>Serif</option>
            </select>
          </div>

          <div>
            <p className="font-medium">Code Font</p>
            <select className="bg-[#1e1b20] p-2 rounded-md w-full mt-1">
              <option>Select font</option>
              <option>Monospace</option>
              <option>Fira Code</option>
            </select>
          </div>

          <div>
            <p className="font-medium">Fonts Preview</p>
            <div className="bg-[#2d2530] p-4 rounded-md text-sm">
              <p className="mb-2">
                Can you write me a simple hello world program?
              </p>
              <div className="bg-[#3a2e3f] p-2 rounded text-xs font-mono">
                <p className="text-purple-400">
                  function <span className="text-pink-400">greet</span>(
                  <span className="text-cyan-400">name: string</span>) {"{"}
                </p>
                <p className="ml-4">console.log(`Hello, ${"{name}"}`);</p>
                <p>{"}"}</p>
                <p className="text-pink-300">return true;</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
