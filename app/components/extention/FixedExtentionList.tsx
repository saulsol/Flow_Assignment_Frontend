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
        <div className="sub-title">
          고정 확장자
        </div>
  
        <div>
          {fixedExtensions?.map((ext) => (
            <label key={ext.id} style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                checked={ext.checked}
                onChange={() => toggleExtension(ext.id)}
              />
              {ext.name}
            </label>
          ))}
        </div>
      </div>
    );
  }