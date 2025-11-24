"use client";
import { useState } from "react";

const languages = [
  { value: "javascript", label: "JavaScript", color: "#f7df1e" },
  { value: "python", label: "Python", color: "#3776ab" },
  { value: "typescript", label: "TypeScript", color: "#007acc" },
  { value: "java", label: "Java", color: "#ed8b00" },
  { value: "cpp", label: "C++", color: "#00599c" },
];

export default function PromptBox({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate(prompt.trim(), language);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const recentPatterns = [
    "API endpoint with authentication",
    "Component with state management", 
    "Database query optimization",
    "Form with validation",
    "Responsive layout design",
    "Algorithm implementation"
  ];

  const handlePatternClick = (pattern) => {
    setPrompt(pattern);
  };

  return (
    <div className="h-full flex flex-col theme-bg-primary">
      {/* Header */}
      <div className="p-4 border-b theme-border theme-bg-secondary">
        <h2 className="text-sm font-medium theme-text-primary mb-1">New File</h2>
        <p className="text-xs theme-text-secondary">
          Describe the code you want to create
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4">
        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-xs font-medium theme-text-primary mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 theme-input rounded text-sm focus:outline-none"
            disabled={loading}
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Prompt Input */}
        <div className="flex-1 flex flex-col mb-4">
          <label className="block text-xs font-medium theme-text-primary mb-2">
            Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build..."
            className="flex-1 px-3 py-2 theme-input rounded resize-none focus:outline-none scrollbar-thin text-sm min-h-[100px] placeholder-current placeholder-opacity-50"
            disabled={loading}
          />
          <div className="mt-2 flex justify-between items-center text-xs theme-text-secondary">
            <span>{prompt.length} chars</span>
            <span>⌘+Enter to run</span>
          </div>
        </div>

        {/* Recent Patterns */}
        <div className="mb-4">
          <p className="text-xs font-medium theme-text-primary mb-2">Common Patterns</p>
          <div className="grid grid-cols-2 gap-1 max-h-20 overflow-y-auto scrollbar-thin">
            {recentPatterns.map((pattern, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handlePatternClick(pattern)}
                className="px-2 py-1 text-xs theme-bg-tertiary theme-hover theme-text-secondary theme-hover-text rounded border theme-border-secondary transition-colors text-left truncate"
                disabled={loading}
              >
                {pattern}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || loading}
          className="w-full py-2 px-3 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
              Running...
            </>
          ) : (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
              </svg>
              Run
            </>
          )}
        </button>

        {/* Shortcuts */}
        <div className="mt-4 p-3 theme-bg-secondary border theme-border rounded text-xs">
          <div className="theme-text-secondary space-y-1">
            <div className="flex justify-between">
              <span>Run code</span>
              <span className="theme-text-primary">⌘+Enter</span>
            </div>
            <div className="flex justify-between">
              <span>Clear input</span>
              <span className="theme-text-primary">⌘+K</span>
            </div>
            <div className="flex justify-between">
              <span>Focus editor</span>
              <span className="theme-text-primary">⌘+E</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}