import { useEffect, useReducer, type ReactNode } from "react";
import type { AvailableDrinks, VendingMachineAction } from "@/types";
import { VendingMachineContext } from "./VendingMachine.context";
import { vendingMachineReducer, initialState } from "./VendingMachine.reducer";

const AUTO_RESET_DELAY = 3000;

export const VendingMachineProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, dispatch] = useReducer(vendingMachineReducer, initialState);
  const { status, balance, paymentMethod } = state;

  useEffect(() => {
    const keepBalance = !!balance && paymentMethod === "CASH";
    if (status === "ERROR") {
      const timer = setTimeout(() => {
        if (keepBalance) {
          dispatch({ type: "RESET_KEEP_BALANCE", keepBalance });
        } else {
          dispatch({ type: "RESET" });
        }
      }, AUTO_RESET_DELAY);

      return () => clearTimeout(timer);
    }
  }, [status, balance, paymentMethod]);

  const autoReset = (action: VendingMachineAction) => {
    dispatch(action);
    setTimeout(() => dispatch({ type: "RESET" }), AUTO_RESET_DELAY);
  };

  const insertCash = (amount: number | string) =>
    dispatch({ type: "INSERT_CASH", amount });

  const payWithCard = () => dispatch({ type: "PAY_WITH_CARD" });
  const cardAuthSuccess = (cardLimit: number) =>
    dispatch({ type: "CARD_AUTH_SUCCESS", cardLimit });
  const cardAuthFail = () => autoReset({ type: "CARD_AUTH_FAIL" });

  const selectDrink = (drinkId: AvailableDrinks) => {
    dispatch({ type: "SELECT_DRINK", drinkId });
  };
  const processCardPayment = () => dispatch({ type: "PROCESS_CARD_PAYMENT" });

  const dispense = (drinkId: AvailableDrinks) => {
    dispatch({ type: "START_DISPENSING", drinkId });
  };

  const dispenseSuccess = (drinkId: AvailableDrinks) =>
    autoReset({ type: "DISPENSE_SUCCESS", drinkId });

  const dispenseFail = (drinkId: AvailableDrinks, reason: string) =>
    dispatch({ type: "DISPENSE_FAIL", drinkId, reason });

  const returnChange = () => autoReset({ type: "RETURN_CHANGE" });

  const cancel = () => autoReset({ type: "CANCEL" });
  const timeout = () => autoReset({ type: "TIMEOUT" });

  return (
    <VendingMachineContext.Provider
      value={{
        state,
        insertCash,
        payWithCard,
        cardAuthSuccess,
        cardAuthFail,
        selectDrink,
        processCardPayment,
        dispense,
        dispenseSuccess,
        dispenseFail,
        returnChange,
        cancel,
        timeout,
      }}
    >
      {children}
    </VendingMachineContext.Provider>
  );
};
