
import { Navbar } from "@/components/Navbar";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Index() {
  const { toast } = useToast();
  const orders = useOrderStore((state) => state.orders);
  const deleteAllOrders = useOrderStore((state) => state.deleteAllOrders);
  const [search, setSearch] = useState("");

  // Filter out delivered orders and search
  const pendingOrders = orders.filter(order => 
    !order.delivered && 
    (search === "" || 
      order.customer.name.includes(search) || 
      order.customer.phone.includes(search) || 
      order.customer.location.includes(search))
  );

  const handleDeleteAll = () => {
    deleteAllOrders();
    toast({
      title: "تم حذف جميع الطلبات",
      description: "تم حذف جميع الطلبات بنجاح",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-custom-black">قائمة الطلبات النشطة</h1>
            <p className="text-muted-foreground">إدارة وعرض الطلبات النشطة</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="البحث عن طلب..."
              className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {orders.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">حذف الكل</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dialog-content">
                  <AlertDialogHeader>
                    <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف جميع الطلبات. هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      حذف
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {pendingOrders.length === 0 ? (
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
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1">لا توجد طلبات نشطة</h3>
            <p className="text-muted-foreground mb-4">
              {search ? "لم يتم العثور على نتائج بحث" : "أضف طلبات جديدة لعرضها هنا"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
