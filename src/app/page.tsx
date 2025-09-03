import Footer from "@/components/layout/home/Footer";
import Header from "@/components/layout/home/Header";
import TestLogin from "@/components/layout/home/TestLogin";

export default function LoginButton() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-black text-white">
      <Header />
      <main className="flex-1">
        <TestLogin />
      </main>
      <Footer />
    </div>
  );
}
