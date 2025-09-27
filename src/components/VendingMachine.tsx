import { useEffect } from "react";
import { Display } from "./Display";
import { DrinksGrid } from "./DrinksGrid";
import { CardControls } from "./CardControls";
import { CashControls } from "./CashControls";
import { useVendingMachine } from "@/hooks/useVendingMachine";

const INACTIVE_MACHINE_TIMEOUT = 10000;

export function VendingMachine() {
  const { state, timeout } = useVendingMachine();
  const { status, paymentMethod } = state;

  useEffect(() => {
    if (status === "IDLE" || paymentMethod === "CASH") return;
    const timer = setTimeout(() => {
      timeout();
    }, INACTIVE_MACHINE_TIMEOUT);

    return () => clearTimeout(timer);
  }, [status, paymentMethod, timeout]);

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
      <Display />
      <DrinksGrid />

      <div className="p-6 space-y-6 bg-gray-50">
        <CardControls />
        <CashControls />
      </div>
    </div>
  );
}
