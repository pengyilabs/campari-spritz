export const insertBarListMobileLogic = () => {
  const swipeContainer = document.querySelector('#swipe-container');
  const handleBar = document.querySelector('#handle-bar');
  let isExpanded = false;
  const POSITIONS = {
    COLLAPSED: '85%',
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

  handleBar.addEventListener('touchend', handleEnd);
}