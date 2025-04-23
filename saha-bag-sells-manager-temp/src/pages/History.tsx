
import { Navbar } from "@/components/Navbar";
import { OrderCard } from "@/components/OrderCard";
import { useOrderStore } from "@/store/useOrderStore";
import { useState } from "react";

export default function History() {
  const orders = useOrderStore((state) => state.orders);
  const [search, setSearch] = useState("");

  // Filter for delivered orders and search
  const deliveredOrders = orders.filter(order => 
    order.delivered && 
    (search === "" || 
      order.customer.name.includes(search) || 
      order.customer.phone.includes(search) || 
      order.customer.location.includes(search))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-custom-black">سجل الطلبات</h1>
            <p className="text-muted-foreground">عرض الطلبات التي تم تسليمها</p>
          </div>
          <div className="w-full sm:w-auto">
            <input
              type="text"
              placeholder="البحث في السجل..."
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <div className="h-16 w-16 text-muted-foreground flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">لا توجد طلبات في السجل</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "لم يتم العثور على نتائج بحث" : "ستظهر الطلبات المكتملة هنا"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
