import EditorFooterBar from "./EditorFooterBar.js";
import EditorStyle from "./EditorStyle.js";
import { push } from "./router.js";

export default function DocumentEditor({ $target, initialState, onEditing }) {
  const $editor = document.createElement("div");

  this.state = initialState;

  let isinitialized = true;
  let lines = "";
  $editor.innerHTML = `
  
            <div class="editorDiv" >
              <h1><div contenteditable="true" name="title" placeholder="제목 없음" style="padding: 16px 24px;
        border-radius: 4px;">${this.state.title}</div></h1>
              <div contenteditable="true" name="content" style="display:block;width:600px;padding: 16px 24px;
        
        border-radius: 4px;">${this.state.content}</div>
            </div>
          `;

  $target.appendChild($editor);

  this.setState = (nextState) => {
    //아래 render를 한번만 하게되면 다른 문서를 클릭했을 때 새로운 데이터가 안그려지는 현상 해결
    if (this.state.id !== nextState.id) {
      isinitialized = true;
    }
    this.state = nextState;
    //render를 한번만 함으로써 커서가 계속 앞으로 가는 현상 해결
    if (isinitialized) {
      this.render();
      isinitialized = false;
    }
  };

  // 타이핑할 때마다 setState -> state값을 쿼리로 editable에 넣음
  // 타이핑 -> 2초후 setState -> state값을 쿼리로 editabledp 넣음 -> 2초 후에 커서가 다시 앞으로오겠지?>

  this.render = () => {
    const documentList =
      this.state.documentList &&
      this.state.documentList.map((document) => {
        return { id: document.id, title: document.title };
      });
    lines =
      this.state.content == null
        ? ""
        : this.state.content
            .split(/<div>|<\/div>|<br>/)
            .map((line) => {
              if (line.indexOf("# ") === 0) {
                return `<h1>${line.substring(2)}</h1>`;
              } else if (line.indexOf("## ") === 0) {
                return `<h2>${line.substring(3)}</h2>`;
              } else if (line.indexOf("### ") === 0) {
                return `<h3>${line.substring(4)}</h3>`;
              } else if (documentList.find((el) => el.title === line)) {
                const linkIndex = documentList.findIndex(
                  (doc) => doc.title === line
                );
                //contenteditable="false" 속성을 넣어서 링크버튼으로 변하면 버튼안의 텍스트를 편집 못하게 함
                return `<button contenteditable="false" id=${documentList[linkIndex].id} class="textLink" style="color:blue;cursor:pointer; readonly">@${line}</button>`;
              }
              return line;
            })
            .join("<br>");

    $editor.querySelector("[name=title]").innerHTML = this.state.title;
    $editor.querySelector("[name=content]").innerHTML = lines;
  };

  this.render();

  $editor.addEventListener("input", (e) => {
    const { target } = e;
    const name = target.getAttribute("name");
    if (this.state[name] !== undefined) {
      const nextState = {
        ...this.state,
        [name]: target.innerHTML,
      };
      this.setState(nextState);
      onEditing(this.state);
    }
  });
  $editor.addEventListener("click", (e) => {
    if (e.target.className === "textLink") {
      push(`${e.target.id}`);
    }
  });

  const editorStyle = new EditorStyle({
    $target: document.querySelector(".editorDiv"),
    onStyle: (style) => {
      document.execCommand(style);
      $editor.focus({ preventScroll: true });
    },
  });
}
