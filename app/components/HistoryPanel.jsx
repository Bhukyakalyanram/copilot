"use client";
import { useState } from "react";

export default function HistoryPanel({
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteOne,
  onToggleFavorite
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHistory = history
    .filter(
      (entry) =>
        entry.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.language.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => Number(b.favorite) - Number(a.favorite));

  const getLanguageInfo = (language) => {
    const languages = {
      javascript: { name: "JavaScript", color: "#f7df1e", ext: "js" },
      typescript: { name: "TypeScript", color: "#007acc", ext: "ts" },
      python: { name: "Python", color: "#3776ab", ext: "py" },
      java: { name: "Java", color: "#ed8b00", ext: "java" },
      cpp: { name: "C++", color: "#00599c", ext: "cpp" }
    };
    return (
      languages[language] || {
        name: language.toUpperCase(),
        color: "#6b7280",
        ext: "txt"
      }
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diff = Math.floor((now - past) / 1000 / 60);

    if (diff < 1) return "now";
    if (diff < 60) return `${diff}m`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const truncatePrompt = (text, limit = 60) =>
    text.length <= limit ? text : text.slice(0, limit) + "...";

  return (
    <div className="h-full flex flex-col theme-bg-primary">
      {/* HEADER */}
      <div className="p-3 border-b theme-border theme-bg-secondary">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium theme-text-primary">Recent Files</h2>

          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs theme-text-secondary theme-hover-text p-1 rounded theme-hover"
              title="Clear history"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 
                0116.138 21H7.862a2 2 0 
                01-1.995-1.858L5 7m5 
                4v6m4-6v6m1-10V4a1 1 0 
                00-1-1h-4a1 1 0 
                00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-1.5 theme-input rounded text-xs placeholder-current placeholder-opacity-50 focus:outline-none"
        />
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filteredHistory.length === 0 ? (
          <div className="p-4 text-center theme-text-secondary text-xs">
            {history.length === 0 ? "No recent files" : "No matches"}
          </div>
        ) : (
          <div className="p-1">
            {filteredHistory.map((entry) => {
              const lang = getLanguageInfo(entry.language);
              const lineCount = entry.code?.split("\n").length || 0;

              return (
                <div
                  key={entry.id}
                  className="group flex items-center gap-2 p-2 rounded theme-hover"
                >
                  {/* CLICKABLE FILE AREA */}
                  <div
                    onClick={() => onSelectHistory(entry)}
                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                  >
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs theme-text-primary font-medium truncate">
                          code.{lang.ext}
                        </span>
                        <span className="text-xs theme-text-secondary flex-shrink-0">
                          {formatTimeAgo(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs theme-text-secondary truncate">
                        {truncatePrompt(entry.prompt)}
                      </p>
                    </div>
                  </div>

                  {/* FAVORITE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(entry.id);
                    }}
                    className="p-1 flex-shrink-0"
                    title="Favorite"
                  >
                    {entry.favorite ? (
                      <svg
                        className="w-4 h-4 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.49 6.91l6.572-.955L10 0l2.938 5.955 6.572.955-4.754 4.636 1.122 6.545z" />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4 theme-text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.049 2.927c.3-.921 1.603-.921 
                          1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 
                          1.371 1.24.588 1.81l-3.976 
                          2.888a1 1 0 
                          00-.364 1.118l1.518 
                          4.674c.3.921-.755 
                          1.688-1.538 
                          1.118l-3.976-2.888a1 1 0 
                          00-1.176 0l-3.976 
                          2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 
                          0 00-.364-1.118L2.08 
                          10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 
                          0 00.95-.69l1.518-4.674z"
                        />
                      </svg>
                    )}
                  </button>

                  {/* DELETE */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOne(entry.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded theme-hover text-[#f85149] flex-shrink-0 transition"
                    title="Delete file"
                  >
                   <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 
                0116.138 21H7.862a2 2 0 
                01-1.995-1.858L5 7m5 
                4v6m4-6v6m1-10V4a1 1 0 
                00-1-1h-4a1 1 0 
                00-1 1v3M4 7h16"
                />
              </svg>
                  </button>

                  <div className="flex-shrink-0 text-xs theme-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    {lineCount}L
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      {history.length > 0 && (
        <div className="border-t theme-border px-3 py-2 theme-bg-secondary">
          <div className="flex justify-between items-center text-xs theme-text-secondary">
            <span>{filteredHistory.length} items</span>
            {filteredHistory.length !== history.length && (
              <span>{history.length} total</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
