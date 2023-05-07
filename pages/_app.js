import Navbar from "@/components/Navbar";
import { Provider } from "react-redux";
import store from "../store/index";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <div>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
