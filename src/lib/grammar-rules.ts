import type { CEFRLevel } from '@/lib/resources';

export type GrammarCategory =
  | 'nouns' | 'verbs' | 'adjectives' | 'pronouns' | 'prepositions'
  | 'sentence-structure' | 'conjunctions' | 'word-order' | 'tense' | 'adverbs';

export interface GrammarExample {
  norwegian: string;
  english: string;
  notes?: string;
}

export interface GrammarExercise {
  type: 'fill-in-the-blank' | 'multiple-choice';
  prompt: string;
  answer: string;
  options?: string[];
  hint?: string;
}

export interface GrammarRule {
  id: string;
  title: string;
  category: GrammarCategory;
  level: CEFRLevel;
  explanation: string;
  explanationEnglish: string;
  examples: GrammarExample[];
  tags: string[];
  exercises: GrammarExercise[];
}

export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  nouns: 'Substantiver',
  verbs: 'Verb',
  adjectives: 'Adjektiver',
  pronouns: 'Pronomen',
  prepositions: 'Preposisjoner',
  'sentence-structure': 'Setningsstruktur',
  conjunctions: 'Konjunksjoner',
  'word-order': 'Ordstilling',
  tense: 'Tempus',
  adverbs: 'Adverb',
};

export const GRAMMAR_RULES: GrammarRule[] = [
  // A1 Rules
  {
    id: 'definite-article-singular',
    title: 'Definite Article (Singular)',
    category: 'nouns',
    level: 'A1',
    explanation:
      'På norsk legger vi til en ending på substantivet for å gjøre det bestemt. Hankjønn får «-en», hunkjønn får «-a» (eller «-en»), og intetkjønn får «-et». Eksempel: «hus» blir «huset», «bil» blir «bilen».',
    explanationEnglish:
      'In Norwegian, the definite article is added as a suffix to the noun. Masculine nouns get "-en", feminine nouns get "-a" (or "-en"), and neuter nouns get "-et". Example: "hus" becomes "huset", "bil" becomes "bilen".',
    examples: [
      { norwegian: 'en bil → bilen', english: 'a car → the car' },
      { norwegian: 'et hus → huset', english: 'a house → the house' },
      { norwegian: 'ei jente → jenta', english: 'a girl → the girl', notes: 'Feminine form' },
    ],
    tags: ['bestemt', 'artikkel', 'substantiv', 'definite', 'article', 'noun'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Gjør substantivet bestemt: «en bok» → ___',
        answer: 'boken',
        hint: 'Masculine nouns get -en',
      },
      {
        type: 'multiple-choice',
        prompt: 'Hva er bestemt form av «et barn»?',
        answer: 'barnet',
        options: ['barnen', 'barnet', 'barna', 'barn'],
        hint: 'Neuter nouns get -et',
      },
    ],
  },
  {
    id: 'present-tense-regular',
    title: 'Present Tense (Regular Verbs)',
    category: 'verbs',
    level: 'A1',
    explanation:
      'Norske verb i presens er enkle! Vi legger til «-r» på infinitiven. Verb som slutter på «-e» beholder «-e» og legger til «-r». «å snakke» → «snakker», «å bo» → «bor». Presens brukes for å beskrive noe som skjer nå eller regelmessig.',
    explanationEnglish:
      'Norwegian present tense is simple! We add "-r" to the infinitive. Verbs ending in "-e" keep the "-e" and add "-r". "å snakke" → "snakker", "å bo" → "bor". Present tense describes what happens now or regularly.',
    examples: [
      { norwegian: 'Jeg snakker norsk.', english: 'I speak Norwegian.' },
      { norwegian: 'Hun bor i Oslo.', english: 'She lives in Oslo.' },
      { norwegian: 'Vi spiser middag.', english: 'We eat dinner.' },
    ],
    tags: ['presens', 'verb', 'present', 'tense', 'regular', '-r'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Bøy verbet: Jeg ___ (å lese) en bok.',
        answer: 'leser',
        hint: 'Add -r to the infinitive stem',
      },
      {
        type: 'multiple-choice',
        prompt: 'Hva er presens av «å jobbe»?',
        answer: 'jobber',
        options: ['jobb', 'jobbet', 'jobber', 'jobbe'],
        hint: 'Add -r to the infinitive',
      },
    ],
  },
  {
    id: 'personal-pronouns',
    title: 'Personal Pronouns',
    category: 'pronouns',
    level: 'A1',
    explanation:
      'Norsk har personlige pronomen for alle personer: «jeg» (1. person entall), «du» (2. person), «han/hun/den/det» (3. person entall), «vi» (1. person flertall), «dere» (2. person flertall), «de» (3. person flertall). «De» brukes sjelden som høflighetsform i moderne norsk.',
    explanationEnglish:
      'Norwegian has personal pronouns for all persons: "jeg" (1st person singular), "du" (2nd person), "han/hun/den/det" (3rd person singular), "vi" (1st person plural), "dere" (2nd person plural), "de" (3rd person plural). "De" is rarely used as a formal form in modern Norwegian.',
    examples: [
      { norwegian: 'Jeg heter Kari.', english: 'My name is Kari.' },
      { norwegian: 'Han er student.', english: 'He is a student.' },
      { norwegian: 'Vi liker kaffe.', english: 'We like coffee.' },
    ],
    tags: ['pronomen', 'pronoun', 'jeg', 'du', 'vi', 'personal'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva betyr «dere»?',
        answer: 'you (plural)',
        options: ['we', 'they', 'you (plural)', 'you (singular)'],
        hint: 'Think about who you are talking TO (more than one person)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: '___ er fra Norge. (She)',
        answer: 'Hun',
        hint: 'The Norwegian word for "she"',
      },
    ],
  },

  // A2 Rules
  {
    id: 'preteritum-weak',
    title: 'Simple Past (Weak Verbs)',
    category: 'tense',
    level: 'A2',
    explanation:
      'Fortidsformen (preteritum) av svake verb dannes ved å legge til en ending på verbstammen. Det finnes fire grupper: gruppe 1 (snakke → snakket), gruppe 2 (kjøpe → kjøpte), gruppe 3 (bo → bodde), gruppe 4 (tro → trodde). Gruppe 1 er vanligst.',
    explanationEnglish:
      'The simple past (preteritum) of weak verbs is formed by adding an ending to the verb stem. There are four groups: group 1 (snakke → snakket), group 2 (kjøpe → kjøpte), group 3 (bo → bodde), group 4 (tro → trodde). Group 1 is the most common.',
    examples: [
      { norwegian: 'Jeg snakket med ham i går.', english: 'I spoke with him yesterday.', notes: 'Group 1: -et ending' },
      { norwegian: 'Hun kjøpte en ny bil.', english: 'She bought a new car.', notes: 'Group 2: -te ending' },
      { norwegian: 'Vi bodde i Bergen.', english: 'We lived in Bergen.', notes: 'Group 3: -dde ending' },
    ],
    tags: ['preteritum', 'fortid', 'past', 'tense', 'svake verb', 'weak verbs'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er preteritum av «å snakke»?',
        answer: 'snakket',
        options: ['snakkte', 'snakket', 'snakte', 'snakke'],
        hint: 'Group 1 verbs get -et',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Jeg ___ (å spise) frokost klokka sju.',
        answer: 'spiste',
        hint: 'Group 2 verb: -te ending',
      },
    ],
  },
  {
    id: 'adjective-agreement',
    title: 'Adjective Agreement',
    category: 'adjectives',
    level: 'A2',
    explanation:
      'Adjektiver må bøyes etter substantivets kjønn og tall. I ubestemt form entall: hankjønn/hunkjønn bruker grunnformen, intetkjønn legger til «-t». I flertall legger alle til «-e». I bestemt form legger alle til «-e»: «den store bilen», «det store huset».',
    explanationEnglish:
      'Adjectives must agree with the gender and number of the noun. In indefinite singular: masculine/feminine use the base form, neuter adds "-t". In plural, all add "-e". In definite form, all add "-e": "den store bilen" (the big car), "det store huset" (the big house).',
    examples: [
      { norwegian: 'en stor bil / et stort hus', english: 'a big car / a big house', notes: 'Indefinite singular' },
      { norwegian: 'store biler / store hus', english: 'big cars / big houses', notes: 'Plural' },
      { norwegian: 'den store bilen / det store huset', english: 'the big car / the big house', notes: 'Definite form' },
    ],
    tags: ['adjektiv', 'adjective', 'bøying', 'agreement', 'kjønn', 'gender'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «et ___ barn»',
        answer: 'lite',
        options: ['liten', 'lita', 'lite', 'lille'],
        hint: 'Neuter indefinite form gets -t (liten → lite)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Den ___ (gammel) mannen sitter der.',
        answer: 'gamle',
        hint: 'Definite form adjective gets -e',
      },
    ],
  },
  {
    id: 'ikke-negation',
    title: 'Negation with "ikke"',
    category: 'word-order',
    level: 'A2',
    explanation:
      'For å nekte en setning bruker vi «ikke». I en hovedsetning plasseres «ikke» etter det bøyde verbet: «Jeg spiser ikke fisk.» I en leddsetning (etter «fordi», «at», osv.) plasseres «ikke» foran det bøyde verbet: «…fordi jeg ikke liker fisk.»',
    explanationEnglish:
      'To negate a sentence, we use "ikke". In a main clause, "ikke" comes after the conjugated verb: "Jeg spiser ikke fisk." In a subordinate clause (after "fordi", "at", etc.), "ikke" comes before the conjugated verb: "…fordi jeg ikke liker fisk."',
    examples: [
      { norwegian: 'Jeg snakker ikke tysk.', english: 'I do not speak German.', notes: 'Main clause' },
      { norwegian: 'Han er ikke hjemme.', english: 'He is not at home.' },
      { norwegian: 'Jeg vet at han ikke kommer.', english: 'I know that he is not coming.', notes: 'Subordinate clause: ikke before verb' },
    ],
    tags: ['ikke', 'negation', 'nekte', 'ordstilling', 'word order', 'negasjon'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hvor skal «ikke» være? «Jeg ___ forstår norsk ___»',
        answer: 'Jeg forstår ikke norsk',
        options: ['Jeg ikke forstår norsk', 'Jeg forstår ikke norsk', 'Ikke jeg forstår norsk', 'Jeg forstår norsk ikke'],
        hint: '"Ikke" comes after the conjugated verb in main clauses',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Hun liker ___ kaffe. (She does not like coffee.)',
        answer: 'ikke',
        hint: 'The Norwegian negation word',
      },
    ],
  },

  // B1 Rules
  {
    id: 'preposition-i-pa',
    title: 'Prepositions: i vs. på',
    category: 'prepositions',
    level: 'B1',
    explanation:
      'Bruken av «i» og «på» er ikke alltid intuitiv for engelsktalende. «I» brukes for lukkede rom og steder man er inne i: «i huset», «i Bergen», «i Norge». «På» brukes for åpne steder, overflater, og visse faste uttrykk: «på kjøkkenet», «på skolen», «på fjellet». Noen unntak må læres utenat.',
    explanationEnglish:
      'The use of "i" and "på" is not always intuitive for English speakers. "I" is used for enclosed spaces and places you are inside: "i huset" (in the house), "i Bergen", "i Norge". "På" is used for open places, surfaces, and certain fixed expressions: "på kjøkkenet" (in the kitchen), "på skolen" (at school), "på fjellet" (in the mountains).',
    examples: [
      { norwegian: 'Hun bor i Oslo.', english: 'She lives in Oslo.', notes: 'City: use "i"' },
      { norwegian: 'Han er på skolen.', english: 'He is at school.', notes: 'Fixed expression with "på"' },
      { norwegian: 'Vi er på fjellet.', english: 'We are in the mountains.', notes: '"på" for mountains/open areas' },
    ],
    tags: ['preposisjon', 'preposition', 'i', 'på', 'sted', 'place'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig preposisjon: «Jeg jobber ___ butikken.»',
        answer: 'i',
        options: ['i', 'på', 'ved', 'til'],
        hint: 'A shop is an enclosed space',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Barna er ___ skolen nå.',
        answer: 'på',
        hint: 'School is a fixed expression that uses "på"',
      },
    ],
  },
  {
    id: 'relative-clauses',
    title: 'Relative Clauses with "som"',
    category: 'sentence-structure',
    level: 'B1',
    explanation:
      'Relativsetninger innledes av «som» (som = who/which/that). «Som» kan referere til både personer og ting. Det er ingen forskjell på «who» og «which» på norsk. Eksempel: «Mannen som bor der er lege.» / «Boken som jeg leste var interessant.» «Som» kan utelates i uformelt språk bare når det er objekt.',
    explanationEnglish:
      'Relative clauses are introduced by "som" (who/which/that). "Som" can refer to both people and things — there is no difference between "who" and "which" in Norwegian. Example: "Mannen som bor der er lege." / "Boken som jeg leste var interessant." "Som" can be omitted informally only when it is the object.',
    examples: [
      { norwegian: 'Jenta som synger, heter Sara.', english: 'The girl who is singing is called Sara.' },
      { norwegian: 'Huset som vi kjøpte, er gammelt.', english: 'The house that we bought is old.' },
      { norwegian: 'Boken (som) jeg leste var god.', english: 'The book (that) I read was good.', notes: '"som" optional as object' },
    ],
    tags: ['som', 'relativsetning', 'relative clause', 'who', 'which', 'that'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Mannen ___ bor her er min nabo.',
        answer: 'som',
        hint: 'The Norwegian relative pronoun (who/which/that)',
      },
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «Filmen ___ vi så var bra.»',
        answer: 'som',
        options: ['som', 'hvilken', 'der', 'hvem'],
        hint: '"Som" works for both people and things',
      },
    ],
  },
  {
    id: 'modal-verbs',
    title: 'Modal Verbs',
    category: 'verbs',
    level: 'B1',
    explanation:
      'Modale hjelpeverb på norsk er: «kan» (can/may), «vil» (will/want), «skal» (shall/will), «må» (must), «bør» (should), «får» (may/is allowed). De bøyes likt for alle personer og følges av infinitiv uten «å». «Skal» uttrykker plan/hensikt, «vil» uttrykker ønske, «må» uttrykker plikt eller nødvendighet.',
    explanationEnglish:
      'Modal auxiliary verbs in Norwegian are: "kan" (can/may), "vil" (will/want), "skal" (shall/will), "må" (must), "bør" (should), "får" (may/is allowed). They are conjugated the same for all persons and are followed by an infinitive without "å". "Skal" expresses plans/intentions, "vil" expresses desire, "må" expresses obligation or necessity.',
    examples: [
      { norwegian: 'Jeg kan svømme.', english: 'I can swim.', notes: '"kan" = ability' },
      { norwegian: 'Du må komme i tide.', english: 'You must come on time.', notes: '"må" = obligation' },
      { norwegian: 'Vi skal reise til Bergen.', english: 'We are going to travel to Bergen.', notes: '"skal" = plan' },
    ],
    tags: ['modal', 'hjelpeverb', 'kan', 'vil', 'skal', 'må', 'bør', 'auxiliary'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva betyr «du bør trene mer»?',
        answer: 'you should exercise more',
        options: ['you must exercise more', 'you should exercise more', 'you can exercise more', 'you want to exercise more'],
        hint: '"Bør" expresses advice/recommendation',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Jeg ___ ikke forstå ham. (I could not understand him.)',
        answer: 'kunne',
        hint: 'Past tense of "kan"',
      },
    ],
  },

  // A1 additional rules
  {
    id: 'noun-genders',
    title: 'Noun Genders (en / ei / et)',
    category: 'nouns',
    level: 'A1',
    explanation:
      'Norske substantiver har tre kjønn: hankjønn (en), hunkjønn (ei) og intetkjønn (et). Artikkelen viser kjønnet. De fleste substantiver er hankjønn. Hunkjønnsord kan også bruke «en» i bokmål. Kjønnet bestemmer ending i bestemt form og adjektivbøying.',
    explanationEnglish:
      'Norwegian nouns have three genders: masculine (en), feminine (ei), and neuter (et). The article shows the gender. Most nouns are masculine. Feminine nouns can also use "en" in Bokmål. Gender determines the definite suffix and adjective agreement.',
    examples: [
      { norwegian: 'en bil (bilen)', english: 'a car (the car)', notes: 'Masculine — most common' },
      { norwegian: 'ei jente / en jente (jenta / jenten)', english: 'a girl (the girl)', notes: 'Feminine — ei or en both accepted' },
      { norwegian: 'et barn (barnet)', english: 'a child (the child)', notes: 'Neuter' },
    ],
    tags: ['kjønn', 'gender', 'en', 'ei', 'et', 'artikkel', 'article', 'masculin', 'feminin', 'nøytrum'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hvilken artikkel bruker «hus»?',
        answer: 'et',
        options: ['en', 'ei', 'et', 'den'],
        hint: 'Houses are neuter in Norwegian',
      },
      {
        type: 'fill-in-the-blank',
        prompt: '___ bok ligger på bordet. (A book lies on the table.)',
        answer: 'en',
        hint: '"Bok" (book) is a feminine noun, but "en" is also accepted',
      },
    ],
  },
  {
    id: 'noun-plurals-indefinite',
    title: 'Indefinite Plural Forms',
    category: 'nouns',
    level: 'A1',
    explanation:
      'Flertall ubestemt form dannes på tre måter. Gruppe 1: legg til «-er» (en bil → biler, en stol → stoler). Gruppe 2: substantiver som slutter på «-e» får bare «-r» (ei jente → jenter, en dame → damer). Gruppe 3: intetkjønnsord med én stavelse har ingen ending (et hus → hus, et barn → barn).',
    explanationEnglish:
      'Indefinite plural is formed three ways. Group 1: add "-er" (en bil → biler). Group 2: nouns already ending in "-e" just add "-r" (ei jente → jenter). Group 3: neuter monosyllables take no ending (et hus → hus, et barn → barn). Some nouns have irregular plurals (en mann → menn, et tre → trær).',
    examples: [
      { norwegian: 'en bil → biler', english: 'a car → cars', notes: 'Group 1: add -er' },
      { norwegian: 'ei jente → jenter', english: 'a girl → girls', notes: 'Group 2: add -r (already ends in -e)' },
      { norwegian: 'et hus → hus', english: 'a house → houses', notes: 'Group 3: no ending (neuter monosyllable)' },
    ],
    tags: ['flertall', 'plural', 'ubestemt', 'indefinite', '-er', '-r', 'substantiv', 'nouns'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er flertall av «en stol»?',
        answer: 'stoler',
        options: ['stolr', 'stoler', 'stols', 'stole'],
        hint: 'Group 1: add -er to the stem',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Det er mange ___ (barn) i parken.',
        answer: 'barn',
        hint: 'Neuter monosyllables have no plural ending',
      },
    ],
  },
  {
    id: 'subject-object-pronouns',
    title: 'Subject vs. Object Pronouns',
    category: 'pronouns',
    level: 'A1',
    explanation:
      'Norsk har to pronomenformer: subjektsform (brukes foran verb) og objektsform (brukes etter verb eller preposisjon). Subjekt: jeg, du, han, hun, det/den, vi, dere, de. Objekt: meg, deg, ham, henne, det/den, oss, dere, dem. Eksempel: «Jeg ser ham» — «jeg» er subjekt, «ham» er objekt.',
    explanationEnglish:
      'Norwegian has two pronoun forms: subject form (used before the verb) and object form (used after the verb or preposition). Subject: jeg, du, han, hun, det/den, vi, dere, de. Object: meg, deg, ham, henne, det/den, oss, dere, dem. Example: "Jeg ser ham" — "jeg" is subject, "ham" is object.',
    examples: [
      { norwegian: 'Jeg hjelper ham.', english: 'I help him.', notes: 'jeg = subject, ham = object' },
      { norwegian: 'Hun liker oss.', english: 'She likes us.', notes: 'hun = subject, oss = object' },
      { norwegian: 'De inviterte meg.', english: 'They invited me.', notes: 'de = subject, meg = object' },
    ],
    tags: ['pronomen', 'pronoun', 'subjekt', 'objekt', 'meg', 'deg', 'ham', 'henne', 'oss', 'dem'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «Kan du hjelpe ___?» (me)',
        answer: 'meg',
        options: ['jeg', 'meg', 'mi', 'min'],
        hint: 'Object form of "jeg" (I)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Vi liker ___ (them) godt.',
        answer: 'dem',
        hint: 'Object form of "de" (they)',
      },
    ],
  },
  {
    id: 'question-words',
    title: 'Question Words',
    category: 'sentence-structure',
    level: 'A1',
    explanation:
      'Spørreord brukes til å stille spørsmål. De viktigste er: «hva» (what), «hvem» (who), «hvor» (where), «hvordan» (how), «hvorfor» (why), «når» (when). «Hvilken/hvilket/hvilke» betyr «which» og bøyes etter kjønn og tall. Spørreordet er alltid første ledd i setningen, og verbet kommer på andre plass.',
    explanationEnglish:
      'Question words are used to ask questions. The most important are: "hva" (what), "hvem" (who), "hvor" (where), "hvordan" (how), "hvorfor" (why), "når" (when). "Hvilken/hvilket/hvilke" means "which" and agrees with the noun in gender and number. The question word always comes first, and the verb comes second (V2).',
    examples: [
      { norwegian: 'Hva heter du?', english: 'What is your name?' },
      { norwegian: 'Hvor bor hun?', english: 'Where does she live?' },
      { norwegian: 'Hvilken dag er det i dag?', english: 'Which day is it today?', notes: 'hvilken agrees with masculine noun "dag"' },
    ],
    tags: ['spørreord', 'question words', 'hva', 'hvem', 'hvor', 'hvordan', 'hvorfor', 'når', 'hvilken'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: '«___ gammel er du?» (How old are you?)',
        answer: 'Hvor',
        options: ['Hva', 'Hvem', 'Hvor', 'Hvorfor'],
        hint: '"Hvor gammel" = how old (literally: where old)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: '___ er søsteren din? (What is your sister\'s name?)',
        answer: 'Hva heter',
        hint: '"Hva heter ...?" = What is ... called?',
      },
    ],
  },
  {
    id: 'imperative',
    title: 'Imperative (Commands)',
    category: 'verbs',
    level: 'A1',
    explanation:
      'Imperativ brukes til å gi ordrer eller oppfordringer. Du lager imperativ ved å fjerne «-e» fra infinitiven: å snakke → snakk!, å komme → kom!, å sitte → sitt!. Infinitiver uten «-e» beholder formen: å bo → bo!. Imperativ er alltid lik for alle personer. Med refleksivt verb: Sett deg! (Sit down!) / Skynd deg! (Hurry up!)',
    explanationEnglish:
      'The imperative is used to give commands or requests. You form it by removing "-e" from the infinitive: å snakke → snakk!, å komme → kom!, å sitte → sitt!. Infinitives without "-e" keep their form: å bo → bo!. The imperative is the same for all persons. With reflexive verbs: Sett deg! (Sit down!) / Skynd deg! (Hurry up!)',
    examples: [
      { norwegian: 'Kom hit!', english: 'Come here!' },
      { norwegian: 'Snakk saktere, takk!', english: 'Speak more slowly, please!', notes: 'snakke → snakk' },
      { norwegian: 'Sett deg!', english: 'Sit down!', notes: 'Reflexive: sette seg → sett deg' },
    ],
    tags: ['imperativ', 'imperative', 'command', 'ordre', 'verb'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er imperativ av «å lytte»?',
        answer: 'lytt',
        options: ['lytte', 'lytter', 'lytt', 'lyttet'],
        hint: 'Remove -e from the infinitive',
      },
      {
        type: 'fill-in-the-blank',
        prompt: '___ deg! Bussen går snart. (Hurry up!)',
        answer: 'Skynd',
        hint: 'Imperative of "å skynde seg" = to hurry',
      },
    ],
  },
  {
    id: 'conjunctions-basic',
    title: 'Basic Conjunctions',
    category: 'conjunctions',
    level: 'A1',
    explanation:
      'Koordinerende konjunksjoner binder sammen setninger uten å endre ordstillingen: «og» (and), «men» (but), «eller» (or). «Fordi» (because) er en subordinerende konjunksjon og innleder en leddsetning — her kommer «ikke» og andre adverb FØR det bøyde verbet. Eksempel: «Jeg spiser ikke, fordi jeg ikke er sulten.»',
    explanationEnglish:
      'Coordinating conjunctions join clauses without changing word order: "og" (and), "men" (but), "eller" (or). "Fordi" (because) is a subordinating conjunction that introduces a subordinate clause — here "ikke" and other adverbs come BEFORE the finite verb. Example: "Jeg spiser ikke, fordi jeg ikke er sulten." (I\'m not eating, because I\'m not hungry.)',
    examples: [
      { norwegian: 'Han er norsk og hun er svensk.', english: 'He is Norwegian and she is Swedish.', notes: '"og" coordinates two main clauses' },
      { norwegian: 'Jeg vil komme, men jeg har ikke tid.', english: 'I want to come, but I don\'t have time.', notes: '"men" = but' },
      { norwegian: 'Jeg drar tidlig fordi jeg ikke liker trafikk.', english: 'I leave early because I don\'t like traffic.', notes: '"fordi" triggers sub-clause word order: ikke before er' },
    ],
    tags: ['konjunksjon', 'conjunction', 'og', 'men', 'eller', 'fordi', 'and', 'but', 'or', 'because'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig konjunksjon: «Jeg er trøtt, ___ jeg jobbet mye i dag.»',
        answer: 'fordi',
        options: ['og', 'men', 'fordi', 'eller'],
        hint: 'You need a word meaning "because"',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Vil du ha kaffe ___ te?',
        answer: 'eller',
        hint: '"or" in Norwegian',
      },
    ],
  },
  {
    id: 'genitive-s',
    title: 'Genitive with -s',
    category: 'nouns',
    level: 'A1',
    explanation:
      'På norsk viser vi eierforhold ved å legge til «-s» direkte på substantivet eller navnet: «Karis bil», «Norges flagg», «barnets leker». Det er ingen apostrof foran «-s» på norsk (ulikt engelsk «Kari\'s car»). Hvis et substantiv allerede slutter på «-s», kan vi bruke «sin»-konstruksjon i stedet: «Markus sin bil».',
    explanationEnglish:
      'In Norwegian, possession is shown by adding "-s" directly to the noun or name: "Karis bil" (Kari\'s car), "Norges flagg" (Norway\'s flag), "barnets leker" (the child\'s toys). There is NO apostrophe before "-s" in Norwegian (unlike English). If a noun already ends in "-s", use the "sin"-construction instead: "Markus sin bil".',
    examples: [
      { norwegian: 'Karis bil er rød.', english: 'Kari\'s car is red.', notes: 'No apostrophe!' },
      { norwegian: 'Norges flagg er rødt og hvitt.', english: 'Norway\'s flag is red and white.' },
      { norwegian: 'Markus sin sykkel er ny.', english: 'Markus\'s bicycle is new.', notes: 'Name ends in -s → use "sin"' },
    ],
    tags: ['genitiv', 'genitive', 'possessiv', 'eierforhold', 'ownership', '-s', 'apostrophe'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Dette er ___ bok. (Lars)',
        answer: 'Lars sin',
        hint: 'Lars ends in -s, so use the "sin"-construction',
      },
      {
        type: 'multiple-choice',
        prompt: 'Hvordan skriver vi «the teacher\'s car» på norsk?',
        answer: 'lærerens bil',
        options: ["lærer's bil", 'lærerens bil', 'læreren bil', 'lærers bil'],
        hint: 'Add -s to the definite form: læreren + s',
      },
    ],
  },

  // A2 additional rules
  {
    id: 'present-perfect',
    title: 'Present Perfect (har + partisipp)',
    category: 'tense',
    level: 'A2',
    explanation:
      'Perfektum dannes med «har» + perfektum partisipp. Partisippen har fire grupper: gruppe 1: -et (snakket), gruppe 2: -t (kjøpt), gruppe 3: -d (bodd), gruppe 4: -dd (trodd). Uregelmessige verb: ha→hatt, være→vært, gjøre→gjort, komme→kommet. Perfektum brukes om hendelser som er relevante for nåtiden, mens preteritum beskriver en avsluttet hendelse i fortiden.',
    explanationEnglish:
      'Present perfect is formed with "har" + past participle. The participle has four groups: group 1: -et (snakket), group 2: -t (kjøpt), group 3: -d (bodd), group 4: -dd (trodd). Irregular verbs: ha→hatt, være→vært, gjøre→gjort, komme→kommet. Present perfect is used for events relevant to the present, while preteritum describes a completed past event.',
    examples: [
      { norwegian: 'Jeg har spist frokost.', english: 'I have eaten breakfast.', notes: 'spise → spist (group 2)' },
      { norwegian: 'Hun har bodd i Oslo i fem år.', english: 'She has lived in Oslo for five years.', notes: 'bo → bodd (group 3)' },
      { norwegian: 'Har du vært i Norge?', english: 'Have you been to Norway?', notes: 'være → vært (irregular)' },
    ],
    tags: ['perfektum', 'present perfect', 'har', 'partisipp', 'participle', 'tense', 'tempus'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er perfektum partisipp av «å reise»?',
        answer: 'reist',
        options: ['reiste', 'reist', 'reiset', 'reise'],
        hint: 'Group 2 verbs get -t (one syllable stem)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'De ___ (å kjøpe) ny bil i dag.',
        answer: 'har kjøpt',
        hint: 'Present perfect: har + participle',
      },
    ],
  },
  {
    id: 'possessives',
    title: 'Possessive Pronouns',
    category: 'pronouns',
    level: 'A2',
    explanation:
      'Possessiver viser eierforhold og bøyes etter det eide substantivets kjønn og tall. Min (en-ord), mi (ei-ord), mitt (et-ord), mine (flertall). Din/di/ditt/dine følger samme mønster. Hans og hennes bøyes ikke. Possessiver kan stå foran eller etter substantivet: «min bil» / «bilen min». Formen etter substantivet er vanligst i talespråket.',
    explanationEnglish:
      'Possessives show ownership and agree with the possessed noun\'s gender and number. Min (masculine), mi (feminine), mitt (neuter), mine (plural). Din/di/ditt/dine follow the same pattern. Hans and hennes do not inflect. Possessives can come before or after the noun: "min bil" / "bilen min". The post-noun form is more common in speech.',
    examples: [
      { norwegian: 'min bil / bilen min', english: 'my car', notes: 'masculine noun' },
      { norwegian: 'mitt hus / huset mitt', english: 'my house', notes: 'neuter noun' },
      { norwegian: 'Har du sett vennene mine?', english: 'Have you seen my friends?', notes: 'plural: mine' },
    ],
    tags: ['possessiv', 'possessive', 'min', 'mi', 'mitt', 'mine', 'din', 'hans', 'hennes', 'vår', 'eierforhold'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «Dette er ___ hus.» (my)',
        answer: 'mitt',
        options: ['min', 'mi', 'mitt', 'mine'],
        hint: '"Hus" is a neuter noun (et hus)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Er dette boka ___? (your — to one person)',
        answer: 'di',
        hint: '"Bok" is feminine: di is the feminine form of "your"',
      },
    ],
  },
  {
    id: 'reflexive-possessive-sin',
    title: 'Reflexive Possessive: sin / si / sitt / sine',
    category: 'pronouns',
    level: 'A2',
    explanation:
      'Sin/si/sitt/sine brukes når den som eier noe, er SUBJEKTET i setningen (3. person). Det skiller mellom «hans/hennes» (refererer til en annen person) og «sin/si/sitt/sine» (refererer tilbake til subjektet). Eksempel: «Han liker bilen sin» (his own car) vs. «Han liker bilen hans» (someone else\'s car). Sin bøyes etter eide substantivets kjønn: sin (en), si (ei), sitt (et), sine (flertall).',
    explanationEnglish:
      'Sin/si/sitt/sine is used when the owner is the SUBJECT of the sentence (3rd person). It distinguishes "hans/hennes" (refers to someone else) from "sin/si/sitt/sine" (refers back to the subject). Example: "Han liker bilen sin" (his own car) vs. "Han liker bilen hans" (someone else\'s car). Sin agrees with the possessed noun\'s gender.',
    examples: [
      { norwegian: 'Hun tok med katten sin.', english: 'She brought her (own) cat.', notes: 'sin refers back to hun' },
      { norwegian: 'De inviterte vennene sine.', english: 'They invited their (own) friends.', notes: 'sine = plural' },
      { norwegian: 'Han leste boka hennes.', english: 'He read her book.', notes: '"hennes" — NOT his own, belongs to another woman' },
    ],
    tags: ['sin', 'si', 'sitt', 'sine', 'refleksiv', 'reflexive', 'possessiv', 'possessive', 'hans', 'hennes'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig: «Per vasker ___ bil.» (his own)',
        answer: 'sin',
        options: ['hans', 'sin', 'sitt', 'sine'],
        hint: 'Per is the subject — use sin/si/sitt/sine',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'De pakket bagasjen ___. (their own)',
        answer: 'sin',
        hint: 'Bagasjen is masculine singular — use sin',
      },
    ],
  },
  {
    id: 'double-definite',
    title: 'Double Definiteness',
    category: 'adjectives',
    level: 'A2',
    explanation:
      'Når et adjektiv brukes foran et bestemt substantiv i norsk, markeres bestemthet TO ganger: adjektivet får «-e»-ending OG substantivet beholder sin bestemte ending. I tillegg brukes en fraskilt artikkel (den/det/de) foran adjektivet. Mønster: den/det/de + adjektiv(-e) + bestemt substantiv. Eksempel: «den store bilen» (en bil), «det gamle huset» (et hus), «de unge studentene» (flerall).',
    explanationEnglish:
      'When an adjective precedes a definite noun in Norwegian, definiteness is marked TWICE: the adjective gets an "-e" ending AND the noun keeps its definite suffix. A separate article (den/det/de) is also placed before the adjective. Pattern: den/det/de + adjective(-e) + definite noun. Example: "den store bilen" (the big car), "det gamle huset" (the old house), "de unge studentene" (the young students).',
    examples: [
      { norwegian: 'den store bilen', english: 'the big car', notes: 'den + stor→store + bil→bilen' },
      { norwegian: 'det gamle huset', english: 'the old house', notes: 'det + gammel→gamle + hus→huset' },
      { norwegian: 'de unge studentene', english: 'the young students', notes: 'de + ung→unge + student→studentene' },
    ],
    tags: ['dobbel bestemt', 'double definite', 'adjektiv', 'adjective', 'bestemt', 'definite', 'den', 'det', 'de'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «___ ny bil er rask.»',
        answer: 'Den nye bilen er rask.',
        options: ['Den ny bil er rask.', 'Den nye bilen er rask.', 'Den nye bil er rask.', 'Nye bilen er rask.'],
        hint: 'You need: den + adjective(-e) + definite noun',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Jeg liker ___ (gammel) huset der borte.',
        answer: 'det gamle',
        hint: '"Hus" is neuter: det + adjective with -e + huset',
      },
    ],
  },
  {
    id: 'adjective-comparison',
    title: 'Adjective Comparison',
    category: 'adjectives',
    level: 'A2',
    explanation:
      'Adjektiver bøyes i tre grader: positiv (stor), komparativ (større), superlativ (størst). Regelmessig: legg til «-ere» for komparativ og «-est» for superlativ. Uregelmessige: god/bedre/best, dårlig/verre/verst, mye/mer/mest, lite/mindre/minst, gammel/eldre/eldst, liten/mindre/minst. Superlativ i bestemt form: den beste, den eldste.',
    explanationEnglish:
      'Adjectives inflect in three degrees: positive (stor — big), comparative (større — bigger), superlative (størst — biggest). Regular pattern: add "-ere" for comparative, "-est" for superlative. Irregulars: god/bedre/best, dårlig/verre/verst, mye/mer/mest, lite/mindre/minst, gammel/eldre/eldst. Superlative in definite form: den beste, den eldste.',
    examples: [
      { norwegian: 'stor → større → størst', english: 'big → bigger → biggest', notes: 'Regular comparison' },
      { norwegian: 'god → bedre → best', english: 'good → better → best', notes: 'Irregular' },
      { norwegian: 'Dette er den billigste bilen.', english: 'This is the cheapest car.', notes: 'Superlative in definite phrase' },
    ],
    tags: ['komparativ', 'superlativ', 'comparative', 'superlative', 'adjektiv', 'adjective', 'grad', 'degree'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er komparativ av «gammel»?',
        answer: 'eldre',
        options: ['gammeler', 'mer gammel', 'eldre', 'eldst'],
        hint: '"Gammel" has an irregular comparative',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Hun er ___ (ung) av de to søstrene.',
        answer: 'yngst',
        hint: 'Superlative of "ung" (young)',
      },
    ],
  },
  {
    id: 'subordinate-word-order',
    title: 'Word Order in Subordinate Clauses',
    category: 'word-order',
    level: 'A2',
    explanation:
      'I en leddsetning (etter f.eks. «fordi», «at», «når», «hvis», «selv om») plasseres adverb som «ikke», «alltid», «ofte» FORAN det bøyde verbet. Dette er motsatt av ordstillingen i en hovedsetning. Sammenlign: Hovedsetning: «Jeg spiser ikke fisk.» Leddsetning: «…fordi jeg ikke spiser fisk.» Husk: subjekt + adverb + verb i leddsetning.',
    explanationEnglish:
      'In a subordinate clause (after e.g. "fordi", "at", "når", "hvis", "selv om") adverbs like "ikke", "alltid", "ofte" are placed BEFORE the finite verb. This is the opposite of main clause order. Compare: Main clause: "Jeg spiser ikke fisk." Subordinate: "…fordi jeg ikke spiser fisk." Remember: subject + adverb + verb in subordinate clauses.',
    examples: [
      { norwegian: 'Jeg vet at hun ikke liker kaffe.', english: 'I know that she doesn\'t like coffee.', notes: 'ikke before liker in subordinate clause' },
      { norwegian: 'Han kom ikke fordi han alltid er sen.', english: 'He didn\'t come because he is always late.', notes: 'alltid before er' },
      { norwegian: 'Hvis du ikke kommer, ringer jeg.', english: 'If you don\'t come, I will call.', notes: 'ikke before kommer in the if-clause' },
    ],
    tags: ['leddsetning', 'subordinate clause', 'ordstilling', 'word order', 'ikke', 'adverb', 'fordi', 'at'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig: «Jeg tror at hun ___ norsk.»',
        answer: 'ikke snakker',
        options: ['snakker ikke', 'ikke snakker', 'snakker aldri', 'aldri snakker ikke'],
        hint: 'In a subordinate clause (after "at"), adverbs come before the verb',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Han drar tidlig fordi han ___ ___ trøtt. (always is)',
        answer: 'alltid er',
        hint: 'In a subordinate clause, the adverb "alltid" comes before the verb "er"',
      },
    ],
  },
  {
    id: 'time-prepositions',
    title: 'Time Prepositions (i / om / på / for…siden)',
    category: 'prepositions',
    level: 'A2',
    explanation:
      'Norsk bruker fire preposisjoner for tid: «i» brukes med år, måneder og lengre perioder (i 2020, i januar, i to uker, i sommer — da det er passert). «Om» brukes for årstider og ukedager generelt, og for fremtid (om sommeren, om mandagen, om to dager). «På» brukes for en bestemt ukedag (på mandag). «For…siden» uttrykker «ago» (for tre år siden, for to dager siden).',
    explanationEnglish:
      'Norwegian uses four prepositions for time: "i" with years, months, and longer periods (i 2020, i januar, i to uker, i sommer — when referring to the past). "Om" for seasons/weekdays generally, and for future (om sommeren, om mandagen, om to dager). "På" for a specific weekday (på mandag). "For…siden" expresses "ago" (for tre år siden).',
    examples: [
      { norwegian: 'Jeg ble født i 1995.', english: 'I was born in 1995.', notes: '"i" with years' },
      { norwegian: 'Vi reiser dit om sommeren.', english: 'We go there in the summer (every year).', notes: '"om" for recurring seasons' },
      { norwegian: 'Det skjedde for fem år siden.', english: 'It happened five years ago.', notes: '"for…siden" = ago' },
    ],
    tags: ['preposisjon', 'preposition', 'tid', 'time', 'i', 'om', 'på', 'siden', 'ago', 'temporal'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig: «Jeg skal ringe deg ___ en time.»',
        answer: 'om',
        options: ['i', 'om', 'på', 'for'],
        hint: '"Om" expresses time in the future (in an hour)',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Han lærte norsk ___ tre måneder ___. (three months ago)',
        answer: 'for / siden',
        hint: '"For … siden" = ago',
      },
    ],
  },

  // B1 additional rules
  {
    id: 'past-perfect',
    title: 'Past Perfect (hadde + partisipp)',
    category: 'tense',
    level: 'B1',
    explanation:
      'Pluskvamperfektum dannes med «hadde» + perfektum partisipp. Det brukes om en handling som ble fullført FØR en annen handling i fortiden. Eksempel: «Da jeg kom hjem, hadde hun allerede spist.» Partisippen er den samme som i perfektum (har + partisipp). Pluskvamperfektum tilsvarer engelsk «had done».',
    explanationEnglish:
      'Past perfect is formed with "hadde" + past participle. It is used for an action completed BEFORE another action in the past. Example: "Da jeg kom hjem, hadde hun allerede spist." (When I came home, she had already eaten.) The participle is the same as in present perfect (har + participle). Past perfect corresponds to English "had done".',
    examples: [
      { norwegian: 'Da vi ankom, hadde toget allerede gått.', english: 'When we arrived, the train had already left.' },
      { norwegian: 'Han fortalte at han hadde bodd i Bergen.', english: 'He told us he had lived in Bergen.', notes: 'Also used in indirect speech' },
      { norwegian: 'Jeg hadde aldri smakt rakfisk før.', english: 'I had never tasted rakfisk before.' },
    ],
    tags: ['pluskvamperfektum', 'past perfect', 'hadde', 'partisipp', 'participle', 'tense', 'tempus', 'fortid'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Da læreren kom inn, ___ elevene allerede ___ (å begynne).',
        answer: 'hadde / begynt',
        hint: 'Past perfect: hadde + past participle',
      },
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig tempus: «Hun fortalte at hun ___ filmen tre ganger.»',
        answer: 'hadde sett',
        options: ['så', 'har sett', 'hadde sett', 'sett'],
        hint: 'The action was completed before she told us — use past perfect',
      },
    ],
  },
  {
    id: 'modal-verbs-past',
    title: 'Modal Verbs in Past Tense',
    category: 'verbs',
    level: 'B1',
    explanation:
      'Modale hjelpeverb bøyes i fortid: kan→kunne, skal→skulle, vil→ville, må→måtte, bør→burde. «Skulle» har to betydninger i fortid: 1) hadde planer om (men kanskje det ikke skjedde): «Han skulle ringe, men glemte det.» 2) rapportert fremtid: «Hun sa at hun skulle komme.» «Ville» i fortid betyr «ønsket»: «Jeg ville gjerne hjelpe.»',
    explanationEnglish:
      'Modal verbs in the past tense: kan→kunne, skal→skulle, vil→ville, må→måtte, bør→burde. "Skulle" in the past has two meanings: 1) was going to (but possibly didn\'t): "Han skulle ringe, men glemte det." 2) reported future: "Hun sa at hun skulle komme." "Ville" in the past means "wanted to": "Jeg ville gjerne hjelpe."',
    examples: [
      { norwegian: 'Jeg kunne ikke sove i natt.', english: 'I could not sleep last night.', notes: 'kunne = past of kan' },
      { norwegian: 'Han sa at han skulle komme.', english: 'He said that he would come.', notes: 'skulle = reported future' },
      { norwegian: 'De måtte avbestille turen.', english: 'They had to cancel the trip.', notes: 'måtte = past of må' },
    ],
    tags: ['modal', 'kunne', 'skulle', 'ville', 'måtte', 'burde', 'past tense', 'fortid', 'hjelpeverb'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Hva er preteritum av «å måtte»?',
        answer: 'måtte',
        options: ['måttet', 'måtte', 'mått', 'måt'],
        hint: 'The past form of "må" is irregular',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Da hun var barn, ___ hun ikke spise grønnsaker. (could not)',
        answer: 'kunne',
        hint: 'Past tense of "kan" = kunne',
      },
    ],
  },
  {
    id: 'reflexive-verbs',
    title: 'Reflexive Verbs and Pronouns',
    category: 'verbs',
    level: 'B1',
    explanation:
      'Refleksive pronomen er: meg (jeg), deg (du), seg (han/hun/det/de), oss (vi), dere (dere). Mange norske verb er alltid refleksive: å glede seg (to be happy/look forward), å skynde seg (to hurry), å melde seg på (to sign up), å gifte seg (to get married). Refleksivt pronomen brukes også med kroppslige handlinger: «Hun skadet seg i kneet.» Ikke forveksl med det engelske «myself/yourself» — norsk bruker bare «seg» for 3. person.',
    explanationEnglish:
      'Reflexive pronouns: meg (I), deg (you), seg (he/she/it/they), oss (we), dere (you pl.). Many Norwegian verbs are always reflexive: å glede seg (to be happy/look forward to), å skynde seg (to hurry), å melde seg på (to sign up), å gifte seg (to get married). Reflexive pronouns also occur with bodily actions: "Hun skadet seg i kneet." Note: Norwegian only uses "seg" for 3rd person, not the full "myself/yourself" system.',
    examples: [
      { norwegian: 'Jeg gleder meg til ferien!', english: 'I\'m looking forward to the holiday!', notes: '"å glede seg" = always reflexive' },
      { norwegian: 'Skynd deg, vi er sene!', english: 'Hurry up, we\'re late!', notes: 'imperative of "å skynde seg"' },
      { norwegian: 'Han skadet seg under treningen.', english: 'He injured himself during training.' },
    ],
    tags: ['refleksiv', 'reflexive', 'seg', 'meg', 'deg', 'verb', 'glede seg', 'skynde seg'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'De giftet ___ i sommer.',
        answer: 'seg',
        hint: '3rd person reflexive pronoun',
      },
      {
        type: 'multiple-choice',
        prompt: 'Hva betyr «å glede seg til»?',
        answer: 'to look forward to',
        options: ['to be sad about', 'to look forward to', 'to worry about', 'to celebrate'],
        hint: '"Glede" relates to joy (glede = joy)',
      },
    ],
  },
  {
    id: 'conditional',
    title: 'Conditional (ville / hadde…)',
    category: 'tense',
    level: 'B1',
    explanation:
      'Kondisjonalis uttrykker hypotetiske situasjoner. Presens kondisjonalis: «ville» + infinitiv («Jeg ville gjerne bo i Paris»). Fortid kondisjonalis (kontrafaktisk): «Hvis + hadde + partisipp, ville + ha + partisipp». Eksempel: «Hvis jeg hadde hatt tid, ville jeg ha hjulpet deg.» Kortform uten «hvis»: «Hadde jeg hatt tid, ville jeg ha hjulpet deg.» Dette tilsvarer engelsk «If I had had time, I would have helped you.»',
    explanationEnglish:
      'The conditional expresses hypothetical situations. Present conditional: "ville" + infinitive ("Jeg ville gjerne bo i Paris" — I would like to live in Paris). Past conditional (contrary-to-fact): "Hvis + hadde + participle, ville + ha + participle". Example: "Hvis jeg hadde hatt tid, ville jeg ha hjulpet deg." Short form without "hvis": invert subject and verb in the if-clause. Corresponds to English "would have".',
    examples: [
      { norwegian: 'Jeg ville gjerne lære kinesisk.', english: 'I would like to learn Chinese.', notes: 'Present conditional: ville + infinitive' },
      { norwegian: 'Hvis det hadde vært billigere, ville vi ha kjøpt det.', english: 'If it had been cheaper, we would have bought it.', notes: 'Past contrary-to-fact' },
      { norwegian: 'Hadde jeg visst det, ville jeg ha sagt noe.', english: 'If I had known that, I would have said something.', notes: 'Inverted without "hvis"' },
    ],
    tags: ['kondisjonalis', 'conditional', 'ville', 'hadde', 'hypotetisk', 'hypothetical', 'would', 'if'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig form: «Hvis jeg ___ rik, ville jeg ha reist verden rundt.»',
        answer: 'hadde vært',
        options: ['var', 'er', 'hadde vært', 'ville vært'],
        hint: 'Past conditional: hadde + past participle in the if-clause',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Jeg ___ gjerne hjelpe deg, men jeg har ikke tid. (would like)',
        answer: 'ville',
        hint: 'Present conditional: ville + infinitive',
      },
    ],
  },
  {
    id: 'indirect-speech',
    title: 'Indirect Speech (Indirekte tale)',
    category: 'sentence-structure',
    level: 'B1',
    explanation:
      'Indirekte tale gjengir det noen sa, uten å sitere direkte. For påstander brukes «at»-setning: «Han sa at han var trøtt» (Han sa: «Jeg er trøtt»). Ja/nei-spørsmål gjengis med «om»: «Hun spurte om jeg ville komme». Spørsmål med spørreord beholder spørreordet: «Læreren spurte hva vi het». Merk at ordstillingen endres til leddsetning (adverb foran verb), og at tempus vanligvis skifter ett steg bakover.',
    explanationEnglish:
      'Indirect speech reports what someone said without direct quotation. Statements use an "at"-clause: "Han sa at han var trøtt" (He said he was tired). Yes/no questions use "om": "Hun spurte om jeg ville komme" (She asked whether I wanted to come). Wh-questions keep the question word: "Læreren spurte hva vi het" (The teacher asked what our names were). Note: word order shifts to subordinate clause order, and tense typically shifts back one step.',
    examples: [
      { norwegian: 'Direkte: «Jeg er sulten.» → Indirekte: Han sa at han var sulten.', english: 'Direct: "I am hungry." → Indirect: He said that he was hungry.', notes: 'er → var (tense shift)' },
      { norwegian: 'Hun spurte om vi hadde spist.', english: 'She asked whether we had eaten.', notes: 'yes/no question → om' },
      { norwegian: 'De lurte på hvor vi bodde.', english: 'They wondered where we lived.', notes: 'wh-question keeps question word' },
    ],
    tags: ['indirekte tale', 'indirect speech', 'at', 'om', 'reported speech', 'setningsstruktur'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Gjengi indirekte: «Er du norsk?» Han spurte ___',
        answer: 'om jeg var norsk.',
        options: ['hva jeg var norsk.', 'om jeg var norsk.', 'at jeg var norsk.', 'om jeg er norsk.'],
        hint: 'Yes/no questions use "om"; tense shifts back one step',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Hun sa ___ hun ikke kom. (that)',
        answer: 'at',
        hint: 'Statements in indirect speech use "at"',
      },
    ],
  },
  {
    id: 'conjunctions-adverb-pairs',
    title: 'Conjunction–Adverb Pairs',
    category: 'conjunctions',
    level: 'B1',
    explanation:
      'Norsk har par av konjunksjoner og adverb som uttrykker samme forhold, men med ulik grammatikk. «Fordi» (konjunksjon, leddsetning) vs. «derfor» (adverb, hovedsetning med inversjon). «Selv om» (konjunksjon) vs. «likevel» (adverb). «Hvis/dersom» (betingelse). Andre par: «enten…eller» (either…or), «verken…eller» (neither…nor), «både…og» (both…and). Konjunksjoner innleder leddsetninger, adverb brukes i hovedsetninger.',
    explanationEnglish:
      'Norwegian has pairs of conjunctions and adverbs expressing the same relationship but with different grammar. "Fordi" (conjunction, sub-clause) vs. "derfor" (adverb, main clause with V2). "Selv om" (conjunction) vs. "likevel" (adverb). Conditional: "hvis/dersom" (if). Other pairs: "enten…eller" (either…or), "verken…eller" (neither…nor), "både…og" (both…and). Conjunctions introduce subordinate clauses; adverbs appear in main clauses.',
    examples: [
      { norwegian: 'Jeg ble hjemme fordi jeg var syk. / Jeg var syk, derfor ble jeg hjemme.', english: 'I stayed home because I was sick. / I was sick, therefore I stayed home.', notes: 'fordi (sub-clause) vs. derfor (main clause + inversion)' },
      { norwegian: 'Selv om det regnet, gikk vi tur. / Det regnet, men vi gikk likevel tur.', english: 'Even though it rained, we went for a walk. / It rained, but we went for a walk anyway.', notes: 'selv om vs. likevel' },
      { norwegian: 'Både Per og Kari er lærere.', english: 'Both Per and Kari are teachers.', notes: 'både…og' },
    ],
    tags: ['konjunksjon', 'adverb', 'fordi', 'derfor', 'selv om', 'likevel', 'enten eller', 'verken eller', 'conjunction'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig: «Han trente hardt, ___ vant han ikke.»',
        answer: 'likevel',
        options: ['selv om', 'likevel', 'fordi', 'derfor'],
        hint: '"Likevel" (still/nevertheless) is an adverb used in a main clause',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Jeg er trøtt, ___ skal jeg fullføre oppgaven. (therefore)',
        answer: 'men likevel',
        hint: '"Likevel" = nevertheless/still; often paired with "men"',
      },
    ],
  },

  // B2 Rules
  {
    id: 'v2-word-order',
    title: 'V2 Word Order',
    category: 'word-order',
    level: 'B2',
    explanation:
      'Norsk er et V2-språk: det bøyde verbet er alltid på andre plass i en hovedsetning. Når setningen begynner med et annet ledd enn subjektet (inversjon), bytter subjekt og verb plass. Eksempel: «I går spiste jeg pizza.» (ikke «I går jeg spiste»). Dette gjelder for adverb, tidsuttrykk, objekter og leddsetninger i front.',
    explanationEnglish:
      'Norwegian is a V2 language: the conjugated verb always occupies the second position in a main clause. When the sentence starts with something other than the subject (inversion), the subject and verb swap places. Example: "I går spiste jeg pizza." (not "I går jeg spiste"). This applies when adverbs, time expressions, objects, or clauses appear at the front.',
    examples: [
      { norwegian: 'Jeg spiser pizza. → I går spiste jeg pizza.', english: 'I eat pizza. → Yesterday I ate pizza.', notes: 'Time adverb triggers inversion' },
      { norwegian: 'Noen ganger er det vanskelig.', english: 'Sometimes it is difficult.', notes: '"Noen ganger" fronted → verb before subject' },
      { norwegian: 'Den boken har jeg allerede lest.', english: 'That book I have already read.', notes: 'Object fronted → inversion' },
    ],
    tags: ['V2', 'inversjon', 'inversion', 'ordstilling', 'word order', 'setningsstruktur'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Velg riktig ordstilling: «I morgen ___»',
        answer: 'reiser vi til Oslo',
        options: ['vi reiser til Oslo', 'reiser vi til Oslo', 'til Oslo vi reiser', 'vi til Oslo reiser'],
        hint: 'The verb must be in second position',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Vanligvis ___ jeg tidlig. (spise)',
        answer: 'spiser',
        hint: 'After a fronted adverb, the verb comes before the subject',
      },
    ],
  },
  {
    id: 'passive-bli',
    title: 'Passive Voice with "bli"',
    category: 'verbs',
    level: 'B2',
    explanation:
      'Norsk har to måter å danne passiv på: «bli»-passiv og «s»-passiv. «Bli»-passiv dannes med «bli» + perfektum partisipp og viser en handling som skjer/skjedde. «Bilen ble stjålet.» «S»-passiven legger til «-s» på verbet og brukes mer i skriftlig norsk for tilstander eller gjentatte handlinger: «Boken selges overalt.»',
    explanationEnglish:
      'Norwegian has two ways to form the passive: "bli"-passive and "s"-passive. The "bli"-passive is formed with "bli" + past participle and shows an action happening/that happened: "Bilen ble stjålet" (The car was stolen). The "s"-passive adds "-s" to the verb and is used more in written Norwegian for states or repeated actions: "Boken selges overalt" (The book is sold everywhere).',
    examples: [
      { norwegian: 'Bilen ble stjålet i natt.', english: 'The car was stolen last night.', notes: '"bli"-passive' },
      { norwegian: 'Huset blir bygget nå.', english: 'The house is being built now.', notes: '"bli"-passive, present' },
      { norwegian: 'Norsk snakkes av fem millioner mennesker.', english: 'Norwegian is spoken by five million people.', notes: '"s"-passive' },
    ],
    tags: ['passiv', 'passive', 'bli', 's-passiv', 'partisipp', 'participle'],
    exercises: [
      {
        type: 'multiple-choice',
        prompt: 'Gjør aktiv til passiv: «De bygget broen i 1980.» →',
        answer: 'Broen ble bygget i 1980.',
        options: ['Broen bygget i 1980.', 'Broen ble bygget i 1980.', 'Broen blir bygget i 1980.', 'Broen har blitt bygget i 1980.'],
        hint: 'Past tense passive uses "ble" + past participle',
      },
      {
        type: 'fill-in-the-blank',
        prompt: 'Boken ___ lest av mange studenter. (The book was read by many students.)',
        answer: 'ble',
        hint: 'Past tense of "bli" for the passive',
      },
    ],
  },
  {
    id: 'cleft-sentences',
    title: 'Cleft Sentences (det er … som)',
    category: 'sentence-structure',
    level: 'B2',
    explanation:
      'Kløvingssetninger brukes for å fremheve et ledd i setningen. Strukturen er: «Det er + [fremhevet ledd] + som + resten». Eksempel: «Det er Kari som synger» (fremhever Kari). «Det er i dag jeg skal reise» (fremhever i dag). Dette er en vanlig konstruksjon i norsk, særlig i talespråket, og tilsvarer engelsk «It is Kari who is singing».',
    explanationEnglish:
      'Cleft sentences are used to emphasize one part of a sentence. The structure is: "Det er + [emphasized element] + som + rest". Example: "Det er Kari som synger" (emphasizes Kari). "Det er i dag jeg skal reise" (emphasizes today). This is a common construction in Norwegian, especially in spoken language, and corresponds to English "It is Kari who is singing".',
    examples: [
      { norwegian: 'Det er Kari som synger.', english: 'It is Kari who is singing.', notes: 'Emphasizes the subject' },
      { norwegian: 'Det er boken jeg vil ha.', english: 'It is the book I want.', notes: '"som" can be omitted when emphasizing object' },
      { norwegian: 'Det var i Oslo det skjedde.', english: 'It was in Oslo that it happened.', notes: 'Emphasizes a place' },
    ],
    tags: ['kløvingssetning', 'cleft', 'det er som', 'fremheving', 'emphasis', 'focus'],
    exercises: [
      {
        type: 'fill-in-the-blank',
        prompt: 'Det ___ Per som tok kaken.',
        answer: 'er',
        hint: 'The cleft sentence structure is "Det er ... som"',
      },
      {
        type: 'multiple-choice',
        prompt: 'Fremhev subjektet: «Læreren forklarte grammatikken.» →',
        answer: 'Det er læreren som forklarte grammatikken.',
        options: [
          'Det var grammatikken som læreren forklarte.',
          'Det er læreren som forklarte grammatikken.',
          'Det er grammatikken læreren forklarte.',
          'Det forklarte læreren grammatikken.',
        ],
        hint: 'Place the emphasized element right after "Det er"',
      },
    ],
  },
];
