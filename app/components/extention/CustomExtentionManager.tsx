"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { apiClient } from "@/app/api/apiClient";

interface CustomExtension {
  id: number;
  name: string;
}

interface FixedExtensionLike {
  name: string;
}

interface Props {
  fixedExtensions: FixedExtensionLike[];
}

export default function CustomExtensionManager({ fixedExtensions }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [extensions, setExtensions] = useState<CustomExtension[]>([]);
  const [loading, setLoading] = useState(true);
  const titleStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#4a2f43",
    backgroundColor: "#ffeaf4",
    border: "1px solid #f4cfe0",
    borderRadius: "10px",
    padding: "6px 12px",
    marginBottom: "10px",
  };
  const countBadgeStyle: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#7a4b67",
    backgroundColor: "#fff",
    border: "1px solid #efc7dc",
    borderRadius: "999px",
    padding: "3px 9px",
    lineHeight: 1.2,
  };
  const inputRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#fff6fa",
    border: "1px solid #f3d5e3",
    borderRadius: "12px",
  };
  const inputStyle: React.CSSProperties = {
    flex: 1,
    height: "40px",
    padding: "0 12px",
    borderRadius: "10px",
    border: "1px solid #ebc7da",
    outline: "none",
    color: "#4a2f43",
    backgroundColor: "#fff",
  };
  const addButtonStyle: React.CSSProperties = {
    height: "40px",
    padding: "0 14px",
    borderRadius: "10px",
    border: "1px solid #e8b8d1",
    backgroundColor: "#ffeaf4",
    color: "#6b3f58",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  };
  const tagListStyle: React.CSSProperties = {
    border: "1px solid #f1d2e2",
    backgroundColor: "#fff6fa",
    padding: "12px",
    minHeight: "60px",
    borderRadius: "12px",
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignContent: "flex-start",
  };
  const tagItemStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    height: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "1px solid #e8b8d1",
    backgroundColor: "#ffeaf4",
    color: "#5a3550",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "pointer",
  };
  const tagCloseStyle: React.CSSProperties = {
    display: "inline-block",
    lineHeight: 1,
    color: "#a15f82",
    fontWeight: 700,
  };

  // 최초 전체 조회
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
    
    const normalizedFixedExtensions = fixedExtensions.map((ext) =>
      ext.name.toLowerCase()
    );
    if (normalizedFixedExtensions.includes(value)) {
      alert("고정 확장자에 포함된 값은 추가할 수 없습니다.");
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
      <div style={titleStyle}>
        <span>커스텀 확장자</span>
        <span style={countBadgeStyle}>{extensions.length}/200</span>
      </div>

      <div style={inputRowStyle}>
        <input
          type="text"
          placeholder="차단할 확장자 추가 (Enter 또는 Tab) / 최대 20자"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
        <button onClick={addExtension} style={addButtonStyle}>
          + 추가
        </button>
      </div>

      <div style={tagListStyle}>
        {extensions.map((ext) => (
          <button
            key={ext.id}
            type="button"
            style={tagItemStyle}
            onClick={() => removeExtension(ext.id)}
          >
            <span>{ext.name}</span>
            <span style={tagCloseStyle}>✕</span>
          </button>
        ))}
      </div>
    </div>
  );
}