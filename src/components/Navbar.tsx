
import { Button } from "@/components/ui/button";
import { Plus, History } from "lucide-react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-custom-red">نظام مبيعات الحقائب</h1>
          </Link>
          <nav className="flex items-center gap-2">
            <Link to="/history">
              <Button variant="ghost" size="icon">
                <History className="h-5 w-5" />
                <span className="sr-only">التاريخ</span>
              </Button>
            </Link>
            <Link to="/add">
              <Button className="bg-custom-red hover:bg-custom-red/90">
                <Plus className="mr-2 h-4 w-4" />
                طلب جديد
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
