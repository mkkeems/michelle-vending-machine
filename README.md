# Vending Machine Simulation

A vending machine simulation built with **React + TypeScript** that models real-world user interactions, **cash** and **card** payment flows, and error handling.

👉 [**Live Demo**](https://michelle-vending-machine.vercel.app/)

## Features

- **Cash payments**

  - Accepts only valid denominations: ₩100, ₩500, ₩1,000, ₩5,000, ₩10,000.
  - Rejects invalid denominations (e.g. foreign currency, invalid strings).
  - Returns change automatically after an item was successfully dispensed or when user manually presses the "Return Change" button.

- **Card payments**

  - Simulates card authorization (randomized success/failure).
  - Randomized available card funds.
  - Handles insufficient funds gracefully.
  - Supports canceling transactions mid-process.

- **Drinks available**

  - Coke: ₩1,100
  - Water: ₩600
  - Coffee: ₩700

- **Edge cases & exceptions**

  - Invalid cash rejection without losing current balance.
  - Out-of-stock items disabled in the UI.
  - Randomized machine jam / dispense failure (10% chance).
  - Auto-reset after completion, error, or timeout.

- **UI/UX considerations**

  - Clear status messages with line breaks for readability.
  - Inactivity timeout resets the machine automatically.
  - State is managed globally via **React Context + Reducer** (single source of truth).

---

## How It Works

1. **Insert Cash**

   - Valid denominations update the balance.
   - Invalid input shows an error and auto-resets (if no prior balance).

2. **Pay with Card**

   - Simulates authorization with randomized funds.
   - If authorization fails, resets the machine.

3. **Drink Selection**

   - Drink selection is only enabled when stock > 0 and funds/cardlimit are sufficient.
   - Triggers processing → dispense → success/failure.

4. **Dispense Simulation**

   - Includes a small chance of machine jam/failure.
   - Updates stock and returns change (if any).

5. **Reset**

   - Auto-reset after: success, cancel, error, timeout.

---

## Mechanism Diagram

![Vending Machine Flow](./src/assets/Vending%20Machine%20Flow.png)

The diagram illustrates the full vending machine flow:

- From payment selection → authorization → drink selection → dispense → success/failure → reset.

---

## How it was built

### Project Structure

```
src/
├── components/        # UI components (Display, DrinksGrid, CashControls, CardControls, etc.)
├── context/           # VendingMachineContext + reducer logic
├── hooks/             # useVendingMachine hook for reducer actions
├── types/             # Shared TypeScript types
├── utils/             # Small helpers (e.g., classNames)
└── App.tsx            # Root component
```

---

### Tech Stack & Versions

- **React 19.1.1**
- **TypeScript 5.8.x**
- **Vite 7.1.x**
- **TailwindCSS 4.1.x**
- **Node.js 23.x** (tested locally)

---

### Implementation Notes

- **State management**: Implemented with React Context + Reducer + a custom hook. This avoids prop-drilling, keeps state centralized, and demonstrates an FSM-like approach without bringing in external stores like Redux or Zustand.

- **Styling**: TailwindCSS for utilities, with clsx + tailwind-merge to handle conditional classes and avoid conflicts. This keeps UI minimal but flexible.

- **Edge cases intentionally simulated**:

  - An invalid $1.00 cash button was added on purpose to demonstrate rejection handling.
  - Randomized card authorization success/fail and card limits to simulate real-world uncertainty.
  - A ~5% chance of "machine error" during dispensing was injected to showcase error handling logic.

---

## AI Usage Disclosure

AI assistance (ChatGPT) was used during development for:

- Defining and refining display messages for reducer actions.
- Suggesting component styling rules (e.g., Tailwind button variants).
- Polishing README structure and language.
