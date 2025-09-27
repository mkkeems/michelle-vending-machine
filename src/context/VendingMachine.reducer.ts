import type {
  DrinkStocks,
  VendingMachineAction,
  VendingMachineState,
} from "@/types";

export const validDenominations = [100, 500, 1000, 5000, 10000];

const initialDrinks: DrinkStocks = {
  COKE: { id: "COKE", name: "Coke", price: 1100, stock: 10 },
  WATER: { id: "WATER", name: "Water", price: 600, stock: 10 },
  COFFEE: { id: "COFFEE", name: "Coffee", price: 700, stock: 10 },
};

const MESSAGES = {
  IDLE: "Insert cash or tap card",
  BALANCE: (amount: number) => `Balance: ₩${amount.toLocaleString()}`,
  INVALID_CASH: (amount: number | string) =>
    `Rejecting Invalid Cash: ${
      typeof amount === "number" ? `₩${amount}` : amount
    }`,
  AUTHORIZING_CARD: "Authorizing card...",
  AUTH_SUCCESS: "Card authorized. Select a drink.",
  AUTH_FAIL: "Card declined.\nPlease try again or insert cash.",
  INSERT_MORE_CASH: "Insert more cash",
  OUT_OF_STOCK: "Out of stock",
  INVALID_SELECTION: "Invalid selection",
  PROCESSING_PAYMENT: "Processing payment...",
  INSUFFICIENT_FUNDS: "Insufficient funds.\nPlease try again or insert cash.",
  SELECTED: (drink: string) => `Selected ${drink}`,
  DISPENSE: (drink: string) => `Dispensing ${drink}...`,
  DISPENSE_FAIL: (drink: string, reason: string) =>
    `Failed to dispense ${drink}.\n${reason}`,
  THANK_YOU: (drink: string) => `${drink} dispensed. Thank you!`,
  WITH_CHANGE: (drink: string, change: number) =>
    `${drink} dispensed. Thank you!\nReturning Change: ₩${change.toLocaleString()}`,
  RETURN_CHANGE: (change: number) => `Returning ₩${change.toLocaleString()}`,
  CANCELED: "Transaction canceled.",
  TIMEOUT: "Timed out.",
} as const;

export const vendingMachineReducer = (
  state: VendingMachineState,
  action: VendingMachineAction
): VendingMachineState => {
  switch (action.type) {
    case "INSERT_CASH": {
      if (typeof action.amount !== "number") {
        return {
          ...state,
          displayMessage: MESSAGES.INVALID_CASH(action.amount),
          paymentMethod: "CASH",
          status: "ERROR",
        };
      }

      if (!validDenominations.includes(action.amount)) {
        return {
          ...state,
          displayMessage: MESSAGES.INVALID_CASH(action.amount),
          paymentMethod: "CASH",
          status: "ERROR",
        };
      }
      return {
        ...state,
        balance: state.balance + action.amount,
        displayMessage: MESSAGES.BALANCE(state.balance + action.amount),
        paymentMethod: "CASH",
        status: "ACTIVE",
      };
    }
    case "PAY_WITH_CARD": {
      return {
        ...state,
        isProcessingCardPayment: true,
        paymentMethod: "CARD",
        displayMessage: MESSAGES.AUTHORIZING_CARD,
        status: "PROCESSING",
      };
    }
    case "CARD_AUTH_SUCCESS": {
      return {
        ...state,
        isProcessingCardPayment: false,
        cardLimit: action.cardLimit,
        displayMessage: MESSAGES.AUTH_SUCCESS,
        status: "ACTIVE",
      };
    }
    case "CARD_AUTH_FAIL": {
      return {
        ...state,
        isProcessingCardPayment: false,
        cardLimit: undefined,
        paymentMethod: undefined,
        displayMessage: MESSAGES.AUTH_FAIL,
        status: "ACTIVE",
      };
    }
    case "SELECT_DRINK": {
      const drink = state.drinksStock[action.drinkId];

      if (!drink)
        return { ...state, displayMessage: MESSAGES.INVALID_SELECTION };

      if (drink.stock <= 0) {
        return {
          ...state,
          displayMessage: MESSAGES.OUT_OF_STOCK,
          status: "ERROR",
        };
      }

      if (state.paymentMethod === "CASH") {
        if (state.balance < drink.price) {
          return { ...state, displayMessage: MESSAGES.INSERT_MORE_CASH };
        }
      }

      return {
        ...state,
        selectedDrink: drink,
        displayMessage: MESSAGES.SELECTED(drink.name),
      };
    }
    case "PROCESS_CARD_PAYMENT": {
      return {
        ...state,
        isProcessingCardPayment: true,
        displayMessage: MESSAGES.PROCESSING_PAYMENT,
        status: "PROCESSING",
      };
    }
    case "START_DISPENSING": {
      if (!state.selectedDrink) {
        return { ...state, displayMessage: "No drink selected." };
      }
      return {
        ...state,
        isProcessingCardPayment: true,
        displayMessage: MESSAGES.DISPENSE(state.selectedDrink.name),
        status: "PROCESSING",
      };
    }
    case "RETURN_CHANGE": {
      return {
        ...state,
        displayMessage: MESSAGES.RETURN_CHANGE(state.balance),
        balance: 0,
        paymentMethod: undefined,
      };
    }
    case "OUT_OF_STOCK":
      return {
        ...state,
        displayMessage: MESSAGES.OUT_OF_STOCK,
        status: "ERROR",
      };
    case "DISPENSE_SUCCESS": {
      const drink = state.drinksStock[action.drinkId];
      if (!drink)
        return { ...state, displayMessage: "Invalid dispense request" };

      const newDrinksStock = {
        ...state.drinksStock,
        [action.drinkId]: { ...drink, stock: drink.stock - 1 },
      };

      if (state.paymentMethod === "CASH") {
        const change = state.balance - drink.price;

        return {
          ...state,
          isProcessingCardPayment: false,
          drinksStock: newDrinksStock,
          balance: 0,
          selectedDrink: undefined,
          displayMessage: change
            ? MESSAGES.WITH_CHANGE(drink.name, change)
            : MESSAGES.THANK_YOU(drink.name),
          status: "DONE",
        };
      }

      if (state.paymentMethod === "CARD") {
        const newCardLimit = (state.cardLimit ?? 0) - drink.price;
        return {
          ...state,
          isProcessingCardPayment: false,
          drinksStock: newDrinksStock,
          cardLimit: newCardLimit,
          displayMessage: MESSAGES.THANK_YOU(drink.name),
          status: "DONE",
        };
      }

      return state;
    }

    case "DISPENSE_FAIL":
      return {
        ...state,
        isProcessingCardPayment: false,
        displayMessage: MESSAGES.DISPENSE_FAIL(action.drinkId, action.reason),
        status: "ERROR",
      };
    case "CANCEL": {
      return {
        ...initialState,
        drinksStock: state.drinksStock,
        displayMessage: MESSAGES.CANCELED,
        status: "DONE",
      };
    }
    case "TIMEOUT": {
      return {
        ...initialState,
        drinksStock: state.drinksStock,
        displayMessage: MESSAGES.TIMEOUT,
        status: "DONE",
      };
    }
    case "RESET_KEEP_BALANCE": {
      return {
        ...initialState,
        balance: state.balance,
        drinksStock: state.drinksStock,
        displayMessage: MESSAGES.BALANCE(state.balance),
        paymentMethod: "CASH",
        status: "ACTIVE",
      };
    }
    case "RESET": {
      return {
        ...initialState,
        drinksStock: state.drinksStock,
      };
    }
    default: {
      return state;
    }
  }
};

export const initialState: VendingMachineState = {
  balance: 0,
  drinksStock: initialDrinks,
  displayMessage: MESSAGES.IDLE,
  isProcessingCardPayment: false,
  isAuthorizingCard: false,
  status: "IDLE",
};
