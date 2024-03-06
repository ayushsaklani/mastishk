import "./globals.css";
import { Public_Sans } from "next/font/google";

import { Navbar } from "./components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
     <head>
        <title>Mastishk an AI ChatBot</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="An AI Chatbot based on LallMa2"
        />
      </head>
      <body className={publicSans.className}>
        <div className="flex flex-col h-[100dvh] p-8 box-border">
          {/* <Navbar></Navbar> */}
          {children}
        </div>
      </body>
    </html>
  );
}
