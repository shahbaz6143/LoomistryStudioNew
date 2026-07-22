import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { BrandProvider } from '@/context/BrandContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: {
    default: 'LoomistryStudio - Premium Handmade Rugs & Carpets',
    template: '%s | LoomistryStudio',
  },
  description: 'Shop premium handmade rugs and carpets crafted by master artisans in India. Hand-knotted, hand-tufted, and flatweave rugs for your home. Free shipping on orders above ₹10,000.',
  keywords: ['handmade rugs', 'carpets', 'hand knotted rugs', 'persian rugs', 'indian rugs', 'wool carpets', 'area rugs', 'buy rugs online'],
  authors: [{ name: 'LoomistryStudio' }],
  creator: 'LoomistryStudio',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://loomistrystudio.com',
    siteName: 'LoomistryStudio',
    title: 'LoomistryStudio - Premium Handmade Rugs & Carpets',
    description: 'Shop premium handmade rugs and carpets crafted by master artisans in India.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'LoomistryStudio - Handmade Rugs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LoomistryStudio - Premium Handmade Rugs & Carpets',
    description: 'Shop premium handmade rugs crafted by master artisans in India.',
    images: ['https://images.unsplash.com/photo-1600166898405-da9535204843?w=1200&h=630&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://loomistrystudio.com'),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <AuthProvider>
          <BrandProvider>
            <ToastProvider>
              <CurrencyProvider>
                <CartProvider>
                  <WishlistProvider>
                    <Header />
                    <main>{children}</main>
                    <Footer />
                    <WhatsAppWidget />
                  </WishlistProvider>
                </CartProvider>
              </CurrencyProvider>
            </ToastProvider>
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
