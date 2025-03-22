import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"; // Ensure App is correctly imported
import { Provider } from "react-redux";
import { store } from "./Redux/store.js"; // Ensure correct path to your Redux store
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Fix: Render `App` instead of `children`
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
);
