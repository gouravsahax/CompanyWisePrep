"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Code2, Loader2, CheckCircle2, MonitorPlay, BrainCircuit, Maximize2, LayoutTemplate } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";

export default function UIBuildWorkspace({
  uiQuestions,
  company,
  role,
  assessmentId,
  isCompleted = false,
  pastSubmissions = null,
  testResults = null,
}: {
  uiQuestions: any[];
  company: any;
  role: any;
  assessmentId: string;
  isCompleted?: boolean;
  pastSubmissions?: any;
  testResults?: any;
}) {
  const router = useRouter();
  const currentQ = uiQuestions[0]; // Assuming 1 question per UI Build for now

  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [codes, setCodes] = useState({
    html: isCompleted && pastSubmissions ? pastSubmissions.html : currentQ?.defaultHtml || "",
    css: isCompleted && pastSubmissions ? pastSubmissions.css : currentQ?.defaultCss || "",
    js: isCompleted && pastSubmissions ? pastSubmissions.js : currentQ?.defaultJs || "",
  });

  const [srcDoc, setSrcDoc] = useState("");
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [isFinished, setIsFinished] = useState(isCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [submitStage, setSubmitStage] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Live preview update
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <style>${codes.css}</style>
          </head>
          <body>
            ${codes.html}
            <script>${codes.js}</script>
          </body>
        </html>
      `);
    }, 500); // debounce 500ms
    return () => clearTimeout(timeout);
  }, [codes.html, codes.css, codes.js]);

  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitStage(0);
    
    const progressInterval = setInterval(() => {
      setSubmitStage(prev => (prev < 2 ? prev + 1 : prev));
    }, 2500);

    try {
      const res = await fetch("/api/uibuild/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          questionId: currentQ.id,
          html: codes.html,
          css: codes.css,
          js: codes.js
        }),
      });
      
      clearInterval(progressInterval);
      
      if (res.ok) {
        setSubmitStage(3);
        setTimeout(() => {
          setIsFinished(true);
          setShowConfirmModal(false);
          setIsSubmitting(false);
        }, 1500);
      } else {
        toast.error("Failed to submit assessment. Please try again.");
        setIsSubmitting(false);
      }
    } catch (e) {
      clearInterval(progressInterval);
      toast.error("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (isFinished || !mounted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, mounted]);



  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!mounted || !currentQ) return null;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-14 border-b border-border/40 bg-card/50 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-semibold">{currentQ.title}</div>
        </div>
        {!isFinished ? (
          <div className="flex items-center gap-4">
            <div className={`font-mono font-medium px-4 py-1.5 rounded-full ${
              timeLeft < 300 ? "bg-danger/10 text-danger" : "bg-muted text-muted-foreground"
            }`}>
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            >
              Finish Assessment
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-success bg-success/10 px-4 py-1.5 rounded-full font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" /> Assessment Completed
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/analytics"
              className="px-4 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium transition-colors"
            >
              View Analysis
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup orientation="horizontal">
          {/* Left pane: Description */}
          <Panel defaultSize={30} minSize={20}>
            <div className="h-full bg-card/30 flex flex-col overflow-y-auto p-6">
              <h2 className="text-xl font-semibold mb-4 text-primary">Requirements</h2>
          <div className="text-muted-foreground text-sm leading-relaxed mb-8 whitespace-pre-wrap">
            {currentQ.description}
          </div>
          
          <h3 className="font-medium text-foreground mb-3">Tasks to complete:</h3>
          <ul className="space-y-3">
            {(typeof currentQ.requirements === 'string' ? JSON.parse(currentQ.requirements) : currentQ.requirements).map((req: string, i: number) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs mt-0.5">{i+1}</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border/40 hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Center pane: Editors */}
          <Panel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col min-w-0">
              <div className="h-12 border-b border-border/40 bg-card/30 flex items-center px-2">
            <div className="flex space-x-1">
              <button 
                onClick={() => setActiveTab('html')}
                className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${activeTab === 'html' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                index.html
              </button>
              <button 
                onClick={() => setActiveTab('css')}
                className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${activeTab === 'css' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                style.css
              </button>
              <button 
                onClick={() => setActiveTab('js')}
                className={`px-4 py-1.5 text-sm rounded-sm transition-colors ${activeTab === 'js' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                script.js
              </button>
            </div>
          </div>
          <div className="flex-1 relative bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={activeTab}
              theme="vs-dark"
              value={codes[activeTab]}
              onChange={(value) => {
                if (isFinished) return;
                setCodes(prev => ({ ...prev, [activeTab]: value || "" }));
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                readOnly: isFinished,
                padding: { top: 16 }
              }}
            />
          </div>
            </div>
          </Panel>

          <PanelResizeHandle className="w-1 bg-border/40 hover:bg-primary/50 transition-colors cursor-col-resize" />

          {/* Right pane: Live Preview */}
          <Panel defaultSize={35} minSize={20}>
            <div className="h-full flex flex-col bg-white">
              <div className="h-12 border-b border-border/40 bg-card/30 flex items-center px-4 shrink-0 justify-between">
            <div className="text-sm font-medium flex items-center gap-2 text-foreground">
              <MonitorPlay className="w-4 h-4" /> Live Preview
            </div>
          </div>
          <div className="flex-1 relative">
            <iframe 
              srcDoc={srcDoc}
              title="Live Preview"
              className="w-full h-full border-none"
              sandbox="allow-scripts allow-modals"
            />
            </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-sm shadow-xl max-w-md w-full p-6 text-center page-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <BrainCircuit className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Submit UI Build?</h2>
            <p className="text-muted-foreground mb-8">
              Your HTML, CSS, and JS will be evaluated by our AI evaluator against the requirements.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-sm border border-border/50 hover:bg-muted font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-sm bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
