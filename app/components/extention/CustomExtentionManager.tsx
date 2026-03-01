"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { apiClient } from "@/app/api/apiClient";

interface CustomExtension {
  id: number;
  name: string;
}

export default function CustomExtensionManager() {
  const [inputValue, setInputValue] = useState("");
  const [extensions, setExtensions] = useState<CustomExtension[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 최초 전체 조회
  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        const data = await apiClient<CustomExtension[]>("/customExtensions");
        setExtensions(data);
      } catch (error) {
        console.error("조회 실패", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExtensions();
  }, []);

  const addExtension = async () => {
    const value = inputValue.trim().toLowerCase();

    if (!value) return;

    if (value.length > 20) {
      alert("확장자는 최대 20자입니다.");
      return;
    }

    if (extensions.some((ext) => ext.name === value)) {
      alert("이미 추가된 확장자입니다.");
      return;
    }

    if (extensions.length >= 200) {
      alert("최대 200개까지 가능합니다.");
      return;
    }

    try {
      await apiClient<void>("/customExtensions/save", {
        method: "POST",
        body: JSON.stringify({ name: value }),
      });
    
      const updated = await apiClient<CustomExtension[]>("/customExtensions");
      setExtensions(updated);
    
      setInputValue("");
    } catch (error) {
      console.error("저장 실패", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const removeExtension = async (id: number) => {
    try {
      await apiClient(`/customExtensions/delete/${id}`, {
        method: "DELETE",
      });

      setExtensions((prev) => prev.filter((ext) => ext.id !== id));
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      addExtension();
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="main-container">
      <div className="sub-title">
        커스텀 확장자 {extensions.length}/200
       
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
            key={ext.id}
            style={{
              padding: "6px 12px",
              background: "#eee",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={() => removeExtension(ext.id)}
          >
            {ext.name} ✕
          </div>
        ))}
      </div>
    </div>
  );
}