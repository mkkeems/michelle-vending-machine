import type { AvailableDrinks } from "@/types";
import { DrinkButton } from "./DrinkButton";
import { useVendingMachine } from "@/hooks/useVendingMachine";

export const DrinksGrid = () => {
  const {
    state,
    selectDrink,
    processCardPayment,
    dispense,
    dispenseSuccess,
    dispenseFail,
  } = useVendingMachine();
  const { drinksStock, balance, isAuthorizingCard, cardLimit, status } = state;

  const simulateDispense = (
    drinkId: AvailableDrinks,
    succeed: boolean,
    failReason?: string
  ) => {
    if (!succeed && failReason) {
      dispenseFail(drinkId, failReason);
    } else {
      dispense(drinkId);

      setTimeout(() => {
        if (succeed) {
          const dispenseFailChance = Math.random() < 0.1;
          const success = succeed && !dispenseFailChance;
          if (success) {
            dispenseSuccess(drinkId);
          } else {
            const randomFailReason = dispenseFailChance
              ? "Machine error. Contact Maintenance"
              : failReason ?? "Unknown error";
            dispenseFail(drinkId, randomFailReason);
          }
        } else {
          dispenseFail(drinkId, failReason ?? "Unknown error");
        }
      }, 1500);
    }
  };

  const handleSelect = (drinkId: AvailableDrinks) => {
    selectDrink(drinkId);

    if (state.paymentMethod === "CARD") {
      processCardPayment();

      setTimeout(() => {
        const drink = state.drinksStock[drinkId];
        const hasFunds = (state.cardLimit ?? 0) >= drink.price;
        simulateDispense(drinkId, hasFunds, "Insufficient funds");
      }, 2000);
    } else {
      simulateDispense(drinkId, true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg mb-4 text-gray-800">Select Your Drink</h2>
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(drinksStock).map(([id, drink]) => {
          const canBuy =
            drink.stock > 0 &&
            (balance >= drink.price || !!cardLimit) &&
            !isAuthorizingCard &&
            status === "ACTIVE";
          return (
            <DrinkButton
              key={id}
              drink={drink}
              canBuy={canBuy}
              onSelect={() => handleSelect(drink.id)}
            />
          );
        })}
      </div>
    </div>
  );
};
