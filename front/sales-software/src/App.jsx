import './App.css';
import { 
  createBrowserRouter, 
  RouterProvider, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';
import RootLayout from './Components/RootLayout';
import LoginFom from './Components/LoginFom';
import ErrorPage from './Components/ErrorPage';
import Dashboard from './Components/Dashboard';
import ManageLead from './Components/Manage-Lead';
import ManageCustomers from './Components/Manage-Customers';
import Products from './Components/Products';
import CreateUser from './Components/Create-Users';
import Qoutation from './Components/Qoutation';
import Invoice from './Components/Invoice';
import Payment from './Components/Payment-info';
import Home from './Components/Home';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<ErrorPage />}>
      {/* Default Route (Login Page) */}
      <Route index element={<LoginFom />} />

      {/* Dashboard with Nested Routes */}
      <Route path="dashboard" element={<Dashboard />}>
      <Route index element={<Home />} />
        <Route path="manage-lead" element={<ManageLead />} />
        <Route path="Manage-Customers" element={<ManageCustomers />} />
        <Route path="products" element={<Products/>} />
        <Route path="Create-user" element={<CreateUser/>} />
        <Route path="quotation" element={<Qoutation/>} />
        <Route path="Invoice" element={<Invoice/>} />
        <Route path="payment" element={<Payment/>} />
      </Route>

      {/* Catch-all for unknown routes */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

function App() {
  return (
    <div>
      <Toaster
  position="top-center"
  reverseOrder={false}
/>
<RouterProvider router={router} />
    </div>

  );
}

export default App;
