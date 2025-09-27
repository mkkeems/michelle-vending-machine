import { useVendingMachine } from "@/hooks/useVendingMachine";
import { PaymentButton } from "./PaymentButton";

export const CardControls = () => {
  const { state, payWithCard, cardAuthSuccess, cardAuthFail, cancel } =
    useVendingMachine();
  const { isProcessingCardPayment, cardLimit, paymentMethod, status } = state;

  const isCardButtonDisabled =
    paymentMethod === "CASH" ||
    !!isProcessingCardPayment ||
    (status !== "ACTIVE" && status !== "IDLE");

  const handlePayWithCard = () => {
    payWithCard();

    setTimeout(() => {
      const authorized = Math.random() > 0.2;
      if (authorized) {
        const cardLimit = Math.floor(Math.random() * (2000 - 0 + 1)) + 500;
        cardAuthSuccess(cardLimit);
      } else {
        cardAuthFail();
      }
    }, 1000);
  };

  const handleCancel = () => {
    cancel();
  };

  return (
    <div>
      <div className="text-sm text-gray-600 mb-2">Card Payment</div>
      <div className="grid grid-cols-1 gap-2">
        <PaymentButton
          label="Pay with Card"
          onClick={handlePayWithCard}
          disabled={isCardButtonDisabled}
        />
        <PaymentButton
          label="Cancel"
          onClick={handleCancel}
          disabled={isCardButtonDisabled || !cardLimit}
          variant="red"
        />
      </div>
    </div>
  );
};
