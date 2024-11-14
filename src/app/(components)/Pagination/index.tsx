"use client";
import React, { useState } from "react";
import { paginationData } from "@/utils/utils";

type Props = {
  data: any[];
  itemsPerPage: number;
};

const Pagination = ({ data, itemsPerPage }: Props) => {
  const [page, setPage] = useState(1);

  // Dữ liệu được phân trang dựa vào trang hiện tại và số item mỗi trang
  const paginatedData = paginationData(data, page, itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div>
      <ul>
        {paginatedData.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Điều hướng phân trang */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= Math.ceil(data.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
