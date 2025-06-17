export function setupPostUserLogic() {
  const searchInput = document.getElementById("searchInput");
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const sortDateBtn = document.getElementById("sortDate");
  const sortViewsBtn = document.getElementById("sortViews");

  let sortAscDate = true;
  let sortAscViews = true;

  // 검색 기능
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const filter = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll("#postTable tbody tr");
      rows.forEach((row) => {
        const title = row.cells[1].textContent.toLowerCase();
        row.style.display = title.includes(filter) ? "" : "none";
      });
    });
  }

  // 삭제 확인
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      if (window.confirm("정말 이 게시물을 삭제하시겠습니까?")) {
        this.closest("tr").remove();
      }
    });
  });

  // 작성일 정렬
  if (sortDateBtn) {
    sortDateBtn.addEventListener("click", () => {
      sortTable(2, "date", sortAscDate);
      sortAscDate = !sortAscDate;
    });
  }

  // 조회수 정렬
  if (sortViewsBtn) {
    sortViewsBtn.addEventListener("click", () => {
      sortTable(3, "number", sortAscViews);
      sortAscViews = !sortAscViews;
    });
  }

  function sortTable(colIndex, type, asc) {
    const tbody = document.querySelector("#postTable tbody");
    const rows = Array.from(tbody.rows);

    rows.sort((a, b) => {
      let valA, valB;
      if (type === "date") {
        valA = new Date(a.cells[colIndex].dataset.date);
        valB = new Date(b.cells[colIndex].dataset.date);
      } else {
        valA = parseInt(a.cells[colIndex].textContent);
        valB = parseInt(b.cells[colIndex].textContent);
      }
      return asc ? valA - valB : valB - valA;
    });

    rows.forEach((row) => tbody.appendChild(row));
  }
}
