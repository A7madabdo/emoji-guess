// Puzzle list. Edit freely.
//   cat:     category shown on screen (tells players what kind of answer to type)
//   clue:    the emojis
//   answers: first one is shown on the tiles; the rest also count as correct
//            (other spellings, other languages — English, Arabic, Filipino).
//   hard:    true = double base points
// Sources used for the classic ones: typito.com emoji quiz 2026, ahaslides Arabic movie
// quiz, minutebugtong.app Filipino emoji quiz, hellorayo.co.uk emoji lyrics quiz.
window.PUZZLES = [
  // ---------- Movies ----------
  { cat: 'Movie', clue: '🚢🧊💔', answers: ['titanic', 'تايتانيك', 'تايتنك'] },
  { cat: 'Movie', clue: '🎈🏠👴', answers: ['up', 'اب'] },
  { cat: 'Movie', clue: '🦖🏝️🧬', answers: ['jurassic park', 'jurassic world', 'حديقة جوراسيك', 'جوراسيك بارك'] },
  { cat: 'Movie', clue: '👻🚫📞', answers: ['ghostbusters', 'ghost busters', 'صائدو الاشباح', 'صائدو الأشباح'], hard: true },
  { cat: 'Movie', clue: '💍🌋👁️', answers: ['lord rings', 'lord of the rings', 'the lord of the rings', 'سيد الخواتم'] },
  { cat: 'Movie', clue: '🥊🐅👁️', answers: ['rocky', 'روكي'] },
  { cat: 'Movie', clue: '👽🚲🌕', answers: ['et', 'e t', 'إي تي', 'اي تي'], hard: true },
  { cat: 'Movie', clue: '🍫🎫🏭', answers: ['willy wonka', 'charlie and the chocolate factory', 'willy wonka and the chocolate factory', 'ويلي ونكا', 'مصنع الشوكولاتة'] },
  { cat: 'Movie', clue: '🐼🥋', answers: ['kungfu panda', 'kung fu panda', 'kungfu panda', 'كونغ فو باندا', 'كونج فو باندا'] },
  { cat: 'Movie', clue: '🔎🐠', answers: ['finding nemo', 'nemo', 'البحث عن نيمو', 'نيمو'] },
  { cat: 'Movie', clue: '👸🐸💋', answers: ['princess frog', 'the princess and the frog', 'princess and the frog', 'الاميرة والضفدع', 'الأميرة والضفدع'] },
  { cat: 'Movie', clue: '🤖❤️🌱', answers: ['wall e', 'walle', 'وال اي', 'وول اي'], hard: true },
  { cat: 'Movie', clue: '🃏🤫🦇', answers: ['dark knight', 'the dark knight', 'dark knight', 'batman', 'فارس الظلام', 'باتمان'] },
  { cat: 'Movie', clue: '🏎️⚡🔧👨‍👩‍👧', answers: ['fast furious', 'fast and furious', 'fast furious', 'the fast and the furious', 'السرعة والغضب', 'فاست اند فيوريس'] },
  { cat: 'Movie', clue: '🧙⚡🦉', answers: ['harry potter', 'هاري بوتر'] },
  { cat: 'Movie', clue: '🤡🎈🚽', answers: ['it', 'ات'], hard: true },
  { cat: 'Movie', clue: '🦈🏖️🩸', answers: ['jaws', 'الفك المفترس'] },
  { cat: 'Movie', clue: '🏠👦😱🎄', answers: ['home alone', 'وحيد في المنزل'] },
  { cat: 'Movie', clue: '🧸🤠🚀', answers: ['toy story', 'حكاية لعبة', 'توي ستوري'] },
  { cat: 'Movie', clue: '💃🪩🎻🇸🇦', answers: ['barbie', 'باربي'] },
  { cat: 'Movie', clue: '👨🏾‍🦱👑🐆🌍', answers: ['black panther', 'النمر الاسود', 'النمر الأسود', 'بلاك بانثر'] },

  // ---------- Songs ----------
  { cat: 'Song', clue: '👶🦈🌊', answers: ['baby shark', 'بيبي شارك'] },
  { cat: 'Song', clue: '🔥🎆💥', answers: ['firework', 'fireworks'] },
  { cat: 'Song', clue: '♠️🃏😐', answers: ['poker face'] },
  { cat: 'Song', clue: '🕺👸', answers: ['dancing queen'] },
  { cat: 'Song', clue: '🧟‍♂️🕺🌕', answers: ['thriller'], hard: true },
  { cat: 'Song', clue: '☂️☂️☂️', answers: ['umbrella'] },
  { cat: 'Song', clue: '🤠🛣️🐎', answers: ['town road', 'old town road'] },
  { cat: 'Song', clue: '💎💎💎✨', answers: ['diamonds'] },

  // ---------- English sayings ----------
  { cat: 'Saying', clue: '🌧️🐈🐕', answers: ['cats dogs', 'cats and dogs', 'raining cats and dogs', 'its raining cats and dogs', "it's raining cats and dogs"] },
  { cat: 'Saying', clue: '🐷✈️', answers: ['pigs fly', 'when pigs fly', 'pigs fly'] },
  { cat: 'Saying', clue: '🍰🧩', answers: ['cake piece', 'piece of cake', 'a piece of cake'] },
  { cat: 'Saying', clue: '🕰️💰', answers: ['time money', 'time is money'] },
  { cat: 'Saying', clue: '🥶🦶🦶', answers: ['cold feet'] },
  { cat: 'Saying', clue: '📖🐛', answers: ['bookworm', 'book worm'] },
  { cat: 'Saying', clue: '🛌🪵', answers: ['sleep log', 'sleep like a log', 'sleeping like a log'] },
  { cat: 'Saying', clue: '😢🥛', answers: ['spilled milk', 'cry over spilled milk', 'crying over spilled milk', 'cry over spilt milk'] },
  { cat: 'Saying', clue: '🤜🪵', answers: ['knock wood', 'knock on wood', 'touch wood'] },

  // ---------- Silly & light ----------
  { cat: 'Silly', clue: '🧛🩸🦷', answers: ['vampire', 'dracula', 'مصاص دماء', 'دراكولا', 'bampira'] },
  { cat: 'Silly', clue: '🧟🧠🚶', answers: ['zombie', 'زومبي'] },
  { cat: 'Silly', clue: '🧜‍♀️🌊🎶', answers: ['mermaid', 'حورية البحر', 'حورية', 'sirena'] },
  { cat: 'Silly', clue: '🤡🎪🎈', answers: ['clown', 'مهرج', 'payaso'] },
  { cat: 'Silly', clue: '🦸‍♂️🕶️💪', answers: ['superhero', 'super hero', 'بطل خارق', 'سوبر هيرو'] },
  { cat: 'Silly', clue: '🤖🧹🧽', answers: ['robot', 'روبوت'] },
  { cat: 'Silly', clue: '👻🏚️😱', answers: ['haunted house', 'ghost house', 'بيت مسكون', 'بيت الاشباح'] },
  { cat: 'Silly', clue: '🤳😘✨', answers: ['selfie', 'سيلفي'] },
  { cat: 'Silly', clue: '😴📺🍿🛋️', answers: ['netflix', 'نتفلكس', 'movie night', 'binge'] },
  { cat: 'Silly', clue: '💃🕺🪩', answers: ['party', 'disco', 'حفلة', 'ديسكو', 'parti'] },
  { cat: 'Silly', clue: '🍕😍🍕😍', answers: ['pizza', 'بيتزا'] },
  { cat: 'Silly', clue: '👨‍🍳🔥😱🍳', answers: ['burnt food', 'burned food', 'burnt', 'الاكل احترق', 'sunog'], hard: true },
  { cat: 'Silly', clue: '⏰😴🙈🏃', answers: ['late', 'overslept', 'late for work', 'متأخر', 'متاخر', 'huli'] },
  { cat: 'Silly', clue: '📱🔋😱', answers: ['low battery', 'battery', 'البطارية', 'لوباتري'] },
  { cat: 'Silly', clue: '🍔🍟🥤😋', answers: ['fast food', 'burger', 'برجر', 'برغر', 'هامبرغر'] },
  { cat: 'Silly', clue: '🛌😴🐑🐑🐑', answers: ['sleep', 'counting sheep', 'نوم', 'tulog'] },
  { cat: 'Silly', clue: '🎂🤫🎉😱', answers: ['surprise party', 'surprise', 'مفاجأة', 'مفاجاة', 'sorpresa'] },
  { cat: 'Silly', clue: '💇‍♀️😱🪞', answers: ['bad haircut', 'haircut', 'قصة شعر', 'gupit'], hard: true },

  // ---------- Animals ----------
  { cat: 'Animal', clue: '🐧🧊🤵', answers: ['penguin', 'بطريق', 'penguin'] },
  { cat: 'Animal', clue: '📏🟡🟤🌳', answers: ['giraffe', 'زرافة', 'زرافه', 'dyirap'] },
  { cat: 'Animal', clue: '🐌🏎️💨', answers: ['snail', 'حلزون', 'suso'] },
  { cat: 'Animal', clue: '😴🌳🐾💤', answers: ['sloth', 'كسلان', 'الكسلان'] },
  { cat: 'Animal', clue: '🎸🎸🎸🎸🌊', answers: ['octopus', 'اخطبوط', 'أخطبوط', 'pugita'] },
  { cat: 'Animal', clue: '🐪🏜️💧', answers: ['camel', 'جمل', 'kamelyo'] },
  { cat: 'Animal', clue: '🦇🌙🙃', answers: ['bat', 'خفاش', 'paniki'] },
  { cat: 'Animal', clue: '🐝🍯👑', answers: ['queen bee', 'bee', 'ملكة النحل', 'نحلة', 'reyna bubuyog'] },
  { cat: 'Animal', clue: '🦁💤👑', answers: ['lion', 'اسد', 'أسد', 'leon'] },
  { cat: 'Animal', clue: '🐔🥚❓🐔', answers: ['chicken egg', 'chicken or egg', 'chicken and egg', 'chicken', 'الدجاجة ام البيضة', 'الدجاجة والبيضة'], hard: true },

  // ---------- Filipino (Pinoy) ----------
  { cat: 'Pinoy food', clue: '🐷🔥🎉', answers: ['lechon', 'litson', 'ليتشون'] },
  { cat: 'Pinoy food', clue: '🍮🥚🥛', answers: ['leche flan', 'lecheflan', 'flan'] },
  { cat: 'Pinoy food', clue: '🍜🎂🙏', answers: ['pancit', 'pansit'] },
  { cat: 'Pinoy food', clue: '🥥🧊🍧🟣', answers: ['halo halo', 'halo-halo', 'halohalo'] },
  { cat: 'Pinoy food', clue: '🍢🐟🏀', answers: ['fishball', 'fish ball', 'fishballs'] },
  { cat: 'Pinoy food', clue: '🍗🧄🥘🖤', answers: ['adobo'] },
  { cat: 'Pinoy place', clue: '🌋👌🏽', answers: ['mayon', 'mayon volcano', 'bulkang mayon'] },
  { cat: 'Pinoy place', clue: '🏝️🏖️🎉🍹', answers: ['boracay'] },
  { cat: 'Pinoy place', clue: '🍫⛰️⛰️⛰️', answers: ['chocolate hills'] },
  { cat: 'Pinoy place', clue: '🚕🚕🚕😩', answers: ['edsa', 'edsa traffic', 'traffic'] },
  { cat: 'Pinoy word', clue: '🚌🎨🪙', answers: ['jeepney', 'dyip', 'jeep'] },
  { cat: 'Pinoy word', clue: '🎤🎶🍻', answers: ['videoke', 'karaoke', 'كاريوكي'] },
  { cat: 'Pinoy word', clue: '🌈🌧️☀️', answers: ['bahaghari', 'rainbow', 'قوس قزح'] },
  { cat: 'Pinoy word', clue: '🏠❤️👨‍👩‍👧‍👦', answers: ['pamilya', 'family', 'عائلة', 'tahanan'] },

  // ---------- Brands & things ----------
  { cat: 'Brand', clue: '🍎📱', answers: ['apple', 'iphone', 'ابل', 'آبل', 'ايفون'] },
  { cat: 'Brand', clue: '👟✔️', answers: ['nike', 'نايك', 'نايكي'] },
  { cat: 'Brand', clue: '🟡Ⓜ️🍟', answers: ['mcdonalds', "mcdonald's", 'ماكدونالدز', 'ماك', 'mcdo'] },
  { cat: 'Brand', clue: '🧜‍♀️☕🟢', answers: ['starbucks', 'ستاربكس', 'ستاربوكس'] },
  { cat: 'Brand', clue: '🐦🔵✖️', answers: ['twitter', 'x', 'تويتر', 'اكس'] },
  { cat: 'Brand', clue: '🎵⏱️📱', answers: ['tiktok', 'tik tok', 'تيك توك', 'تيكتوك'] },
  { cat: 'Brand', clue: '👻📸🟡', answers: ['snapchat', 'snap', 'سناب شات', 'سناب'] },
  { cat: 'Brand', clue: '🎮🅿️🔷', answers: ['playstation', 'play station', 'ps5', 'بلايستيشن', 'بلاي ستيشن'] },
  { cat: 'Brand', clue: '🚗⚡🚀', answers: ['tesla', 'تسلا', 'تيسلا'] },
  { cat: 'Brand', clue: '🛒📦😊', answers: ['amazon', 'امازون', 'أمازون'] },
];
