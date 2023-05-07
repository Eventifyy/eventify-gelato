import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import store from "../store/index";
import "@/styles/globals.css";

export default function App({ Component, pageProps, ...appProps }) {
  const isHomePage = (appProps.router.pathname === "/")
  return (
    <Provider store={store}>
      <div>
        <Navbar isHomePage={isHomePage} />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
