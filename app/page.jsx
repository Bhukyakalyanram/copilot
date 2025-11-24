"use client";
import { useState, useEffect } from "react";
import PromptBox from "./components/PromptBox";
import CodeBox from "./components/CodeBox";
import HistoryPanel from "./components/HistoryPanel";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem("editor-history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error loading history:", error);
      }
    }
  }, []);
const onDeleteOne = (id) => {
  const updated = history.filter((item) => item.id !== id);
  setHistory(updated);
  localStorage.setItem("editor-history", JSON.stringify(updated));
};

  const handleGenerate = async (prompt, language) => {
    setLoading(true);
    setCode("");
    setCurrentLanguage(language);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, language })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setCode(data.code || "// Unable to process request");
      
      const entry = { 
        id: Date.now(),
        prompt: prompt.substring(0, 100) + (prompt.length > 100 ? "..." : ""), 
        code: data.code, 
        language,
        timestamp: new Date().toISOString()
      };
      
      const updatedHistory = [entry, ...history.slice(0, 49)];
      setHistory(updatedHistory);
      localStorage.setItem("editor-history", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error processing request:", error);
      setCode(`// Error: ${error.message}\n// Please try again\n\nfunction example() {\n  console.log("Hello, World!");\n  return true;\n}`);
    } finally {
      setLoading(false);
    }
  };
  const onToggleFavorite = (id) => {
  const updated = history.map(h =>
    h.id === id ? { ...h, favorite: !h.favorite } : h
  );

  setHistory(updated);
  localStorage.setItem("editor-history", JSON.stringify(updated));
};


  const handleSelectHistory = (entry) => {
    setCode(entry.code);
    setCurrentLanguage(entry.language);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("editor-history");
  };

  return (
    <div className="h-screen theme-bg-primary flex flex-col overflow-hidden">
      {/* Menu Bar */}
      <div className="theme-bg-secondary border-b theme-border px-4 py-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#238636] rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-sm theme-text-primary font-medium">Code Editor</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="flex items-center gap-1 text-xs theme-text-secondary">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Ready</span>
          </div>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              showHistory 
                ? 'bg-[#238636] text-white' 
                : 'theme-text-secondary theme-hover theme-hover-text'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {showHistory && (
          <div className="w-64 border-r theme-border theme-bg-primary">
            <HistoryPanel 
              history={history} 
              onSelectHistory={handleSelectHistory}
              onClearHistory={clearHistory}
              onDeleteOne={onDeleteOne}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r theme-border theme-bg-primary">
            <PromptBox onGenerate={handleGenerate} loading={loading} />
          </div>

          {/* Main Editor */}
          <div className="flex-1 theme-bg-primary">
            <CodeBox 
              code={code} 
              loading={loading} 
              language={currentLanguage}
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-black px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-white">
          <span>Ready</span>
          {currentLanguage && (
            <span className="capitalize">{currentLanguage}</span>
          )}
          {code && (
            <span>{code.split('\n').length} lines</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-white">
          {loading && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Processing...</span>
            </div>
          )}
          <span>UTF-8</span>
          <span>CRLF</span>
        </div>
      </div>
    </div>
  );
}