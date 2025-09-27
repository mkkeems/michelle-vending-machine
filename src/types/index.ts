export type Drink = {
  id: AvailableDrinks;
  name: string;
  price: number;
  stock: number;
};

export type PaymentMethod = "CASH" | "CARD";

export type AvailableDrinks = "COKE" | "WATER" | "COFFEE";
export type DrinkStocks = Record<AvailableDrinks, Drink>;

export type MachineStatus = "IDLE" | "ACTIVE" | "PROCESSING" | "ERROR" | "DONE";

export type VendingMachineState = {
  balance: number;
  drinksStock: DrinkStocks;
  displayMessage: string;
  isAuthorizingCard: boolean;
  isProcessingCardPayment: boolean;
  selectedDrink?: Drink;
  paymentMethod?: PaymentMethod;
  cardLimit?: number;
  status: MachineStatus;
};

/** Actions that can be dispatched to the reducer */
export type VendingMachineAction =
  | { type: "INSERT_CASH"; amount: number | string }
  | { type: "PAY_WITH_CARD" }
  | { type: "CARD_AUTH_SUCCESS"; cardLimit: number }
  | { type: "CARD_AUTH_FAIL" }
  | { type: "SELECT_DRINK"; drinkId: AvailableDrinks }
  | { type: "PROCESS_CARD_PAYMENT" }
  | { type: "START_DISPENSING"; drinkId: AvailableDrinks }
  | { type: "RETURN_CHANGE" }
  | { type: "OUT_OF_STOCK"; drinkId: AvailableDrinks }
  | { type: "DISPENSE_SUCCESS"; drinkId: AvailableDrinks }
  | { type: "DISPENSE_FAIL"; drinkId: AvailableDrinks; reason: string }
  | { type: "CANCEL" }
  | { type: "TIMEOUT" }
  | { type: "RESET" }
  | { type: "RESET_KEEP_BALANCE"; keepBalance: boolean };
