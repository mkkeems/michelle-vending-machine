import { useVendingMachine } from "@/hooks/useVendingMachine";

export const Display = () => {
  const { state } = useVendingMachine();
  const { cardLimit, balance, displayMessage, status } = state;

  return (
    <div className="bg-black text-green-400 p-6 text-center font-mono">
      {!!balance && status !== "ACTIVE" && (
        <div className="text-sm mb-2">BALANCE: ₩{balance.toLocaleString()}</div>
      )}
      {!!cardLimit && (
        <div className="text-sm mb-2">
          (CARD LIMIT: ₩{cardLimit.toLocaleString()})
        </div>
      )}
      <div className="text-lg leading-relaxed whitespace-pre-line">
        {displayMessage}
      </div>
    </div>
  );
};
