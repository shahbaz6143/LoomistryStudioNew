import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CurrencyProvider } from '@/context/CurrencyContext';

export const metadata = {
  title: 'LoomistryStudio - Premium Handmade Rugs & Carpets',
  description:
    'Premium handmade rugs and carpets crafted by artisans. Shop hand-knotted, hand-tufted, and flatweave rugs for your home.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body>
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <Header />
                <main>{children}</main>
                <Footer />
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
