
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BagItem, Order } from "@/types";
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateTotalPrice(items: BagItem[]): number {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

export function formatPrice(price: number): string {
  return price.toLocaleString("ar-DZ") + " دج";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export async function exportOrderAsImage(orderId: string) {
  const element = document.getElementById(`order-${orderId}`);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    
    const dataUrl = canvas.toDataURL("image/png");
    
    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `order-${orderId}.png`;
    link.click();
  } catch (error) {
    console.error("Failed to export order as image:", error);
  }
}

export function getOrderStatus(order: Order): "delivered" | "pending" {
  return order.delivered ? "delivered" : "pending";
}
