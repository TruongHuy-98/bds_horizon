import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Activity,
  FileQuestion,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
  Share2,
  Mail,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  ArrowLeft,
  Award,
  Sparkles,
  HelpCircle,
  FileText,
  Play,
  Layers,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/site/Header";
import { toast } from "sonner";

import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import feature1 from "@/assets/news-feature-1.jpg";

import { INITIAL_MOCK_EXAMS, ExamSet, ExamQuestion } from "@/data/mockExamsData";
import { INITIAL_MOCK_EXAM_RESULTS, ExamResult } from "@/data/mockExamResultsData";

export const Route = createFileRoute("/on-thi")({
  component: OnThiPage,
  head: () => ({
    meta: [
      { title: "Trung tâm Ôn thi Chứng chỉ BĐS — Da Nang Real Estate" },
      {
        name: "description",
        content:
          "Cổng thông tin luyện thi chuyên nghiệp cho môi giới và nhà đầu tư tại Đà Nẵng. Hệ thống câu hỏi bám sát thực tế và quy hoạch mới nhất.",
      },
    ],
  }),
});

function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-[#F8FAFC] py-14">
      <div className="container-page grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="text-lg font-bold text-[#0F172A] tracking-tight">Da Nang Estates</div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Professional Real Estate Solutions in Da Nang and Central Vietnam.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">HỌC TẬP</h4>
          <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Khóa học Môi giới
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Tài liệu Pháp luật
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Đề thi mẫu
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">HỖ TRỢ</h4>
          <ul className="space-y-2.5 text-sm text-slate-500 font-medium">
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">COPYRIGHT</h4>
          <p className="text-sm text-slate-500 mb-4">
            © 2024 Da Nang Estates. Professional Real Estate Solutions.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <ExternalLink className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <Share2 className="h-5 w-5" />
            </a>
            <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface UserExamResult {
  id: string;
  examId: string;
  examTitle: string;
  userName: string;
  userAvatar: string;
  certificateType: string;
  score: number;
  maxScore: number;
  scorePercent: number;
  status: "ĐẠT" | "KHÔNG ĐẠT";
  completedAt: string;
  durationSeconds: number;
  userAnswers: Record<string, any>;
}

export default function OnThiPage() {
  // 1. View mode state: 'list' | 'testing' | 'result'
  const [viewMode, setViewMode] = useState<"list" | "testing" | "result">("list");
  
  // Data lists state
  const [exams, setExams] = useState<ExamSet[]>([]);
  const [resultsHistory, setResultsHistory] = useState<ExamResult[]>([]);
  
  // Active test state
  const [selectedExam, setSelectedExam] = useState<ExamSet | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Active result state (for review)
  const [activeResult, setActiveResult] = useState<UserExamResult | null>(null);

  // Search & Filter state for list view
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertFilter, setSelectedCertFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect">("all");

  // Load exams & results from localStorage or initial data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedExams = localStorage.getItem("mock_exams");
      if (storedExams) {
        try { setExams(JSON.parse(storedExams)); } catch { setExams(INITIAL_MOCK_EXAMS); }
      } else {
        localStorage.setItem("mock_exams", JSON.stringify(INITIAL_MOCK_EXAMS));
        setExams(INITIAL_MOCK_EXAMS);
      }

      const storedResults = localStorage.getItem("mock_exam_results");
      if (storedResults) {
        try { setResultsHistory(JSON.parse(storedResults)); } catch { setResultsHistory(INITIAL_MOCK_EXAM_RESULTS); }
      } else {
        localStorage.setItem("mock_exam_results", JSON.stringify(INITIAL_MOCK_EXAM_RESULTS));
        setResultsHistory(INITIAL_MOCK_EXAM_RESULTS);
      }
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    let interval: any = null;
    if (viewMode === "testing" && isTimerRunning) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsTimerRunning(false);
            handleSubmitExam(true); // Auto submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewMode, isTimerRunning]);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start an Exam
  const handleStartExam = (exam: ExamSet) => {
    if (!exam.questions || exam.questions.length === 0) {
      toast.error("Bộ đề thi này chưa có câu hỏi nào!");
      return;
    }
    setSelectedExam(exam);
    setUserAnswers({});
    setActiveQIndex(0);
    setTimeRemaining(exam.durationMinutes * 60);
    setIsTimerRunning(true);
    setViewMode("testing");
    toast.success(`Bắt đầu làm bài thi: ${exam.title}`);
  };

  // Select Option for a Question
  const handleSelectOption = (questionId: string, optionKey: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  // Select True/False sub-statement answer
  const handleSelectSubStatement = (questionId: string, subKey: string, val: string) => {
    setUserAnswers((prev) => {
      const currentObj = prev[questionId] && typeof prev[questionId] === "object" ? prev[questionId] : {};
      return {
        ...prev,
        [questionId]: {
          ...currentObj,
          [subKey]: val,
        },
      };
    });
  };

  // Handle Textarea input for Essay
  const handleTextAnswer = (questionId: string, textVal: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: textVal,
    }));
  };

  // Calculate score and submit exam
  const handleSubmitExam = (isAuto = false) => {
    if (!selectedExam) return;

    setIsTimerRunning(false);
    setShowConfirmModal(false);

    let earnedPoints = 0;
    let totalQuestions = selectedExam.questions.length;

    selectedExam.questions.forEach((q) => {
      const userAns = userAnswers[q.id];

      if (!userAns) return;

      if (!q.type || q.type === "Trắc nghiệm") {
        if (userAns === q.correctOption) {
          earnedPoints += 1;
        }
      } else if (q.type === "Đúng/Sai") {
        if (typeof userAns === "object" && q.subStatements && q.subStatements.length > 0) {
          let correctSubCount = 0;
          q.subStatements.forEach((sub) => {
            if (userAns[sub.key]) {
              correctSubCount += 0.25; // 4 subs = 1 point
            }
          });
          earnedPoints += correctSubCount;
        } else if (typeof userAns === "string") {
          earnedPoints += 0.5;
        }
      } else if (q.type === "Tình huống") {
        if (userAns === q.correctOption) {
          earnedPoints += 1;
        }
      } else if (q.type === "Tự luận") {
        if (typeof userAns === "string" && userAns.trim().length > 0) {
          earnedPoints += 1;
        }
      }
    });

    const totalPercent = Math.min(100, Math.round((earnedPoints / totalQuestions) * 100));
    const isPassed = totalPercent >= selectedExam.passingScorePercent;
    const timeSpent = selectedExam.durationMinutes * 60 - timeRemaining;

    const resultObj: ExamResult = {
      id: "res-" + Math.random().toString(36).substring(2, 9),
      candidateName: "Nguyễn Văn A (Bạn)",
      candidatePhone: "0905 999 888",
      candidateEmail: "nguyenvana@gmail.com",
      candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      certificateType: selectedExam.certificateType,
      scoreText: `${earnedPoints}/${totalQuestions} câu`,
      scorePercent: totalPercent,
      correctAnswersCount: earnedPoints,
      totalQuestionsCount: totalQuestions,
      timeSpentMinutes: Math.max(1, Math.round(timeSpent / 60)),
      passed: isPassed,
      submittedAt: new Date().toISOString(),
      answers: [],
    };
    (resultObj as any).userAnswers = { ...userAnswers };
    (resultObj as any).durationSeconds = timeSpent > 0 ? timeSpent : 1;

    // Save to localStorage & update state
    const updatedHistory = [resultObj, ...resultsHistory];
    setResultsHistory(updatedHistory);
    localStorage.setItem("mock_exam_results", JSON.stringify(updatedHistory));

    setActiveResult(resultObj as any);
    setViewMode("result");

    if (isAuto) {
      toast.warning("Hết giờ làm bài! Hệ thống đã nộp bài thi tự động.");
    } else {
      toast.success(`Đã nộp bài thành công! Kết quả: ${isPassed ? "ĐẠT 🎉" : "KHÔNG ĐẠT ⚠️"}`);
    }
  };

  // Review a historical result from table
  const handleReviewHistoryResult = (h: ExamResult) => {
    // Find exam set
    const matchedExam = exams.find((e) => e.id === h.examId) || exams[0];
    setSelectedExam(matchedExam);
    setActiveResult(h as any);
    setViewMode("result");
  };

  // Filtered exams list
  const filteredExams = useMemo(() => {
    return exams.filter((e) => {
      const matchSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCert = selectedCertFilter === "all" || e.certificateType === selectedCertFilter;
      return matchSearch && matchCert;
    });
  }, [exams, searchTerm, selectedCertFilter]);

  const categories = [
    {
      title: "Pháp luật BĐS",
      questions: "500+ Câu hỏi",
      desc: "Luật Đất đai, Luật Nhà ở và các thông tư mới nhất áp dụng...",
      footer: "Mới cập nhật",
      img: news1,
    },
    {
      title: "Kinh doanh BĐS",
      questions: "420+ Câu hỏi",
      desc: "Quy trình môi giới, thẩm định giá và quản lý dự án bất động...",
      footer: "Đã học 45%",
      img: news2,
    },
    {
      title: "Phòng chống rửa tiền",
      questions: "280+ Câu hỏi",
      desc: "Các quy định bắt buộc về phòng chống rửa tiền trong...",
      footer: "Khó: 35%",
      img: news3,
    },
    {
      title: "Quy hoạch xây dựng",
      questions: "350+ Câu hỏi",
      desc: "Đọc bản đồ quy hoạch, chỉ giới xây dựng và quy chuẩn...",
      footer: "Thành thạo",
      img: feature1,
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Nguyễn Minh Quân",
      agency: "Lighthouse Agency",
      score: 9.8,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80",
    },
    {
      rank: 2,
      name: "Trần Thu Hà",
      agency: "Sơn Trà Realty",
      score: 9.6,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    },
    {
      rank: 3,
      name: "Lê Hoàng Nam",
      agency: "Independent Broker",
      score: 9.4,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      <Header />

      {/* ========================================================================= */}
      {/* 1. MÀN HÌNH 1: DANH SÁCH ĐỀ THI & LỊCH SỬ (list mode)                    */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <main className="container-page py-10 flex-1">
          {/* Title Banner Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 mb-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-teal-500/10 text-teal-700 border border-teal-500/30 text-xs font-semibold px-2.5 py-0.5">
                  Chứng chỉ Môi giới & Quản lý BĐS
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B396E] tracking-tight">
                Trung tâm Ôn thi & Thi thử Chứng chỉ BĐS
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Cổng thông tin luyện thi chuyên nghiệp cho môi giới và nhà đầu tư tại Đà Nẵng. Hệ thống
                câu hỏi bám sát thực tế và quy định mới nhất.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-200/80 rounded-2xl p-4 text-right shrink-0 shadow-sm">
              <div className="text-[11px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5 justify-end">
                <Clock className="size-3.5" /> Kỳ thi sát hạch tiếp theo
              </div>
              <div className="text-2xl font-black text-red-600 mt-1">14 Ngày Còn Lại</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Sở Xây dựng TP. Đà Nẵng</p>
            </div>
          </div>

          {/* Top Dash Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Lộ trình học tập
                </span>
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                  <BookOpen className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">68% Hoàn thành</div>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-teal-600 h-full rounded-full" style={{ width: "68%" }} />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Điểm trung bình
                </span>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">8.4 / 10</div>
                <span className="text-xs font-bold text-emerald-600 inline-block mt-2">
                  +12% so với tuần trước
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Câu hỏi đã ôn
                </span>
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600">
                  <FileQuestion className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-black text-slate-900">1,240 / 2,000</div>
                <a
                  href="#exam-list"
                  className="text-xs font-bold text-teal-700 flex items-center gap-1 mt-2 hover:underline"
                >
                  Tiếp tục học <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#0B396E] to-slate-900 text-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-24 w-24" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300">
                  Phòng luyện thi
                </span>
                <h3 className="text-lg font-bold mt-1">Thi thử mô phỏng</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Trải nghiệm áp lực phòng thi với bộ đề chuẩn từ Sở Xây dựng.
                </p>
              </div>
              <div className="mt-4 relative z-10">
                <Button
                  onClick={() => {
                    if (exams.length > 0) handleStartExam(exams[0]);
                  }}
                  className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Play className="h-3.5 w-3.5 fill-current" /> Bắt đầu ngay (Bộ đề #01)
                </Button>
              </div>
            </div>
          </div>

          {/* ==================== DANH SÁCH BỘ ĐỀ THI THỬ ==================== */}
          <section id="exam-list" className="mb-14 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="size-5 text-teal-600" />
                  Danh sách Bộ đề Thi thử Hiện có
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Chọn bộ đề thi bên dưới để bắt đầu tính giờ và chấm điểm tự động</p>
              </div>

              {/* Filter pills & Search */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
                  <Input
                    placeholder="Tìm tên đề thi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 text-xs bg-white border-slate-200"
                  />
                </div>
                <select
                  value={selectedCertFilter}
                  onChange={(e) => setSelectedCertFilter(e.target.value)}
                  className="h-8 text-xs bg-white border border-slate-200 rounded-lg px-2.5 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="all">Tất cả chứng chỉ</option>
                  <option value="Môi giới BĐS">Môi giới BĐS</option>
                  <option value="Định giá BĐS">Định giá BĐS</option>
                  <option value="Quản lý Sàn BĐS">Quản lý Sàn BĐS</option>
                </select>
              </div>
            </div>

            {/* Exams Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.length === 0 ? (
                <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                  <FileQuestion className="size-10 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600 text-sm">Không tìm thấy bộ đề thi nào phù hợp</p>
                </div>
              ) : (
                filteredExams.map((exam) => (
                  <Card
                    key={exam.id}
                    className="bg-white border-slate-200 hover:border-teal-500/50 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group rounded-2xl"
                  >
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 font-semibold text-[10px]">
                          {exam.certificateType}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">
                          {exam.questions?.length || exam.questionCount || 0} câu hỏi
                        </Badge>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                        {exam.title}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-slate-400" />
                          <span>{exam.durationMinutes} Phút</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="size-3.5 text-slate-400" />
                          <span>Đạt từ {exam.passingScorePercent}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/60 border-t border-slate-100">
                      <Button
                        onClick={() => handleStartExam(exam)}
                        className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs h-9 rounded-xl shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Play className="size-3.5 fill-current" />
                        Bắt đầu làm bài
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Ngân hàng câu hỏi section */}
          <section className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Chuyên mục Ngân hàng câu hỏi</h2>
              <a href="#" className="text-xs font-bold text-teal-700 hover:underline">
                Xem tất cả chuyên mục
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((c) => (
                <div
                  key={c.title}
                  className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300 group"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {c.questions}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col justify-between h-[150px]">
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-1">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                        {c.desc}
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                      <span className="text-[11px] font-bold text-slate-500">{c.footer}</span>
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom split section: Lịch sử & Bảng xếp hạng */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dynamic Lịch sử luyện tập gần đây */}
            <div className="lg:col-span-2 bg-white border border-slate-200/70 rounded-2xl shadow-xs p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Lịch sử luyện tập gần đây</h2>
                  <p className="text-xs text-slate-400">Kết quả được tự động đồng bộ từ phòng thi</p>
                </div>
                <span className="text-xs text-slate-400 font-mono">{resultsHistory.length} bài thi</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 w-1/4">Thời gian</th>
                      <th className="pb-3 w-2/5">Chủ đề / Đề thi</th>
                      <th className="pb-3 w-1/5">Kết quả</th>
                      <th className="pb-3 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {resultsHistory.slice(0, 5).map((h: any, i) => {
                      const isPassed = h.passed ?? h.status === "ĐẠT";
                      const dateStr = h.submittedAt || h.completedAt || new Date().toISOString();
                      const durationStr = h.timeSpentMinutes ? `${h.timeSpentMinutes} phút` : h.durationSeconds ? `${Math.floor(h.durationSeconds / 60)} phút` : "30 phút";

                      return (
                        <tr key={h.id || i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <div className="font-bold text-slate-900 text-xs">
                              {new Date(dateStr).toLocaleDateString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                              })}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {durationStr}
                            </div>
                          </td>
                          <td className="py-4 font-bold text-slate-900 text-xs max-w-xs truncate">
                            {h.examTitle}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                isPassed
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {isPassed ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              {h.scorePercent}% ({isPassed ? "ĐẠT" : "TRƯỢT"})
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReviewHistoryResult(h)}
                              className="h-8 rounded-lg text-xs font-semibold border-teal-200 text-teal-700 hover:bg-teal-50"
                            >
                              Xem lại bài làm
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bảng xếp hạng */}
            <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs flex flex-col justify-between overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Bảng xếp hạng Đà Nẵng</h2>
                <div className="space-y-4">
                  {leaderboard.map((u) => (
                    <div
                      key={u.name}
                      className="flex items-center justify-between border-b border-slate-100 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="h-10 w-10 object-cover rounded-full border-2 border-white shadow-xs"
                          />
                          <span
                            className={`absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full text-[10px] font-black grid place-items-center border border-white text-white shadow-xs ${
                              u.rank === 1
                                ? "bg-amber-400"
                                : u.rank === 2
                                ? "bg-slate-400"
                                : "bg-amber-700"
                            }`}
                          >
                            {u.rank}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-slate-900">{u.name}</div>
                          <div className="text-[10px] font-semibold text-slate-400">{u.agency}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">{u.score}</div>
                        <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                          Avg Score
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-4 text-xs font-bold text-teal-700 border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                Xem toàn bộ bảng xếp hạng
              </button>
            </div>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* 2. MÀN HÌNH 2: PHÒNG THI MÔ PHỎNG (testing mode)                          */}
      {/* ========================================================================= */}
      {viewMode === "testing" && selectedExam && (
        <div className="min-h-screen bg-slate-100 flex flex-col">
          {/* STICKY TOP BAR */}
          <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md px-4 sm:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(true)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Thoát bài thi"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white max-w-md truncate">
                  {selectedExam.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge className="bg-teal-500/20 text-teal-300 border-none text-[10px]">
                    {selectedExam.certificateType}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Đã trả lời: {Object.keys(userAnswers).length}/{selectedExam.questions.length} câu
                  </span>
                </div>
              </div>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base ${
                  timeRemaining < 300
                    ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse"
                    : "bg-slate-800 text-teal-400 border-slate-700"
                }`}
              >
                <Clock className="size-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>

              <Button
                onClick={() => setShowConfirmModal(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md"
              >
                Nộp bài thi
              </Button>
            </div>
          </header>

          {/* MAIN TESTING WORKSPACE */}
          <main className="container-page py-6 flex-1 grid lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: QUESTION STREAM */}
            <div className="lg:col-span-8 space-y-6">
              {selectedExam.questions.map((q, idx) => {
                const isCurrent = idx === activeQIndex;
                const userAns = userAnswers[q.id];

                return (
                  <Card
                    id={`question-${q.id}`}
                    key={q.id || idx}
                    className={`p-6 bg-white border-2 transition-all duration-200 shadow-sm rounded-2xl ${
                      isCurrent ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200/80"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-900 text-white font-bold text-xs py-0.5 px-2.5">
                          Câu {idx + 1} / {selectedExam.questions.length}
                        </Badge>
                        {q.type && (
                          <Badge variant="outline" className="text-[10px] font-semibold border-slate-200">
                            {q.type}
                          </Badge>
                        )}
                      </div>
                      {userAns && (
                        <Badge className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-semibold">
                          ✓ Đã chọn đáp án
                        </Badge>
                      )}
                    </div>

                    {/* Scenario context if present */}
                    {q.context && (
                      <div className="p-4 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 space-y-1 mb-4">
                        <strong className="block text-[11px] text-purple-800 uppercase tracking-wider font-bold">
                          📖 Đoạn văn đọc hiểu tình huống:
                        </strong>
                        <p className="leading-relaxed italic">{q.context}</p>
                      </div>
                    )}

                    {/* Question Content */}
                    <h4 className="font-bold text-slate-900 text-base leading-relaxed mb-4">
                      {q.content}
                    </h4>

                    {/* OPTIONS RENDERER */}

                    {/* A. Trắc nghiệm (Radio options A, B, C, D) */}
                    {(!q.type || q.type === "Trắc nghiệm" || q.type === "Tình huống") && (
                      <div className="space-y-2.5">
                        {q.options.map((opt) => {
                          const isSelected = userAns === opt.key;
                          return (
                            <button
                              key={opt.key}
                              onClick={() => {
                                handleSelectOption(q.id, opt.key);
                                setActiveQIndex(idx);
                              }}
                              className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                                isSelected
                                  ? "bg-teal-50/80 border-teal-500 text-teal-950 ring-1 ring-teal-500/30 font-bold"
                                  : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/70"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span
                                  className={`size-6 rounded-lg text-xs font-bold flex items-center justify-center border ${
                                    isSelected
                                      ? "bg-teal-600 text-white border-teal-600"
                                      : "bg-white text-slate-600 border-slate-300"
                                  }`}
                                >
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                              {isSelected && <Check className="size-4 text-teal-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* B. Đúng / Sai (Sub-statements radio grid) */}
                    {q.type === "Đúng/Sai" && q.subStatements && (
                      <div className="space-y-3 pt-2">
                        {q.subStatements.map((sub) => {
                          const currentVal = userAns && typeof userAns === "object" ? userAns[sub.key] : undefined;
                          return (
                            <div key={sub.key} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                              <span className="font-medium text-slate-800">
                                <strong>{sub.key})</strong> {sub.text}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleSelectSubStatement(q.id, sub.key, "Đúng")}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                                    currentVal === "Đúng"
                                      ? "bg-emerald-600 text-white border-emerald-600"
                                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                  }`}
                                >
                                  Đúng
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSelectSubStatement(q.id, sub.key, "Sai")}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition-all ${
                                    currentVal === "Sai"
                                      ? "bg-red-600 text-white border-red-600"
                                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                  }`}
                                >
                                  Sai
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* C. Tự luận (Textarea input) */}
                    {q.type === "Tự luận" && (
                      <div className="space-y-2 pt-2">
                        <textarea
                          placeholder="Nhập câu trả lời chi tiết của bạn vào đây..."
                          value={typeof userAns === "string" ? userAns : ""}
                          onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                          className="w-full p-3.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 min-h-[120px]"
                        />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* RIGHT COLUMN: QUICK NAVIGATION DRAWER / SIDEBAR */}
            <div className="lg:col-span-4 sticky top-20 space-y-4">
              <Card className="p-5 bg-white border-slate-200 shadow-sm rounded-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Layers className="size-4 text-teal-600" />
                    Danh sách câu hỏi ({selectedExam.questions.length})
                  </h4>
                  <Badge variant="outline" className="text-[10px] font-bold border-teal-200 bg-teal-50 text-teal-700">
                    {Object.keys(userAnswers).length}/{selectedExam.questions.length} đã chọn
                  </Badge>
                </div>

                {/* Grid of question numbers */}
                <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
                  {selectedExam.questions.map((q, idx) => {
                    const isAnswered = !!userAnswers[q.id];
                    const isCurrent = idx === activeQIndex;

                    return (
                      <button
                        key={q.id || idx}
                        onClick={() => {
                          setActiveQIndex(idx);
                          const el = document.getElementById(`question-${q.id}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`size-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center relative ${
                          isCurrent
                            ? "ring-2 ring-teal-500 ring-offset-2 bg-teal-600 text-white"
                            : isAnswered
                            ? "bg-emerald-500 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                        {isAnswered && !isCurrent && (
                          <span className="absolute -top-1 -right-1 size-2.5 bg-emerald-300 rounded-full border border-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="size-3 bg-emerald-500 rounded-md shrink-0" />
                    <span>Đã trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-3 bg-slate-200 rounded-md shrink-0" />
                    <span>Chưa trả lời</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowConfirmModal(true)}
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs h-10 rounded-xl shadow-md mt-2"
                >
                  <Check className="size-4 mr-1.5" />
                  Nộp bài thi ngay
                </Button>
              </Card>
            </div>

          </main>

          {/* MODAL CONFIRM NỘP BÀI SỚM */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <Card className="max-w-md w-full bg-white p-6 rounded-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <AlertCircle className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Xác nhận nộp bài thi?</h3>
                    <p className="text-xs text-slate-500">Kiểm tra thông số trước khi nộp bài</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số câu đã trả lời:</span>
                    <strong className="text-slate-900">{Object.keys(userAnswers).length} / {selectedExam.questions.length} câu</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian còn lại:</span>
                    <strong className="text-teal-700 font-mono">{formatTime(timeRemaining)}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 h-10 text-xs font-semibold"
                  >
                    Tiếp tục làm bài
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleSubmitExam(false)}
                    className="flex-1 h-10 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Xác nhận Nộp bài
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MÀN HÌNH 3: KẾT QUẢ & XEM LẠI BÀI LÀM (result mode)                    */}
      {/* ========================================================================= */}
      {viewMode === "result" && activeResult && selectedExam && (() => {
        const res = activeResult as any;
        const isPassed = res.passed ?? res.status === "ĐẠT";
        const correctCount = res.correctAnswersCount ?? res.score ?? 0;
        const totalCount = res.totalQuestionsCount ?? res.maxScore ?? selectedExam.questions.length;
        const durationSecs = res.durationSeconds || (res.timeSpentMinutes ? res.timeSpentMinutes * 60 : 1800);
        const userAnswersMap = res.userAnswers || {};

        return (
          <main className="container-page py-10 flex-1 space-y-10">
            
            {/* HERO RESULT CARD */}
            <Card className="p-8 bg-white border-slate-200 shadow-lg rounded-3xl overflow-hidden relative">
              <div className="grid md:grid-cols-12 gap-8 items-center">
                
                {/* Badge & Big Score */}
                <div className="md:col-span-5 text-center md:text-left space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase border shadow-2xs">
                    {isPassed ? (
                      <span className="text-emerald-700 bg-emerald-50 border-emerald-300 flex items-center gap-1.5">
                        <Sparkles className="size-4 text-emerald-600" /> ĐẠT KẾT QUẢ SÁT HẠCH
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-50 border-red-300 flex items-center gap-1.5">
                        <XCircle className="size-4 text-red-600" /> CHƯA ĐẠT YÊU CẦU
                      </span>
                    )}
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {activeResult.scorePercent}%
                  </h2>

                  <p className="text-xs text-slate-500 font-medium">
                    Đạt <strong className="text-slate-900 font-bold">{correctCount} / {totalCount}</strong> câu đúng (Điểm yêu cầu: {selectedExam.passingScorePercent}%)
                  </p>
                </div>

                {/* Stats Breakdown */}
                <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Thời gian làm bài</span>
                    <div className="text-lg font-bold text-slate-900 font-mono">
                      {Math.floor(durationSecs / 60)}m {durationSecs % 60}s
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Bộ đề thi</span>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {activeResult.examTitle}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Loại chứng chỉ</span>
                    <div className="text-xs font-bold text-teal-700">
                      {activeResult.certificateType}
                    </div>
                  </div>
                </div>

              </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 mt-6 border-t border-slate-100">
              <Button
                onClick={() => handleStartExam(selectedExam)}
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs h-10 px-6 rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="size-4" />
                Thi lại đề này
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode("list")}
                className="w-full sm:w-auto border-slate-200 text-slate-700 font-bold text-xs h-10 px-6 rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Chọn đề thi khác
              </Button>
            </div>
          </Card>

          {/* DETAILED QUESTION REVIEW STREAM */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="size-5 text-teal-600" />
                  Xem lại Chi tiết Đáp án Đúng / Sai
                </h3>
                <p className="text-xs text-slate-500">Đối chiếu đáp án đã chọn và giải thích chi tiết cho từng câu hỏi</p>
              </div>

              {/* Review Filter */}
              <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setReviewFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tất cả ({selectedExam.questions.length})
                </button>
                <button
                  onClick={() => setReviewFilter("correct")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "correct" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Câu đúng
                </button>
                <button
                  onClick={() => setReviewFilter("incorrect")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    reviewFilter === "incorrect" ? "bg-red-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Câu sai / Chưa làm
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {selectedExam.questions.map((q, idx) => {
                const userAns = userAnswersMap[q.id];
                const isCorrect = userAns === q.correctOption;

                if (reviewFilter === "correct" && !isCorrect) return null;
                if (reviewFilter === "incorrect" && isCorrect) return null;

                return (
                  <Card key={q.id || idx} className="p-6 bg-white border-slate-200 shadow-xs rounded-2xl space-y-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-900 text-white font-bold text-xs py-0.5 px-2.5">
                          Câu {idx + 1}
                        </Badge>
                        {q.type && (
                          <Badge variant="outline" className="text-[10px] font-semibold border-slate-200">
                            {q.type}
                          </Badge>
                        )}
                      </div>

                      <Badge
                        className={`text-[10px] font-bold px-2.5 py-0.5 border-none ${
                          isCorrect
                            ? "bg-emerald-100 text-emerald-800"
                            : userAns
                            ? "bg-red-100 text-red-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {isCorrect ? "✓ Trả lời Đúng" : userAns ? "✗ Trả lời Sai" : "— Chưa trả lời"}
                      </Badge>
                    </div>

                    {/* Context if present */}
                    {q.context && (
                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950 italic">
                        <strong>Tình huống:</strong> {q.context}
                      </div>
                    )}

                    {/* Question Content */}
                    <h4 className="font-bold text-slate-900 text-sm leading-relaxed">
                      {q.content}
                    </h4>

                    {/* Options list review */}
                    {(!q.type || q.type === "Trắc nghiệm" || q.type === "Tình huống") && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt) => {
                          const isUserChoice = userAns === opt.key;
                          const isCorrectOption = q.correctOption === opt.key;

                          let style = "bg-slate-50 border-slate-200 text-slate-700";
                          if (isCorrectOption) {
                            style = "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold ring-1 ring-emerald-400/30";
                          } else if (isUserChoice && !isCorrectOption) {
                            style = "bg-red-50 border-red-300 text-red-950 font-bold";
                          }

                          return (
                            <div key={opt.key} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold shrink-0">{opt.key}.</span>
                                <span>{opt.text}</span>
                              </div>
                              {isCorrectOption && (
                                <Badge className="bg-emerald-600 text-white text-[9px] font-bold py-0 h-4 border-none">
                                  Đáp án đúng
                                </Badge>
                              )}
                              {isUserChoice && !isCorrectOption && (
                                <Badge className="bg-red-600 text-white text-[9px] font-bold py-0 h-4 border-none">
                                  Lựa chọn của bạn
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-950 space-y-1">
                        <strong className="block font-bold text-blue-800 text-[11px] uppercase tracking-wider">
                          💡 Giải thích chi tiết:
                        </strong>
                        <p className="leading-relaxed">{q.explanation}</p>
                      </div>
                    )}

                  </Card>
                );
              })}
            </div>
          </section>
        </main>
      );
    })()}

      <Footer />
    </div>
  );
}
