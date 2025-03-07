# Веб-приложение для отслеживания ментального состояния

### Описание
Данный проект представляет собой веб-приложение, разработанное с использованием Django, Django REST Framework (DRF) и React. Основная цель приложения — помочь пользователям отслеживать и анализировать свое ментальное состояние. 

## Возможности сайта

#### 1. Аутентификация и авторизация

• Регистрация пользователей: Пользователи могут создать учетную запись, заполнив необходимые данные.

• Вход и выход: Реализованы функции входа и выхода из системы, обеспечивающие безопасность и доступ к личным заметкам.

#### 2. Работа с заметками

• Пользователи могут создавать заметки о своем ментальном состоянии, включая такие параметры, как настроение, эмоции и влияния.

• Заметки можно просматривать и удалять.

#### 3. Анализ данных

• Приложение предоставляет возможность получать статистику за определенный период:

  • Частота написания заметок: Пользователи могут увидеть, как часто они записывают свои мысли и чувства.

  • Тренды настроения: Отображаются изменения в настроении пользователя на протяжении времени.
  • Тренды энергии: Отображаются изменения в уровне энергии пользователя (выбирается вместе с эмоциями) на протяжении времени.

  • Статистика эмоций: Пользователи могут анализировать, какие эмоции они чаще всего испытывают и как это соотносится с их общим состоянием.

### Технологический стэк

• Backend: Django, Django REST Framework

• Frontend: React, Chart.js, Font Awesome, Tailwind CSS

• База данных: SQLite

<details>
<summary>Для работы приложения</summary>

1. Клонировать репозиторий:
```bash
git clone https://github.com/BobrovGH/mental-health-diary
```

3. Установить зависимости для backend:
```bash
pip install -r requirements.txt
```

4. Настройть базу данных в файле settings.py и выполнить миграции:
```bash
python manage.py migrate
```

5. Запустить сервер:
```bash
python manage.py runserver
```

6. Установить зависимости для frontend:
```
bash cd frontend
npm install
```

7. Запустить приложение React:
```bash npm start```
</details>

## Сриншоты интерфейса<p>
• Список заметок пользователя <p>
![notes_pageLarge](https://github.com/user-attachments/assets/fb9e308d-ecb7-4d6f-b084-7635e3e85be1)<p>
• Создание новой заметки
![creating_noteLarge](https://github.com/user-attachments/assets/b163d472-ce1c-45de-ab68-f42cf2606fa8)<p>
• Аналитика по заметкам пользователя
![analysis_pageLarge](https://github.com/user-attachments/assets/a406dfa7-20e0-433e-8cc3-6a5f1ced0c8f)
