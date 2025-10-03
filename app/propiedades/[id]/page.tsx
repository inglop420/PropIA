
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PropertyDetail } from "./_components/property-detail";

export default function PropiedadDetailPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-[#F5F5DC]">
      <Navbar />
      <PropertyDetail propiedadId={params.id} />
      <Footer />
    </main>
  );
}
