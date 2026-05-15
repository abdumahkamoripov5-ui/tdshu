// ============================================
// Mahalliy ko'p tilli tizim (UZ / RU / EN)
// Bayroqchalar orqali til almashtiriladi.
// Internetsiz, file:// da ham ishlaydi.
// ============================================

(function () {
    'use strict';

    var I18N = {
        ru: {
            // ===== TOP BAR =====
            "Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi": "Высшая школа переводоведения, языкознания и международной журналистики",
            "ISHONCH TELEFONI / CALL CENTER": "ТЕЛЕФОН ДОВЕРИЯ / CALL CENTER",
            "ISHONCH TELEFONI": "ТЕЛЕФОН ДОВЕРИЯ",

            // ===== NAVIGATION =====
            "BOSH SAHIFA": "ГЛАВНАЯ",
            "OLIY MAKTAB": "ВЫСШАЯ ШКОЛА",
            "TA'LIM YO'NALISHLARI": "НАПРАВЛЕНИЯ",
            "O'QITUVCHILAR": "ПРЕПОДАВАТЕЛИ",
            "MAQOLALAR": "СТАТЬИ",
            "ALOQA": "КОНТАКТЫ",

            // ===== COMMON BUTTONS =====
            "Batafsil": "Подробнее",
            "Batafsil ma'lumot": "Подробнее",
            "Ko'rish": "Смотреть",
            "Yuborish": "Отправить",
            "Maqola yuborish": "Отправить статью",
            "Maqolani yuborish": "Отправить статью",
            "Barcha maqolalar": "Все статьи",
            "Barcha o'qituvchilar": "Все преподаватели",
            "Barcha yo'nalishlar": "Все направления",

            // ===== INDEX HERO =====
            "Toshkent davlat sharqshunoslik universiteti tarkibidagi yetakchi ilmiy-ta'lim maskani":
                "Ведущий научно-образовательный центр в составе Ташкентского государственного университета востоковедения",

            // ===== ABOUT SECTION =====
            "Oliy maktab haqida": "О высшей школе",
            "Tarjimon, tilshunos va xalqaro jurnalist tayyorlash markazi": "Центр подготовки переводчиков, лингвистов и международных журналистов",
            "2024-yildan beri zamonaviy ta'lim": "Современное образование с 2024 года",

            // ===== STATS =====
            "Professor-o'qituvchilar": "Профессорско-преподавательский состав",
            "Fan doktorlari": "Доктора наук",
            "Fan nomzodlari": "Кандидаты наук",
            "Ta'lim yo'nalishlari": "Направления обучения",
            "O'qitiladigan tillar": "Изучаемые языки",
            "Ilmiy salohiyat": "Научный потенциал",

            // ===== EDUCATION DIRECTIONS =====
            "Ta'lim yo'nalishlarimiz": "Наши направления обучения",
            "Bakalavriat va magistratura bosqichlarida tayyorlanadigan mutaxassisliklar":
                "Специальности уровней бакалавриата и магистратуры",
            "Tarjima nazariyasi va amaliyoti": "Теория и практика перевода",
            "Xalqaro jurnalistika": "Международная журналистика",
            "Yo'lboshchi va talqin faoliyati": "Деятельность гида-переводчика",
            "Qiyosiy tilshunoslik, lingvistik talqin": "Сравнительное языкознание, лингвистический анализ",
            "Sinxron tarjima": "Синхронный перевод",
            "Ta'lim yo'nalishlari haqida to'liq ma'lumot oling": "Получите полную информацию о направлениях",
            "Bakalavriat. Yozma va og'zaki tarjima ko'nikmalarini chuqur egallash.":
                "Бакалавриат. Углубленное освоение навыков письменного и устного перевода.",
            "Bakalavriat. Xalqaro media va jurnalistika sohasi mutaxassislari.":
                "Бакалавриат. Специалисты в области международных СМИ и журналистики.",
            "Bakalavriat. Gid-tarjimon va madaniyatlararo muloqot mutaxassisligi.":
                "Бакалавриат. Специальность гид-переводчик и межкультурная коммуникация.",
            "Magistratura. Tilshunoslik sohasidagi ilmiy tadqiqotlar.":
                "Магистратура. Научные исследования в области языкознания.",
            "Magistratura. Sinxron va ketma-ket tarjima bo'yicha yuqori malaka.":
                "Магистратура. Высокая квалификация по синхронному и последовательному переводу.",

            // ===== TEACHERS PREVIEW =====
            "Professor-o'qituvchilarimiz": "Наши преподаватели",
            "O'z sohasining malakali mutaxassislari": "Квалифицированные специалисты своего дела",
            "Oliy maktab boshlig'i": "Заведующий высшей школой",
            "Professor": "Профессор",
            "Dotsent": "Доцент",
            "O'qituvchi": "Преподаватель",
            "Filologiya fanlari doktori, dotsent": "Доктор филологических наук, доцент",
            "Filologiya fanlari doktori, professor": "Доктор филологических наук, профессор",
            "Tarjimashunoslik va sharq tillari mutaxassisi": "Специалист по переводоведению и восточным языкам",
            "Tilshunoslik va qiyosiy tadqiqotlar mutaxassisi": "Специалист по языкознанию и сравнительным исследованиям",
            "Sharq tillari va tarjima mutaxassisi": "Специалист по восточным языкам и переводу",
            "Tilshunoslik mutaxassisi": "Специалист по языкознанию",
            "Yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor":
                "Первый проректор по делам молодёжи и духовно-просветительской работе",

            // ===== GALLERY / NEWS =====
            "Oliy maktab hayotidan": "Из жизни высшей школы",
            "Bizning kundalik faoliyatimizdan lavhalar": "Сцены из нашей повседневной деятельности",
            "O'qituvchilarimiz maqolalari": "Статьи наших преподавателей",
            "Eng so'nggi ilmiy maqolalar va tadqiqotlar": "Новейшие научные статьи и исследования",
            "Hozircha maqolalar yo'q": "Пока статей нет",
            "O'qituvchilarimizning maqolalari tez orada bu yerda paydo bo'ladi.":
                "Статьи наших преподавателей скоро появятся здесь.",

            // ===== FOOTER =====
            "Tezkor havolalar": "Быстрые ссылки",
            "Talabalarga": "Студентам",
            "Bog'lanish": "Связаться",
            "Bosh sahifa": "Главная",
            "Oliy maktab": "Высшая школа",
            "O'qituvchilar": "Преподаватели",
            "Maqolalar": "Статьи",
            "Aloqa": "Контакты",
            "Qabul": "Приём",
            "Stipendiya": "Стипендия",
            "Kutubxona": "Библиотека",
            "E-universitet": "Электронный университет",
            "Toshkent, Amir Temur ko'chasi, 20": "Ташкент, ул. Амира Темура, 20",
            "Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi — Toshkent davlat sharqshunoslik universiteti tarkibidagi tarjimon, tilshunos va xalqaro jurnalist tayyorlash markazi.":
                "Высшая школа переводоведения, языкознания и международной журналистики — центр подготовки переводчиков, лингвистов и международных журналистов в составе Ташкентского государственного университета востоковедения.",

            // ===== ABOUT PAGE =====
            "Bizning tariximiz, vazifalarimiz, yutuqlarimiz va moddiy-texnika bazamiz":
                "Наша история, задачи, достижения и материально-техническая база",
            "Oliy maktab tarixi": "История высшей школы",
            "Tashkil topishi va rivojlanish bosqichlari": "Основание и этапы развития",
            "Tashkil topishi": "Основание",
            "Rivojlanish bosqichlari": "Этапы развития",
            "Professor-o'qituvchilar tarkibi": "Профессорско-преподавательский состав",
            "2025-2026 o'quv yili holatiga ko'ra": "По состоянию на 2025-2026 учебный год",
            "Vazifa va maqsadlar": "Миссия и цели",
            "Bizning missiyamiz va asosiy vazifalarimiz": "Наша миссия и основные задачи",
            "Missiyamiz": "Наша миссия",
            "Asosiy vazifalar": "Основные задачи",
            "Yutuqlar": "Достижения",
            "Oliy maktabning erishgan natijalari": "Результаты, достигнутые высшей школой",
            "Darslik va qo'llanmalar": "Учебники и пособия",
            "Xalqaro konferensiyalar": "Международные конференции",
            "Xalqaro grantlar": "Международные гранты",
            "Ilmiy maqolalar": "Научные статьи",
            "Asosiy yutuqlar": "Основные достижения",
            "Hamkor tashkilotlar": "Партнёрские организации",
            "Oliy maktabning ilmiy va ta'lim hamkorlari": "Научные и образовательные партнёры высшей школы",
            "Moddiy-texnika bazasi": "Материально-техническая база",
            "Talabalar ixtiyoridagi zamonaviy imkoniyatlar": "Современные возможности для студентов",
            "Kompyuter sinflari": "Компьютерные классы",
            "Tarjima laboratoriyalari": "Лаборатории перевода",
            "Internet": "Интернет",
            "3 ta zamonaviy kompyuter sinfi, 100 dan ortiq kompyuterlar.":
                "3 современных компьютерных класса, более 100 компьютеров.",
            "2 ta maxsus jihozlangan tarjima laboratoriyasi.":
                "2 специально оборудованные лаборатории перевода.",
            "5000 dan ortiq adabiyotlar va elektron kutubxona.":
                "Более 5000 книг и электронная библиотека.",
            "Yuqori tezlikdagi Internet va Wi-Fi tarmog'i.":
                "Высокоскоростной Интернет и Wi-Fi сеть.",

            // ===== FACULTIES PAGE =====
            "Bakalavriat va magistratura bosqichlaridagi mutaxassisliklar":
                "Специальности уровней бакалавриата и магистратуры",
            "Bakalavriat yo'nalishlari": "Направления бакалавриата",
            "Sharq tillari bo'yicha bakalavr darajasi beriladigan yo'nalishlar":
                "Направления с присвоением степени бакалавра по восточным языкам",
            "Magistratura yo'nalishlari": "Направления магистратуры",
            "Ilmiy-tadqiqot va yuqori malaka beriladigan yo'nalishlar":
                "Научно-исследовательские направления высокой квалификации",
            "Doktorantura (PhD)": "Докторантура (PhD)",
            "Tilshunoslik, tarjimashunoslik va media kommunikatsiyalar yo'nalishlarida ilmiy darajalar.":
                "Учёные степени в области языкознания, переводоведения и медиакоммуникаций.",
            "Jurnalistika: Xalqaro jurnalistika": "Журналистика: Международная журналистика",
            "Bakalavriat": "Бакалавриат",
            "Magistratura": "Магистратура",
            "Oliy maktabda 11 ta sharq tili chuqur o'rganiladi": "В высшей школе глубоко изучаются 11 восточных языков",
            "Arab tili": "Арабский язык",
            "Fors tili": "Персидский язык",
            "Turk tili": "Турецкий язык",
            "Hind tili": "Хинди",
            "Urdu tili": "Урду",
            "Dariy tili": "Дари",
            "Xitoy tili": "Китайский язык",
            "Yapon tili": "Японский язык",
            "Koreys tili": "Корейский язык",
            "Indonez tili": "Индонезийский язык",
            "Malay tili": "Малайский язык",
            "Jami tillar": "Всего языков",

            // ===== TEACHERS PAGE =====
            "Oliy maktabning malakali professor-o'qituvchilar tarkibi":
                "Квалифицированный преподавательский состав высшей школы",
            "O'qituvchimisiz?": "Вы преподаватель?",
            "O'z ilmiy maqolangizni saytimizga joylash uchun quyidagi tugmani bosing":
                "Нажмите кнопку ниже, чтобы опубликовать свою научную статью на сайте",
            "O'z maqolangizni saytimizga joylash uchun quyidagi tugmani bosing":
                "Нажмите кнопку ниже, чтобы опубликовать свою статью на сайте",

            // ===== CONTACT =====
            "Biz bilan bog'laning": "Свяжитесь с нами",
            "Savollaringiz va takliflaringiz uchun har doim ochiqmiz":
                "Мы всегда открыты для ваших вопросов и предложений",
            "Aloqa ma'lumotlari": "Контактная информация",
            "Quyidagi kanallar orqali oliy maktab bilan bog'lanishingiz mumkin":
                "Вы можете связаться с высшей школой по следующим каналам",
            "Manzilimiz": "Наш адрес",
            "Telefon": "Телефон",
            "Email": "Email",
            "Ish vaqti": "Часы работы",
            "Ijtimoiy tarmoqlar": "Социальные сети",
            "Bizni ijtimoiy tarmoqlarda kuzating": "Следите за нами в социальных сетях",
            "Murojaat yuborish": "Отправить обращение",
            "Muammo yoki taklifingizni biz bilan bo'lishing": "Поделитесь своей проблемой или предложением",
            "Eslatma:": "Примечание:",
            "Sizning murojaatingiz 24 soat ichida ko'rib chiqiladi va javob beriladi.":
                "Ваше обращение будет рассмотрено и получит ответ в течение 24 часов.",
            "Ismingiz *": "Ваше имя *",
            "Telefon raqami *": "Номер телефона *",
            "Email *": "Email *",
            "Murojaat turi *": "Тип обращения *",
            "Sarlavha *": "Заголовок *",
            "Xabaringiz *": "Ваше сообщение *",
            "Tanlang...": "Выберите...",
            "Savol": "Вопрос",
            "Taklif": "Предложение",
            "Shikoyat": "Жалоба",
            "Hamkorlik": "Сотрудничество",
            "Boshqa": "Другое",

            // ===== ARTICLES PAGE =====
            "Ilmiy maqolalar": "Научные статьи",
            "O'qituvchilarimiz tomonidan yozilgan ilmiy ishlar va tadqiqotlar":
                "Научные работы и исследования наших преподавателей",
            "Barcha maqolalar": "Все статьи",
            "Universitet o'qituvchilarining ilmiy maqolalari to'plami":
                "Сборник научных статей преподавателей университета",

            // ===== SUBMIT ARTICLE =====
            "O'qituvchilar uchun ilmiy maqola yuborish formasi":
                "Форма отправки научной статьи для преподавателей",
            "Sizning maqolangiz administrator tomonidan ko'rib chiqilgandan so'ng saytda chop etiladi. Tasdiqlash 24-48 soat ichida amalga oshiriladi.":
                "Ваша статья будет опубликована после рассмотрения администратором. Подтверждение осуществляется в течение 24-48 часов.",
            "Yangi maqola yuborish": "Отправить новую статью",
            "O'qituvchi ma'lumotlari": "Данные преподавателя",
            "To'liq ism-sharif *": "Полное имя *",
            "Lavozim *": "Должность *",
            "Ta'lim yo'nalishi *": "Направление обучения *",
            "Qaysi fandan dars beradi *": "Преподаваемая дисциплина *",
            "O'qituvchi rasmi *": "Фото преподавателя *",
            "JPG, PNG formatda, maksimum 2MB": "JPG, PNG формат, максимум 2МБ",
            "Maqola ma'lumotlari": "Данные статьи",
            "Maqola sarlavhasi *": "Заголовок статьи *",
            "Qisqacha tavsif (annotatsiya) *": "Краткое описание (аннотация) *",
            "Maqola matni *": "Текст статьи *",
            "Maqola kategoriyasi *": "Категория статьи *",
            "Kalit so'zlar": "Ключевые слова",
            "Qo'shimcha fayl (ixtiyoriy)": "Дополнительный файл (необязательно)",
            "PDF yoki Word formatda, maksimum 10MB": "PDF или Word формат, максимум 10МБ",
            "Men maqolaning original ekanligini va saytda chop etilishi mumkinligini tasdiqlayman":
                "Я подтверждаю оригинальность статьи и возможность её публикации на сайте",
            "Tarjimashunoslik": "Переводоведение",
            "Tilshunoslik": "Языкознание",
            "Qiyosiy tilshunoslik": "Сравнительное языкознание",
            "Sharq tillari": "Восточные языки",
            "Sharq madaniyati": "Восточная культура",

            // ===== PLACEHOLDERS =====
            "Olimov Akmal Karimovich": "Олимов Акмал Каримович",
            "Professor / Dotsent / O'qituvchi": "Профессор / Доцент / Преподаватель",
            "Arab tili grammatikasi": "Грамматика арабского языка",
            "email@tsuos.uz": "email@tsuos.uz",
            "+998 90 123 45 67": "+998 90 123 45 67",
            "Maqolangiz sarlavhasini kiriting": "Введите заголовок вашей статьи",
            "Maqolangiz haqida qisqacha ma'lumot (200-300 belgi)":
                "Краткая информация о вашей статье (200-300 символов)",
            "Maqolangizning to'liq matnini bu yerga yozing...":
                "Введите полный текст вашей статьи...",
            "til, madaniyat, tarjima": "язык, культура, перевод",
            "Ism familiyangiz": "Ваше имя и фамилия",
            "email@example.com": "email@example.com",
            "Murojaat sarlavhasi": "Заголовок обращения",
            "Murojaatingizni batafsil yozing...": "Подробно опишите ваше обращение..."
        },

        en: {
            // ===== TOP BAR =====
            "Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi": "Higher School of Translation Studies, Linguistics and International Journalism",
            "ISHONCH TELEFONI / CALL CENTER": "HOTLINE / CALL CENTER",
            "ISHONCH TELEFONI": "HOTLINE",

            // ===== NAVIGATION =====
            "BOSH SAHIFA": "HOME",
            "OLIY MAKTAB": "ABOUT",
            "TA'LIM YO'NALISHLARI": "PROGRAMS",
            "O'QITUVCHILAR": "FACULTY",
            "MAQOLALAR": "ARTICLES",
            "ALOQA": "CONTACT",

            // ===== COMMON BUTTONS =====
            "Batafsil": "More",
            "Batafsil ma'lumot": "Learn more",
            "Ko'rish": "View",
            "Yuborish": "Send",
            "Maqola yuborish": "Submit article",
            "Maqolani yuborish": "Submit article",
            "Barcha maqolalar": "All articles",
            "Barcha o'qituvchilar": "All teachers",
            "Barcha yo'nalishlar": "All programs",

            // ===== INDEX HERO =====
            "Toshkent davlat sharqshunoslik universiteti tarkibidagi yetakchi ilmiy-ta'lim maskani":
                "Leading research and education center within Tashkent State University of Oriental Studies",

            // ===== ABOUT SECTION =====
            "Oliy maktab haqida": "About the school",
            "Tarjimon, tilshunos va xalqaro jurnalist tayyorlash markazi":
                "Center for training translators, linguists and international journalists",
            "2024-yildan beri zamonaviy ta'lim": "Modern education since 2024",

            // ===== STATS =====
            "Professor-o'qituvchilar": "Faculty members",
            "Fan doktorlari": "Doctors of Science",
            "Fan nomzodlari": "Candidates of Science",
            "Ta'lim yo'nalishlari": "Programs",
            "O'qitiladigan tillar": "Languages taught",
            "Ilmiy salohiyat": "Academic strength",

            // ===== EDUCATION DIRECTIONS =====
            "Ta'lim yo'nalishlarimiz": "Our programs",
            "Bakalavriat va magistratura bosqichlarida tayyorlanadigan mutaxassisliklar":
                "Specialties offered at Bachelor's and Master's levels",
            "Tarjima nazariyasi va amaliyoti": "Translation theory and practice",
            "Xalqaro jurnalistika": "International journalism",
            "Yo'lboshchi va talqin faoliyati": "Guide-interpreter activity",
            "Qiyosiy tilshunoslik, lingvistik talqin": "Comparative linguistics and interpretation",
            "Sinxron tarjima": "Simultaneous interpretation",
            "Ta'lim yo'nalishlari haqida to'liq ma'lumot oling": "Get full information about our programs",
            "Bakalavriat. Yozma va og'zaki tarjima ko'nikmalarini chuqur egallash.":
                "Bachelor's. In-depth mastery of written and oral translation skills.",
            "Bakalavriat. Xalqaro media va jurnalistika sohasi mutaxassislari.":
                "Bachelor's. Specialists in international media and journalism.",
            "Bakalavriat. Gid-tarjimon va madaniyatlararo muloqot mutaxassisligi.":
                "Bachelor's. Guide-interpreter and intercultural communication specialty.",
            "Magistratura. Tilshunoslik sohasidagi ilmiy tadqiqotlar.":
                "Master's. Research in the field of linguistics.",
            "Magistratura. Sinxron va ketma-ket tarjima bo'yicha yuqori malaka.":
                "Master's. Advanced qualification in simultaneous and consecutive interpretation.",

            // ===== TEACHERS PREVIEW =====
            "Professor-o'qituvchilarimiz": "Our faculty",
            "O'z sohasining malakali mutaxassislari": "Qualified specialists in their fields",
            "Oliy maktab boshlig'i": "Head of the Higher School",
            "Professor": "Professor",
            "Dotsent": "Associate Professor",
            "O'qituvchi": "Lecturer",
            "Filologiya fanlari doktori, dotsent": "Doctor of Philology, Associate Professor",
            "Filologiya fanlari doktori, professor": "Doctor of Philology, Professor",
            "Tarjimashunoslik va sharq tillari mutaxassisi": "Specialist in translation studies and Oriental languages",
            "Tilshunoslik va qiyosiy tadqiqotlar mutaxassisi": "Specialist in linguistics and comparative studies",
            "Sharq tillari va tarjima mutaxassisi": "Specialist in Oriental languages and translation",
            "Tilshunoslik mutaxassisi": "Linguistics specialist",
            "Yoshlar masalalari va ma'naviy-ma'rifiy ishlar bo'yicha birinchi prorektor":
                "First Vice-Rector for Youth Affairs and Spiritual-Educational Work",

            // ===== GALLERY / NEWS =====
            "Oliy maktab hayotidan": "Life at the school",
            "Bizning kundalik faoliyatimizdan lavhalar": "Scenes from our daily activities",
            "O'qituvchilarimiz maqolalari": "Articles by our faculty",
            "Eng so'nggi ilmiy maqolalar va tadqiqotlar": "Latest research articles and studies",
            "Hozircha maqolalar yo'q": "No articles yet",
            "O'qituvchilarimizning maqolalari tez orada bu yerda paydo bo'ladi.":
                "Articles by our faculty will appear here soon.",

            // ===== FOOTER =====
            "Tezkor havolalar": "Quick links",
            "Talabalarga": "For students",
            "Bog'lanish": "Contact",
            "Bosh sahifa": "Home",
            "Oliy maktab": "About",
            "O'qituvchilar": "Faculty",
            "Maqolalar": "Articles",
            "Aloqa": "Contact",
            "Qabul": "Admissions",
            "Stipendiya": "Scholarships",
            "Kutubxona": "Library",
            "E-universitet": "E-university",
            "Toshkent, Amir Temur ko'chasi, 20": "Tashkent, Amir Temur St., 20",
            "Tarjimashunoslik, tilshunoslik va xalqaro jurnalistika oliy maktabi — Toshkent davlat sharqshunoslik universiteti tarkibidagi tarjimon, tilshunos va xalqaro jurnalist tayyorlash markazi.":
                "Higher School of Translation Studies, Linguistics and International Journalism — a center for training translators, linguists and international journalists within Tashkent State University of Oriental Studies.",

            // ===== ABOUT PAGE =====
            "Bizning tariximiz, vazifalarimiz, yutuqlarimiz va moddiy-texnika bazamiz":
                "Our history, mission, achievements and facilities",
            "Oliy maktab tarixi": "History of the school",
            "Tashkil topishi va rivojlanish bosqichlari": "Founding and development stages",
            "Tashkil topishi": "Founding",
            "Rivojlanish bosqichlari": "Development stages",
            "Professor-o'qituvchilar tarkibi": "Faculty composition",
            "2025-2026 o'quv yili holatiga ko'ra": "As of the 2025-2026 academic year",
            "Vazifa va maqsadlar": "Mission and goals",
            "Bizning missiyamiz va asosiy vazifalarimiz": "Our mission and key tasks",
            "Missiyamiz": "Our mission",
            "Asosiy vazifalar": "Key tasks",
            "Yutuqlar": "Achievements",
            "Oliy maktabning erishgan natijalari": "Results achieved by the school",
            "Darslik va qo'llanmalar": "Textbooks and manuals",
            "Xalqaro konferensiyalar": "International conferences",
            "Xalqaro grantlar": "International grants",
            "Ilmiy maqolalar": "Research articles",
            "Asosiy yutuqlar": "Main achievements",
            "Hamkor tashkilotlar": "Partner organizations",
            "Oliy maktabning ilmiy va ta'lim hamkorlari": "Academic and educational partners of the school",
            "Moddiy-texnika bazasi": "Facilities",
            "Talabalar ixtiyoridagi zamonaviy imkoniyatlar": "Modern resources available to students",
            "Kompyuter sinflari": "Computer labs",
            "Tarjima laboratoriyalari": "Translation labs",
            "Internet": "Internet",
            "3 ta zamonaviy kompyuter sinfi, 100 dan ortiq kompyuterlar.":
                "3 modern computer labs, over 100 computers.",
            "2 ta maxsus jihozlangan tarjima laboratoriyasi.":
                "2 specially equipped translation labs.",
            "5000 dan ortiq adabiyotlar va elektron kutubxona.":
                "Over 5,000 books and an electronic library.",
            "Yuqori tezlikdagi Internet va Wi-Fi tarmog'i.":
                "High-speed Internet and Wi-Fi network.",

            // ===== FACULTIES PAGE =====
            "Bakalavriat va magistratura bosqichlaridagi mutaxassisliklar":
                "Specialties offered at Bachelor's and Master's levels",
            "Bakalavriat yo'nalishlari": "Bachelor's programs",
            "Sharq tillari bo'yicha bakalavr darajasi beriladigan yo'nalishlar":
                "Programs leading to a Bachelor's degree in Oriental languages",
            "Magistratura yo'nalishlari": "Master's programs",
            "Ilmiy-tadqiqot va yuqori malaka beriladigan yo'nalishlar":
                "Research-oriented programs with advanced qualification",
            "Doktorantura (PhD)": "Doctoral studies (PhD)",
            "Tilshunoslik, tarjimashunoslik va media kommunikatsiyalar yo'nalishlarida ilmiy darajalar.":
                "Doctoral degrees in linguistics, translation studies and media communications.",
            "Jurnalistika: Xalqaro jurnalistika": "Journalism: International journalism",
            "Bakalavriat": "Bachelor's",
            "Magistratura": "Master's",
            "Oliy maktabda 11 ta sharq tili chuqur o'rganiladi": "The school teaches 11 Oriental languages in depth",
            "Arab tili": "Arabic",
            "Fors tili": "Persian",
            "Turk tili": "Turkish",
            "Hind tili": "Hindi",
            "Urdu tili": "Urdu",
            "Dariy tili": "Dari",
            "Xitoy tili": "Chinese",
            "Yapon tili": "Japanese",
            "Koreys tili": "Korean",
            "Indonez tili": "Indonesian",
            "Malay tili": "Malay",
            "Jami tillar": "Total languages",

            // ===== TEACHERS PAGE =====
            "Oliy maktabning malakali professor-o'qituvchilar tarkibi":
                "Qualified faculty composition of the school",
            "O'qituvchimisiz?": "Are you a faculty member?",
            "O'z ilmiy maqolangizni saytimizga joylash uchun quyidagi tugmani bosing":
                "Click the button below to publish your research article on our site",
            "O'z maqolangizni saytimizga joylash uchun quyidagi tugmani bosing":
                "Click the button below to publish your article on our site",

            // ===== CONTACT =====
            "Biz bilan bog'laning": "Get in touch",
            "Savollaringiz va takliflaringiz uchun har doim ochiqmiz":
                "We are always open to your questions and suggestions",
            "Aloqa ma'lumotlari": "Contact information",
            "Quyidagi kanallar orqali oliy maktab bilan bog'lanishingiz mumkin":
                "You can reach the school through the following channels",
            "Manzilimiz": "Our address",
            "Telefon": "Phone",
            "Email": "Email",
            "Ish vaqti": "Working hours",
            "Ijtimoiy tarmoqlar": "Social media",
            "Bizni ijtimoiy tarmoqlarda kuzating": "Follow us on social media",
            "Murojaat yuborish": "Send a message",
            "Muammo yoki taklifingizni biz bilan bo'lishing": "Share your issue or suggestion with us",
            "Eslatma:": "Note:",
            "Sizning murojaatingiz 24 soat ichida ko'rib chiqiladi va javob beriladi.":
                "Your message will be reviewed and answered within 24 hours.",
            "Ismingiz *": "Your name *",
            "Telefon raqami *": "Phone number *",
            "Email *": "Email *",
            "Murojaat turi *": "Inquiry type *",
            "Sarlavha *": "Subject *",
            "Xabaringiz *": "Your message *",
            "Tanlang...": "Select...",
            "Savol": "Question",
            "Taklif": "Suggestion",
            "Shikoyat": "Complaint",
            "Hamkorlik": "Partnership",
            "Boshqa": "Other",

            // ===== ARTICLES PAGE =====
            "Ilmiy maqolalar": "Research articles",
            "O'qituvchilarimiz tomonidan yozilgan ilmiy ishlar va tadqiqotlar":
                "Research and studies written by our faculty",
            "Barcha maqolalar": "All articles",
            "Universitet o'qituvchilarining ilmiy maqolalari to'plami":
                "Collection of research articles by university faculty",

            // ===== SUBMIT ARTICLE =====
            "O'qituvchilar uchun ilmiy maqola yuborish formasi":
                "Research article submission form for faculty",
            "Sizning maqolangiz administrator tomonidan ko'rib chiqilgandan so'ng saytda chop etiladi. Tasdiqlash 24-48 soat ichida amalga oshiriladi.":
                "Your article will be published after review by the administrator. Approval takes 24-48 hours.",
            "Yangi maqola yuborish": "Submit new article",
            "O'qituvchi ma'lumotlari": "Faculty information",
            "To'liq ism-sharif *": "Full name *",
            "Lavozim *": "Position *",
            "Ta'lim yo'nalishi *": "Program *",
            "Qaysi fandan dars beradi *": "Subject taught *",
            "O'qituvchi rasmi *": "Faculty photo *",
            "JPG, PNG formatda, maksimum 2MB": "JPG, PNG format, max 2MB",
            "Maqola ma'lumotlari": "Article information",
            "Maqola sarlavhasi *": "Article title *",
            "Qisqacha tavsif (annotatsiya) *": "Short description (abstract) *",
            "Maqola matni *": "Article text *",
            "Maqola kategoriyasi *": "Article category *",
            "Kalit so'zlar": "Keywords",
            "Qo'shimcha fayl (ixtiyoriy)": "Additional file (optional)",
            "PDF yoki Word formatda, maksimum 10MB": "PDF or Word format, max 10MB",
            "Men maqolaning original ekanligini va saytda chop etilishi mumkinligini tasdiqlayman":
                "I confirm the originality of the article and that it may be published on the site",
            "Tarjimashunoslik": "Translation Studies",
            "Tilshunoslik": "Linguistics",
            "Qiyosiy tilshunoslik": "Comparative Linguistics",
            "Sharq tillari": "Oriental Languages",
            "Sharq madaniyati": "Oriental Culture",

            // ===== PLACEHOLDERS =====
            "Olimov Akmal Karimovich": "John Smith",
            "Professor / Dotsent / O'qituvchi": "Professor / Associate / Lecturer",
            "Arab tili grammatikasi": "Arabic grammar",
            "Maqolangiz sarlavhasini kiriting": "Enter your article title",
            "Maqolangiz haqida qisqacha ma'lumot (200-300 belgi)":
                "Brief information about your article (200-300 characters)",
            "Maqolangizning to'liq matnini bu yerga yozing...":
                "Write the full text of your article here...",
            "til, madaniyat, tarjima": "language, culture, translation",
            "Ism familiyangiz": "Your name",
            "email@example.com": "email@example.com",
            "Murojaat sarlavhasi": "Inquiry subject",
            "Murojaatingizni batafsil yozing...": "Describe your inquiry in detail..."
        }
    };

    function flagToLang(flag) {
        var alt = (flag.getAttribute('alt') || '').toLowerCase();
        if (alt.indexOf('рус') !== -1 || alt.indexOf('rus') !== -1) return 'ru';
        if (alt.indexOf('english') !== -1 || alt.indexOf('eng') !== -1) return 'en';
        return 'uz';
    }

    function applyTranslation(lang) {
        if (lang === 'uz' || !I18N[lang]) return;
        var dict = I18N[lang];

        // Text nodes
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        var node, nodes = [];
        while ((node = walker.nextNode())) nodes.push(node);

        nodes.forEach(function(n) {
            var raw = n.nodeValue;
            var trimmed = raw.trim();
            if (trimmed && dict[trimmed]) {
                n.nodeValue = raw.replace(trimmed, dict[trimmed]);
            }
        });

        // Placeholder attribute
        document.querySelectorAll('[placeholder]').forEach(function(el) {
            var p = (el.getAttribute('placeholder') || '').trim();
            if (p && dict[p]) el.setAttribute('placeholder', dict[p]);
        });

        // Option text
        document.querySelectorAll('option').forEach(function(el) {
            var t = (el.textContent || '').trim();
            if (t && dict[t]) el.textContent = dict[t];
        });

        // Title attributes (for tooltips)
        document.querySelectorAll('[title]').forEach(function(el) {
            var t = (el.getAttribute('title') || '').trim();
            if (t && dict[t]) el.setAttribute('title', dict[t]);
        });

        // <title>
        var pageTitle = (document.title || '').trim();
        if (dict[pageTitle]) document.title = dict[pageTitle];

        document.documentElement.lang = lang;
    }

    function markActiveFlag(lang) {
        document.querySelectorAll('.flag').forEach(function(flag) {
            var fl = flagToLang(flag);
            if (fl === lang) {
                flag.style.opacity = '1';
                flag.style.outline = '2px solid #4a90d9';
                flag.style.outlineOffset = '1px';
            } else {
                flag.style.opacity = '0.55';
                flag.style.outline = 'none';
            }
        });
    }

    function setLang(lang) {
        try { localStorage.setItem('siteLang', lang); } catch (e) {}
        location.reload();
    }

    function init() {
        var lang = 'uz';
        try { lang = localStorage.getItem('siteLang') || 'uz'; } catch (e) {}

        applyTranslation(lang);
        markActiveFlag(lang);

        document.querySelectorAll('.flag').forEach(function(flag) {
            flag.style.cursor = 'pointer';
            flag.addEventListener('click', function() {
                setLang(flagToLang(this));
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
