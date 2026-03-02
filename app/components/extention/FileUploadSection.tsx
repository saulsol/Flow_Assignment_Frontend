"use client";

import { apiClient } from "@/app/api/apiClient";
import { useState, DragEvent, ChangeEvent } from "react";

interface UploadedFile {
  name: string;
  size: number;
  date: string;
}

interface FileValidationResponse {
  fileName: string;
  parsable: boolean;
}

export default function FileUploadSection() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  /* =========================
     파일 선택
  ========================== */
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
  
    const file = e.target.files[0]; // 단일 파일 기준
    const fileName = file.name;
  
    try {
      const result = await apiClient<FileValidationResponse>(
        "/files/check",
        {
          method: "POST",
          body: JSON.stringify({ fileName }),
        }
      );
  
      if (!result.parsable) {
        alert(`차단된 확장자입니다: ${result.fileName}`);
        return;
      }
  
      // 통과 시에만 저장
      setSelectedFiles([file]);
    } catch (error) {
      console.error("확장자 검사 실패", error);
    }
  };

  /* =========================
     드래그앤드롭
  ========================== */
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  
    const droppedFiles = Array.from(e.dataTransfer.files);
  
    const validFiles: File[] = [];
  
    for (const file of droppedFiles) {
      const formData = new FormData();
      formData.append("multipartFile", file);
      formData.append("fileName", file.name);
  
      try {
        const result = await apiClient<FileValidationResponse>(
          "/files/check",
          {
            method: "POST",
            body: JSON.stringify({ fileName: file.name }),
          }
        );
    
        if (!result.parsable) {
          alert(`차단된 확장자입니다: ${result.fileName}`);
          return;
        }
    
        // 통과 시에만 저장
        setSelectedFiles([file]);
      } catch (error) {
        console.error("확장자 검사 실패", error);
      }
    }
  
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  /* =========================
     업로드 버튼
  ========================== */
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
  
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
  
        formData.append("fileName", file.name);
        formData.append("multipartFile", file);
  
        await apiClient<void>("/files/save", {
          method: "POST",
          body: formData,
          headers: {}, 
        });
      }
  
      alert("업로드 성공");
  
      setSelectedFiles([]);
    } catch (error) {
      console.error("업로드 실패", error);
      alert("업로드 중 오류 발생");
    }
  };

  /* =========================
     파일 삭제
  ========================== */
  const removeUploadedFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const formatSize = (size: number) => {
    return (size / 1024 / 1024).toFixed(1) + " mb";
  };

  return (
    <div className="main-container">
      <h2>파일 업로드</h2>

      {/* 드롭 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "10px",
          padding: "80px 20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        첨부할 파일을 여기에 끌어다 놓으세요
      </div>

      {/* 선택된 파일 리스트 */}
      {selectedFiles.length > 0 && (
        <div style={{ marginBottom: "15px" }}>
          {selectedFiles.map((file) => (
            <div key={file.name}>{file.name}</div>
          ))}
        </div>
      )}

      {/* 버튼 영역 */}
      <div style={{ display: "flex", gap: "20px" }}>
        <label
          style={{
            padding: "12px 20px",
            border: "1px solid purple",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          파일 선택
          <input
            type="file"
            multiple
            hidden
            onChange={handleFileSelect}
          />
        </label>

        <button
          onClick={handleUpload}
          style={{
            padding: "12px 20px",
            border: "1px solid purple",
            borderRadius: "8px",
          }}
        >
          업로드
        </button>
      </div>

      {/* 업로드 완료 목록 */}
      <div style={{ marginTop: "40px" }}>
      {/* <h3>업로드 된 파일</h3> */}

        {uploadedFiles.map((file) => (
          <div
            key={file.name}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div>{file.name}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {formatSize(file.size)} | {file.date}
              </div>
            </div>

            <button onClick={() => removeUploadedFile(file.name)}>
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}