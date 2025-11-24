"use client";
import { useState, useMemo } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBox({ code, loading, language = "javascript" }) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState(14);

  // CLEAN RAW AI OUTPUT
  const clean = (raw) => {
    if (!raw) return "";

    return raw
      .replace(/<\/?s>/g, "")
      .replace(/\[\/?INST\]/g, "")
      .replace(/```[\s\S]*?```/g, (m) => m.replace(/```[a-zA-Z]*/g, "").replace(/```/g, ""))
      .trim();
  };

  const final = useMemo(() => clean(code), [code]);
  const lineCount = final ? final.split("\n").length : 0;

  const languageMap = {
    javascript: "javascript",
    typescript: "typescript",
    react: "jsx",
    html: "html",
    css: "css",
    python: "python",
    java: "java",
    cpp: "cpp"
  };

  const resolvedLanguage = languageMap[language] || "javascript";

  const copy = async () => {
    if (!final) return;
    await navigator.clipboard.writeText(final);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    if (!final) return;
    const blob = new Blob([final], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const ext =
      {
        javascript: "js",
        typescript: "ts",
        python: "py",
        react: "jsx",
        html: "html",
        css: "css",
        java: "java",
        cpp: "cpp",
      }[language] || "txt";

    a.href = url;
    a.download = `code.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col theme-bg-primary">

      {/* HEADER */}
      <div className="flex items-center border-b theme-border theme-bg-secondary px-4 py-2">
        <span className="text-sm theme-text-primary font-medium">
          {final ? `generated.${resolvedLanguage}` : "Untitled"}
        </span>
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-4 py-2 theme-bg-secondary border-b theme-border">

        {/* LEFT SIDE: line count */}
        <div className="flex items-center gap-4 theme-text-secondary">
          <span className="text-xs">{lineCount} lines</span>
        </div>

        {/* RIGHT SIDE CONTROLS */}
        <div className="flex items-center gap-4">

          {/* FONT SIZE CONTROLLER */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFontSize((f) => Math.max(10, f - 1))}
              className="w-7 h-7 rounded theme-hover theme-text-secondary flex items-center justify-center text-sm"
              title="Decrease Font Size"
            >
              A-
            </button>

            {/* slider */}
            <input
              type="range"
              min="10"
              max="30"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              className="w-24 cursor-pointer"
            />

            <button
              onClick={() => setFontSize((f) => Math.min(30, f + 1))}
              className="w-7 h-7 rounded theme-hover theme-text-secondary flex items-center justify-center text-sm"
              title="Increase Font Size"
            >
              A+
            </button>

            {/* display value */}
            <span className="text-xs theme-text-secondary">{fontSize}px</span>
          </div>

          {/* COPY BUTTON */}
          <button
            onClick={copy}
            className="p-2 rounded theme-hover theme-text-secondary"
            title="Copy"
          >
            {copied ? (
              <span className="text-green-400 text-xs">✓</span>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  d="M8 5H6a2 2 0 00-2 2v6a2 
                  2 0 002 2h2m6-6V7a2 2 0 
                  00-2-2H9m0 0a2 2 0 00-2 
                  2v8a2 2 0 002 2h8a2 2 
                  0 002-2V9a2 2 0 
                  00-2-2h-1"
                />
              </svg>
            )}
          </button>

          {/* DOWNLOAD */}
          <button
            onClick={download}
            className="p-2 rounded theme-hover theme-text-secondary"
            title="Download"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 
                3h10a3 3 0 003-3v-1m-4-4l-4 
                4m0 0l-4-4m4 4V4"
              />
            </svg>
          </button>

        </div>
      </div>

      {/* CODE AREA */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full theme-text-secondary">
            <div className="animate-spin h-6 w-6 border-2 border-current border-t-transparent rounded-full" />
          </div>
        ) : final ? (
        <SyntaxHighlighter
  language={resolvedLanguage}
  style={vscDarkPlus}
  showLineNumbers={true}
  wrapLines={true}
  PreTag="div"
  codeTagProps={{
    style: {
      fontSize: `${fontSize}px`,
      lineHeight: "1.6",
      fontFamily: "monospace",
    }
  }}
  customStyle={{
    margin: 0,
    padding: "1.5rem",
    background: "transparent",
  }}
  lineNumberStyle={{
    color: "#6e7681",
    paddingRight: "12px",
    textAlign: "right",
    fontSize: `${fontSize}px`
  }}
>
  {final}
</SyntaxHighlighter>

        ) : (
          <div className="flex justify-center items-center h-full theme-text-secondary">
            No code generated
          </div>
        )}
      </div>
    </div>
  );
}
