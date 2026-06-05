import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./components/layout/Layout";
import { Loader } from "./features/loader/Loader";

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

function lazyRoute(element: React.ReactNode) {
  return (
    <Suspense fallback={<Loader />}>
      {element}
    </Suspense>
  );
}

export default function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<></>} />
          <Route path="/home" element={<></>} />

          <Route path="/privacy" element={lazyRoute(<Privacy />)} />
          <Route path="/legal" element={lazyRoute(<Legal />)} />
          <Route path="/cookies" element={lazyRoute(<Cookies />)} />
          <Route path="/refunds" element={lazyRoute(<Refunds />)} />
          <Route path="/login" element={lazyRoute(<Login />)} />
          <Route path="/register" element={lazyRoute(<Register />)} />

          <Route path="/playground" element={<></>} />
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}