export const insertBarListMobileLogic = () => {
  const swipeContainer = document.querySelector('#swipe-container');
  const dragHandle = document.querySelector('#drag-handle');
  const barList = document.querySelector("#bar-list-mobile");
  let startY = 0;
  let currentY = 0;
  let initialTop = 0;
  
  const STATES = {
    COLLAPSED: 'collapsed',
    EXPANDED: 'expanded',
    DRAGGING: 'dragging'
  };
  
  let currentState = STATES.EXPANDED;
  
  const POSITIONS = {
    COLLAPSED: '90%',
    EXPANDED: '0%'
  };
  
  const handleStart = (event) => {
    startY = event.touches[0].clientY;
    initialTop = parseFloat(window.getComputedStyle(swipeContainer).top);
    currentState = STATES.DRAGGING;
    
    swipeContainer.style.transition = 'none';
  }
  
  function handleMove(event) {
    if (currentState !== STATES.DRAGGING) return;
    
    currentY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Limitar el movimiento entre 0 y 90% del viewport height
    const newTop = Math.max(0, Math.min(initialTop + deltaY, window.innerHeight * 0.9));
    swipeContainer.style.top = `${newTop}px`;
  }
  
  function handleEnd() {
    if (currentState !== STATES.DRAGGING) return;
    
    swipeContainer.style.transition = 'top 0.3s ease';
    const currentTop = parseFloat(window.getComputedStyle(swipeContainer).top);
    
    // Determine if expand or collapse according to position
    if (currentTop < window.innerHeight * 0.45) {
      expandList();
      barList.style.overflowY = "scroll";
      console.log("expanded")
  } else {
      collapseList();
      barList.style.overflowY = "hidden";
      console.log("collapsed")
  }
    
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
  }
  
  function expandList() {
    currentState = STATES.EXPANDED;
    swipeContainer.style.top = POSITIONS.EXPANDED;
  }
  
  function collapseList() {
    currentState = STATES.COLLAPSED;
    swipeContainer.style.top = POSITIONS.COLLAPSED;
  }
  
  // Event Listeners
  dragHandle.addEventListener('touchstart', handleStart);
  document.addEventListener('touchmove', handleMove);
  document.addEventListener('touchend', handleEnd);
  
  // Click en el handle para alternar estados
  dragHandle.addEventListener('click', () => {
    if (currentState === STATES.COLLAPSED) {
      expandList();
    } else if (currentState === STATES.EXPANDED) {
      collapseList();
    }
  });
}