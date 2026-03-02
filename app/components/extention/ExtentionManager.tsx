"use client";
import { useState, useEffect } from "react";

import FixedExtensionList from "./FixedExtentionList";
import CustomExtensionManager from "./CustomExtentionManager";
import FileUploadSection from "./FileUploadSection";
import { apiClient } from "@/app/api/apiClient";

export interface FixedExtension {
    id: number;
    name: string;
    checked: boolean;
}

export default function ExtentionManager() {
    const [fixedExtensions, setFixedExtensions] = useState<FixedExtension[]>([]);
    const [loading, setLoading] = useState(true);
    const headerTitleStyle: React.CSSProperties = {
        fontSize: "24px",
        fontWeight: 700,
        color: "#3f2a3c",
        marginBottom: "8px",
    };
    const headerDescriptionStyle: React.CSSProperties = {
        fontSize: "14px",
        color: "#6b5b68",
        marginBottom: "20px",
    };

    useEffect(() => {
        const load = async () => {
          try {
            const data = await apiClient<FixedExtension[]>(
              "/fixedExtensions"
            );
            setFixedExtensions(data);
          } catch (e) {
            console.error(e);
          } finally {
            setLoading(false);
          }
        };
    
        load();
      }, []);
    
    if (loading) return <div>로딩중...</div>;

    return (
        <div>
            <div style={headerTitleStyle}>파일 확장자 차단</div>
            <div style={headerDescriptionStyle}>파일 확장자를 차단하여 업로드를 제한합니다.</div>
            <hr />
            <FixedExtensionList fixedExtensions={fixedExtensions} setFixedExtensions={setFixedExtensions} />
            <CustomExtensionManager fixedExtensions={fixedExtensions} />
            <hr />
            <FileUploadSection />
        </div>
    );
}