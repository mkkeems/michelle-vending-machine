import type { Drink } from "@/types";
import { cn } from "@/utils/cn";

interface DrinkButtonProps {
  drink: Drink;
  canBuy: boolean;
  onSelect: () => void;
}

export function DrinkButton({ drink, canBuy, onSelect }: DrinkButtonProps) {
  return (
    <button
      onClick={onSelect}
      disabled={!canBuy}
      className={cn(
        "w-full px-4 py-2 rounded-lg border font-medium transition-all text-left cursor-pointer",
        canBuy
          ? "bg-white hover:bg-blue-50 border-blue-400 text-gray-800"
          : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
      )}
    >
      <div className="flex justify-between items-center">
        <div>
          <span>{drink.name}</span>
          <div className="text-xs">Stock: {drink.stock}</div>
        </div>
        <span>₩{drink.price.toLocaleString()}</span>
      </div>
    </button>
  );
}
