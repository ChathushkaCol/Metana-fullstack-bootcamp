import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Navigation />
      <main style={{ padding: "1rem" }}>{children}</main>
      <Footer />
    </>
  );
}


