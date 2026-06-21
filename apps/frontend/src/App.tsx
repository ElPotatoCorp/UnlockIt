import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./components/layout/Layout";
import { Loader } from "./features/loader/Loader";
import { HelmetProvider } from "react-helmet-async";
import { NotFound } from "./features/not-found/NotFound";
import { ModalProvider } from "./components/common/modal-provider/ModalProvider";

/** @ts-ignore */
function hardToLoad<T>(importFn: () => Promise<T>, delay = 3000) {
  return new Promise<T>(resolve => {
    setTimeout(() => {
      resolve(importFn());
    }, delay);
  });
}

const Privacy = lazy(() => import("./pages/privacy/Privacy"));
const Legal = lazy(() => import("./pages/legal/Legal"));
const Cookies = lazy(() => import("./pages/cookies/Cookies"));
const Refunds = lazy(() => import("./pages/refunds/Refunds"));
const Login = lazy(() => import("./features/login/Login"));
const Register = lazy(() => import("./features/register/Register"));
const Home = lazy(() => import("./pages/home/Home"));
const Search = lazy(() => import("./pages/search/Search"));
const Wishlist = lazy(() => import("./pages/wishlist/Wishlist"));
const Game = lazy(() => import("./pages/game/Game"));
const Purchase = lazy(() => import("./pages/purchase/Purchase"));
const Purchases = lazy(() => import("./pages/purchases/Purchases"));

function lazyRoute(element: React.ReactNode) {
  return (
    <Suspense fallback={<Loader />}>
      {element}
    </Suspense>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              {["/home", "/store", "/shop"].map((path) => (
                <Route key={path} path={path} element={<Navigate to="/" replace />} />
              ))}

              <Route path="/privacy" element={lazyRoute(<Privacy />)} />
              <Route path="/legal" element={lazyRoute(<Legal />)} />
              <Route path="/cookies" element={lazyRoute(<Cookies />)} />
              <Route path="/refunds" element={lazyRoute(<Refunds />)} />
              <Route path="/login" element={lazyRoute(<Login />)} />
              <Route path="/register" element={lazyRoute(<Register />)} />
              <Route path="/search" element={lazyRoute(<Search />)} />
              <Route path="/search/:term" element={lazyRoute(<Search />)} />
              <Route path="/wishlist" element={lazyRoute(<Wishlist />)} />
              <Route path="/games/:id" element={lazyRoute(<Game />)} />
              <Route path="/purchases/:orderId/:gameId" element={lazyRoute(<Purchase/>)} />
              <Route path="/purchases" element={lazyRoute(<Purchases/>)} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </HelmetProvider>
  );
}