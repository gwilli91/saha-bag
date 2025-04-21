
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useOrderStore } from "@/store/useOrderStore";
import { BagItem, Order } from "@/types";
import { calculateTotalPrice, formatPrice, generateId } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { AddCategoryDialog } from "./AddCategoryDialog";

interface OrderFormProps {
  editOrder?: Order;
}

export function OrderForm({ editOrder }: OrderFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const categories = useOrderStore((state) => state.categories);
  const addOrder = useOrderStore((state) => state.addOrder);
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const [name, setName] = useState(editOrder?.customer.name || "");
  const [phone, setPhone] = useState(editOrder?.customer.phone || "");
  const [location, setLocation] = useState(editOrder?.customer.location || "");
  const [items, setItems] = useState<BagItem[]>(editOrder?.items || []);

  const handleAddItem = () => {
    if (categories.length === 0) {
      toast({
        title: "لا توجد أنواع حقائب",
        description: "الرجاء إضافة نوع حقيبة أولاً",
        variant: "destructive",
      });
      return;
    }

    setItems([
      ...items,
      {
        categoryId: categories[0].id,
        quantity: 1,
        price: categories[0].price,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index: number, categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    setItems(
      items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            categoryId,
            price: category.price,
          };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems(
      items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      })
    );
  };

  const handlePriceChange = (index: number, price: number) => {
    setItems(
      items.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            price,
          };
        }
        return item;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !location || items.length === 0) {
      toast({
        title: "خطأ في النموذج",
        description: "الرجاء ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const order: Order = {
      id: editOrder?.id || generateId(),
      customer: {
        name,
        phone,
        location,
      },
      items,
      totalPrice: calculateTotalPrice(items),
      date: editOrder?.date || new Date().toISOString(),
      delivered: editOrder?.delivered || false,
    };

    if (editOrder) {
      updateOrder(editOrder.id, order);
      toast({
        title: "تم تحديث الطلب",
        description: "تم تحديث الطلب بنجاح",
      });
    } else {
      addOrder(order);
      toast({
        title: "تم إضافة الطلب",
        description: "تم إضافة الطلب بنجاح",
      });
    }

    navigate("/");
  };

  const totalPrice = calculateTotalPrice(items);

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editOrder ? "تعديل الطلب" : "طلب جديد"}</CardTitle>
            <CardDescription>أدخل معلومات العميل والطلب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم العميل</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسم العميل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    placeholder="أدخل رقم الهاتف"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">مكان الإرسال</Label>
                <Input
                  id="location"
                  placeholder="أدخل مكان الإرسال"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>الحقائب</CardTitle>
              <CardDescription>أضف الحقائب إلى الطلب</CardDescription>
            </div>
            <div className="flex gap-2">
              <AddCategoryDialog />
              <Button
                type="button"
                onClick={handleAddItem}
                className="bg-custom-red hover:bg-custom-red/90"
              >
                إضافة حقيبة
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center p-4 border rounded-md border-dashed">
                  لا توجد حقائب. أضف حقيبة للبدء.
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label>نوع الحقيبة</Label>
                      <Select
                        value={item.categoryId}
                        onValueChange={(value) => handleCategoryChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الحقيبة" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name} - {formatPrice(category.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24 space-y-2">
                      <Label htmlFor={`quantity-${index}`}>الكمية</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label htmlFor={`price-${index}`}>السعر</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        min="1"
                        value={item.price}
                        onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                      />
                    </div>
                    <div className="w-32 space-y-2">
                      <Label>المجموع</Label>
                      <div className="p-2 bg-muted rounded-md text-center">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      className="shrink-0 mt-8"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">حذف</span>
                    </Button>
                  </div>
                ))
              )}

              {items.length > 0 && (
                <div className="flex justify-end items-center gap-2 p-3 border rounded-lg bg-muted/50">
                  <span className="font-bold">المجموع الكلي:</span>
                  <span className="text-lg font-bold text-custom-red">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-custom-red hover:bg-custom-red/90"
            disabled={items.length === 0}
          >
            {editOrder ? "تحديث الطلب" : "إضافة الطلب"}
          </Button>
        </div>
      </div>
    </form>
  );
}
