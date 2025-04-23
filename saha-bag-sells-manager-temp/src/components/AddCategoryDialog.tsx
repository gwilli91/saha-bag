
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderStore } from "@/store/useOrderStore";
import { generateId } from "@/lib/utils";
import { FolderPlus } from "lucide-react";

export function AddCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const addCategory = useOrderStore((state) => state.addCategory);

  const handleSubmit = () => {
    if (name && price) {
      addCategory({
        id: generateId(),
        name,
        price: Number(price),
      });
      setName("");
      setPrice("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FolderPlus className="h-4 w-4" />
          إضافة نوع حقيبة
        </Button>
      </DialogTrigger>
      <DialogContent className="dialog-content sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة نوع حقيبة جديد</DialogTitle>
          <DialogDescription>
            أضف نوع حقيبة جديد مع السعر الخاص به.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-1">
              الاسم
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="حقيبة فاخرة"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right col-span-1">
              السعر
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1200"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-custom-red hover:bg-custom-red/90">إضافة</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
