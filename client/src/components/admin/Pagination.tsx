import React from "react";
interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
}

export default function Pagination({ page, totalPages, setPage }: PaginationProps) {
    return (
        <div className="p-5 border-t-2 border-dreamxec-navy/10 flex justify-between items-center bg-gray-50/50">
            <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-dreamxec-navy hover:text-dreamxec-navy disabled:opacity-50 disabled:hover:border-gray-200 font-bold text-sm text-gray-600 shadow-sm transition-all"
            >
                &larr; Previous
            </button>
            <span className="text-sm font-bold text-dreamxec-navy font-sans bg-white px-4 py-2 rounded-lg border-2 border-gray-200 shadow-sm">
                Page {page} of {Math.max(1, totalPages)}
            </span>
            <button
                disabled={page >= totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-lg hover:border-dreamxec-navy hover:text-dreamxec-navy disabled:opacity-50 disabled:hover:border-gray-200 font-bold text-sm text-gray-600 shadow-sm transition-all"
            >
                Next &rarr;
            </button>
        </div>
    )
}