export const insertBarListMobileLogic = () => {
  const swipeContainer = document.getElementById('swipe-container');
  const dragHandle = document.getElementById('drag-handle');

  let startY = 0;
  let currentY = 0;
  let initialTransform = 0;

  const STATES = {
    COLLAPSED: 'collapsed',
    EXPANDED: 'expanded',
    DRAGGING: 'dragging'
  };

  let currentState = STATES.EXPANDED;
  const POSITIONS = {
    COLLAPSED: '90%',
    EXPANDED: '0px'
  };

  const handleStart = (event) => {
    startY = event.type === 'mousedown' ? event.clientY : event.touches[0].clientY;
    initialTransform = getTransformValue();
    currentState = STATES.DRAGGING;
    
    // Add listeners to movement and end
    if (event.type === 'mousedown') {
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }
    
    swipeContainer.style.transition = 'none';
}

  function handleMove(event) {
    if (currentState !== STATES.DRAGGING) return;
    
    currentY = event.type === 'mousemove' ? event.clientY : event.touches[0].clientY;
    const deltaY = currentY - startY;
    
    // Limitar el movimiento
    const newTransform = Math.max(0, Math.min(initialTransform + deltaY, window.innerHeight - 80));
    swipeContainer.style.transform = `translateY(${newTransform}px)`;
  }

  function handleEnd() {
    if (currentState !== STATES.DRAGGING) return;
    
    swipeContainer.style.transition = 'transform 0.3s ease';
    const currentTransform = getTransformValue();
    
    // Determinar si expandir o colapsar basado en la posición y velocidad
    if (currentTransform < window.innerHeight * 0.5) {
        expandList();
    } else {
        collapseList();
    }
    
    // Remover listeners de movimiento
    document.removeEventListener('mousemove', handleMove);
    document.removeEventListener('mouseup', handleEnd);
  }

  function getTransformValue() {
    const transform = window.getComputedStyle(swipeContainer).transform;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m42; // "Y" value of the transformation
  }

  function expandList() {
    currentState = STATES.EXPANDED;
    swipeContainer.style.transform = `translateY(${POSITIONS.EXPANDED})`;
  }

  function collapseList() {
    currentState = STATES.COLLAPSED;
    swipeContainer.style.transform = `translateY(${POSITIONS.COLLAPSED})`;
  }

  // Event Listeners
  dragHandle.addEventListener('mousedown', handleStart);
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