interface FixedExtension {
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
  
    const toggleExtension = (name: string) => {
      setFixedExtensions((prev) =>
        prev.map((ext) =>
          ext.name === name
            ? { ...ext, checked: !ext.checked }
            : ext
        )
      );
    };
  
    const reset = () => {
      setFixedExtensions((prev) =>
        prev.map((ext) => ({ ...ext, checked: false }))
      );
    };
  
    return (
      <div>
        <div className="sub-title">
          고정 확장자
          <button onClick={reset}>초기화</button>
        </div>
  
        <div>
          {fixedExtensions?.map((ext) => (
            <label key={ext.name} style={{ marginRight: "15px" }}>
              <input
                type="checkbox"
                checked={ext.checked}
                onChange={() => toggleExtension(ext.name)}
              />
              {ext.name}
            </label>
          ))}
        </div>
      </div>
    );
  }