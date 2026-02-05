import styles from "./Pagination.module.css";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      if (currentPage <= 3) end = 5;
      if (currentPage >= totalPages - 2) start = totalPages - 4;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.pagination}>
      <button className={styles.arrow} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>&lt;</button>
      {visiblePages[0] > 1 && <>
        <button className={styles.page} onClick={() => onPageChange(1)}>1</button>
        <span className={styles.dots}>...</span>
      </>}
      {visiblePages.map((page) => (
        <button key={page} className={`${styles.page} ${currentPage === page ? styles.active : ""}`} onClick={() => onPageChange(page)}>
          {page}
        </button>
      ))}
      {visiblePages[visiblePages.length - 1] < totalPages && <>
        <span className={styles.dots}>...</span>
        <button className={styles.page} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
      </>}
      <button className={styles.arrow} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>&gt;</button>
    </div>
  );
}

export default Pagination;