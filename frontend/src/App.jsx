import { createBrowserRouter, RouterProvider } from "react-router-dom";


import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import VerificationPage from "./Pages/Verification";
import UserPage from "./Pages/UserPage";
import AdminPage from "./Pages/Adminpage";
import CardPage from "./Pages/cart";
import ProductDetail from "./Pages/ProductDetials";
import CategoryPage from "./Pages/CategoryPage";
import AdminCategoryPage from "./Pages/AdminCategory";
import WishPage from "./Pages/WishPage";
import UserListPage from "./Pages/userList"
import Address from "./Pages/AddressPage";
import CheckOut from "./Pages/Checkoutpage";
import CheckOutCart  from "./component/chackoutCart";
import AboutPage from "./Pages/AboutPage";
import OrderPage from "./Pages/OrderPage";
import PendingPage from "./Pages/PendingPage";
import ShippedPage from "./Pages/ShippedPage";
import CompletedPage from "./Pages/Completedpage"
import ErrorPage from "./component/error";
import PrivateRoute from "./component/PrivateRoute";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import ErrorFallback from './Pages/ErrorPage';
const router = createBrowserRouter([
  { path: "/login", element: <LoginPage />,errorElement:<ErrorFallback />},
  { path: "/register", element: <RegisterPage />,errorElement:<ErrorFallback /> },
  { path: "/verification", element: <VerificationPage />,errorElement:<ErrorFallback /> },
  { path: "/", element: <UserPage />,errorElement:<ErrorFallback />},
  { path: "/aboutpage", element: <AboutPage />,errorElement:<ErrorFallback /> },
  { path: "/products/:category", element: <CategoryPage />,errorElement:<ErrorFallback />},
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [{ path: "/addresspage/:productId", element: <Address />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/product/:id", element: <ProductDetail />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/checkout/:productId", element: <CheckOut />,errorElement:<ErrorFallback /> ,}],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [ { path: "/dashbord", element: <AdminPage />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/checkout", element: <CheckOutCart  />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/orders", element: <OrderPage  />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/adminproducts/:category", element: <AdminCategoryPage />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/userlistpage", element: <UserListPage />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/pending", element: <PendingPage />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/shipping", element: <ShippedPage />,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/completed", element: <CompletedPage/>,errorElement:<ErrorFallback /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User", "Admin"]} />,
    children: [
      { path: "/cartpage", element: <CardPage />,errorElement:<ErrorFallback /> },
      { path: "/wishpage", element: <WishPage />,errorElement:<ErrorFallback /> },
      { path: "*", element: <ErrorPage />,errorElement:<ErrorFallback /> },
    ],
  },

 
]);

// function App() {
//   return (
//     <Provider store={store}>
//       <RouterProvider router={router} />
//     </Provider>
//   );
// }

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}


export default App;
