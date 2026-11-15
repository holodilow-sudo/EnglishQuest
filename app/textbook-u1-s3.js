(() => {
 const B=window.TextbookBuilder;
 B.activities(1,3,`
41|20|Узнай чудо природы|Выбери фотографию по аудиотексту.|Для номера фотографии нужна запись. По текстам 44 можно отдельно узнать Столбы, Белые скалы и Большой Барьерный риф.|audio
42|20|Названия природных мест|Прочитай Niagara Falls, the Stolby National Park, the Great Barrier Reef, the White Cliffs of Dover.|Сверь произношение с транскрипцией в книге. Названия в тексте доступны для синтезированного чтения.
43|20|Похожие слова|Узнай знакомые по звучанию слова и проверь значения.|Park — парк; metre — метр; national — национальный; unique — уникальный; million — миллион; port — порт; reef — риф; symbol — символ; collection — коллекция; coral — коралл; tourist — турист.
44|20|Три природных объекта|Прочитай тексты на страницах 20–21, найди соответствующие фотографии.|1 Столбы — скальные столбы у Красноярска; 2 Белые скалы — светлый берег у Дувра; 3 риф — подводные кораллы. Сверяй изображение, а не только номер текста.
45|21|Найди доказательство|Найди ответы на шесть вопросов непосредственно в текстах.|Столбы: недалеко от Красноярска, необычные скалы. Скалы Дувра белые из-за мела; путешественники видят их, пересекая Ла-Манш. Риф известен кораллами и разнообразием подводной жизни; туристы приезжают нырять и исследовать.
46|21|Мой выбор|Выбери природное место и объясни желание посетить его.|I would like to visit … because … . Причина должна соответствовать выбранному месту.
47|21|Подбираем заголовки|Выбери заголовки к трём текстам; один лишний.|Столбы — The Guards of the River; Дувр — The Image of the Country; риф — The Unique Sea World. Лишний — The Noisy Wonder.
48|21|Закончи предложения|Используй информацию из текстов.|1 the Yenisey River; 2 one of the official symbols; 3 in Australia / off the coast of Australia. Последняя формулировка точнее описывает морской риф.
49|22|Где это находится?|Соотнеси восемь природных объектов со странами.|Baikal/Stolby — Russia; Niagara — Canada and the USA; Dead Sea — Israel and Jordan в рамках списка книги; White Cliffs — the UK; Great Barrier Reef — Australia; Grand Canyon — the USA; Fujiyama — Japan. Это работа с предложенным списком, не полное описание границ региона.
50|22|Слушаем проверку|Сравни ответ 49 с оригинальной записью.|Запись отсутствует. Географические соответствия 49 доступны в подсказке, но интонацию оригинала без аудио проверить нельзя.|audio
51|22|Разговор после поездки|Спроси друга, что он посетил, что впечатлило и есть ли фотографии.|Where have you been? What is it like? What impressed you most? Have you got any photos? Is it worth visiting? Ответы — по выбранному тексту или реальному опыту.
52|22|Неисчисляемые слова|Разбери правило на примерах water, information, homework, money, news.|Не добавляй a/an и обычное -s к неисчисляемому значению. Information is, money is, news is. Для единицы: a bottle of water, a piece of information. Некоторые слова меняют исчисляемость по значению.
53|23|Нужен ли a/an?|Вставь артикль только перед исчисляемым существительным в единственном числе.|1 —; 2 —; 3 —; 4 a bottle of — mineral water; 5 an interesting book; 6 — milk, — juice, — tea; 7 — ice cream; 8 an orange. Знак — означает отсутствие артикля.
54|23|Is или are?|Поставь форму be, учитывая неисчисляемые значения.|1 is; 2 is; 3 is / will be (объявление будущего выпуска); 4 is; 5 is; 6 is. News выглядит как множественное, но здесь единственное.
55|23|Мини-доклад|Подготовь рассказ о природном объекте: где он, чем известен, бывал ли ты там и хотел бы поехать.|План: It is located … . It is famous for … . I have/haven’t been there. I would like to visit it because … . Если добавляешь новые факты, проверь источник и дату.
ДЗ 7|42|Куршская коса|Вставь слова из рамки и напиши три вопроса.|long; unique; metres/meters; reach; during. Примеры вопросов: Where is it situated? How long is it? Why do birds stop there?
ДЗ 8|42|Перевод о природе|Переведи шесть пунктов с русского на английский.|В материале «Перевод: чудеса природы» есть примеры всех ответов. Сначала попробуй самостоятельно; допустимы другие верные формулировки.
`);
 B.rule(1,3,'u1s3-uncountable',22,'52–54','Неисчисляемые существительные','В значении вещества или абстрактного понятия water, milk, butter, information, homework, money обычно не имеют a/an и окончания -s. С ними is. News тоже согласуется с единственным числом. Считать можно порции и ёмкости: a bottle of water. Не переносим правило на все значения слова: a coffee может обозначать порцию в кафе.',`
There is some butter in the fridge.|В холодильнике есть немного масла.
Your information is useful.|Твоя информация полезна.
No news is good news.|Отсутствие новостей — хорошая новость.
Could I have a bottle of mineral water?|Можно бутылку минеральной воды?
`);
 B.rule(1,3,'u1s3-place',21,'44–51','Где находится и чем известно','Be located / be situated + in/near/along описывает расположение. Be famous for объясняет, чем место известно. Would like to + глагол — хотел бы. Is it worth visiting? — стоит ли посетить? После worth — -ing.',`
The park is located near Krasnoyarsk.|Парк находится недалеко от Красноярска.
It is famous for its unique cliffs.|Он знаменит необычными скалами.
Is it worth visiting?|Стоит ли его посетить?
`);
 B.text(1,3,'u1s3-wonders',20,'44','Столбы, Белые скалы и коралловый риф',`
Столбы|The Stolby National Park is located not far from Krasnoyarsk city. The Park was founded in 1925 and it is famous for its unique rocky cliffs. Several hundred cliffs are situated along the Yenisey River, one of the most beautiful and powerful rivers in the world.|В учебнике парк «Столбы» расположен недалеко от Красноярска. Он основан в 1925 году и знаменит необычными скалами. Сотни скал расположены вдоль Енисея, описанного как одна из красивейших и мощных рек мира.
Столбы|They are 60–90 metres high and have strange curved forms. The local people say that the Park looks like ‘forest giants land’. No wonder that the Stolby National Park attracts lots of tourists.|Их высота — 60–90 метров, а формы необычно изогнуты. Местные жители говорят, что парк похож на страну лесных великанов. Неудивительно, что он привлекает множество туристов.
Дувр|This British wonder of nature is situated in the south of England. The White Cliffs are to the east and west of the town Dover, an important English port. The cliffs are up to 107 metres high and are made of chalk.|Это британское чудо природы расположено на юге Англии. Белые скалы находятся к востоку и западу от важного портового города Дувр. Они достигают 107 метров и состоят из мела.
Дувр|The White Cliffs with their colourful flowers are home to a great number of insects, especially butterflies and grasshoppers. The white line of cliffs is the first sight of England that travellers can see when they cross the English Channel from France. That’s why the White Cliffs of Dover have become one of the official symbols of Britain.|На скалах с разноцветными цветами живёт множество насекомых, особенно бабочек и кузнечиков. Белая линия скал — первый вид Англии для путешественников, пересекающих Ла-Манш из Франции. Поэтому в тексте они названы одним из официальных символов Британии.
Риф|Have you ever been to an underwater garden? Then welcome to the Great Barrier Reef, the largest collection of coral reefs in the world. There are corals of different shapes and sizes, and bright colours. They grow on the ocean floor in warm, clean and clear sea water.|Ты бывал в подводном саду? Добро пожаловать на Большой Барьерный риф — крупнейшую систему коралловых рифов. Здесь яркие кораллы разных форм и размеров. Они растут на дне в тёплой, чистой и прозрачной морской воде.
Риф|Bright fish swim everywhere. Reef fish have amazing colours and patterns which help to protect them from their enemies. The Great Barrier Reef is also full of unique plants and animals. Thousands of tourists come to Australia to dive down and explore the fantastic underwater garden.|Повсюду плавают яркие рыбы. Их удивительная окраска и узоры помогают защищаться от врагов. Здесь много необычных растений и животных. Тысячи туристов приезжают в Австралию нырять и исследовать этот фантастический подводный сад.
`,'Продолжение текстов — на странице 21. Названия, числа и оценки передают текст издания 2019 года; история правового статуса парка здесь не уточняется.');
 B.text(1,3,'u1s3-curonian',42,'ДЗ 7','Куршская коса',`
|The Curonian Spit is situated between Russia and Lithuania. It is 98 km [long]. The fantastic combination of forests, beach and desert makes this place [unique].|Куршская коса расположена между Россией и Литвой. Её длина — 98 километров. Необычное сочетание леса, пляжа и пустыни делает это место уникальным.
|The Curonian Spit is home to the highest moving sand dunes in Europe. Their average height is 35 [meters]. Some of them [reach] a height of 60 meters. Between 10 and 20 million birds fly over the Spit [during] spring and autumn migration. Most of them stop to have a rest on the Curonian Spit.|В тексте коса описана как место самых высоких подвижных песчаных дюн Европы. Их средняя высота — 35 метров, некоторые достигают 60. Во время весенней и осенней миграции над косой пролетают от 10 до 20 миллионов птиц. Большинство останавливается отдохнуть.
`,'Пропуски заполнены словами рамки. Числа относятся к учебному тексту; британское написание metres тоже правильно.');
 B.vocabulary(1,3,'tb-u1s3-words','Природа: описание и вещества',`
be located|располагаться|The park is located near the city.|Парк расположен недалеко от города.|21
cliff|скала, утёс|The cliffs are white.|Скалы белые.|21
chalk|мел|The cliffs are made of chalk.|Скалы состоят из мела.|21
underwater|подводный|It is an underwater garden.|Это подводный сад.|21
coral reef|коралловый риф|We saw a coral reef.|Мы увидели коралловый риф.|21
powerful|мощный|The river is powerful.|Река мощная.|20
protect|защищать|The colours help to protect the fish.|Окраска помогает защищать рыб.|21
enemy|враг|The fish hides from its enemies.|Рыба прячется от врагов.|21
attract|привлекать|The park attracts tourists.|Парк привлекает туристов.|20
information|информация|The information is useful.|Информация полезна.|22
news|новости|The news is good.|Новости хорошие.|22
sand dune|песчаная дюна|The sand dune is high.|Песчаная дюна высокая.|42
`);
 B.quiz(1,3,'tb-u1s3-check','Природа: текст и грамматика',`
Why are the Cliffs of Dover white?|Почему скалы Дувра белые?|They are made of chalk.|They are covered in snow all year.|They are painted.|Причина названа в тексте 44.|21
What is the Great Barrier Reef?|Что такое Большой Барьерный риф?|A collection of coral reefs|A mountain in Russia|A park in London|Упр. 44: подводный мир кораллов.|21
Where is the Stolby Park in the text?|Где расположен парк в тексте?|Near Krasnoyarsk|Near Dover|In Australia|Упр. 44: not far from Krasnoyarsk.|20
Your information … useful.|Твоя информация полезна.|is|are|be|Information — неисчисляемое. Упр. 52–54.|22
Where … the money?|Где деньги?|is|are|am|Money — единственное число в английском. Упр. 54.|23
Could I have … bottle of water?|Можно бутылку воды?|a|an|no article|Bottle — исчисляемое слово, начальный согласный звук. Упр. 53.|23
I am reading … interesting book.|Я читаю интересную книгу.|an|a|some|Перед гласным звуком в interesting — an. Упр. 53.|23
Which sentence is correct?|Какое предложение верно?|The news is good.|The news are good.|A news is good.|News — неисчисляемое слово с формой на -s. Упр. 52.|22
Is it worth … ?|Стоит ли это посетить?|visiting|visit|to visit|После worth используется -ing. Упр. 51.|22
What makes the Curonian Spit unique in the text?|Что делает косу уникальной в тексте?|The combination of forests, beach and desert|A large city centre|An underground railway|ДЗ 7: combination of forests, beach and desert.|42
`);
 B.coverage(1,3,41,55,['7','8']);
})();
