import "./globals.css";

export const metadata = { title: "MERN Agent Distributor" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
