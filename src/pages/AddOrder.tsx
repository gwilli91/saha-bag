
import { Navbar } from "@/components/Navbar";
import { OrderForm } from "@/components/OrderForm";

export default function AddOrder() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-custom-black">إضافة طلب جديد</h1>
          <p className="text-muted-foreground">أدخل معلومات الطلب الجديد</p>
        </div>
        <OrderForm />
      </main>
    </div>
  );
}
