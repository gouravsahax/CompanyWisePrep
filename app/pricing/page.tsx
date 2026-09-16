"use client";

import { useSession } from "next-auth/react";
import Script from "next/script";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { Coins, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PACKAGES = [
  { id: "pkg_tiny", name: "Test", credits: 2, basePriceINR: 1, popular: false },
  { id: "pkg_small", name: "Starter", credits: 10, basePriceINR: 99, popular: false },
  { id: "pkg_medium", name: "Pro", credits: 25, basePriceINR: 199, popular: true },
  { id: "pkg_large", name: "Elite", credits: 75, basePriceINR: 499, popular: false },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("INR");
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isPricingLoading, setIsPricingLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPricingConfig = async () => {
      try {
        const geoRes = await fetch("https://ipapi.co/json/");
        const geoData = await geoRes.json();
        const userCurrency = geoData.currency || "INR";
        setCurrency(userCurrency);

        if (userCurrency !== "INR") {
          const rateRes = await fetch("https://open.er-api.com/v6/latest/INR");
          const rateData = await rateRes.json();
          if (rateData?.rates?.[userCurrency]) {
            setExchangeRate(rateData.rates[userCurrency]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch pricing config", error);
      } finally {
        setIsPricingLoading(false);
      }
    };
    fetchPricingConfig();
  }, []);

  const getConvertedPrice = (basePriceINR: number) => {
    return Math.round(basePriceINR * exchangeRate);
  };

  const handlePayment = async (pkg: typeof PACKAGES[0]) => {
    if (!session) {
      toast.error("Please sign in to purchase credits.");
      return;
    }

    setLoadingPkg(pkg.id);

    try {
      const convertedPrice = getConvertedPrice(pkg.basePriceINR);

      // 1. Create order
      const res = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: convertedPrice, credits: pkg.credits, currency })
      });
      
      const order = await res.json();
      
      if (order.error) throw new Error(order.error);

      // 2. Initialize Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use NEXT_PUBLIC for client side
        amount: order.amount,
        currency: order.currency,
        name: "CompanyWisePrep",
        description: `Purchase ${pkg.credits} Credits`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount: convertedPrice,
              credits: pkg.credits
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success(`Success! Added ${pkg.credits} credits to your account.`);
            router.refresh();
          } else {
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: session.user?.name || "",
          email: session.user?.email || "",
        },
        theme: {
          color: "#3b82f6"
        }
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed! " + response.error.description);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while initializing payment.");
    } finally {
      setLoadingPkg(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto page-fade-in bg-background p-8">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-5xl mx-auto space-y-12 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Purchase Credits</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock premium mock OAs, AI code analytics, and exclusive company prep sheets.
            Top up your balance instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {PACKAGES.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative flex flex-col bg-card border rounded-sm p-6 shadow-sm transition-transform hover:-translate-y-1 ${pkg.popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <div className="flex items-baseline gap-1">
                  {isPricingLoading ? (
                    <div className="h-9 w-20 bg-muted animate-pulse rounded-sm"></div>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold text-foreground">{getConvertedPrice(pkg.basePriceINR)}</span>
                      <span className="text-muted-foreground font-medium">{currency}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                <div className="flex items-center gap-3 font-medium">
                  <Coins className="w-5 h-5 text-warning" />
                  <span>{pkg.credits} Credits</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-success mt-0.5 shrink-0"/> Unlock Company OAs</li>
                  <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-success mt-0.5 shrink-0"/> Detailed AI Analytics</li>
                  <li className="flex gap-2 items-start"><Check className="w-4 h-4 text-success mt-0.5 shrink-0"/> No expiration date</li>
                </ul>
              </div>

              <button
                onClick={() => handlePayment(pkg)}
                disabled={loadingPkg !== null}
                className={`w-full py-3 px-4 rounded-sm font-medium transition-all flex justify-center items-center ${pkg.popular ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-foreground border border-border hover:bg-muted/80'}`}
              >
                {loadingPkg === pkg.id ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  `Buy ${pkg.credits} Credits`
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 flex justify-center">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
             Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
