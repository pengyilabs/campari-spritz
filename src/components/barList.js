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
    swipeContainer.classList.remove("bounce-barlist");
  };

  const collapseList = () => {
    isExpanded = false;
    swipeContainer.style.top = POSITIONS.COLLAPSED;
    barList.style.overflowY = "hidden";
    findABarSection.classList.remove("shadow-bottom-hide");
  };

  /* The code above could be reduced to simplify the process, but just in case we want to revert these changes, this logic will be enough */
  barList.addEventListener("touchend", () => !isExpanded && expandList());
  handleBar.addEventListener("touchend", toggleList);

  /* add bouncing animation */
  swipeContainer.classList.add("bounce-barlist");
};
