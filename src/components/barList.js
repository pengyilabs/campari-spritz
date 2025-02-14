export const insertBarListMobileLogic = () => {
  const findABarSection = document.querySelector("#find-a-bar-section");
  const swipeContainer = document.querySelector("#swipe-container");
  const handleBar = document.querySelector("#handle-bar");
  const barList = document.querySelector("#bar-list-mobile");

  let isExpanded = false;
  const POSITIONS = {
    COLLAPSED: "75vh",
    EXPANDED: "0vh",
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
    // barList.style.overflowY = "scroll";
  };

  const collapseList = () => {
    isExpanded = false;
    swipeContainer.style.top = POSITIONS.COLLAPSED;
    // barList.style.overflowY = "hidden";
  };

  /* The code above could be reduced to simplify the process, but just in case we want to revert these changes, this logic will be enough */
  barList.addEventListener("touchend", () => !isExpanded && expandList());
  handleBar.addEventListener("touchend", toggleList);
};
