const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for each label
const rotationValues = [
  { minDegree: 0, maxDegree: 45, value: 'A 4 ቅዱስት ስዕላት' },    // Excluded
  { minDegree: 46, maxDegree: 90, value: 'መስቀል የእንጨት' },
  { minDegree: 91, maxDegree: 135, value: 'እንኳን አደረሳችሁ' },
  { minDegree: 136, maxDegree: 180, value: 'ትንሹ ስዕል አድህኖ' },
  { minDegree: 181, maxDegree: 225, value: 'ፍሬም ስዕል አድህኖ' },    // Excluded
  { minDegree: 226, maxDegree: 270, value: 'ክር' },
  { minDegree: 271, maxDegree: 315, value: 'መስቀል የብረት' },
  { minDegree: 316, maxDegree: 360, value: 'ላምኔት የተደረገ ቅዱስት ስዕላት' },
];

// Draw limits for each label
const drawLimit = {
  'A 4 ቅዱስት ስዕላት': 0, // Excluded
  'መስቀል የእንጨት': 40, // 40 times
  'እንኳን አደረሳችሁ': 350, // double number of the rewards times the reward is 160 so this will be 320
  'ትንሹ ስዕል አድህኖ': 20, // 20 times
  'ፍሬም ስዕል አድህኖ': 0, // Excluded
  'ክር': 50, // 50 times
  'መስቀል የብረት': 20, // 20 times
  'ላምኔት የተደረገ ቅዱስት ስዕላት': 30, // 30 times
};

// Count the number of draws for each label
const drawCount = {
  'A 4 ቅዱስት ስዕላት': 0,
  'መስቀል የእንጨት': 0,
  'እንኳን አደረሳችሁ': 0,
  'ትንሹ ስዕል አድህኖ': 0,
  'ፍሬም ስዕል አድህኖ': 0,
  'ክር': 0,
  'መስቀል የብረት': 0,
  'ላምኔት የተደረገ ቅዱስት ስዕላት': 0,
};

// Size of each piece
const data = [30, 30, 30, 30, 30, 30, 30, 30];

// Background color for each piece
var pieColors = [
  "#388E3C", "#005B96", "#388E3C", "#005B96", "#388E3C", "#005B96", "#388E3C", "#005B96",
];

// Create chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ['መስቀል የእንጨት', 'A4 ቅዱሳን ስዕላት', 'ላምኔት የተደረገ ቅቅዱሳን ስዕላት' , 'መስቀል የብረት' , 'ክር' , 'ፍሬም ቅዱሳን ስዕላት' , 'ትንሹ ቅዱሳን ስዕላት' , 'እንኳን አደረሳችሁ'],
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#FFDF00",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 14.5 },
      },
    },
  },
});

// Function to check if the game is over
const checkGameOver = () => {
  return Object.keys(drawLimit).every((key) => drawCount[key] >= drawLimit[key]);
};

// Function to display value based on randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    // Skip labels A 4 ቅዱስት ስዕላት, ፍሬም ስዕል አድህኖ, or any label that has reached its draw limit
    if (i.value === 'A 4 ቅዱስት ስዕላት' || i.value === 'ፍሬም ስዕል አድህኖ' || drawCount[i.value] >= drawLimit[i.value]) {
      continue; // Skip this value
    }

    // If the angleValue is between min and max, display the value
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      // Increment the draw count for this label
      drawCount[i.value] += 1;

      // Check if the game is over after updating the count
      if (checkGameOver()) {
        finalValue.innerHTML = `<p>ጨዋታው ተጠናቋል</p>`;
        spinBtn.disabled = true;
        return; // End the game
      } else {
        finalValue.innerHTML = `<p><strong>ውጤት: ${i.value}</p>`;
      }

      spinBtn.disabled = false;
      break;
    }
  }
};

// Spinner count
let count = 0;
let resultValue = 101; // 100 rotations for animation and last rotation for result

// Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p><strong>መልካም እድል!</p>`;

  // Generate random degrees but exclude ranges for excluded labels and those that have reached their limits
  let randomDegree;
  do {
    randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  } while (
    (randomDegree >= 0 && randomDegree <= 45) ||   // Exclude range for A 4 ቅዱስት ስዕላት
    (randomDegree >= 181 && randomDegree <= 225) || // Exclude range for ፍሬም ስዕል አድህኖ
    (randomDegree >= 46 && randomDegree <= 90 && drawCount['መስቀል የእንጨት'] >= drawLimit['መስቀል የእንጨት']) ||
    (randomDegree >= 91 && randomDegree <= 135 && drawCount['እንኳን አደረሳችሁ'] >= drawLimit['እንኳን አደረሳችሁ']) ||
    (randomDegree >= 136 && randomDegree <= 180 && drawCount['ትንሹ ስዕል አድህኖ'] >= drawLimit['ትንሹ ስዕል አድህኖ']) ||
    (randomDegree >= 226 && randomDegree <= 270 && drawCount['ክር'] >= drawLimit['ክር']) ||
    (randomDegree >= 271 && randomDegree <= 315 && drawCount['መስቀል የብረት'] >= drawLimit['መስቀል የብረት']) ||
    (randomDegree >= 316 && randomDegree <= 360 && drawCount['ላምኔት የተደረገ ቅዱስት ስዕላት'] >= drawLimit['ላምኔት የተደረገ ቅዱስት ስዕላት'])
  );

 // Interval for rotation animation
 let rotationInterval = window.setInterval(() => {
  myChart.options.rotation = myChart.options.rotation + resultValue;
  myChart.update();

  // If rotation > 360 reset it back to 0
  if (myChart.options.rotation >= 360) {
    count += 1;
    resultValue -= 5;
    myChart.options.rotation = 0;
  } else if (count > 15 && myChart.options.rotation == randomDegree) {
    valueGenerator(randomDegree);
    clearInterval(rotationInterval);
    count = 0;
    resultValue = 101;
  }
}, 10);
});

