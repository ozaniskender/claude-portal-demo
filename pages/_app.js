import "@/styles/globals.css";
import { useEffect } from "react";
import { initSeedData } from "@/utils/seedData";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    initSeedData();
  }, []);

  return <Component {...pageProps} />;
}
