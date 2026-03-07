"use client";

import React, { useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import { Copy, Check } from "lucide-react";

import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
  muted?: boolean;
}

const CodeBlock: React.FC<{
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}> = ({ inline, className, children }) => {
  const [copied, setCopied] = useState(false);

  if (inline) {
    return <code className="inline-code">{children}</code>;
  }

  const handleCopy = async () => {
    const code = String(children).replace(/\n$/, "");
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden bg-[#1a1a1a] border border-white/[0.08]">
      <div className="flex items-center justify-between px-3 py-2 bg-[#252525] border-b border-white/[0.08]">
        <span className="text-xs text-[#8e8e8e] font-mono">
          {className ? className.replace("language-", "") : "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#8e8e8e] hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <><Check size={12} /><span>Copied!</span></>
          ) : (
            <><Copy size={12} /><span>Copy</span></>
          )}
        </button>
      </div>
      <pre className="p-3 sm:p-4 overflow-x-auto">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};

const components: Components = {
  code: (props) => <CodeBlock {...props} />,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse border border-white/[0.08] rounded-lg">{children}</table>
    </div>
  ),
};

export function MarkdownRenderer({ content, isStreaming, muted }: MarkdownRendererProps) {
  return (
    <div className={`markdown-body${muted ? " muted" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
      {Boolean(isStreaming) && (
        <span key="cursor" className="inline-block w-2 h-2 ml-1 bg-white rounded-full animate-cursor-pulse" />
      )}
    </div>
  );
}
