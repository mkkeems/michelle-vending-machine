import { createContext } from "react";
import type { VendingMachineState, AvailableDrinks } from "@/types";

type VendingMachineContextType = {
  state: VendingMachineState;
  insertCash: (amount: number | string) => void;
  payWithCard: () => void;
  cardAuthSuccess: (cardLimit: number) => void;
  cardAuthFail: () => void;
  selectDrink: (drinkId: AvailableDrinks) => void;
  processCardPayment: () => void;
  dispense: (drinkId: AvailableDrinks) => void;
  dispenseSuccess: (drinkId: AvailableDrinks) => void;
  dispenseFail: (drinkId: AvailableDrinks, reason: string) => void;
  returnChange: () => void;
  cancel: () => void;
  timeout: () => void;
};

export const VendingMachineContext =
  createContext<VendingMachineContextType | null>(null);
