
export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div id="main">
            <img src="/flow-logo.svg" alt="logo" id="logo" />
            {children}
        </div>
    );
}