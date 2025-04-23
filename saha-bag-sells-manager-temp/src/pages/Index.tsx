import { Navbar } from "@/components/Navbar";
import { OrderCard } from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { exportOrderAsImage } from "@/lib/utils";
import { Share2 } from "lucide-react";

export default function Index() {
  const { toast } = useToast();
  const orders = useOrderStore((state) => state.orders);
  const deleteAllOrders = useOrderStore((state) => state.deleteAllOrders);
  const [search, setSearch] = useState("");

  // Track selected order IDs for sharing
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

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
    setSelectedOrders([]);
  };

  // Handle selection of a single order
  const handleSelect = (id: string, checked: boolean) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((oid) => oid !== id)
    );
  };

  // Share all selected orders as images
  const handleShareSelected = async () => {
    if (selectedOrders.length === 0) return;
    for (const id of selectedOrders) {
      await exportOrderAsImage(id);
    }
    toast({
      title: "تم مشاركة الطلبات",
      description: `تم تصدير ${selectedOrders.length} طلب كصور بنجاح`,
    });
  };

  // Select or deselect all visible orders
  const handleToggleSelectAll = (checked: boolean) => {
    setSelectedOrders(checked ? pendingOrders.map(order => order.id) : []);
  };

  const allSelected = selectedOrders.length === pendingOrders.length && pendingOrders.length > 0;
  const someSelected = selectedOrders.length > 0 && selectedOrders.length < pendingOrders.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        {/* Responsive and spaced controls */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:justify-between sm:items-center sm:gap-6 px-0 md:px-2">
          <div className="w-full sm:w-auto">
            <h1 className="text-2xl font-bold text-custom-black mb-0 sm:mb-1">
              قائمة الطلبات النشطة
            </h1>
            <p className="text-muted-foreground text-sm">
              إدارة وعرض الطلبات النشطة
            </p>
          </div>
          {pendingOrders.length > 0 && (
            <div className="flex flex-col w-full sm:w-auto gap-4 sm:flex-row sm:items-center sm:gap-2">
              <div className="flex flex-col xs:flex-row gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="البحث عن طلب..."
                  className="flex h-10 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <label className="flex items-center gap-2 cursor-pointer select-none mt-2 sm:mt-0">
                  <input
                    type="checkbox"
                    className="form-checkbox accent-custom-red"
                    checked={allSelected}
                    onChange={(e) => handleToggleSelectAll(e.target.checked)}
                    ref={el => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    aria-label="اختر الكل"
                  />
                  <span className="text-xs">تحديد الكل</span>
                </label>
              </div>
              <div className="flex flex-row gap-2 overflow-auto w-full sm:w-auto mt-1 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={handleShareSelected}
                  disabled={selectedOrders.length === 0}
                  className="gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  مشاركة المحدد
                </Button>
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
              </div>
            </div>
          )}
          {/* If no orders, just show the search centered */}
          {pendingOrders.length === 0 && (
            <div className="w-full max-w-lg mt-4">
              <input
                type="text"
                placeholder="البحث عن طلب..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
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
              <OrderCard
                key={order.id}
                order={order}
                selectable
                checked={selectedOrders.includes(order.id)}
                onCheckChange={(checked) => handleSelect(order.id, checked)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
