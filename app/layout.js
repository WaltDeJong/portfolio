import { Inter } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Walter De Jong",
  description: "Javascript Developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
      <link rel="icon" href="/images/logo.png" />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
