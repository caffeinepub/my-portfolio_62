import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Portfolio from "./components/Portfolio";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Portfolio />
      <Toaster />
    </QueryClientProvider>
  );
}
