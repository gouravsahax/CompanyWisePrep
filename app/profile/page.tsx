"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { User, Mail, Coins, Code2, Loader2, CheckCircle2 } from "lucide-react";
import { updateDefaultLanguage } from "@/app/actions/user";
import { toast } from "react-hot-toast";

const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "python", name: "Python", icon: "PY" },
  { id: "java", name: "Java", icon: "JAVA" },
  { id: "cpp", name: "C++", icon: "C++" },
];

export default function ProfilePage() {
  const { data: session, update, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // @ts-ignore
  const [selectedLang, setSelectedLang] = useState<string | null>(session?.user?.defaultLanguage || null);

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (status === "unauthenticated" || !session?.user) {
    return <div className="min-h-screen flex items-center justify-center bg-background">You must be logged in to view this page.</div>;
  }

  const user = session.user;

  const handleUpdateLanguage = async (langId: string) => {
    if (isSubmitting || langId === selectedLang) return;
    setIsSubmitting(true);
    setSelectedLang(langId);
    
    const res = await updateDefaultLanguage(langId);
    if (res.success) {
      await update(); // refresh session data
      toast.success("Language updated successfully");
    } else {
      toast.error("Failed to update language");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background flex flex-col p-6 sm:p-12 lg:p-24 page-fade-in font-sans">
      <div className="max-w-3xl mx-auto w-full space-y-12">
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
          <p className="text-muted-foreground font-light">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* User Info Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-card/50 border border-border/50 rounded-sm p-6 flex flex-col items-center text-center shadow-sm">
              <div className="relative w-24 h-24 mb-4">
                {user.image ? (
                  <Image src={user.image} alt="User" fill className="rounded-full object-cover border-4 border-background shadow-sm" />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold border-4 border-background shadow-sm">
                    {user.name?.[0] || user.email?.[0] || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{user.name || "User"}</h2>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 justify-center"><Mail className="w-3.5 h-3.5" /> {user.email}</p>
              
              <div className="w-full h-px bg-border/40 my-6"></div>
              
              <div className="w-full flex items-center justify-between px-2">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"><Coins className="w-4 h-4 text-warning" /> Credits</span>
                {/* @ts-ignore */}
                <span className="font-bold text-foreground text-lg">{user.credits ?? 2}</span>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-card/50 border border-border/50 rounded-sm p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-border/40 pb-4">
                <div className="p-2 bg-primary/10 rounded-sm text-primary">
                  <Code2 className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Default Language</h3>
                  <p className="text-xs text-muted-foreground">Select the programming language you prefer to start coding in.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {LANGUAGES.map((lang) => {
                  const isSelected = selectedLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => handleUpdateLanguage(lang.id)}
                      disabled={isSubmitting}
                      className={`relative p-4 rounded-sm border transition-all duration-200 flex items-center gap-4 text-left ${
                        isSelected 
                          ? "bg-primary/10 border-primary shadow-sm" 
                          : "bg-card/30 border-border/50 hover:border-primary/50 hover:bg-card cursor-pointer"
                      }`}
                    >
                      <div className={`w-10 h-10 shrink-0 rounded-sm flex items-center justify-center text-xs font-bold ${
                        isSelected ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                      }`}>
                        {lang.icon}
                      </div>
                      <span className={`font-medium flex-1 ${isSelected ? "text-primary" : "text-foreground"}`}>{lang.name}</span>
                      
                      {isSelected && (
                        <div className="text-primary">
                          {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 fill-current text-primary-foreground" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
