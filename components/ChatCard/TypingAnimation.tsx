"use client";

import { cn } from "@/libs/utils";
import { motion, MotionProps, useInView } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy } from "lucide-react";

interface TypingAnimationProps extends MotionProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  enableMarkdown?: boolean;
}

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!inline && match) {
    return (
      <div className="relative group">
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="rounded-md !m-0"
        >
          {codeString}
        </SyntaxHighlighter>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1 rounded-md bg-gray-800 text-gray-200 opacity-0 group-hover:opacity-100 transition"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>
    );
  }

  return (
    <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  );
};

// ✅ Type-safe MarkdownComponents
const MarkdownComponents: Components = {
  code: CodeBlock,
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-5 mb-3 text-gray-900 dark:text-gray-100">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-gray-100">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-gray-800 dark:text-gray-200">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href as string}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-4">
      <table className="min-w-full border border-gray-300 dark:border-gray-600">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-700">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-gray-200 dark:border-gray-600">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{children}</td>,
  hr: () => <hr className="my-6 border-gray-300 dark:border-gray-600" />,
};

export function TypingAnimation({
  children,
  className,
  duration = 50,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  enableMarkdown = true,
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, { forwardMotionProps: true });

  const [displayedText, setDisplayedText] = useState<string>("");
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.3,
    once: true,
  });

  // ⚡ Optimization: only re-render markdown once finished typing
  const renderedMarkdown = useMemo(() => {
    if (!enableMarkdown) return displayedText;
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
        {displayedText}
      </ReactMarkdown>
    );
  }, [displayedText, enableMarkdown]);

  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => setStarted(true), delay);
      return () => clearTimeout(startTimeout);
    }
    if (!isInView) return;
    const startTimeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimeout);
  }, [delay, startOnView, isInView]);

  useEffect(() => {
    if (!started) return;

    setDisplayedText(""); // reset
    const graphemes = Array.from(children);
    let i = 0;

    const typingEffect = setInterval(() => {
      if (i < graphemes.length) {
        setDisplayedText(graphemes.slice(0, i + 1).join(""));
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, duration);

    return () => clearInterval(typingEffect);
  }, [children, duration, started]);

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        enableMarkdown
          ? "prose prose-lg max-w-none dark:prose-invert"
          : "text-4xl font-bold leading-[5rem] tracking-[-0.02em]",
        className,
      )}
      {...props}
    >
      {enableMarkdown ? renderedMarkdown : displayedText}
    </MotionComponent>
  );
}
