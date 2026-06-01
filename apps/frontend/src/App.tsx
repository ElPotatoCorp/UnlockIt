import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Privacy } from "./pages/privacy/Privacy";
import { Legal } from "./pages/legal/Legal";
import { Cookies } from "./pages/cookies/Cookies";
import { Refunds } from "./pages/refunds/Refunds";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<></>} />
          <Route path="/home" element={<></>} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/refunds" element={<Refunds />} />
          
          <Route path="/playground" element={<></>} />

          {/* Catch-all route */}
          <Route path="*" element={<></>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;