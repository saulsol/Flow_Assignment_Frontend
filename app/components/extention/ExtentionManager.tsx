"use client";
import { useState } from "react";

import FixedExtensionList from "./FixedExtentionList";
import CustomExtensionManager from "./CustomExtentionManager";
export interface FixedExtension {
    name: string;
    checked: boolean;
}

export default function ExtentionManager() {
    const [fixedExtensions, setFixedExtensions] = useState<FixedExtension[]>([
        { name: "bat", checked: false },
        { name: "cmd", checked: false },
        { name: "com", checked: false },
        { name: "cpl", checked: false },
        { name: "exe", checked: false },
        { name: "scr", checked: false },
        { name: "js", checked: false },
      ]);  

    return (
        <div>
            <div>파일 확장자 차단</div>
            <div>파일 확장자를 차단하여 업로드를 제한합니다.</div>
            <hr />
            <FixedExtensionList fixedExtensions={fixedExtensions} setFixedExtensions={setFixedExtensions} />
            <CustomExtensionManager />
        </div>
    );
}