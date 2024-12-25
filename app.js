function navigateToAbout() {
    window.location.href = 'about.html';
}

function navigateToIndex() {
    window.location.href = 'index.html';
}

function navigateToServices() {
    window.location.href = 'Services.html';
}

function navigateToContact() {
    window.location.href = 'Contact.html';
}

function navigateTologin() {
    window.location.href = 'login.html';
}

function navigateTosignUp() {
    window.location.href = 'signUp.html';
}

function navigateToBudgetTracking() {
    window.location.href = 'BudgetTracking.html';
}

// Budget Tracking Logic
const incomeForm = document.getElementById('income-form');
const budgetForm = document.getElementById('budget-form');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const remainingBalance = document.getElementById('remaining-balance');
const expenseChartCtx = document.getElementById('expenseChart').getContext('2d');

let total = 0;
let expenses = {};
let income = 0;

const expenseChart = new Chart(expenseChartCtx, {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            label: 'Expenses',
            data: [],
            backgroundColor: [
                'rgb(251, 0, 0)',
                'rgb(194, 253, 0)',
                'rgb(249, 182, 0)',
                'rgba(0, 0, 255, 0.2)',
                'rgb(0, 255, 51)',
                'rgb(2, 234, 255)',
                'rgb(255, 0, 255)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true
    }
});

incomeForm.addEventListener('submit', function(event) {
    event.preventDefault();
    income = parseFloat(document.getElementById('income').value);
    remainingBalance.textContent = income.toFixed(2);
    incomeForm.style.display = 'none';
    budgetForm.style.display = 'block';
});

budgetForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const expenseName = document.getElementById('expense-name').value;
    const expenseAmount = parseFloat(document.getElementById('expense-amount').value);
    
    if (expenseName && !isNaN(expenseAmount) && expenseAmount > 0) {
        const listItem = document.createElement('li');
        listItem.textContent = `${expenseName}: $${expenseAmount.toFixed(2)}`;
        expenseList.appendChild(listItem);
        
        total += expenseAmount;
        totalAmount.textContent = total.toFixed(2);
        
        if (expenses[expenseName]) {
            expenses[expenseName] += expenseAmount;
        } else {
            expenses[expenseName] = expenseAmount;
        }
        
        updateChart();
        
        budgetForm.reset();
    }
    
    const remaining = income - total;
    remainingBalance.textContent = remaining.toFixed(2);
      // Show message if expenses exceed a certain threshold
    if (total > income / 2) {
        expenseMessage.textContent = "aadhe paise khatam hogy month end kaise katenge?";
    } else {
        expenseMessage.textContent = "Good job! You're spending wisely. why not treat your friends?";
    }
});
//Add animation to expense name input field
const expenseNameInput = document.getElementById('expense-name');
expenseNameInput.addEventListener('input', function() {
    expenseNameInput.style.backgroundColor = '#fe2d00'; // Light cyan background
    setTimeout(() => {
        expenseNameInput.style.backgroundColor = ''; // Reset background color
    }, 500);
});
function updateChart() {
    expenseChart.data.labels = Object.keys(expenses);
    expenseChart.data.datasets[0].data = Object.values(expenses);
    expenseChart.update();
}
// Download PDF logic
downloadPdfButton.addEventListener('click', function() {
    if (income === 0) {
        alert('Please set your income first.');
        return;
    }
    if (Object.keys(expenses).length === 0) {
        alert('Please add at least one expense.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add budget summary
    doc.text('Budget Summary', 10, 10);
    doc.text(`Total Expenses: $${total.toFixed(2)}`, 10, 20);
    doc.text(`Remaining Balance: $${(income - total).toFixed(2)}`, 10, 30);

    // Add expense list
    let yOffset = 40;
    for (const [name, amount] of Object.entries(expenses)) {
        doc.text(`${name}: $${amount.toFixed(2)}`, 10, yOffset);
        yOffset += 10;
    }
 // Add expense message if applicable
 if (total > income / 2) {
    doc.text("Kharche km krde bhai/behen tu to ambani bhi ni hai", 10, yOffset + 10);
}

     // Add chart
     html2canvas(document.getElementById('expenseChart')).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, yOffset, 180, 100);
        doc.save('budget-summary.pdf');
    });
});