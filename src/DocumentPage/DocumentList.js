import { push } from "../router.js";

export default function DocumentList({ $target, initialState, onDelete }) {
  const $documentList = document.createElement("div");
  $target.appendChild($documentList);

  this.state = initialState;

  // nextState로 변경 후 상태에 따라 그리기
  this.setState = (nextState) => {
    this.state = nextState;
    this.render();
  };

  this.render = () => {
    $documentList.innerHTML = `
    <ul>
      <li data-id="new" class="document-item">새로운 문서 추가하기 +</li>
      ${this.state
        .map(({ id, title }) => {
          return `<li data-id=${id} class="document-item">${title}<img class="delete-btn" src="/src/assets/img/delete.png"/></li>`;
        })
        .join("")}
      </ul>`;
  };

  // 문서 리스트 클릭 시 /documents/${id}로 url 바꿈
  $documentList.addEventListener("click", (e) => {
    const $li = e.target.closest("li");

    if ($li) {
      const { id } = $li.dataset;

      // delete 버튼 클릭 시
      if (e.target.classList.contains("delete-btn")) {
        onDelete(id);
        return;
      }

      push(`/documents/${id}`); // 이벤트 dispatch
    }
  });
}
