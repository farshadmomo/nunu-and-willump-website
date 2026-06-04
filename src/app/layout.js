import { Fredoka, Nunito, Martian_Mono } from "next/font/google";
import "./globals.css";

// Chubby, rounded display (snowball-friendly) + plump rounded body.
const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata = {
  title: "Nunu & Willump — A Boy and His Yeti",
  description:
    "A scroll-driven, holo-iridescent ice tribute to Nunu & Willump of the Freljord. Roll the biggest snowball ever.",
};

export const viewport = {
  themeColor: "#0a1020",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} ${martian.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
