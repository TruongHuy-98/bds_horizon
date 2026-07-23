import React, { useState } from "react";
import {
  X,
  Sparkles,
  FileText,
  Copy,
  Trash2,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  FileQuestion,
  Info,
  Check,
  ArrowRight,
  ListOrdered,
  FileSpreadsheet,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import {
  parseRawQuestionsText,
  ParsedQuestion,
  SAMPLE_RAW_QUESTIONS_TEXT,
} from "../../lib/questionParser";

interface SmartQuestionImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  examTitle: string;
  onImportQuestions: (questions: ParsedQuestion[]) => void;
}

export function SmartQuestionImporterModal({
  isOpen,
  onClose,
  examTitle,
  onImportQuestions,
}: SmartQuestionImporterModalProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "lines" | "excel">("paste");
  const [rawText, setRawText] = useState("");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const lineCount = rawText ? rawText.split("\n").length : 0;
  const charCount = rawText.length;

  const handleAnalyze = () => {
    if (!rawText.trim()) {
      toast.error("Vui lòng dán nội dung văn bản câu hỏi trước khi phân tích!");
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      const results = parseRawQuestionsText(rawText);
      setParsedQuestions(results);
      setIsAnalyzing(false);
      if (results.length > 0) {
        toast.success(`Đã tự động nhận diện thành công ${results.length} câu hỏi!`);
      } else {
        toast.warning("Chưa nhận diện được câu hỏi nào. Vui lòng kiểm tra định dạng văn bản.");
      }
    }, 200);
  };

  const handleLoadSample = () => {
    setRawText(SAMPLE_RAW_QUESTIONS_TEXT);
    const results = parseRawQuestionsText(SAMPLE_RAW_QUESTIONS_TEXT);
    setParsedQuestions(results);
    toast.info("Đã tải dữ liệu mẫu thành công!");
  };

  const handleClear = () => {
    setRawText("");
    setParsedQuestions([]);
    toast.info("Đã xóa nhanh nội dung nhập!");
  };

  const handleSaveToBank = () => {
    if (parsedQuestions.length === 0) {
      toast.error("Chưa có câu hỏi nào được phân tích để lưu!");
      return;
    }
    onImportQuestions(parsedQuestions);
    toast.success(`Đã nhập thành công ${parsedQuestions.length} câu hỏi vào bộ đề thi!`);
    onClose();
  };

  // Type counters
  const countTN = parsedQuestions.filter((q) => q.type === "Trắc nghiệm").length;
  const countDS = parsedQuestions.filter((q) => q.type === "Đúng/Sai").length;
  const countTH = parsedQuestions.filter((q) => q.type === "Tình huống").length;
  const countTL = parsedQuestions.filter((q) => q.type === "Tự luận").length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <Card className="max-w-6xl w-full bg-white border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto rounded-2xl">
        
        {/* 1. MODAL HEADER */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Thêm câu hỏi thông minh từ văn bản</h3>
                <Badge className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-semibold">
                  AI Smart Importer
                </Badge>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                Đang mở cho bộ đề: <span className="font-semibold text-slate-200 truncate max-w-md">{examTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("paste")}
              className={`px-4 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === "paste"
                  ? "border-teal-600 text-teal-700 bg-white shadow-sm"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="size-3.5" />
              Dán từ văn bản (Được hỗ trợ)
            </button>
            <button
              disabled
              className="px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed flex items-center gap-1.5 opacity-60"
            >
              <ListOrdered className="size-3.5" />
              Thêm nhiều dòng
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-slate-300 text-slate-400">Sắp ra mắt</Badge>
            </button>
            <button
              disabled
              className="px-4 py-2 text-xs font-medium text-slate-400 cursor-not-allowed flex items-center gap-1.5 opacity-60"
            >
              <FileSpreadsheet className="size-3.5" />
              Import Excel / Word
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-slate-300 text-slate-400">Sắp ra mắt</Badge>
            </button>
          </div>
        </div>

        {/* 3. SHOWCASE CARDS (KHỐI HƯỚNG DẪN 4 DẠNG) */}
        <div className="p-4 bg-slate-50/60 border-b border-slate-200 shrink-0 space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="size-3.5 text-teal-600" /> Trắc nghiệm
                </span>
                <span className="text-[10px] text-slate-400 font-mono">A/B/C/D</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Dòng bắt đầu <code className="bg-slate-100 px-1 rounded font-bold">A.</code>, <code className="bg-slate-100 px-1 rounded font-bold">B.</code>, <code className="bg-slate-100 px-1 rounded font-bold">C.</code>, <code className="bg-slate-100 px-1 rounded font-bold">D.</code> kèm dòng <code className="bg-slate-100 px-1 rounded font-bold">Đáp án: A</code>
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="size-3.5 text-blue-600" /> Đúng / Sai
                </span>
                <span className="text-[10px] text-slate-400 font-mono">a/b/c/d</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Các nhận định con bắt đầu <code className="bg-slate-100 px-1 rounded font-bold">a)</code>, <code className="bg-slate-100 px-1 rounded font-bold">b)</code>, <code className="bg-slate-100 px-1 rounded font-bold">c)</code>, <code className="bg-slate-100 px-1 rounded font-bold">d)</code>
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="size-3.5 text-purple-600" /> Tình huống
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Đoạn văn</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Bắt đầu bằng dòng <code className="bg-slate-100 px-1 rounded font-bold">Đọc tình huống:</code> hoặc <code className="bg-slate-100 px-1 rounded font-bold">Cho đoạn tư liệu:</code>
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <FileQuestion className="size-3.5 text-amber-600" /> Tự luận
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Trình bày</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                Câu hỏi mở, không chứa danh sách lựa chọn A/B/C/D hay a/b/c/d
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-amber-50/70 border border-amber-200/60 p-2 rounded-lg">
            <Info className="size-3.5 text-amber-600 shrink-0" />
            <span>
              <strong>Lưu ý bộ lọc nhiễu:</strong> Hệ thống tự động bỏ qua các dòng tiêu đề như <em>"PHẦN I"</em>, <em>"PHẦN II"</em>, <em>"Thí sinh trả lời từ câu..."</em>.
            </span>
          </div>
        </div>

        {/* 4. SPLIT VIEW WORKSPACE (2 CỘT) */}
        <div className="grid lg:grid-cols-12 flex-1 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* CỘT TRÁI: INPUT TEXTAREA */}
          <div className="lg:col-span-6 p-5 flex flex-col space-y-3 bg-white overflow-y-auto">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileText className="size-4 text-teal-600" />
                Văn bản thô (Dán nội dung vào đây)
              </label>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{lineCount} dòng</span>
                <span>•</span>
                <span>{charCount} ký tự</span>
              </div>
            </div>

            <Textarea
              placeholder={`Dán nội dung câu hỏi từ tài liệu Word, PDF hoặc Text tại đây...\n\nVí dụ:\nCâu 1: Theo Luật Kinh doanh BĐS...\nA. Đáp án A\nB. Đáp án B\nC. Đáp án C\nD. Đáp án D\nĐáp án: A`}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="flex-1 font-mono text-xs bg-slate-50/50 border-slate-200 focus-visible:ring-teal-500/30 min-h-[300px] resize-none leading-relaxed p-3.5"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleLoadSample}
                  className="h-8 text-xs border-teal-200 text-teal-700 hover:bg-teal-50 font-medium"
                >
                  <Copy className="size-3.5 mr-1" />
                  Tải dữ liệu mẫu
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="size-3.5 mr-1" />
                  Xóa nhanh
                </Button>
              </div>

              <Button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md shadow-teal-600/10"
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin size-3.5 border-2 border-t-transparent border-white rounded-full"></span>
                    Đang phân tích...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="size-4" />
                    Phân tích & Xem trước
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* CỘT PHẢI: LIVE PREVIEW CARDS */}
          <div className="lg:col-span-6 p-5 flex flex-col space-y-3 bg-slate-50/40 overflow-hidden">
            
            {/* Header & Stats Badges */}
            <div className="flex items-center justify-between shrink-0 pb-2 border-b border-slate-200">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Xem trước kết quả phân tích ({parsedQuestions.length})
                </h4>
                <p className="text-[11px] text-slate-400">Kiểm tra danh sách trước khi nhập vào bộ đề</p>
              </div>

              {parsedQuestions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] bg-teal-50 text-teal-700 border-teal-200 font-semibold">
                    TN: {countTN}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                    Đ/S: {countDS}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 font-semibold">
                    TH: {countTH}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200 font-semibold">
                    TL: {countTL}
                  </Badge>
                </div>
              )}
            </div>

            {/* Questions Live List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {parsedQuestions.length === 0 ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50 text-slate-400 space-y-2">
                  <Sparkles className="size-10 text-slate-300 stroke-[1.5]" />
                  <p className="font-semibold text-slate-700 text-sm">Chưa có dữ liệu phân tích</p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Dán văn bản ở cột bên trái và bấm <strong>"Phân tích & Xem trước"</strong> hoặc bấm <strong>"Tải dữ liệu mẫu"</strong> để xem hoạt động.
                  </p>
                </div>
              ) : (
                parsedQuestions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2.5">
                    
                    {/* Header & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-900 text-white font-bold text-[10px] py-0.5 px-2">
                          Câu {q.number || idx + 1}
                        </Badge>
                        <Badge
                          className={`text-[10px] font-bold border-none ${
                            q.type === "Trắc nghiệm"
                              ? "bg-teal-100 text-teal-800"
                              : q.type === "Đúng/Sai"
                              ? "bg-blue-100 text-blue-800"
                              : q.type === "Tình huống"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {q.type}
                        </Badge>
                      </div>

                      {q.answer && (
                        <Badge variant="outline" className="text-[10px] font-bold border-emerald-300 bg-emerald-50 text-emerald-800">
                          Đáp án: {q.answer}
                        </Badge>
                      )}
                    </div>

                    {/* Scenario Context if present */}
                    {q.context && (
                      <div className="p-2.5 bg-purple-50/60 border border-purple-100 rounded-lg text-xs text-purple-900 space-y-0.5">
                        <strong className="block text-[10px] text-purple-700 uppercase font-bold">Đoạn văn tình huống:</strong>
                        <p className="italic">{q.context}</p>
                      </div>
                    )}

                    {/* Question Title */}
                    <h5 className="font-bold text-slate-800 text-xs leading-relaxed">
                      {q.title}
                    </h5>

                    {/* Multiple Choice Options (A, B, C, D) */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                        {q.options.map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2 rounded-lg border text-xs flex items-center gap-2 ${
                              q.answer && q.answer.toUpperCase() === opt.key
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                                : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            <span className="font-bold shrink-0">{opt.key}.</span>
                            <span className="line-clamp-2">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* True/False Statements (a, b, c, d) */}
                    {q.subStatements && q.subStatements.length > 0 && (
                      <div className="space-y-1 pt-1 text-xs">
                        {q.subStatements.map((sub) => (
                          <div key={sub.key} className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 flex items-center justify-between">
                            <span><strong>{sub.key})</strong> {sub.text}</span>
                            <Badge variant="outline" className="text-[9px] py-0 h-4 bg-white">Đúng / Sai</Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] text-blue-900">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-2 shrink-0 border-t border-slate-200">
              <Button
                type="button"
                onClick={handleSaveToBank}
                disabled={parsedQuestions.length === 0}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs py-3 h-auto rounded-xl shadow-lg shadow-teal-600/10"
              >
                <Check className="size-4 mr-1.5" />
                Lưu vào Ngân hàng câu hỏi ({parsedQuestions.length} câu)
              </Button>
            </div>

          </div>

        </div>

      </Card>
    </div>
  );
}
