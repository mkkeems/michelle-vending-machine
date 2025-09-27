import { validDenominations } from "@/context/VendingMachine.reducer";
import { PaymentButton } from "./PaymentButton";
import { useVendingMachine } from "@/hooks/useVendingMachine";

export const CashControls = () => {
  const { state, insertCash, returnChange } = useVendingMachine();
  const { balance, paymentMethod, status } = state;
  const isCashButtonDisabled =
    paymentMethod === "CARD" ||
    (paymentMethod === "CASH" && status !== "ACTIVE" && status !== "IDLE");

  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">Insert Cash</div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        {validDenominations.map((amount) => (
          <PaymentButton
            key={amount}
            label={`₩${amount.toLocaleString()}`}
            onClick={() => insertCash(amount)}
            disabled={isCashButtonDisabled}
          />
        ))}
        <PaymentButton
          label={`$1.00`}
          onClick={() => insertCash("$1.00")}
          disabled={isCashButtonDisabled}
          variant="red"
        />
      </div>
      <PaymentButton
        label="Return Change"
        onClick={returnChange}
        disabled={balance === 0 || isCashButtonDisabled}
        variant="blue"
      />
    </div>
  );
};
