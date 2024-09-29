import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from '@/components/Navbar';
import UserProvider from "@/context/UserProvider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";



const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Swalay",
  description: "India's First All-In-One Music Distribution Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

      </Head> */}

      <body className={`dashboardBody ${inter.className}`} >
        <UserProvider>


        <Navbar />

        {/* <main style={{ padding: "1rem", minHeight: "80vh" }}> */}
        <main style={{ padding: "0.7rem", minHeight: "80vh" }}>
          {/* <section style={{ border: "2px solid green" }}> */}
          <Toaster position="top-center" 
            reverseOrder={false} 
            toastOptions={{
              duration: 5000,
             }}
            />
          <section>
            {children}
          </section>
        </main>

        <div style={{ padding: "1rem"}}>
          <Footer />
        </div >
        </UserProvider>
      </body>
    </html>
  );
}