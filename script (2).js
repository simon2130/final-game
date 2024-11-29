const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Object that stores values of minimum and maximum angle for each label
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 'A4 ስዕል አድህኖ' },    // Excluded
  { minDegree: 31, maxDegree: 90, value: 'መስቀል' },    // meskel
  { minDegree: 91, maxDegree: 150, value: 'እንኳን አደረሳችሁ' },   // enkuan_aderesachu
  { minDegree: 151, maxDegree: 210, value: 'ትንሹ ስዕል አድህኖ' },  // teneshu_sel_adehno
  { minDegree: 211, maxDegree: 270, value: 'ክር' },  // ker
  { minDegree: 271, maxDegree: 330, value: 'ፍሬም ስዕል አድህኖ' },  // Excluded
  { minDegree: 331, maxDegree: 360, value: 'A4 ስዕል አድህኖ' },  // Excluded
];

// Draw limits for each label
const drawLimit = {
  'መስቀል': 30, // meskel: 30 times
  'ክር': 30, // ker: 30 times
  'ትንሹ ስዕል አድህኖ': 20, // teneshu_sel_adehno: 20 times
  'እንኳን አደረሳችሁ': 50, // enkuan_aderesachu: 50 times
  'A4 ስዕል አድህኖ': 5, // A4: 50 times
  'ፍሬም ስዕል አድህኖ': 3, // yefrem_sel_adehno: 30 times
};

// Count the number of draws for each label
const drawCount = {
  'መስቀል': 0,
  'ክር': 0,
  'ትንሹ ስዕል አድህኖ': 0,
  'እንኳን አደረሳችሁ': 0,
  'A4 ስዕል አድህኖ': 0,
  'ፍሬም ስዕል አድህኖ': 0,
};

// Size of each piece
const data = [16, 16, 16, 16, 16, 16];

// Background color for each piece
var pieColors = [
  "#388E3C", "#005B96", "#388E3C", "#005B96", "#388E3C", "#005B96"
];

// Create chart
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: ['መስቀል', 'A4 ስዕል አድህኖ', 'ፍሬም ስዕል አድህኖ', 'ክር', 'ትንሹ ስዕል አድህኖ', 'እንኳን አደረሳችሁ'],
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
        font: { size: 16 },
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
    // Skip labels A4, yefrem_sel_adehno, or any label that has reached its draw limit
    if (i.value === 'A4 ስዕል አድህኖ' || i.value === 'ፍሬም ስዕል አድህኖ' || drawCount[i.value] >= drawLimit[i.value]) {
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

  // Generate random degrees but exclude ranges for A4, yefrem_sel_adehno, and labels that have reached their limits
  let randomDegree;
  do {
    randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  } while (
    (randomDegree >= 0 && randomDegree <= 30) ||   // Exclude range for A4
    (randomDegree >= 331 && randomDegree <= 360) ||// Exclude range for A4
    (randomDegree >= 271 && randomDegree <= 330) ||// Exclude range for yefrem_sel_adehno
    (randomDegree >= 31 && randomDegree <= 90 && drawCount['መስቀል'] >= drawLimit['መስቀል']) ||   // Exclude range for meskel if drawn 30 times
    (randomDegree >= 151 && randomDegree <= 210 && drawCount['ትንሹ ስዕል አድህኖ'] >= drawLimit['ትንሹ ስዕል አድህኖ']) || // Exclude range for teneshu_sel_adehno if drawn 20 times
    (randomDegree >= 211 && randomDegree <= 270 && drawCount['ክር'] >= drawLimit['ክር']) || // Exclude range for ker if drawn 30 times
    (randomDegree >= 91 && randomDegree <= 150 && drawCount['እንኳን አደረሳችሁ'] >= drawLimit['እንኳን አደረሳችሁ'])     // Exclude range for enkuan_aderesachu if drawn 50 times
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
