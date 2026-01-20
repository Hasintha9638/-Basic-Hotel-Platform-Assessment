import "./App.css";
import { useAuth } from "./hooks/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import HotelList from "./pages/HotelList";
import NotFound from "./pages/NotFound";
import HotelDetail from "./pages/HotelDetail";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/hotels" replace /> : <Login />
            }
          />
          <Route
            path="/hotels"
            element={
              <ProtectedRoute>
                <Layout>
                  <HotelList />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hotels/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <HotelDetail />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/hotels" replace />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <Layout>
                  <NotFound />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
