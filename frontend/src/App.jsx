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
import store from "./redux/store";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/verification", element: <VerificationPage /> },
  { path: "/", element: <UserPage />},
  { path: "/aboutpage", element: <AboutPage /> },
  { path: "/products/:category", element: <CategoryPage /> },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [{ path: "/addresspage/:productId", element: <Address /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/product/:id", element: <ProductDetail /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/checkout/:productId", element: <CheckOut /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [ { path: "/dashbord", element: <AdminPage /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/checkout", element: <CheckOutCart  /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User"]} />,
    children: [ { path: "/orders", element: <OrderPage  /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/adminproducts/:category", element: <AdminCategoryPage /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/userlistpage", element: <UserListPage /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/pending", element: <PendingPage /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/shipping", element: <ShippedPage /> }],
  },
  {
    element: <PrivateRoute allowedRoles={["Admin"]} />,
    children: [{ path: "/completed", element: <CompletedPage/> }],
  },
  {
    element: <PrivateRoute allowedRoles={["User", "Admin"]} />,
    children: [
      { path: "/cartpage", element: <CardPage /> },
      { path: "/wishpage", element: <WishPage /> },
      { path: "*", element: <ErrorPage /> },
    ],
  },

 
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
