import { useContext } from "react";
import { VendingMachineContext } from "@/context/VendingMachine.context";

export const useVendingMachine = () => {
  const ctx = useContext(VendingMachineContext);
  if (!ctx)
    throw new Error(
      "useVendingMachine must be used inside a VendingMachineProvider"
    );
  return ctx;
};
