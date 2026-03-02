import { apiClient } from "@/app/api/apiClient";

interface FixedExtension {
    id: number;
    name: string;
    checked: boolean;
  }
  
  interface Props {
    fixedExtensions: FixedExtension[];
    setFixedExtensions: React.Dispatch<
      React.SetStateAction<FixedExtension[]>
    >;
  }
  
  export default function FixedExtensionList({
    fixedExtensions,
    setFixedExtensions,
  }: Props) {
    const titleStyle: React.CSSProperties = {
      display: "inline-block",
      fontSize: "18px",
      fontWeight: 700,
      color: "#4a2f43",
      backgroundColor: "#ffeaf4",
      border: "1px solid #f4cfe0",
      borderRadius: "10px",
      padding: "6px 12px",
      marginBottom: "10px",
    };
    const listContainerStyle: React.CSSProperties = {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      padding: "12px",
      backgroundColor: "#fff6fa",
      border: "1px solid #f6dce8",
      borderRadius: "12px",
      marginBottom: "16px",
    };
    const chipStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 12px",
      borderRadius: "999px",
      border: "1px solid #ebc7da",
      backgroundColor: "#ffffff",
      color: "#4a3a45",
      fontSize: "14px",
      lineHeight: 1,
      cursor: "pointer",
      transition: "all 0.2s ease",
    };
    const checkboxStyle: React.CSSProperties = {
      width: "15px",
      height: "15px",
      margin: 0,
      display: "block",
      flexShrink: 0,
      accentColor: "#d46aa1",
      cursor: "pointer",
    };
    const labelTextStyle: React.CSSProperties = {
      lineHeight: 1,
      display: "inline-block",
    };
  
    const toggleExtension = async (id: number) => {
        const target = fixedExtensions.find((ext) => ext.id === id);
        if (!target) return;
      
        const updatedChecked = !target.checked;
      
        // UI 먼저 업데이트 (낙관적 업데이트)
        setFixedExtensions((prev) =>
          prev.map((ext) =>
            ext.id === id ? { ...ext, checked: updatedChecked } : ext
          )
        );
      
        try {
          await apiClient(`/fixedExtensions/fixed`, {
            method: "PATCH",
            body: JSON.stringify({ id: id, checked: updatedChecked}),
          });
        } catch (error) {
          console.error("업데이트 실패", error);
      
          setFixedExtensions((prev) =>
            prev.map((ext) =>
              ext.id === id ? { ...ext, checked: target.checked } : ext
            )
          );
        }
      };
  
  
  
    return (
      <div>
        <div style={titleStyle}>
          고정 확장자
        </div>
  
        <div style={listContainerStyle}>
          {fixedExtensions?.map((ext) => (
            <label key={ext.id} style={chipStyle}>
              <input
                type="checkbox"
                checked={ext.checked}
                onChange={() => toggleExtension(ext.id)}
                style={checkboxStyle}
              />
              <span style={labelTextStyle}>{ext.name}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }