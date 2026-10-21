# Дизайн-система — VIII Конгрес НТАГЕТУ

## Brand

- **Проєкт:** Офіційний сайт VIII Конгресу Наукового товариства анатомів, гістологів, ембріологів та топографоанатомів України (НТАГЕТ).
- **Опис:** інформаційний багатосторінковий сайт конгресу — анонс, програма, місце проведення, комітети й контакти.
- **Джерело контенту:** друкована «Програма VIII Конгресу НТАГЕТ України» (редакція від 11.10.2026) — дати **14–17 жовтня 2026**, місце очної участі **готель «Супутник», вул. Княгині Ольги, 116, Львів**, онлайн-зали в Google Meet, склад комітетів, регламент і перелік доповідей. Усі ці дані зберігаються в `db.json` і читаються через `src/services/api.js`.
- **Емоційний тон:** урочисто-академічний, науковий, музейно точний. Не «медичний стартап», а **сторінка з анатомічного атласу XIX століття, переверстана для вебу**: старовинний папір, глибоке чорнило, артеріальний кармін, тонкі волосяні лінійки, нумеровані підписи до «таблиць».

## Архетип

**EDITORIAL** — «наукова таблиця анатомічного атласу».
Редакційний макет: сітка-вимір, дві колонки, підписи моноширинним шрифтом на кшталт гравіювальних legend-ів (`FIG. 03 — КЛЮЧОВІ ДАТИ`), квадратні кути, відмова від тіней на користь волосяних ліній. Вертикальний ритм тримають великі серифні цифри у лівому рейлі.

## Color Palette (→ @theme токени в src/index.css → Tailwind utilities)

| Токен | Hex | Роль |
|---|---|---|
| `--color-ink` | `#101A1E` | Anatomical Ink — основний текст, шапка, темні секції, hero-основа |
| `--color-paper` | `#F3EEE4` | Aged Paper — фон сторінки |
| `--color-plate` | `#FBF8F1` | Plate White — картки, панелі, «таблиці» |
| `--color-carmine` | `#9C2B21` | Arterial Carmine — єдиний гучний акцент: активні стани, акцентні дати, кнопки, підкреслення |
| `--color-teal` | `#2E5D63` | Venous Teal — вторинний акцент: посилання, номери малюнків, типи сесій |
| `--color-rule` | `#D9D0C0` | Graphite Rule — волосяні лінії, розділювачі таблиць |
| `--color-ink-soft` | `#57646A` | Muted текст, підписи, друга лінія пояснень |
| `--color-plate-dim` | `#EAE3D6` | Hover-фон рядків індексу, підкладки таблиць |

Правила кольору:
- **Ніяких градієнтів, ніякого glassmorphism, ніяких «фіолетових» героїв.**
- Carmine використовується ≤ 3 разів на екран як акцент; решта — чорнило й папір.
- Темні секції (`bg-ink`) інвертують текст у `text-paper`.

## Typography

Шрифти підключаються з Google Fonts в `index.html` (усі мають кирилицю):

- **Заголовки / display:** `Old Standard TT` → `--font-serif` (`font-serif`) — історичний науковий сериф. Розміри щедрі, міжрядковий інтервал щільний (`leading-[0.95]`–`leading-tight`), заголовки часто в верхньому регістрі з розрідженим трекінгом.
- **Основний текст / UI:** `IBM Plex Sans` → `--font-sans` (`font-sans`) — кириличний підмножина, висока читабельність українського тексту.
- **Числа, дати, час, підписи таблиць, індекси:** `IBM Plex Mono` → `--font-mono` (`font-mono`) — з `tracking-[0.18em]` та `uppercase` для legend-ів.

Типографська шкала:
- Основний текст: `text-lg` (18px), `leading-relaxed`, `text-ink`
- h1 (hero): `text-5xl md:text-7xl` (≥ 56px), `font-serif`, `leading-[0.95]`
- h2 (секція): `text-3xl md:text-4xl`, `font-serif`
- h3 (картка/рядок): `text-xl md:text-2xl`, `font-serif`
- h4 / підзаголовок: `text-lg`, `font-sans font-semibold`
- legend / plate label: `text-[11px] font-mono uppercase tracking-[0.22em] text-ink-soft`
- Надзаголовок (eyebrow): `text-xs font-mono uppercase tracking-[0.3em] text-carmine`

## Spacing & Layout

- Секція: `py-20 md:py-28`; щільні індекси: `py-4` на рядок.
- Контейнер: `max-w-6xl mx-auto px-6` (вузький текстовий вимір — `max-w-[68ch]`).
- **Радіус: квадратні кути.** `rounded-none` за замовчуванням; максимум `rounded-[2px]` для кнопок і полів.
- **Тіні замінені лінійками:** `border border-rule`, внутрішня подвійна рамка через `outline outline-1 outline-offset-4 outline-rule`.
- Сітка сторінки: 12-колонкова; типова редакційна розкладка — `lg:grid-cols-[minmax(0,3fr)_minmax(0,9fr)]` (лівий рейл з номером/датою + права колонка контенту).
- Горизонтальний відступ мобільного: `px-5`.

### Три фірмові мотиви (обов'язкові у кожній секції)

1. **Plate Frame** — секція всередині тонкої подвійної рамки, у правому верхньому куті — моно-легенда `FIG. 03 — КЛЮЧОВІ ДАТИ`. Реалізується компонентом `PlateFrame` + `PlateLabel`.
2. **Index List** — програма, ключові дати й оргкомітет як нумеровані рядки, розділені `divide-y divide-rule`, з номером у моноширинному шрифті зліва.
3. **Oversized Numeral Anchor** — велика серифна цифра (номер дня, розділу, таблиці) у лівому рейлі як «якір» колонки.

## Components

| Файл | Призначення |
|---|---|
| `src/components/ui/PlateFrame.jsx` | Подвійна волосяна рамка секції + слот для моно-легенди |
| `src/components/ui/PlateLabel.jsx` | Легенда таблиці: `FIG. NN — НАЗВА`, `font-mono uppercase tracking-[0.22em]` |
| `src/components/ui/SectionHeading.jsx` | Eyebrow + серіфний заголовок + опційний опис, вирівнювання за лівим краєм (ніколи не по центру) |
| `src/components/ui/HairlineRule.jsx` | Горизонтальна лінійка `border-rule`, з опційним ромбом-маркером посередині |
| `src/components/ui/Button.jsx` | Варіанти `solid` (ink/carmine) та `outline`; квадратні кути, hover — зміна фону + підкреслення, `active:translate-y-px` |
| `src/components/ui/IndexRow.jsx` | Рядок індексу: моно-номер + назва + права метадана |
| `src/components/ui/Reveal.jsx` | Обгортка появи при скролі (`reveal` → `reveal-in`), проп `delay` для каскаду |
| `src/hooks/useReveal.js` | IntersectionObserver-хук (без сторонніх бібліотек) |
| `src/hooks/useCollection.js` | `useCollection(name)` / `useSingleton(name)` — читання колекцій із кешем на рівні модуля (один запит на весь застосунок) |
| `src/data/siteMeta.js` | `NAV_LINKS` (спільна навігація шапки/підвалу) + `CONGRESS_SHELL` (каркас конгресу, щоб шапка ніколи не була порожньою до першого запиту) |
| `src/lib/format.js` | Українські дати: `formatUaDate`, `formatUaDateNumeric`, `formatUaDateWithWeekday`, `formatUaRange`, `formatTimeRange`, `pluralUa`/`withCountUa`, `daysUntil`/`formatDaysLeft` |

## Pages & Component Inventory

- `src/features/home/HomePage.jsx` — маршрут `/`. Компонує секції нижче.
- `src/features/home/HeroPlate.jsx` — герой-таблиця: темна основа `bg-ink`, ординал «VIII» величезним серифом, повна назва конгресу, дати й місто в моно, формат участі, перелік організаторів, фотографія атласу в подвійній рамці праворуч і рядок статистики програми.
- `src/features/home/Announcement.jsx` — анонс у два стовпці з буквицею (initial cap) у карміні, перелік форматів участі як індекс і гістологічна ілюстрація в рамці.
- `src/features/home/KeyDatesIndex.jsx` — головні події програми (14–17 жовтня) як нумерований індекс з акцентними засіданнями карміном і зворотним відліком у лівому рейлі.
- `src/features/home/GreetingFromOrganizers.jsx` — звернення оргкомітету: чорнильна таблиця, портретна ілюстрація в рамці, текст звернення серифом, список голів конгресу (Аппельханс, Чемерис, Кривко) і підпис моно.
- `src/features/home/AboutTheSociety.jsx` — блок про НТАГЕТ: таблиця фактів (конгрес, мови, заходи БПР, журнали), напрями роботи конгресу як індекс, список наукових журналів товариства, керівництво та фото зали.
- `src/features/home/VenueCallout.jsx` — заклик до сторінки місця проведення з адресою, переліком залів і варіантами доїзду.
- `src/features/program/ProgramPage.jsx` — маршрут `/program`. Мастика з фактами програми, перемикач днів (чотири дні) + список засідань, примітки до програми.
- `src/features/program/DaySelector.jsx` — горизонтальний моно-перемикач днів (active = кармін), доступний з клавіатури.
- `src/features/program/SessionListByDay.jsx` — засідання дня рядками індексу: час (моно), тип, назва, модератори, зала; для засідань із переліком доповідей — розкривний список «Доповіді засідання (N)» з реальними назвами та авторами з програми. Службові позиції (перерви, реєстрація) — дрібним рядком із перемикачем «Сховати перерви».
- `src/features/program/ProgramNotes.jsx` — примітки до програми: регламент, реєстрація, формат участі, мови, БПР, публікація матеріалів, редакційна примітка.
- `src/features/venue/VenuePage.jsx` — маршрут `/venue`.
- `src/features/venue/AddressAndCity.jsx` — адреса готелю «Супутник», ключові факти (зали, онлайн-трансляція), панорама Львова в рамці та посилання на карту.
- `src/features/venue/HallsAndOnline.jsx` — зали засідань із робочими посиланнями Google Meet для зали 1, зали 2 і зали 3 та поясненням, як долучитися онлайн.
- `src/features/venue/HowToGetThere.jsx` — проїзд: потяг, літак, місто — рядками індексу.
- `src/features/venue/VenueMap.jsx` — схема розташування залів у конференц-зоні готелю (літеровані позначки A–F, вибір кліком і з клавіатури).
- `src/features/venue/AccommodationList.jsx` — перебування учасників: готель «Супутник» як місце проведення, реєстрація 15 жовтня та дружня вечеря.
- `src/features/committee/CommitteePage.jsx` — маршрут `/committee`.
- `src/features/committee/CommitteeGroups.jsx` — голови конгресу, організаційний, програмний і координаційний комітети: ролі, імена, афіліації, міста.
- `src/features/committee/ContactNote.jsx` — нота в кінці сторінки комітетів: адреса місця проведення та онлайн-зали Google Meet.
- `src/features/contacts/ContactsPage.jsx` — маршрут `/contacts`.
- `src/features/contacts/ContactList.jsx` — онлайн-зали (робочі посилання Google Meet), адреса місця проведення, організаційна інформація.
- `src/features/contacts/InquiryForm.jsx` — контрольована форма запиту (ім'я, email, організація, тема, повідомлення), валідація, POST на `/api/inquiries`, екран підтвердження з номером запису.
- `src/components/layout/Header.jsx` — тонка чорнильна смуга: ординал «VIII» серіфом + моно-навігація + мобільне меню.
- `src/components/layout/Footer.jsx` — темний `bg-ink`: дати, місто, контакти в моно, лінійка-розділювач.
- `src/components/layout/Layout.jsx` — оболонка: Header + `<main>` + Footer (існує в скелеті).

## Animations

- Поява при скролі: `opacity-0 translate-y-4` → `opacity-100 translate-y-0`, `0.5s ease`, каскад `0.08s` на елемент (IntersectionObserver у `src/hooks/useReveal.js`).
- Рядок індексу при hover: фон `bg-plate-dim`, зсув `translate-x-1`, ліва межа набуває `border-carmine`, `0.2s ease`.
- Кнопка: hover — інверсія (ink ↔ paper) або `brightness-110`; `active:translate-y-px`.
- Посилання: підкреслення «росте» від лівого краю (`bg-[length:0%_1px]` → `100%`).
- Перехід за замовчуванням: `0.2s ease`. Повага до `prefers-reduced-motion`.

## Accessibility

- Контраст ≥ 4.5:1: `ink` на `paper` ≈ 15:1; `carmine` на `paper` — лише для великого тексту та підкреслень; на `bg-ink` текст завжди `paper`.
- Фокус: `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carmine`.
- Уся навігація — справжні `<Link>`/`<button>`; активний день програми — `<button aria-pressed>`.

## Images

Слот → URL (отримано через `find_image`, повторно використовувати без нових запитів):

- **hero** (hero-таблиця на головній, 1600×1066, landscape 3:2, avg `#98795F`) — **офіційний плакат конгресу, наданий оргкомітетом** (власний матеріал клієнта, лежить у `public/uploads/`):
  `/uploads/photo_2026-10-14_20-27-25-fdb3c7cc.jpg`
  Емблема товариства «1845», старовинний мікроскоп, препарат легень, гістологічні скельця, старі томи. Контейнер тримає `aspect-[3/2]`, тому плакат не обрізається і його заголовок із датами читається повністю. Підпис під таблицею веде на файл у повному розмірі.
- **hero-reserve** (запасна ілюстрація, якщо оргкомітет замінить плакат, landscape, avg `#A07E5C`) — старовинні ботанічні та анатомічні ілюстрації з лупою:
  `https://images.pexels.com/photos/6966593/pexels-photo-6966593.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
  (5472×3648, Pexels, автор: Polina Tankilevitch)
- **society** (блок про НТАГЕТУ, зала конгресу, landscape, avg `#26211B`) — аудиторія на науковій конференції:
  `https://images.pexels.com/photos/20733081/pexels-photo-20733081.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
  (5239×3497, Pexels)
- **lab** (мікроскопія/гістологія, landscape, avg `#AAB0AE`) — робота з гістологічними скельцями:
  `https://images.pexels.com/photos/8442368/pexels-photo-8442368.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
  (5192×3466, Pexels)
- **venue** (сторінка «Місце проведення», панорама Львова, landscape, avg `#8A8081`):
  `https://images.pexels.com/photos/35765706/pexels-photo-35765706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
  (5184×3456, Pexels; слот збережено як `venue-lviv`)
- **anatomia** (портретна ілюстрація для блоку про товариство / анонсу, portrait, avg `#9D8B81`) — студенти з анатомічною моделлю серця:
  `https://images.pexels.com/photos/33469924/pexels-photo-33469924.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
  (3744×5616, Pexels)

Правила використання зображень:
- Завжди фіксована пропорція контейнера (`aspect-[4/3]`, `aspect-video`, `aspect-[3/4]`) + `object-cover`.
- Обов'язкові `width` / `height` атрибути з розмірів вище, `loading="lazy"` для нижче першого екрана, `style={{ backgroundColor: avgColor }}` як плейсхолдер.
- Кожне фото — всередині подвійної рамки (plate frame) з моно-підписом під ним. Номер таблиці (`FIG. NN`) несе `PlateFrame` секції, а підпис фото — короткий опис зображення без номера. Ніяких круглих аватарок.

## Quality bar

Перед написанням компонента: «Чи виглядало б це як сторінка справжнього наукового атласу — щільно, точно, з повагою до лінійки й цифри?» Якщо ні — прибрати декор, додати структуру, повернутися до сітки.
