import MainLayout from "./components/layout/MainLayout";
import ExtentionManager from "./components/extention/ExtentionManager";


export default function Home() {
  
  return (
    <>
      <main>
        <MainLayout>
          <ExtentionManager />
        </MainLayout>
      </main>
    </>
  );
}
