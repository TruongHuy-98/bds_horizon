import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ListPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  // Build array of pages with ellipsis
  const getPageNumbers = () => {
    const delta = 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Phân trang"
      className={`mt-8 flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      {/* First Page */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/70 bg-card disabled:opacity-40"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        title="Trang đầu"
        aria-label="Trang đầu"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>

      {/* Prev */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/70 bg-card disabled:opacity-40"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Trang trước"
        aria-label="Trang trước"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Number Buttons */}
      {pages.map((p, idx) =>
        typeof p === "number" ? (
          <button
            key={idx}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-9 min-w-9 px-3 rounded-lg text-xs font-semibold border transition-all ${
              currentPage === p
                ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                : "bg-card text-foreground/80 border-border/70 hover:border-primary/50 hover:bg-muted"
            }`}
            aria-current={currentPage === p ? "page" : undefined}
          >
            {p}
          </button>
        ) : (
          <span key={idx} className="px-2 text-xs text-muted-foreground select-none">
            {p}
          </span>
        )
      )}

      {/* Next */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/70 bg-card disabled:opacity-40"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Trang sau"
        aria-label="Trang sau"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-lg border-border/70 bg-card disabled:opacity-40"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        title="Trang cuối"
        aria-label="Trang cuối"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

