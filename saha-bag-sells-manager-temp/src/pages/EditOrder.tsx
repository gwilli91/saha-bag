
import { Navbar } from "@/components/Navbar";
import { OrderForm } from "@/components/OrderForm";
import { useOrderStore } from "@/store/useOrderStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const orders = useOrderStore((state) => state.orders);
  const order = orders.find((o) => o.id === id);

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-custom-black">تعديل الطلب</h1>
          <p className="text-muted-foreground">تعديل معلومات الطلب</p>
        </div>
        <OrderForm editOrder={order} />
      </main>
    </div>
  );
}
