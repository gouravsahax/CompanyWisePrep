"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Code2, Loader2, CheckCircle2 } from "lucide-react";
import { updateDefaultLanguage } from "@/app/actions/user";
import { toast } from "react-hot-toast";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JAVA" },
  { id: "cpp", name: "C++", icon: "C++" },
];

export default function LanguageSelectionPage() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleContinue = async () => {
    if (!selectedLang) return;
    
    setIsSubmitting(true);
    const res = await updateDefaultLanguage(selectedLang);
    
    if (res.success) {
      await update(); // Force token refresh so middleware sees it
      router.push("/"); // Redirect back to home/dashboard
    } else {
      toast.error("Failed to save language. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 page-fade-in font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
            <Code2 className="w-8 h-8 text-primary stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Choose your weapon</h1>
          <p className="text-sm text-muted-foreground font-light">Select your default programming language for coding assessments. You can change this later.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelectedLang(lang.id)}
                className={`relative p-4 rounded-sm border transition-all duration-200 flex flex-col items-center gap-3 text-center ${
                  isSelected 
                    ? "bg-primary/10 border-primary shadow-sm" 
                    : "bg-card/50 border-border/50 hover:border-primary/50 hover:bg-card"
                }`}
              >
                <div className={`w-12 h-12 rounded-sm flex items-center justify-center text-sm font-bold ${
                  isSelected ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                }`}>
                  {lang.icon}
                </div>
                <span className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>{lang.name}</span>
                
                {isSelected && (
                  <div className="absolute top-3 right-3 text-primary">
                    <CheckCircle2 className="w-4 h-4 fill-current text-primary-foreground" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedLang || isSubmitting}
          className="w-full py-3.5 rounded-sm bg-primary text-primary-foreground font-medium transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 hover:bg-primary/90"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin stroke-[1.5]" />
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
}
