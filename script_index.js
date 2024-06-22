const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');

    for (let i = 0; i < 12; i++) {
        const option = new Option(new Date(0, i).toLocaleString('ru', { month: 'long' }), i);
        monthSelect.add(option);
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 8; i++) {
        const option = new Option(i, i);
        yearSelect.add(option);
    }

    monthSelect.value = new Date().getMonth();
    yearSelect.value = currentYear;

    function generateCalendar(year, month) {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = ''; // Очистка календаря

        const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        daysOfWeek.forEach(day => {
            const dayName = document.createElement('div');
            dayName.textContent = day;
            dayName.className = 'day-of-week';
            calendar.appendChild(dayName);
        });

        
        const startOfMonth = new Date(year, month, 1);
        const startDayOfWeek = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1;
        const prevMonthDaysToShow = startDayOfWeek;
        const prevMonthEnd = new Date(year, month, 0).getDate();
        for (let i = prevMonthEnd - prevMonthDaysToShow + 1; i <= prevMonthEnd; i++) {
            const dayButton = document.createElement('button');
            dayButton.textContent = i;
            dayButton.className = 'other-month';
            dayButton.onclick = function() {
                if (month+1 === 1) {
                    window.open(`days.html?date=${i}-${month+12}-${year-1}`, '_blank');
                }
                else {
                    window.open(`days.html?date=${i}-${month}-${year}`, '_blank');
                }
            };
            calendar.appendChild(dayButton);
        }

        const endOfMonth = new Date(year, month + 1, 0);
        const today = new Date();
        const daysInMonth = endOfMonth.getDate();
        for (let day  = 1; day <= daysInMonth; day++) {
            const dayButton = document.createElement('button');
            dayButton.textContent = day;
            const currentDate = new Date(year, month, day);
            if ((currentDate.getDay() === 0 || currentDate.getDay() === 6) && today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
                dayButton.classList.add('current-day');
            } else if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
                dayButton.classList.add('current-day');
            } else if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
                dayButton.classList.add('weekend');
            }
            dayButton.onclick = function() {
                window.open(`days.html?date=${day}-${month+1}-${year}`, '_blank');
            };
            calendar.appendChild(dayButton);
        }

        const totalCells = 42;
        const nextMonthDaysToShow = totalCells - (prevMonthDaysToShow + daysInMonth);
        for (let i = 1; i <= nextMonthDaysToShow; i++) {
            const dayButton = document.createElement('button');
            dayButton.textContent = i;
            dayButton.className = 'other-month';
            dayButton.onclick = function() {
                if (month+1===12){
                    window.open(`days.html?date=${i}-${month-10}-${year+1}`, '_blank');
                    console.log(i);
                }
                else {
                    window.open(`days.html?date=${i}-${month+2}-${year+1}`, '_blank');
                    console.log(month);

                }
            };
            calendar.appendChild(dayButton);
        }
    }

    function updateCalendar() {
        generateCalendar(parseInt(yearSelect.value), parseInt(monthSelect.value));
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateCalendar();
    });