import React, { useState, useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  Eye,
  Code2,
  Undo,
  Redo,
  RemoveFormatting,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Soạn thảo nội dung bài báo chi tiết tại đây...",
}: RichTextEditorProps) {
  const [mode, setMode] = useState<"visual" | "html">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlCode, setHtmlCode] = useState(value);

  // Dialog states
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [tableOpen, setTableOpen] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  // Sync internal editor content when props value changes from outside
  useEffect(() => {
    setHtmlCode(value || "");
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (command: string, value: string | undefined = undefined) => {
    if (mode === "html") return;
    document.execCommand(command, false, value);
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtmlCode(newHtml);
      onChange(newHtml);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtmlCode(newHtml);
      onChange(newHtml);
    }
  };

  const handleHtmlCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newHtml = e.target.value;
    setHtmlCode(newHtml);
    onChange(newHtml);
    if (editorRef.current) {
      editorRef.current.innerHTML = newHtml;
    }
  };

  // Link Insertion
  const handleInsertLink = () => {
    if (!linkUrl) return;
    const textToInsert = linkText || linkUrl;
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800 font-medium">${textToInsert}</a>`;
    insertHtmlAtCursor(linkHtml);
    setLinkOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  // Image Insertion
  const handleInsertImage = () => {
    if (!imageUrl) return;
    const imgHtml = `
      <figure class="my-4 text-center">
        <img src="${imageUrl}" alt="${imageAlt || "Hình ảnh bài viết"}" class="max-w-full h-auto rounded-xl mx-auto shadow-md border border-slate-200" />
        ${imageAlt ? `<figcaption class="text-xs text-slate-500 mt-1.5 italic">${imageAlt}</figcaption>` : ""}
      </figure>
    `;
    insertHtmlAtCursor(imgHtml);
    setImageOpen(false);
    setImageUrl("");
    setImageAlt("");
  };

  // Video Insertion
  const handleInsertVideo = () => {
    if (!videoUrl) return;
    let embedUrl = videoUrl;
    if (videoUrl.includes("youtube.com/watch?v=")) {
      const id = videoUrl.split("v=")[1]?.split("&")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    } else if (videoUrl.includes("youtu.be/")) {
      const id = videoUrl.split("youtu.be/")[1]?.split("?")[0];
      embedUrl = `https://www.youtube.com/embed/${id}`;
    }

    const videoHtml = `
      <div class="my-6 aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-black">
        <iframe src="${embedUrl}" class="w-full h-full" allowfullscreen title="Embedded Video"></iframe>
      </div>
    `;
    insertHtmlAtCursor(videoHtml);
    setVideoOpen(false);
    setVideoUrl("");
  };

  // Table Insertion
  const handleInsertTable = () => {
    let rowsHtml = "";
    for (let r = 0; r < tableRows; r++) {
      let colsHtml = "";
      for (let c = 0; c < tableCols; c++) {
        if (r === 0) {
          colsHtml += `<th class="border border-slate-300 bg-slate-100 p-2.5 font-bold text-left text-slate-800">Tiêu đề ${c + 1}</th>`;
        } else {
          colsHtml += `<td class="border border-slate-300 p-2.5 text-slate-700">Nội dung ${r},${c + 1}</td>`;
        }
      }
      rowsHtml += `<tr>${colsHtml}</tr>`;
    }

    const tableHtml = `
      <div class="my-4 overflow-x-auto">
        <table class="w-full border-collapse border border-slate-300 text-sm">
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    `;
    insertHtmlAtCursor(tableHtml);
    setTableOpen(false);
  };

  const insertHtmlAtCursor = (html: string) => {
    if (mode === "html") {
      setHtmlCode((prev) => prev + html);
      onChange(htmlCode + html);
      return;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const div = document.createElement("div");
        div.innerHTML = html;
        const frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = div.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);
        if (lastNode) {
          range.setStartAfter(lastNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        editorRef.current.innerHTML += html;
      }
      handleInput();
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
      {/* TOP HEADER: TOOLBAR & MODE SWITCHER */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2 select-none">
        
        {/* MODE SWITCHER */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode("visual")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              mode === "visual"
                ? "bg-white text-blue-600 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="size-3.5" />
            Thị giác (Visual)
          </button>
          <button
            type="button"
            onClick={() => setMode("html")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
              mode === "html"
                ? "bg-slate-900 text-emerald-400 shadow-xs font-mono font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="size-3.5" />
            Mã HTML
          </button>
        </div>

        {/* VISUAL TOOLBAR BUTTONS */}
        {mode === "visual" && (
          <div className="flex flex-wrap items-center gap-1 text-slate-700">
            
            {/* Format Text Group */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("bold")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600"
                title="In đậm (Ctrl+B)"
              >
                <Bold className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("italic")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600"
                title="In nghiêng (Ctrl+I)"
              >
                <Italic className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("underline")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600"
                title="Gạch chân (Ctrl+U)"
              >
                <Underline className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("strikeThrough")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700 hover:text-blue-600"
                title="Gạch ngang"
              >
                <Strikethrough className="size-4" />
              </button>
            </div>

            {/* Headings */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("formatBlock", "<h1>")}
                className="p-1.5 hover:bg-slate-100 rounded font-bold text-xs"
                title="Tiêu đề H1"
              >
                <Heading1 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("formatBlock", "<h2>")}
                className="p-1.5 hover:bg-slate-100 rounded font-bold text-xs"
                title="Tiêu đề H2"
              >
                <Heading2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("formatBlock", "<h3>")}
                className="p-1.5 hover:bg-slate-100 rounded font-bold text-xs"
                title="Tiêu đề H3"
              >
                <Heading3 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("formatBlock", "<h4>")}
                className="p-1.5 hover:bg-slate-100 rounded font-bold text-xs"
                title="Tiêu đề H4"
              >
                <Heading4 className="size-4" />
              </button>
            </div>

            {/* Quotes & Code */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("formatBlock", "blockquote")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Trích dẫn (Blockquote)"
              >
                <Quote className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("formatBlock", "pre")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Mã nguồn (Code Block)"
              >
                <Code className="size-4" />
              </button>
            </div>

            {/* Alignments */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("justifyLeft")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Căn trái"
              >
                <AlignLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("justifyCenter")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Căn giữa"
              >
                <AlignCenter className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("justifyRight")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Căn phải"
              >
                <AlignRight className="size-4" />
              </button>
            </div>

            {/* Lists */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("insertUnorderedList")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Danh sách không thứ tự (Bullet List)"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("insertOrderedList")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                title="Danh sách có thứ tự (Numbered List)"
              >
                <ListOrdered className="size-4" />
              </button>
            </div>

            {/* Inserts: Link, Image, Video, Table */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => setLinkOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded text-blue-600 hover:bg-blue-50"
                title="Chèn liên kết (Link)"
              >
                <LinkIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setImageOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded text-emerald-600 hover:bg-emerald-50"
                title="Chèn hình ảnh"
              >
                <ImageIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded text-purple-600 hover:bg-purple-50"
                title="Chèn Video / YouTube"
              >
                <Video className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setTableOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded text-amber-600 hover:bg-amber-50"
                title="Chèn Bảng (Table)"
              >
                <TableIcon className="size-4" />
              </button>
            </div>

            {/* Undo / Redo / Clear */}
            <div className="flex items-center bg-white rounded-lg border border-slate-200/80 p-0.5">
              <button
                type="button"
                onClick={() => exec("undo")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                title="Hoàn tác (Ctrl+Z)"
              >
                <Undo className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("redo")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                title="Làm lại (Ctrl+Y)"
              >
                <Redo className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => exec("removeFormat")}
                className="p-1.5 hover:bg-slate-100 rounded text-slate-500"
                title="Xóa định dạng"
              >
                <RemoveFormatting className="size-4" />
              </button>
            </div>

          </div>
        )}
      </div>

      {/* EDITOR WORKSPACE AREA */}
      <div className="min-h-[350px] max-h-[600px] overflow-y-auto relative p-4 bg-white">
        {mode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="outline-none min-h-[320px] prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed focus:outline-none"
            data-placeholder={placeholder}
          />
        ) : (
          <textarea
            value={htmlCode}
            onChange={handleHtmlCodeChange}
            rows={14}
            className="w-full h-full min-h-[320px] font-mono text-xs text-emerald-400 bg-slate-950 p-4 outline-none resize-none leading-relaxed border-0 rounded-lg"
            placeholder="<html>...</html>"
          />
        )}
      </div>

      {/* FOOTER STATS & TIPS */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span>Số từ: <strong className="text-slate-800">{htmlCode.replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length}</strong></span>
          <span>•</span>
          <span>Số ký tự (gồm HTML): <strong className="text-slate-800">{htmlCode.length}</strong></span>
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          Hỗ trợ phím tắt Ctrl+B, Ctrl+I, Ctrl+U và dán nội dung HTML trực tiếp.
        </div>
      </div>

      {/* DIALOG 1: INSERT LINK */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-blue-600">
              <LinkIcon className="size-4" /> Chèn liên kết (Hyperlink)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Đường dẫn URL *</Label>
              <Input
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="text-sm border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Văn bản hiển thị (Anchor Text)</Label>
              <Input
                placeholder="Ví dụ: Bấm vào đây để xem thêm..."
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setLinkOpen(false)}>Hủy</Button>
            <Button onClick={handleInsertLink} className="bg-blue-600 text-white hover:bg-blue-700">Chèn liên kết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: INSERT IMAGE */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-emerald-600">
              <ImageIcon className="size-4" /> Chèn hình ảnh trực tiếp vào bài viết
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Đường dẫn ảnh (URL) *</Label>
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="text-sm border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Chú thích ảnh (Caption & Alt)</Label>
              <Input
                placeholder="Ví dụ: Phối cảnh dự án ven sông Đà Nẵng..."
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setImageOpen(false)}>Hủy</Button>
            <Button onClick={handleInsertImage} className="bg-emerald-600 text-white hover:bg-emerald-700">Chèn hình ảnh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: INSERT VIDEO */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-purple-600">
              <Video className="size-4" /> Nhúng Video / YouTube Iframe
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Link YouTube hoặc URL Video Embed *</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setVideoOpen(false)}>Hủy</Button>
            <Button onClick={handleInsertVideo} className="bg-purple-600 text-white hover:bg-purple-700">Nhúng Video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: INSERT TABLE */}
      <Dialog open={tableOpen} onOpenChange={setTableOpen}>
        <DialogContent className="sm:max-w-md bg-white border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-amber-600">
              <TableIcon className="size-4" /> Chèn Bảng dữ liệu (Table)
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Số hàng (Rows)</Label>
              <Input
                type="number"
                min={1}
                max={20}
                value={tableRows}
                onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                className="text-sm border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Số cột (Columns)</Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={tableCols}
                onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                className="text-sm border-slate-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTableOpen(false)}>Hủy</Button>
            <Button onClick={handleInsertTable} className="bg-amber-600 text-white hover:bg-amber-700">Chèn Bảng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
