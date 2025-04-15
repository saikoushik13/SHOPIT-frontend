import { onAuthStateChanged } from "firebase/auth";
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Header from "./components/header";
import Loader, { LoaderLayout } from "./components/loader";
import ProtectedRoute from "./components/protected-route";
import { auth } from "./firebase";
import { getUser } from "./redux/api/userAPI";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { RootState } from "./redux/store";
import Footer from "./components/footer";
import AboutUs from "./pages/footer/AboutUs";
import OurServices from "./pages/footer/OurServices";
import PrivacyPolicy from "./pages/footer/PrivacyPolicy";
import AffiliateProgram from "./pages/footer/AffiliateProgram";
import FAQ from "./pages/footer/FAQ";
import ShippingPolicy from "./pages/footer/ShippingPolicy";
import ReturnsPolicy from "./pages/footer/ReturnsPolicy";
import OrderStatus from "./pages/footer/OrderStatus";
import PaymentOptions from "./pages/footer/PaymentOptions";





// Lazy loaded pages
const Home = lazy(() => import("./pages/home"));
const Search = lazy(() => import("./pages/search"));
const ProductDetails = lazy(() => import("./pages/product-details"));
const Cart = lazy(() => import("./pages/cart"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));
const NotFound = lazy(() => import("./pages/not-found"));
const Checkout = lazy(() => import("./pages/checkout"));
const Signup = lazy(() => import("./pages/signup"));


// Admin Routes Importing
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Discount = lazy(() => import("./pages/admin/discount"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(() => import("./pages/admin/management/productmanagement"));
const TransactionManagement = lazy(() => import("./pages/admin/management/transactionmanagement"));
const DiscountManagement = lazy(() => import("./pages/admin/management/discountmanagement"));
const NewDiscount = lazy(() => import("./pages/admin/management/newdiscount"));

const FooterWrapper = () => {
  const location = useLocation();
  const hiddenRoutes = ["/admin", "/login", "/signup"];

  // Check if the current path starts with any of the hidden routes
  const shouldHideFooter = hiddenRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  return !shouldHideFooter ? <Footer /> : null;
};



const App = () => {
  const { user, loading } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
      }
    });
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<LoaderLayout />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<OurServices />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/affiliate" element={<AffiliateProgram />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/shipping-policy" element={<ShippingPolicy />} />
      <Route path="/returns" element={<ReturnsPolicy />} />
      <Route path="/order-status" element={<OrderStatus />} />
      <Route path="/payment-options" element={<PaymentOptions />} />
      <Route
  path="/signup"
  element={
    <ProtectedRoute isAuthenticated={user ? false : true}>
      <Signup />
    </ProtectedRoute>
  }
/>
          {/* Not logged In Route */}
          <Route
            path="/login"
            
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          />
          {/* Logged In User Routes */}
          <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />
          </Route>
          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin"}
              />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />
            <Route path="/admin/discount" element={<Discount />} />
            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />
            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />
            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/product/:id" element={<ProductManagement />} />
            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
            <Route path="/admin/discount/new" element={<NewDiscount />} />
            <Route path="/admin/discount/:id" element={<DiscountManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FooterWrapper />
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
