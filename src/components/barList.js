export const insertBarListMobileLogic = () => {
  const swipeContainer = document.querySelector('#swipe-container');
  let isExpanded = false;
  const POSITIONS = {
    COLLAPSED: '90%',
    EXPANDED: '0%'
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
  }

  const expandList = () => {
    isExpanded = true;
    swipeContainer.style.top = POSITIONS.EXPANDED;
  }
  
  const collapseList = () => {
    isExpanded = false;
    swipeContainer.style.top = POSITIONS.COLLAPSED;
  }

  document.addEventListener('touchend', handleEnd);
}