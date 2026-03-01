"use client";

import { useState, KeyboardEvent } from "react";

export default function CustomExtensionManager() {
  const [inputValue, setInputValue] = useState("");
  const [extensions, setExtensions] = useState<string[]>([]);

  const addExtension = () => {
    const value = inputValue.trim().toLowerCase();

    if (!value) return;
    if (value.length > 20) {
      alert("확장자는 최대 20자입니다.");
      return;
    }
    if (extensions.includes(value)) {
      alert("이미 추가된 확장자입니다.");
      return;
    }
    if (extensions.length >= 200) {
      alert("최대 200개까지 가능합니다.");
      return;
    }

    setExtensions((prev) => [...prev, value]);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addExtension();
    }
  };

  const removeExtension = (ext: string) => {
    setExtensions((prev) => prev.filter((item) => item !== ext));
  };

  const reset = () => {
    setExtensions([]);
  };

  return (
    <div className="main-container">
      <div className="sub-title">
        커스텀 확장자 {extensions.length}/200
        <button onClick={reset} style={{ float: "right" }}>
          초기화
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="차단할 확장자 추가 (Enter 또는 Tab) / 최대 20자"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button onClick={addExtension}>+ 추가</button>
      </div>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "10px",
          minHeight: "60px",
          borderRadius: "8px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        {extensions.map((ext) => (
          <div
            key={ext}
            style={{
              padding: "6px 12px",
              background: "#eee",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={() => removeExtension(ext)}
          >
            {ext} ✕
          </div>
        ))}
      </div>
    </div>
  );
}