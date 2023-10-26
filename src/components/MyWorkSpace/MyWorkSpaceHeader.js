import { SELECTOR } from "../../constants/selector.js";
import { TAG } from "../../constants/tag.js";
import { PATH } from "../../routes/path.js";
import { navigate } from "../../routes/router.js";
import { postDocument } from "../../service/documents.js";
import { createCustomElement } from "../../utils/dom.js";
import { IconSVG } from "../Common/IconSVG.js";

export default function MyWorkSpaceHeader({ $target, updateAllDocuments }) {
  const $myWorkSpaceTitle = createCustomElement({
    tag: TAG.SPAN,
    props: {
      textContent: "개인 페이지",
    },
  });

  const $myWorkSpaceAddBtn = createCustomElement({
    tag: TAG.BUTTON,
    props: {
      innerHTML: IconSVG.add,
    },
  });

  const $myWorkSpaceHeader = createCustomElement({
    tag: TAG.DIV,
    props: {
      id: SELECTOR.HEADER.MY_WORKSPACE,
    },
    children: [$myWorkSpaceTitle, $myWorkSpaceAddBtn],
  });

  $target.appendChild($myWorkSpaceHeader);

  $myWorkSpaceAddBtn.addEventListener("click", async (event) => {
    const createdPost = await postDocument({ title: "" });
    navigate(`${PATH.DOCUMENTS}/${createdPost.id}`);

    updateAllDocuments();
  });
}