import { VendingMachine } from "@/components/VendingMachine";
import { VendingMachineProvider } from "@/context/VendingMachine.provider";

function App() {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <VendingMachineProvider>
        <VendingMachine />
      </VendingMachineProvider>
    </div>
  );
}

export default App;
