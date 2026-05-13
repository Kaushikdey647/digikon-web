import type { Metadata } from "next";
import { OAuthSiteErrorRedirect } from "@/components/auth/oauth-site-error-redirect";
import { getSiteUrl } from "@/lib/site";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const siteUrl = getSiteUrl();
const defaultTitle = "Digikon Marketing | Digital marketing agency";
const defaultDescription =
  "Digikon Marketing helps brands grow with SEO, paid media, content, and analytics — strategy through optimization.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Digikon Marketing",
  },
  description: defaultDescription,
  applicationName: "Digikon Marketing",
  authors: [{ name: "Digikon Marketing", url: siteUrl }],
  creator: "Digikon Marketing",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Digikon Marketing",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${plusJakarta.className} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <OAuthSiteErrorRedirect />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
