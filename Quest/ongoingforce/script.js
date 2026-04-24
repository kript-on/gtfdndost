// Находим на странице элементы аудио и кнопки по их ID
const bgMusic = document.getElementById("bgMusic");
const muteBtn = document.getElementById("muteBtn");

// Проверяем значение в localStorage: отключен ли звук игроком ранее?
// Если записи нет (null), будем считать, что звук выключен (true) для соответствия политикам браузера
let isMuted = localStorage.getItem("isMuted") !== "false";

// Функция для установки актуального состояния звука
function applyMuteState() {
  if (isMuted) {
    bgMusic.pause(); // Ставим на паузу
    muteBtn.innerText = "🔇 Звук выключен"; // Обновляем текст кнопки
  } else {
    // Пытаемся запустить воспроизведение. Используем catch на случай блокировки автовоспроизведения
    bgMusic.play().catch((error) => {
      console.warn(
        "Автовоспроизведение заблокировано браузером до первого взаимодействия.",
      );
    });
    muteBtn.innerText = "🔊 Звук включен";
  }
}

// Применяем состояние при загрузке скрипта (страницы)
applyMuteState();

// Добавляем обработчик события 'click' на кнопку
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted; // Переключаем булево значение на противоположное
  localStorage.setItem("isMuted", isMuted); // Сохраняем новое значение в память браузера
  applyMuteState(); // Вызываем функцию применения изменений
});

// Пытаемся найти элемент-счетчик на текущей странице
const winCountElement = document.getElementById("winCount");

// Выполняем код, только если мы находимся на странице, где этот элемент есть (на index.html)
if (winCountElement) {
  // Получаем текущее количество побед
  let wins = localStorage.getItem("quest2Wins") || 0;
  // Заменяем текст внутри span на наше число
  winCountElement.innerText = wins;
}

const DieCountElement = document.getElementById("DieCount");

// Выполняем код, только если мы находимся на странице, где этот элемент есть (на index.html)
if (DieCountElement) {
  // Получаем текущее количество побед
  let die = localStorage.getItem("quest2Die") || 0;
  // Заменяем текст внутри span на наше число
  DieCountElement.innerText = die;
}

// Находим полоску здоровья на текущей странице
const hpBar = document.getElementById("hpBar");
 
// Функция загрузки и отображения HP
function initHP() {
  // Получаем значение из памяти. Если его нет, ставим 100 (начало игры)
  let currentHP = parseInt(localStorage.getItem("playerHP"));
  if (isNaN(currentHP)) {
    currentHP = 100;
    localStorage.setItem("playerHP", currentHP);
  }
 
  // Обновляем визуал, если полоска есть на странице
  if (hpBar) {
    hpBar.style.width = currentHP + "%";
    hpBar.innerText = currentHP + "%";
 
    // Меняем цвет полоски, если здоровья мало
    if (currentHP <= 30)
      hpBar.style.backgroundColor = "#DC143C"; // Красный
    else if (currentHP <= 60)
      hpBar.style.backgroundColor = "#FFD700"; // Желтый
    else hpBar.style.backgroundColor = "#32CD32"; // Зеленый
  }
}
 
// Запускаем проверку HP при открытии страницы
initHP();
 
// Глобальная функция для получения урона
// Ее можно будет вызывать прямо из HTML
function takeDamage(amount) {
  let currentHP = parseInt(localStorage.getItem("playerHP")) || 100;
  currentHP -= amount;
 
  if (currentHP <= 0) {
    currentHP = 0;
    localStorage.setItem("playerHP", currentHP);
    // Если здоровье упало до 0 — перенаправляем на экран смерти
    window.location.href = "trap.html";
  } else {
    localStorage.setItem("playerHP", currentHP); // Иначе просто сохраняем
    initHP(); // И обновляем интерфейс
  }
}
 



// Функция для получения инвентаря из памяти
function getInventory() {
  // Пытаемся получить строку с инвентарем. Если её нет (первая игра), возвращаем строку с пустым массивом '[]'
  const invString = localStorage.getItem("playerInventory") || "[]";
  // JSON.parse превращает строку (текст) обратно в полноценный JavaScript-массив
  return JSON.parse(invString);
}
 
// Функция для добавления нового предмета
function addItem(itemName) {
  const inventory = getInventory(); // Получаем текущий массив предметов
 
  // Проверяем, нет ли уже такого предмета в сумке (чтобы не собирать дубликаты одного ключа)
  if (!inventory.includes(itemName)) {
    inventory.push(itemName); // Добавляем новый предмет в конец массива
 
    // Сохраняем обновленный массив обратно в память.
    // JSON.stringify превращает массив в строку, так как localStorage работает только со строками!
    localStorage.setItem("playerInventory", JSON.stringify(inventory));
 

  }
}
 
// Функция для проверки наличия предмета (вернет true или false)
function hasItem(itemName) {
  const inventory = getInventory();
  return inventory.includes(itemName);
}
 
// ВАЖНО: При старте новой игры (на экранах смертей или в главном меню)
// не забывайте очищать сумку: localStorage.setItem("playerInventory", "[]");
