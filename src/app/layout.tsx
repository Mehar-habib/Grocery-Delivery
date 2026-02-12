import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";

export const metadata: Metadata = {
  title: "Grocery Delivery",
  description: "10 minutes delivery ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-linear-to-b from-green-100 w-full min-h-screen">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
