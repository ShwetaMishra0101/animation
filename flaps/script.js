// Calculate the available screen area for the flaps
const getAvailableScreenArea = () => {
  const sidebarWidth = 200; // Width of the left sidebar (doc area)
  const availableWidth = window.innerWidth - sidebarWidth;
  const availableHeight = window.innerHeight;
  return {
    width: availableWidth,
    height: availableHeight,
  };
};

// Calculate the dimensions for the flaps based on the available screen area
const calculateFlapDimensions = () => {
  const availableArea = getAvailableScreenArea();
  const minWidth = Math.floor(availableArea.width * 0.2);
  const maxWidth = Math.floor(availableArea.width * 0.3);
  const width = Math.floor(Math.random() * (maxWidth - minWidth + 1)) + minWidth;
  const height = Math.floor(width / 1.5); // Assuming a fixed aspect ratio
  return {
    width: width,
    height: height,
  };
};

// Generate random content for the flaps
const generateRandomContent = () => {
  const contentType = Math.random() < 0.5 ? 'text' : 'image';
  if (contentType === 'text') {
    const fontSize = Math.floor(Math.random() * 20) + 10;
    const text = getRandomText();
    return `<p style="font-size: ${fontSize}px">${text}</p>`;
  } else {
    const imageUrl = getRandomImageUrl();
    return `<img src="${imageUrl}" alt="Random Image" />`;
  }
};

// Get random lorem ipsum text
const getRandomText = () => {
  const loremIpsum = [
    'Lorem ipsum dolor sit amet',
    'consectetur adipiscing elit',
    'sed do eiusmod tempor incididunt',
    'ut labore et dolore magna aliqua',
    'Ut enim ad minim veniam',
    'quis nostrud exercitation ullamco laboris',
    'nisi ut aliquip ex ea commodo consequat',
  ];
  return loremIpsum[Math.floor(Math.random() * loremIpsum.length)];
};

// Get random image URL
const getRandomImageUrl = () => {
  const imageUrls = [
    'https://via.placeholder.com/150',
    'https://via.placeholder.com/200',
    'https://via.placeholder.com/250',
    'https://via.placeholder.com/300',
  ];
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
};

// Create and animate flaps based on data
const createAndAnimateFlaps = () => {
  const data = generateRandomData();
  const { id, width, height, x, y, color, content } = data;

  const flap = document.createElement('div');
  flap.id = id;
  flap.className = 'flap';
  flap.style.width = `${width}px`;
  flap.style.height = `${height}px`;
  flap.style.left = `${x}px`;
  flap.style.top = `${y}px`;
  flap.style.backgroundColor = color;
  flap.innerHTML = content;

  // Add close button
  const closeButton = document.createElement('div');
  closeButton.className = 'close-button';
  closeButton.innerHTML = 'X';
  flap.appendChild(closeButton);

  // Attach event listener to close button
  closeButton.addEventListener('click', () => {
    moveFlapToDocArea(flap);
  });

  document.body.appendChild(flap);

  gsap.from(flap, {
    duration: 1,
    scale: 0,
    opacity: 0,
    ease: 'back.out(1.7)',
  });
  openFlaps.push(flap)
  Draggable.create(flap, { type: 'x,y', edgeResistance: 0.65 });
};

// Generate random JSON data for flaps
const generateRandomData = () => {
  const id = `flap${Math.floor(Math.random() * 100) + 1}`;
  const { width, height } = calculateFlapDimensions();
  const availableArea = getAvailableScreenArea();
  const x = Math.floor(Math.random() * (availableArea.width - width));
  const y = Math.floor(Math.random() * (availableArea.height - height));
  const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const content = generateRandomContent();
  const focusPriority = Math.floor(Math.random() * 91) + 10; 

  return {
    id: id,
    width: width,
    height: height,
    x: x,
    y: y,
    color: color,
    content: content,
    focusPriority: focusPriority,
  };
};

// Move a flap to the doc area and minimize it
const moveFlapToDocArea = (flap) => {
  const docArea = document.getElementById('doc-area');
  flap.classList.add('minimized');
  docArea.appendChild(flap);
};

// Find the flap with the lowest focus_priority among the opened flaps
const findFlapWithLowestPriority = () => {
  const lowestPriorityFlap = openFlaps.reduce((prevFlap, currFlap) => {
    return prevFlap.focusPriority < currFlap.focusPriority ? prevFlap : currFlap;
  });
  return lowestPriorityFlap;
};

// Generate and animate flaps periodically
const generateAndAnimateFlapsPeriodically = () => {
  createAndAnimateFlaps();

  setInterval(() => {
    if (openFlaps.length < 3) {
      createAndAnimateFlaps();
    }else{
      createAndAnimateFlaps();
    }
    console.log(openFlaps.length)
  }, 2000);
};

// Initialize the app
const initialize = () => {
  generateAndAnimateFlapsPeriodically();
};

// Keep track of open flaps
const openFlaps = [];

// Run the app
initialize();
