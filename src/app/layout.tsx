import "@fortawesome/fontawesome-svg-core/styles.css";
import type { Metadata } from "next";
import "../styles/globals.css";
import "react-datepicker/dist/react-datepicker.css";
import ReduxProvider from "./redux/provider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={roboto.className}>
      <meta
        name="format-detection"
        content="telephone=no, date=no, email=no, address=no"
      />
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
