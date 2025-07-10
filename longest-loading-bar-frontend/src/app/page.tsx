import BarSwitcher from "@/components/BarSwitcher";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black relative">
      <BarSwitcher />
	  <Footer />
    </main>
  );
}

