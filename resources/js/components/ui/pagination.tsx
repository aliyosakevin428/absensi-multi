import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type PaginationProps = {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, lastPage, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5; // Jumlah tombol halaman yang ditampilkan

    if (lastPage <= maxPagesToShow) {
      // Jika total halaman kecil, tampilkan semua
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      // Selalu tampilkan halaman pertama
      pages.push(1);

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(lastPage - 1, currentPage + 1);

      if (startPage > 2) pages.push('…');
      for (let i = startPage; i <= endPage; i++) pages.push(i);
      if (endPage < lastPage - 1) pages.push('…');

      // Selalu tampilkan halaman terakhir
      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-1">
      {/* Tombol Previous */}
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        size="sm"
        className="rounded-l-md px-2"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Tombol nomor halaman */}
      {getPageNumbers().map((page, index) =>
        page === '…' ? (
          <span key={index} className="px-2 text-sm text-gray-500">
            …
          </span>
        ) : (
          <Button
            key={index}
            onClick={() => onPageChange(Number(page))}
            variant={page === currentPage ? 'default' : 'outline'}
            size="sm"
            className="px-3"
          >
            {page}
          </Button>
        )
      )}

      {/* Tombol Next */}
      <Button
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        size="sm"
        className="rounded-r-md px-2"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};
