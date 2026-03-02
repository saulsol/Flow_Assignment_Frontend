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
  const titleStyle: React.CSSProperties = {
    display: "inline-block",
    fontSize: "18px",
    fontWeight: 700,
    color: "#4a2f43",
    backgroundColor: "#ffeaf4",
    border: "1px solid #f4cfe0",
    borderRadius: "10px",
    padding: "6px 12px",
    marginBottom: "12px",
  };
  const dropZoneStyle: React.CSSProperties = {
    border: "2px dashed #e7b8d1",
    borderRadius: "12px",
    padding: "70px 20px",
    textAlign: "center",
    marginBottom: "14px",
    backgroundColor: "#fff6fa",
    color: "#6d4860",
    fontWeight: 600,
  };
  const selectedFilesWrapStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "14px",
  };
  const selectedFileChipStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    height: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "1px solid #ebc7da",
    backgroundColor: "#ffeaf4",
    color: "#5a3550",
    fontSize: "14px",
    lineHeight: 1,
  };
  const actionRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  };
  const actionButtonStyle: React.CSSProperties = {
    height: "40px",
    minWidth: "110px",
    padding: "0 16px",
    borderRadius: "10px",
    border: "1px solid #b93679",
    backgroundColor: "#cc3f86",
    color: "#fff",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: 1,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };
  const uploadedListWrapStyle: React.CSSProperties = {
    marginTop: "26px",
    display: "grid",
    gap: "10px",
  };
  const uploadedCardStyle: React.CSSProperties = {
    border: "1px solid #f1d2e2",
    backgroundColor: "#fff6fa",
    padding: "14px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const fileNameStyle: React.CSSProperties = {
    color: "#4a2f43",
    fontWeight: 600,
  };
  const fileMetaStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#846479",
    marginTop: "4px",
  };
  const removeButtonStyle: React.CSSProperties = {
    height: "32px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "1px solid #e8b8d1",
    backgroundColor: "#fff",
    color: "#8d5a77",
    fontWeight: 700,
    cursor: "pointer",
  };

  return (
    <div className="main-container">
      <div style={titleStyle}>파일 업로드</div>

      {/* 드롭 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={dropZoneStyle}
      >
        첨부할 파일을 여기에 끌어다 놓으세요
      </div>

      {/* 선택된 파일 리스트 */}
      {selectedFiles.length > 0 && (
        <div style={selectedFilesWrapStyle}>
          {selectedFiles.map((file) => (
            <div key={file.name} style={selectedFileChipStyle}>
              {file.name}
            </div>
          ))}
        </div>
      )}

      {/* 버튼 영역 */}
      <div style={actionRowStyle}>
        <label
          style={actionButtonStyle}
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
          style={actionButtonStyle}
        >
          업로드
        </button>
      </div>

      {/* 업로드 완료 목록 */}
      <div style={uploadedListWrapStyle}>
      {/* <h3>업로드 된 파일</h3> */}

        {uploadedFiles.map((file) => (
          <div
            key={file.name}
            style={uploadedCardStyle}
          >
            <div>
              <div style={fileNameStyle}>{file.name}</div>
              <div style={fileMetaStyle}>
                {formatSize(file.size)} | {file.date}
              </div>
            </div>

            <button
              onClick={() => removeUploadedFile(file.name)}
              style={removeButtonStyle}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}