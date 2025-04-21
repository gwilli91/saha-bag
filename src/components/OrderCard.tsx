
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate, exportOrderAsImage, getOrderStatus } from "@/lib/utils";
import { useOrderStore } from "@/store/useOrderStore";
import { Order } from "@/types";
import { Check, Edit, Share2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const { toast } = useToast();
  const toggleDelivered = useOrderStore((state) => state.toggleDelivered);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);
  const categories = useOrderStore((state) => state.categories);

  const handleShareOrder = async () => {
    await exportOrderAsImage(order.id);
    toast({
      title: "تم تصدير الطلب",
      description: "تم تصدير الطلب كصورة بنجاح",
    });
  };

  const handleDeleteOrder = () => {
    deleteOrder(order.id);
    toast({
      title: "تم حذف الطلب",
      description: "تم حذف الطلب بنجاح",
    });
  };

  const handleToggleDelivered = () => {
    toggleDelivered(order.id);
    toast({
      title: order.delivered ? "تم إلغاء تسليم الطلب" : "تم تسليم الطلب",
      description: order.delivered ? "تم إلغاء تسليم الطلب بنجاح" : "تم تسليم الطلب بنجاح",
    });
  };

  const status = getOrderStatus(order);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "نوع غير معروف";
  };

  return (
    <Card id={`order-${order.id}`} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{order.customer.name}</CardTitle>
            <CardDescription>{order.customer.phone}</CardDescription>
          </div>
          <Badge
            className={
              status === "delivered"
                ? "bg-green-500 hover:bg-green-600"
                : "bg-amber-500 hover:bg-amber-600"
            }
          >
            {status === "delivered" ? "تم التسليم" : "قيد الانتظار"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">مكان الإرسال:</span>
            <span>{order.customer.location}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">تاريخ الطلب:</span>
            <span>{formatDate(order.date)}</span>
          </div>
          
          <div className="border-t pt-3">
            <h3 className="text-sm font-semibold mb-2">الحقائب:</h3>
            <ul className="space-y-1">
              {order.items.map((item, index) => (
                <li key={index} className="text-sm flex justify-between">
                  <span>
                    {getCategoryName(item.categoryId)} ({item.quantity})
                  </span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between pt-2 font-semibold">
            <span>المجموع:</span>
            <span className="text-custom-red">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleToggleDelivered}
          >
            <Check className="h-4 w-4" />
            <span className="sr-only">
              {order.delivered ? "إلغاء تسليم" : "تسليم"}
            </span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleShareOrder}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">مشاركة</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleDeleteOrder}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">حذف</span>
          </Button>
        </div>
        <Link to={`/edit/${order.id}`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            تعديل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
