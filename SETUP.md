# 🛠 Пошаговая настройка Firebase + GitHub Pages

> Настройка занимает ~10 минут. Делается один раз.

---

## Шаг 1: Создать проект в Firebase

1. Перейдите на **[https://console.firebase.google.com/](https://console.firebase.google.com/)**
2. Нажмите **«Добавить проект»** (Add project)
3. Введите имя проекта, например: `fraction-praise-tracker`
4. Google Analytics можно **отключить** (не нужен)
5. Нажмите **«Создать проект»**

---

## Шаг 2: Зарегистрировать веб-приложение

1. В панели проекта нажмите на значок **«</>»** (Web) — «Добавить приложение»
2. Введите название приложения, например: `Fraction Tracker`
3. **НЕ** ставьте галочку "Firebase Hosting"
4. Нажмите **«Зарегистрировать»**
5. Вы увидите блок кода с конфигурацией:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "fraction-praise-tracker.firebaseapp.com",
  projectId: "fraction-praise-tracker",
  storageBucket: "fraction-praise-tracker.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. **Скопируйте эти значения** — они понадобятся на шаге 6.

---

## Шаг 3: Включить аутентификацию по Email/Password

1. В левом меню Firebase Console перейдите в **Build → Authentication**
2. Нажмите **«Начать»** (Get started)
3. Во вкладке **«Sign-in method»** нажмите на **«Email/Password»**
4. **Включите** переключатель «Email/Password»
5. Кнопка «Email link (passwordless sign-in)» — можно НЕ включать
6. Нажмите **«Сохранить»**

---

## Шаг 4: Создать базу данных Firestore

1. В левом меню перейдите в **Build → Firestore Database**
2. Нажмите **«Создать базу данных»** (Create database)
3. Выберите режим: **«Начать в тестовом режиме»** (Start in test mode)
   > Мы потом поменяем правила на безопасные
4. Выберите ближайший регион (например, `europe-west1` для Европы)
5. Нажмите **«Создать»**

---

## Шаг 5: Настроить правила безопасности Firestore

1. В разделе **Firestore Database** перейдите на вкладку **«Правила»** (Rules)
2. **Удалите** всё содержимое и вставьте:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return request.auth != null &&
        request.auth.token.email_verified == true &&
        request.auth.token.email in get(/databases/$(database)/documents/config/admins).data.emails;
    }

    match /sheets/{sheetId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /config/{configId} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

3. Нажмите **«Опубликовать»** (Publish)

> **Что делают эти правила:**
> - Любой может ЧИТАТЬ данные таблицы (просмотр)
> - ПИСАТЬ (изменять данные) могут только пользователи, чей email указан в документе `/config/admins`
> - Документ `/config/admins` нельзя изменить через сайт — только через Firebase Console
> - Это серверная защита, которую невозможно обойти через DevTools или модификацию JavaScript

---

## Шаг 6: Создать аккаунты администраторов

### 6.1 Создать пользователей

1. Перейдите в **Authentication → Users**
2. Нажмите **«Добавить пользователя»** (Add user)
3. Введите:
   - **Email:** email администратора (например: `goponos12@gmail.com`)
   - **Password:** придумайте пароль (администратор будет использовать его для входа)
4. Нажмите **«Добавить»**
5. **Повторите** для каждого администратора

> 💡 После создания пользователя, нажмите на три точки справа от него и выберите **«Верифицировать email»** (Verify email), чтобы отметить его email как подтвержденный. Это нужно для правил безопасности!

### 6.2 Создать документ с администраторами в Firestore

1. Перейдите в **Firestore Database → Data**
2. Нажмите **«Начать коллекцию»** (Start collection)
3. ID коллекции: `config`
4. ID документа: `admins`
5. Добавьте поле:
   - **Название поля:** `emails`
   - **Тип:** `array`
   - Нажмите **«+»** и добавьте элементы типа `string`:
     - `goponos12@gmail.com` (ваш email)
     - другие email'ы администраторов
6. Нажмите **«Сохранить»**

> **Чтобы добавить или убрать администратора в будущем:**  
> Просто отредактируйте массив `emails` в документе `config/admins` прямо в Firebase Console.

---

## Шаг 7: Вставить конфигурацию Firebase в HTML

1. Откройте файл `index.html` в текстовом редакторе (Notepad++ или VS Code)
2. Найдите блок в начале `<script>`:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "ВСТАВЬТЕ_СЮДА_API_KEY",
  authDomain: "ВСТАВЬТЕ_СЮДА.firebaseapp.com",
  projectId: "ВСТАВЬТЕ_СЮДА",
  storageBucket: "ВСТАВЬТЕ_СЮДА.appspot.com",
  messagingSenderId: "ВСТАВЬТЕ_СЮДА",
  appId: "ВСТАВЬТЕ_СЮДА"
};
```

3. Замените каждое `"ВСТАВЬТЕ_СЮДА..."` на реальные значения из шага 2
4. Сохраните файл

---

## Шаг 8: Загрузить на GitHub и включить GitHub Pages

### 8.1 Создать репозиторий

1. Перейдите на **[https://github.com/new](https://github.com/new)**
2. Имя репозитория: `fraction-praise-tracker`
3. Описание: `Интерактивная таблица для фракции Arizona RP`
4. Тип: **Public** (для GitHub Pages на бесплатном аккаунте)
5. **НЕ** ставьте галочки README / .gitignore / license
6. Нажмите **«Create repository»**

### 8.2 Загрузить файлы

1. На странице нового репозитория нажмите **«uploading an existing file»**
2. Перетащите (drag & drop) файлы из папки проекта:
   - `index.html`
   - `README.md`
   - `SETUP.md`
   - `firestore.rules`
3. В поле "Commit message" напишите: `Первая загрузка`
4. Нажмите **«Commit changes»**

### 8.3 Включить GitHub Pages

1. Перейдите в **Settings** (настройки) репозитория
2. В левом меню нажмите **«Pages»**
3. В разделе «Source» выберите:
   - Branch: **main**
   - Folder: **/ (root)**
4. Нажмите **«Save»**
5. Через 1–2 минуты сайт будет доступен по адресу:
   ```
   https://ВАШ-ЮЗЕРНЕЙМ.github.io/fraction-praise-tracker/
   ```

---

## Шаг 9: Добавить домен GitHub Pages в Firebase

1. Вернитесь в **Firebase Console → Authentication → Settings → Authorized domains**
2. Нажмите **«Добавить домен»** (Add domain)
3. Добавьте:
   ```
   ВАШ-ЮЗЕРНЕЙМ.github.io
   ```
4. Нажмите **«Добавить»**

---

## Шаг 10: Загрузить данные из Google Таблицы (первый запуск)

1. Откройте ваш сайт: `https://ВАШ-ЮЗЕРНЕЙМ.github.io/fraction-praise-tracker/`
2. Нажмите **«🔐 Войти»** и введите email/пароль администратора
3. Нажмите кнопку **«📦 Загрузить исходные данные»** (Initialize)
4. Подтвердите действие
5. Данные из Google Таблицы будут загружены в Firestore

> Эту кнопку нужно нажать только один раз. После этого все данные хранятся в Firebase.

---

## Готово! 🎉

Теперь:
- **Все** могут просматривать таблицу по ссылке
- **Только администраторы** (чьи email в списке `config/admins`) могут изменять данные
- Данные синхронизируются в реальном времени между всеми пользователями
- Защиту **невозможно обойти** — правила безопасности работают на серверах Firebase

---

## FAQ

**Q: Как добавить нового администратора?**  
A: В Firebase Console: 
1. Authentication → Add user (создайте аккаунт)
2. Firestore → config/admins → добавьте email в массив `emails`

**Q: Как убрать администратора?**  
A: В Firebase Console удалите email из массива `emails` в документе `config/admins`.

**Q: Можно ли обойти защиту через DevTools?**  
A: Нет. Правила безопасности выполняются на серверах Firebase. Даже если кто-то изменит JavaScript-код на странице, Firebase откажет в записи, если email пользователя не в списке администраторов.

**Q: Данные сохраняются между перезагрузками?**  
A: Да, все данные хранятся в облаке Firebase и доступны с любого устройства.

**Q: Это бесплатно?**  
A: Да, бесплатный тариф Firebase (Spark plan) включает:
- 50,000 чтений / 20,000 записей в день
- 1 ГБ хранения
- Неограниченное количество пользователей аутентификации
- Этого более чем достаточно для управления фракцией.
