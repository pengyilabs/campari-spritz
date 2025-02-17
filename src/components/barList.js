/* Deprecated */
export const insertBarListMobileLogic = () => {
  const findABarSection = document.querySelector("#find-a-bar-section");
  const swipeContainer = document.querySelector("#swipe-container");
  const handleBar = document.querySelector("#handle-bar");
  const barList = document.querySelector("#bar-list-mobile");

  let isExpanded = false;
  const POSITIONS = {
    COLLAPSED: "85%",
    EXPANDED: "0%",
  };

  const handleEnd = () => {
    toggleList();
  };

  const toggleList = () => {
    if (isExpanded === false) {
      expandList();
    } else {
      collapseList();
    }
  };

  const expandList = () => {
    isExpanded = true;
    swipeContainer.style.top = POSITIONS.EXPANDED;
    barList.style.overflowY = "scroll";
    findABarSection.classList.add("shadow-bottom-hide");
  };

  const collapseList = () => {
    isExpanded = false;
    swipeContainer.style.top = POSITIONS.COLLAPSED;
    barList.style.overflowY = "hidden";
    findABarSection.classList.remove("shadow-bottom-hide");
  };

  handleBar.addEventListener("touchend", handleEnd);
};
