
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div
            id="main"
            style={{
                width: "100%",
                maxWidth: "960px",
                margin: "0 auto",
                padding: "24px 16px",
                boxSizing: "border-box",
                backgroundColor: "#ffeef5",
            }}
        >
            <img src="/flow-logo.svg" alt="logo" id="logo" />
            {children}
        </div>
    );
}