import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePublicationPage from "./pages/CreatePublicationPage";
import MyPublicationsPage from "./pages/MyPublicationsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import "./App.css";
import CategoriesPage from "./pages/CategoriesPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ContactPage from "./pages/ContactPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ProfilePage from "./pages/ProfilePage";
import ProductsPage from "./pages/ProductPage";
import UserProfilePage from "./pages/UserProfilePage";
import CartPage from "./pages/CartPage";
import EditPublicationPage from "./pages/EditPublicationPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/create-publication"
            element={<CreatePublicationPage />}
          />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/my-publications" element={<MyPublicationsPage />} />
          <Route
            path="/edit-publication/:id"
            element={<EditPublicationPage />}
          />
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditionsPage />}
          />{" "}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />{" "}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
