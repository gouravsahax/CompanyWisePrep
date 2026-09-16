"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Code2,
  Play,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AssessmentWorkspace({
  dsaQuestions,
  company,
  role,
  assessmentId,
  isCompleted = false,
  pastSubmissions = null,
  testResults = null,
  defaultLanguage
}: {
  dsaQuestions: any[];
  company: any;
  role: any;
  assessmentId: string;
  isCompleted?: boolean;
  pastSubmissions?: any;
  testResults?: any;
  defaultLanguage?: string;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const defaultCodeTemplates: Record<string, string> = {
    javascript:
      "// Write your optimal solution here\n\n// function solve(...) {\n//   // Your code here...\n// }\n",
    python:
      "# Write your optimal solution here\n\n# def solve(...):\n#     # Your code here...\n#     pass\n",
    java: "// Write your optimal solution here\n\nclass Solution {\n    // public ... solve(...) {\n    //     // Your code here...\n    // }\n}\n",
    cpp: "// Write your optimal solution here\n\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // ... solve(...) {\n    //     // Your code here...\n    // }\n};\n",
  };

  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [language, setLanguage] = useState(
    defaultLanguage || session?.user?.defaultLanguage || "javascript",
  );
  
  const [allCodes, setAllCodes] = useState<Record<string, Record<string, string>>>(() => {
    if (isCompleted && pastSubmissions) return pastSubmissions;
    const initial: Record<string, Record<string, string>> = {};
    dsaQuestions.forEach(q => {
      initial[q.id] = { ...defaultCodeTemplates };
    });
    return initial;
  });

  const [submittedQuestions, setSubmittedQuestions] = useState<Record<string, "accepted" | "failed">>(() => {
    const initial: Record<string, "accepted" | "failed"> = {};
    if (isCompleted && testResults) {
      Object.keys(testResults).forEach(qId => {
        initial[qId] = "accepted"; // Approximation for completed state
      });
    }
    return initial;
  });

  const [isProblemListOpen, setIsProblemListOpen] = useState(false);
  const [leftTab, setLeftTab] = useState<'description' | 'solution'>('description');

  const [isConsoleOpen, setIsConsoleOpen] = useState(isCompleted);
  const [consoleStatus, setConsoleStatus] = useState<
    "idle" | "running" | "run-success" | "submit-success" | "error" | "review"
  >(isCompleted ? "review" : "idle");
  const [activeTab, setActiveTab] = useState<"testcase" | "testresult">(
    isCompleted ? "testresult" : "testcase",
  );
  
  const [executionResults, setExecutionResults] = useState<any[]>([]);
  
  // Update review results when switching questions in review mode
  useEffect(() => {
    if (isCompleted && testResults && testResults[currentQ?.id]) {
      setExecutionResults(testResults[currentQ.id].execution?.results || []);
    } else if (isCompleted) {
      setExecutionResults([]);
    }
  }, [activeQuestionIdx, isCompleted, testResults]);

  const [executionError, setExecutionError] = useState<string>("");
  const [activeResultCaseIdx, setActiveResultCaseIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(3600); // 60 mins
  const [isFinished, setIsFinished] = useState(isCompleted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitStage, setSubmitStage] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close console when switching questions
  useEffect(() => {
    if (!isCompleted) {
      setIsConsoleOpen(false);
    }
  }, [activeQuestionIdx, isCompleted]);

  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitStage(0);
    
    // Simulate UI progress for the heavy backend API call
    const progressInterval = setInterval(() => {
      setSubmitStage(prev => (prev < 2 ? prev + 1 : prev));
    }, 2500);

    try {
      const res = await fetch("/api/assessment/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, submissions: allCodes, language }),
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
      console.error(e);
      toast.error("Network error. Please try again.");
      setIsSubmitting(false);
    }
  };

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
  }, [isFinished, mounted, assessmentId]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleRunCode = async () => {
    setIsConsoleOpen(true);
    setActiveTab("testresult");
    setConsoleStatus("running");
    setActiveResultCaseIdx(0);
    setExecutionError("");

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: allCodes[currentQ.id][language],
          language,
          questionId: currentQ.id,
          type: "run",
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setConsoleStatus("error");
        setExecutionError(data.error);
        return;
      }

      setExecutionResults(data.results);
      setConsoleStatus("run-success");
    } catch (e: any) {
      setConsoleStatus("error");
      setExecutionError(e.message || "Network error");
    }
  };

  const handleSubmit = async () => {
    setIsConsoleOpen(true);
    setActiveTab("testresult");
    setConsoleStatus("running");
    setExecutionError("");

    // Explicit save on submit
    try {
      await fetch("/api/assessment/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, submissions: allCodes }),
      });
    } catch (e) {
      console.error("Auto-save failed during submit", e);
    }

    try {
      const timeTaken = 3600 - timeLeft;
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: allCodes[currentQ.id][language],
          language,
          questionId: currentQ.id,
          type: "submit",
          timeTaken,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setConsoleStatus("error");
        setExecutionError(data.error);
        return;
      }

      setExecutionResults(data.results);
      setConsoleStatus("submit-success");
      
      const isAccepted = data.results.every(
        (r: any, i: number) =>
          JSON.stringify(r.result) ===
          JSON.stringify(currentQ.submitTestCases[i].execOutput),
      );
      setSubmittedQuestions(prev => ({
        ...prev,
        [currentQ.id]: isAccepted ? "accepted" : "failed"
      }));
    } catch (e: any) {
      setConsoleStatus("error");
      setExecutionError(e.message || "Network error");
    }
  };

  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 20 && newWidth < 80) {
        setLeftWidth(newWidth);
      }
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const [consoleHeight, setConsoleHeight] = useState(256);
  const [isDraggingConsole, setIsDraggingConsole] = useState(false);
  const rightContainerRef = useRef<HTMLDivElement>(null);

  const handleConsoleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingConsole || !rightContainerRef.current) return;
      const rect = rightContainerRef.current.getBoundingClientRect();
      const newHeight = rect.bottom - e.clientY - 56; // 56px is the footer height (h-14)
      if (newHeight > 100 && newHeight < rect.height - 150) {
        setConsoleHeight(newHeight);
      }
    },
    [isDraggingConsole],
  );

  const handleConsoleMouseUp = useCallback(() => {
    setIsDraggingConsole(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else if (isDraggingConsole) {
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";
      window.addEventListener("mousemove", handleConsoleMouseMove);
      window.addEventListener("mouseup", handleConsoleMouseUp);
    } else {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleConsoleMouseMove);
      window.removeEventListener("mouseup", handleConsoleMouseUp);
    }
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleConsoleMouseMove);
      window.removeEventListener("mouseup", handleConsoleMouseUp);
    };
  }, [
    isDragging,
    isDraggingConsole,
    handleMouseMove,
    handleMouseUp,
    handleConsoleMouseMove,
    handleConsoleMouseUp,
  ]);

  if (!dsaQuestions || dsaQuestions.length === 0) {
    return (
      <main className="flex-1 flex overflow-hidden bg-background">
        <div className="w-full h-full flex items-center justify-center p-8 text-center">
          <div className="max-w-md space-y-4">
            <h2 className="text-2xl font-light">Assessment Environment</h2>
            <p className="text-muted-foreground font-light">
              This is a placeholder for non-DSA assessments (e.g., UI Build,
              System Design). The actual questions would be loaded here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (isFinished && !isCompleted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background page-fade-in text-center p-8">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-3xl font-semibold mb-3 tracking-tight">
          Assessment Completed
        </h2>
        <p className="text-muted-foreground max-w-md mb-8">
          You have successfully submitted your answers for the {company?.name}{" "}
          {role?.name} online assessment. Your code and metrics have been evaluated by our AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/analytics`}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-sm transition-all duration-300 hover:-translate-y-0.5 shadow-sm inline-flex items-center gap-2"
            >
              <BrainCircuit className="w-5 h-5" />
              View AI Analysis
            </Link>
          <Link
            href={`/company/${company?.slug || "amazon"}`}
            className="bg-muted text-foreground px-6 py-2.5 rounded-full font-medium hover:bg-muted/80 transition-colors shadow-sm"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = dsaQuestions[activeQuestionIdx];

  return (
    <>
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-md px-4 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/company/${company?.slug || "amazon"}`}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted/80 transition-colors border border-border/50 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-medium tracking-tight text-foreground hidden sm:block">
              {company?.name} - {isCompleted ? 'Completed Assessment' : 'Active Assessment'}
            </h1>
            <span className="text-muted-foreground/30 font-light text-xs hidden sm:block">
              |
            </span>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <span className="hidden sm:inline">{role?.name}</span>
              {!isCompleted && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span
                    className={`${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-primary"} font-mono bg-card px-2 py-0.5 rounded border border-border/50 shadow-sm`}
                  >
                    {formatTime(timeLeft)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isCompleted && (
            <Link
              href="/analytics"
              className="text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              AI Analysis
            </Link>
          )}
          {!isCompleted && (
            <button
              onClick={() => setShowConfirmModal(true)}
              className="text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded transition-colors"
            >
              Finish Assessment
            </button>
          )}
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden min-h-0">
        <div
          ref={containerRef}
          className="flex-1 flex flex-col md:flex-row min-h-0 relative"
        >
          {/* Left side: Problem Description */}
          <div
            style={{
              width:
                typeof window !== "undefined" && window.innerWidth >= 768
                  ? `${leftWidth}%`
                  : "100%",
            }}
            className="flex-shrink-0 min-h-0 flex flex-col bg-card/10 md:h-full"
          >
            {/* Question Navigation Bar */}
            <div className="h-10 border-b border-border/20 bg-muted/30 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsProblemListOpen(!isProblemListOpen)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-muted ${
                    isProblemListOpen
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="w-3.5 h-3.5" /> Problems List
                </button>
                <div className="w-px h-4 bg-border/40 mx-1"></div>
                <button
                  onClick={() => setLeftTab('description')}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1 rounded ${
                    leftTab === 'description'
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Description
                </button>
                {isCompleted && (
                  <button
                    onClick={() => setLeftTab('solution')}
                    className={`flex items-center gap-1.5 text-xs font-medium transition-colors px-3 py-1 rounded ${
                      leftTab === 'solution'
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    Solution
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveQuestionIdx((prev) => Math.max(0, prev - 1));
                    setLeftTab('description');
                  }}
                  disabled={activeQuestionIdx === 0}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-medium text-muted-foreground">
                  {activeQuestionIdx + 1} / {dsaQuestions.length}
                </span>
                <button
                  onClick={() => {
                    setActiveQuestionIdx((prev) =>
                      Math.min(dsaQuestions.length - 1, prev + 1),
                    );
                    setLeftTab('description');
                  }}
                  disabled={activeQuestionIdx === dsaQuestions.length - 1}
                  className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex min-h-0">
              {isProblemListOpen && (
                <div className="w-64 flex-shrink-0 border-r border-border/20 bg-muted/10 overflow-y-auto page-fade-in flex flex-col">
                  <div className="p-3 border-b border-border/10 sticky top-0 bg-muted/10 backdrop-blur-md">
                    <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Assessment Problems
                    </h3>
                  </div>
                  <div className="p-2 space-y-1">
                    {dsaQuestions.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setActiveQuestionIdx(idx)}
                        className={`w-full text-left px-3 py-2 rounded-sm text-sm transition-all duration-200 flex items-start gap-2 cursor-pointer ${
                          idx === activeQuestionIdx
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span
                          className={`font-mono text-xs mt-0.5 ${idx === activeQuestionIdx ? "opacity-100" : "opacity-50"}`}
                        >
                          {idx + 1}.
                        </span>
                        <span className="truncate flex-1 leading-snug">
                          {q.title}
                        </span>
                        {submittedQuestions[q.id] === "accepted" && (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        )}
                        {submittedQuestions[q.id] === "failed" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto">
                {leftTab === 'description' ? (
                  <div className="p-6 lg:p-8 space-y-6 pb-12 page-fade-in">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                        {activeQuestionIdx + 1}. {currentQ.title}
                      </h2>
                    </div>
                    <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-muted/50 max-w-none text-muted-foreground font-light text-[15px]">
                      {currentQ.description}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">
                        Constraints
                      </h3>
                      <div className="bg-muted/30 p-5 rounded-sm border border-border/50 text-sm text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                        {currentQ.constraints}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">
                        Examples
                      </h3>
                      {(currentQ.examples as any[]).map((ex: any, i: number) => (
                        <div
                          key={i}
                          className="bg-muted/30 p-5 rounded-sm border border-border/50 space-y-2"
                        >
                          <p className="font-mono text-sm">
                            <strong className="text-foreground">Input:</strong>{" "}
                            {ex.input}
                          </p>
                          <p className="font-mono text-sm">
                            <strong className="text-foreground">Output:</strong>{" "}
                            {ex.output}
                          </p>
                          {ex.explanation && (
                            <p className="text-sm text-muted-foreground mt-2 font-light italic">
                              Explanation: {ex.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 lg:p-8 space-y-8 pb-12 page-fade-in">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-foreground tracking-tight">Solution Details</h3>
                      <div className="bg-primary/5 p-5 rounded-sm border border-primary/20 space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">Topic</p>
                            <p className="text-[15px] text-foreground font-medium">{currentQ.topic || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">Data Structure</p>
                            <p className="text-[15px] text-foreground font-medium">{currentQ.dataStructure || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">Time Complexity</p>
                            <p className="text-[15px] text-primary font-mono">{currentQ.timeComplexity || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1.5">Space Complexity</p>
                            <p className="text-[15px] text-primary font-mono">{currentQ.spaceComplexity || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-foreground">Optimal Solution</h3>
                      {currentQ.correctSolution ? (
                        <div className="space-y-6">
                          {Object.entries(currentQ.correctSolution).map(([lang, code]) => (
                            <div key={lang} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground capitalize">{lang}</span>
                              </div>
                              <div className="bg-[#0d1117] p-4 rounded-sm border border-border/50 overflow-x-auto">
                                <pre className="text-[13px] font-mono text-[#c9d1d9] leading-relaxed">
                                  {code as string}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground italic bg-muted/20 p-4 rounded-sm border border-border/10">
                          Solution code is not available for this problem.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Draggable Divider */}
          <div
            className="hidden md:flex w-1 bg-border/40 hover:bg-primary/50 cursor-col-resize active:bg-primary z-20 shrink-0 h-full transition-colors relative"
            onMouseDown={() => setIsDragging(true)}
          >
            {/* Invisible wider hit area for easier grabbing */}
            <div className="absolute -left-2 -right-2 top-0 bottom-0 z-30" />
          </div>

          {/* Right side: Mock Code Editor Area */}
          <div
            ref={rightContainerRef}
            className="flex-1 min-h-0 bg-[#0d1117] flex flex-col relative md:h-full"
          >
            <div className="h-10 border-b border-border/20 bg-[#161b22] flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 uppercase tracking-wider">
                  <Code2 className="w-3.5 h-3.5" /> Code
                </span>
                <div className="w-px h-4 bg-border/20"></div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#161b22] hover:bg-[#21262d] transition-colors text-xs text-[#c9d1d9] font-mono focus:outline-none cursor-pointer border border-border/20 rounded px-2 py-1"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
            </div>
            <div className="flex-1 relative w-full flex flex-col min-h-0">
              <div className="flex-1 relative min-h-0 w-full bg-[#0d1117]">
                {mounted && (
                  <div className="absolute inset-0">
                    <Editor
                      height="100%"
                      width="100%"
                      language={language || "javascript"}
                      theme="vs-dark"
                      value={allCodes[currentQ.id]?.[language] || ""}
                      onChange={(val) => {
                        setAllCodes(prev => ({
                          ...prev,
                          [currentQ.id]: {
                            ...prev[currentQ.id],
                            [language]: val || ""
                          }
                        }));
                      }}
                      loading={
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground/50">
                          Loading IDE...
                        </div>
                      }
                      options={{
                        readOnly: isCompleted,
                        automaticLayout: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily:
                          "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        scrollBeyondLastLine: false,
                        smoothScrolling: true,
                        padding: { top: 16 },
                        scrollbar: {
                          vertical: "visible",
                          horizontal: "visible",
                        },
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Draggable Horizontal Divider */}
              {isConsoleOpen && (
                <div
                  className="h-1 w-full bg-border/40 hover:bg-primary/50 cursor-row-resize active:bg-primary z-20 shrink-0 transition-colors relative"
                  onMouseDown={() => setIsDraggingConsole(true)}
                >
                  <div className="absolute -top-2 -bottom-2 left-0 right-0 z-30" />
                </div>
              )}

              {/* Console Drawer */}
              {isConsoleOpen && (
                <div
                  style={{ height: `${consoleHeight}px` }}
                  className="bg-[#1e1e1e] flex flex-col shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-10 relative"
                >
                  <div className="h-10 flex items-center px-4 gap-6 bg-[#2d2d2d] shrink-0">
                    <button
                      onClick={() => setActiveTab("testcase")}
                      className={`text-[13px] font-medium transition-colors relative flex items-center h-full ${activeTab === "testcase" ? "text-white" : "text-muted-foreground hover:text-white"}`}
                    >
                      Testcases
                      {activeTab === "testcase" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("testresult")}
                      className={`text-[13px] font-medium transition-colors relative flex items-center h-full ${activeTab === "testresult" ? "text-white" : "text-muted-foreground hover:text-white"}`}
                    >
                      Test Result
                      {activeTab === "testresult" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
                      )}
                    </button>
                    <div className="flex-1"></div>
                    <button
                      onClick={() => setIsConsoleOpen(false)}
                      className="text-muted-foreground hover:text-white text-lg leading-none cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 text-sm font-mono text-[#d4d4d4] bg-[#1e1e1e]">
                    {consoleStatus === "running" ? (
                      <div className="flex items-center gap-3 text-muted-foreground pt-2 pl-2">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />{" "}
                        Evaluating...
                      </div>
                    ) : activeTab === "testcase" ? (
                      <div className="space-y-4">
                        {(currentQ.examples as any[]).map(
                          (ex: any, i: number) => (
                            <div key={i} className="space-y-1.5">
                              <div className="text-[11px] uppercase tracking-wider text-muted-foreground/80 font-sans font-semibold">
                                Case {i + 1}
                              </div>
                              <div className="bg-[#2d2d2d] rounded-sm p-3 text-[13px] border border-[#3d3d3d]">
                                <div className="text-muted-foreground mb-1 font-sans text-xs">
                                  Input:
                                </div>
                                <div>{ex.input}</div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    ) : consoleStatus === "error" ? (
                      <div className="space-y-4 pt-4 px-4 pb-4">
                        <div className="text-red-500 font-semibold text-lg flex items-center gap-2 font-sans">
                          Execution Error
                        </div>
                        <div className="bg-[#2d2d2d] rounded-sm p-4 text-[13px] border border-red-500/20 text-red-400 font-mono whitespace-pre-wrap overflow-x-auto">
                          {executionError}
                        </div>
                      </div>
                    ) : consoleStatus === "run-success" || consoleStatus === "submit-success" || consoleStatus === "review" ? (
                      <div className="space-y-4 pt-1">
                        <div
                          className={`font-semibold text-lg flex items-center gap-2 font-sans px-2 ${executionResults.every((r, i) => JSON.stringify(r.result) === JSON.stringify(
                            (consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases)[i].execOutput
                          )) ? "text-success" : "text-red-500"}`}
                        >
                          {executionResults.every(
                            (r, i) =>
                              JSON.stringify(r.result) ===
                              JSON.stringify(
                                (consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases)[i].execOutput,
                              ),
                          )
                            ? "Accepted"
                            : "Wrong Answer"}
                        </div>

                        <div className="flex items-center gap-2 px-2 flex-wrap">
                          {((consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases) as any[]).map((_, i) => {
                            const passed =
                              executionResults[i]?.success &&
                              JSON.stringify(executionResults[i]?.result) ===
                                JSON.stringify(
                                  (consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases)[i].execOutput,
                                );
                            return (
                              <button
                                key={i}
                                onClick={() => setActiveResultCaseIdx(i)}
                                className={`px-3 py-1.5 rounded-sm text-sm font-sans transition-colors flex items-center gap-2 shrink-0 ${
                                  activeResultCaseIdx === i
                                    ? "bg-[#2d2d2d] text-white font-medium"
                                    : "hover:bg-[#2d2d2d] text-muted-foreground"
                                }`}
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${passed ? "bg-success" : "bg-red-500"}`}
                                ></div>
                                Case {i + 1}
                                {(consoleStatus === "submit-success" || consoleStatus === "review") && i >= currentQ.runTestCases.length && (
                                  <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground ml-1">Hidden</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <div className="px-2 space-y-4 font-sans text-sm pb-4">
                          {(() => {
                            const isHidden = consoleStatus === "submit-success" && activeResultCaseIdx >= currentQ.runTestCases.length;
                            return (
                              <>
                                <div>
                                  <div className="text-muted-foreground mb-1.5 font-medium">Input</div>
                                  <div className="bg-[#2d2d2d] rounded-sm p-3 font-mono text-[#d4d4d4] border border-[#3d3d3d] whitespace-pre-wrap">
                                    {isHidden ? "Hidden Test Case" : (consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases)[activeResultCaseIdx].input}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground mb-1.5 font-medium">Output</div>
                                  <div className="bg-[#2d2d2d] rounded-sm p-3 font-mono text-[#d4d4d4] border border-[#3d3d3d] whitespace-pre-wrap">
                                    {executionResults[activeResultCaseIdx]
                                      ? executionResults[activeResultCaseIdx].success
                                        ? isHidden && JSON.stringify(executionResults[activeResultCaseIdx].result) === JSON.stringify(currentQ.submitTestCases[activeResultCaseIdx].execOutput) 
                                          ? "Hidden" 
                                          : JSON.stringify(executionResults[activeResultCaseIdx].result)
                                        : executionResults[activeResultCaseIdx].error
                                      : "No output generated."}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-muted-foreground mb-1.5 font-medium">Expected</div>
                                  <div className="bg-[#2d2d2d] rounded-sm p-3 font-mono text-[#d4d4d4] border border-[#3d3d3d] whitespace-pre-wrap">
                                    {isHidden ? "Hidden Test Case" : (consoleStatus === "submit-success" || consoleStatus === "review" ? currentQ.submitTestCases : currentQ.runTestCases)[activeResultCaseIdx].output}
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center pt-10 font-sans">
                        You must run your code first
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-14 border-t border-border/20 bg-[#161b22] flex items-center justify-between px-4 gap-4 shrink-0 relative z-20">
              <button
                onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                className="text-[13px] font-medium text-muted-foreground hover:text-white px-3 py-1.5 rounded-sm hover:bg-[#2d2d2d] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                Console{" "}
                <ChevronUp
                  className={`w-3.5 h-3.5 transition-transform ${isConsoleOpen ? "rotate-180" : ""}`}
                />
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunCode}
                  disabled={consoleStatus === "running"}
                  className="px-6 py-1.5 rounded-sm border border-border/50 hover:bg-muted/10 text-[13px] font-medium transition-colors text-[#c9d1d9] disabled:opacity-50 cursor-pointer"
                >
                  Run Code
                </button>
                {!isCompleted && (
                  <button
                    onClick={handleSubmit}
                    disabled={consoleStatus === "running"}
                    className="px-6 py-1.5 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground text-[13px] font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {consoleStatus === "running" ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    Submit
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation & Submission Modal */}
      {(showConfirmModal || isSubmitting) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm page-fade-in">
          <div className="bg-card border border-border/50 shadow-2xl rounded-sm p-6 max-w-sm w-full mx-4 space-y-5">
            {!isSubmitting ? (
              <>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  Finish Assessment?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Are you sure you want to finish and submit this assessment? You
                  still have{" "}
                  <strong className="text-foreground">
                    {formatTime(timeLeft)}
                  </strong>{" "}
                  remaining. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end pt-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 text-sm font-medium hover:bg-muted text-muted-foreground hover:text-foreground rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFinish}
                    className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-sm transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Submit & Finish
                  </button>
                </div>
              </>
            ) : (
              <div className="py-8 flex flex-col items-center justify-center space-y-8 text-center">
                <div className="relative flex items-center justify-center">
                  {submitStage === 3 ? (
                    <CheckCircle2 className="w-16 h-16 text-success animate-in zoom-in duration-300" />
                  ) : (
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  )}
                </div>
                <div className="space-y-6 w-full max-w-xs mx-auto text-left">
                  <div className="flex items-center gap-3">
                    {submitStage > 0 ? <CheckCircle2 className="w-5 h-5 text-success" /> : submitStage === 0 ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                    <span className={`font-medium ${submitStage >= 0 ? "text-foreground" : "text-muted-foreground"}`}>Evaluating Submissions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {submitStage > 1 ? <CheckCircle2 className="w-5 h-5 text-success" /> : submitStage === 1 ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                    <span className={`font-medium ${submitStage >= 1 ? "text-foreground" : "text-muted-foreground"}`}>Generating AI Analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {submitStage > 2 ? <CheckCircle2 className="w-5 h-5 text-success" /> : submitStage === 2 ? <Loader2 className="w-5 h-5 text-primary animate-spin" /> : <div className="w-5 h-5 rounded-full border-2 border-muted" />}
                    <span className={`font-medium ${submitStage >= 2 ? "text-foreground" : "text-muted-foreground"}`}>Updating Analytics</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
