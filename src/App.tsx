import { QueryClient, QueryClientProvider } from "react-query";
import { MainView } from "./pages/MainView";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainView />
    </QueryClientProvider>
  );
}

export default App;
