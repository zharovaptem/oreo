// Извлечение параметров даты из URL
const params = new URLSearchParams(window.location.search);
const date = params.get('date'); // Получаем дату
document.getElementById('dateToday').textContent = date ? date : 'Не указана';

// Генерация полей для задач
const timeSlots = document.getElementById('timeSlots');
for (let hour = 8; hour <= 22; hour++) {
    const timeSlot = document.createElement('div');
    timeSlot.className = 'time-slot';
    const label = document.createElement('label');
    label.textContent = `${hour}:00`;
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Добавить задачу на ${hour}:00`;

    timeSlot.appendChild(label);
    timeSlot.appendChild(input);
    timeSlots.appendChild(timeSlot);
}

document.getElementById('saveTasks').addEventListener('click', function() {
    const inputs = document.querySelectorAll('.time-slot input');
    inputs.forEach(input => {
        const time = input.previousElementSibling.textContent.replace(':00', '');
        fetch('/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                date: date ? date : new Date().toISOString().slice(0,10),
                time: time,
                task: input.value
            }),
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

window.onload = function() {
    fetch(`/tasks?date=${date}`)
    .then(response => response.json())
    .then(tasks => {
        tasks.forEach(task => {
            let timeSlot;
            document.querySelectorAll('label').forEach(label => {
                if(label.textContent.trim() === `${task.time}:00`) {
                    timeSlot = label.nextElementSibling;
                }
            });
            if (timeSlot) {
                timeSlot.value = task.task;
            }
        });
    })
    .catch(error => console.error('Ошибка:', error));
};