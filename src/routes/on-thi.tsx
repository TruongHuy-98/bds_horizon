import { createFileRoute, Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/site/Header";

import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import feature1 from "@/assets/news-feature-1.jpg";

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

export default function OnThiPage() {
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

  const history = [
    {
      time: "14:20 Hôm nay",
      duration: "30 Phút",
      title: "Thi thử Tổng hợp #12",
      score: "36/40",
      status: "ĐẠT",
    },
    {
      time: "Hôm qua",
      duration: "15 Phút",
      title: "Kinh doanh Bất động sản",
      score: "18/30",
      status: "TRƯỢT",
    },
    {
      time: "2 ngày trước",
      duration: "60 Phút",
      title: "Đề thi Mô phỏng Bộ Xây Dựng",
      score: "72/80",
      status: "ĐẠT",
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
    <div className="min-h-screen bg-slate-50/50">
      <Header />

      <main className="container-page py-10">
        {/* Title Banner Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-200 pb-8 mb-10">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B396E] tracking-tight">
              Trung tâm Ôn thi Chứng chỉ BĐS
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Cổng thông tin luyện thi chuyên nghiệp cho môi giới và nhà đầu tư tại Đà Nẵng. Hệ thống
              câu hỏi bám sát thực tế và quy hoạch mới nhất.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200/80 rounded-2xl p-4 text-right shrink-0">
            <div className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
              Kỳ thi tiếp theo
            </div>
            <div className="text-2xl font-black text-red-600 mt-1">14 Ngày Còn Lại</div>
          </div>
        </div>

        {/* Top Dash Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Lộ trình */}
          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Lộ trình học
              </span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-black text-slate-900">68% Hoàn thành</div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "68%" }} />
              </div>
            </div>
          </div>

          {/* Điểm trung bình */}
          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
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

          {/* Câu hỏi đã ôn */}
          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[140px]">
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
                href="#"
                className="text-xs font-bold text-primary flex items-center gap-1 mt-2 hover:underline"
              >
                Tiếp tục học <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Phòng luyện thi */}
          <div className="bg-[#0B396E] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-24 w-24" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                Phòng luyện thi
              </span>
              <h3 className="text-lg font-bold mt-1">Thi thử mô phỏng</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Trải nghiệm áp lực phòng thi với bộ đề chuẩn từ Sở Xây dựng Đà Nẵng.
              </p>
            </div>
            <div className="mt-4 space-y-2 relative z-10">
              <button className="w-full bg-white text-slate-900 font-bold text-xs py-2 px-3 rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                <Clock className="h-3.5 w-3.5" /> 30 Phút - 40 Câu
              </button>
              <button className="w-full bg-transparent border border-white/40 text-white font-bold text-xs py-2 px-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> 60 Phút - 80 Câu
              </button>
            </div>
          </div>
        </div>

        {/* Ngân hàng câu hỏi section */}
        <section className="mb-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Ngân hàng câu hỏi</h2>
            <a href="#" className="text-xs font-bold text-primary hover:underline">
              Xem tất cả chuyên mục
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((c) => (
              <div
                key={c.title}
                className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group"
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
                    <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {c.desc}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-3">
                    <span className="text-[11px] font-bold text-slate-500">{c.footer}</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom split section: Lịch sử & Bảng xếp hạng */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lịch sử luyện tập */}
          <div className="lg:col-span-2 bg-white border border-slate-200/70 rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900">Lịch sử luyện tập gần đây</h2>
              <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-500 border border-slate-200">
                <Filter className="h-4 w-4" />
              </button>
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
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-slate-900">{h.time}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{h.duration}</div>
                      </td>
                      <td className="py-4 font-bold text-slate-900">{h.title}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                            h.status === "ĐẠT"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                              : "bg-red-50 text-red-600 border border-red-200/50"
                          }`}
                        >
                          {h.status === "ĐẠT" ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5" />
                          )}
                          {h.score} {h.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs font-bold border-slate-200 hover:bg-slate-50"
                        >
                          Review Errors
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng xếp hạng */}
          <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm flex flex-col justify-between overflow-hidden">
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
                          className="h-10 w-10 object-cover rounded-full border-2 border-white shadow-sm"
                        />
                        <span
                          className={`absolute -top-1.5 -left-1.5 h-5 w-5 rounded-full text-[10px] font-black grid place-items-center border border-white text-white shadow-sm ${
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

            <button className="w-full py-4 text-xs font-bold text-primary border-t border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              Xem toàn bộ bảng xếp hạng
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
