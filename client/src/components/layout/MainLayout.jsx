import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MainLayout({ children }) {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Header currentUser={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
