import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-4">
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 border rounded ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => onPageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
