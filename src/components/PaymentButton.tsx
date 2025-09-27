import { cn } from "@/utils/cn";

interface PaymentButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "green" | "red" | "blue";
}

export const PaymentButton = ({
  label,
  onClick,
  disabled,
  variant = "green",
}: PaymentButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 rounded-md px-4 py-2 font-medium transition-all w-full cursor-pointer",
        variant === "green" &&
          "bg-green-500 text-white hover:bg-green-600 border border-green-600",
        variant === "red" &&
          "bg-red-400 text-white hover:bg-red-500 border border-red-500",
        variant === "blue" &&
          "bg-sky-500 text-white hover:bg-sky-600 border border-sky-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {label}
    </button>
  );
};
