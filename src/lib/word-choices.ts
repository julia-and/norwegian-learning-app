import type { CEFRLevel } from '@/lib/resources';

export type WordChoiceCategory =
  | 'conjunctions' | 'verbs' | 'prepositions' | 'pronouns' | 'adverbs';

export interface WordChoiceExample {
  norwegian: string;
  english: string;
}

export interface WordChoiceEntry {
  word: string;
  meaning: string;
  meaningEnglish: string;
  examples: WordChoiceExample[];
}

export interface WordChoiceGroup {
  id: string;
  title: string;
  level: CEFRLevel;
  category: WordChoiceCategory;
  tip?: string;
  tipEnglish?: string;
  words: WordChoiceEntry[];
  tags: string[];
}

export const WORD_CHOICE_CATEGORY_LABELS: Record<WordChoiceCategory, string> = {
  conjunctions: 'Konjunksjoner',
  verbs: 'Verb',
  prepositions: 'Preposisjoner',
  pronouns: 'Pronomen',
  adverbs: 'Adverb',
};

export const WORD_CHOICE_GROUPS: WordChoiceGroup[] = [
  {
    id: 'om-hvis-dersom',
    title: 'om vs. hvis vs. dersom',
    level: 'A2',
    category: 'conjunctions',
    tip: '«Hvis» og «dersom» brukes bare om betingelser (if). «Om» kan bety både «if» og «whether», pluss «about».',
    tipEnglish: '"Hvis" and "dersom" are only for conditions (if). "Om" can mean "if", "whether", or "about".',
    words: [
      {
        word: 'om',
        meaning: 'Kan bety «hvis» (betingelse), «hvorvidt» (om noe er sant), eller «om/angående».',
        meaningEnglish: 'Can mean "if" (condition), "whether", or "about".',
        examples: [
          { norwegian: 'Om du vil, kan vi gå.', english: 'If you want, we can go.' },
          { norwegian: 'Jeg lurer på om han kommer.', english: 'I wonder whether he is coming.' },
          { norwegian: 'Vi snakket om filmen.', english: 'We talked about the film.' },
        ],
      },
      {
        word: 'hvis',
        meaning: 'Brukes kun for betingelser (if). Vanligst i dagligtale.',
        meaningEnglish: 'Used only for conditions (if). Most common in everyday speech.',
        examples: [
          { norwegian: 'Hvis det regner, tar vi bussen.', english: 'If it rains, we take the bus.' },
          { norwegian: 'Hva gjør du hvis du blir syk?', english: 'What do you do if you get sick?' },
        ],
      },
      {
        word: 'dersom',
        meaning: 'Betyr det samme som «hvis», men er mer formelt.',
        meaningEnglish: 'Means the same as "hvis" but is more formal.',
        examples: [
          { norwegian: 'Dersom du ønsker det, kan vi utsette møtet.', english: 'If you wish, we can postpone the meeting.' },
        ],
      },
    ],
    tags: ['if', 'whether', 'betingelse', 'condition', 'om', 'hvis', 'dersom'],
  },
  {
    id: 'bade-begge',
    title: 'både vs. begge',
    level: 'A2',
    category: 'pronouns',
    tip: '«Både» brukes alltid med «og» (both...and). «Begge» står alene og betyr «both (of them)».',
    tipEnglish: '"Både" always pairs with "og" (both...and). "Begge" stands alone and means "both (of them)".',
    words: [
      {
        word: 'både',
        meaning: 'Brukes alltid sammen med «og» for å binde to ting sammen: «både A og B».',
        meaningEnglish: 'Always used with "og" to link two things: "both A and B".',
        examples: [
          { norwegian: 'Hun snakker både norsk og engelsk.', english: 'She speaks both Norwegian and English.' },
          { norwegian: 'Jeg liker både kaffe og te.', english: 'I like both coffee and tea.' },
        ],
      },
      {
        word: 'begge',
        meaning: 'Betyr «begge to» og viser til to bestemte ting eller personer.',
        meaningEnglish: 'Means "both (of them)" and refers to two specific things or people.',
        examples: [
          { norwegian: 'Begge barna sover.', english: 'Both children are sleeping.' },
          { norwegian: 'Vi inviterte begge.', english: 'We invited both (of them).' },
        ],
      },
    ],
    tags: ['both', 'begge', 'både', 'og', 'pair'],
  },
  {
    id: 'tro-synes-mene-tenke-vite',
    title: 'å tro vs. å synes vs. å mene vs. å tenke vs. å vite',
    level: 'B1',
    category: 'verbs',
    tip: 'Tro = believe/think (usikker). Synes = have an opinion (subjektiv). Mene = mean/hold a view. Tenke = think (prosess). Vite = know (fakta).',
    tipEnglish: 'Tro = believe (uncertain). Synes = think/feel (personal opinion). Mene = mean/hold a view. Tenke = think (process). Vite = know (facts).',
    words: [
      {
        word: 'å tro',
        meaning: 'Å anta noe man er usikker på, eller å ha religiøs tro.',
        meaningEnglish: 'To believe something you are unsure about, or to have religious faith.',
        examples: [
          { norwegian: 'Jeg tror det blir fint vær i morgen.', english: 'I think it will be nice weather tomorrow.' },
          { norwegian: 'Tror du hun kommer?', english: 'Do you think she is coming?' },
        ],
      },
      {
        word: 'å synes',
        meaning: 'Å ha en personlig mening eller opplevelse. Subjektivt.',
        meaningEnglish: 'To have a personal opinion or feeling. Subjective.',
        examples: [
          { norwegian: 'Jeg synes filmen var bra.', english: 'I think (feel) the movie was good.' },
          { norwegian: 'Hva synes du om maten?', english: 'What do you think about the food?' },
        ],
      },
      {
        word: 'å mene',
        meaning: 'Å ha en holdning eller å mene noe med det man sier.',
        meaningEnglish: 'To hold a view or to mean something by what you say.',
        examples: [
          { norwegian: 'Hva mener du med det?', english: 'What do you mean by that?' },
          { norwegian: 'Jeg mener at vi bør vente.', english: 'I think (hold the view) that we should wait.' },
        ],
      },
      {
        word: 'å tenke',
        meaning: 'Den mentale prosessen å tenke. Å reflektere eller vurdere.',
        meaningEnglish: 'The mental process of thinking. To reflect or consider.',
        examples: [
          { norwegian: 'Jeg må tenke litt på det.', english: 'I need to think about it a bit.' },
          { norwegian: 'Hva tenker du på?', english: 'What are you thinking about?' },
        ],
      },
      {
        word: 'å vite',
        meaning: 'Å kjenne til fakta. Sikker kunnskap.',
        meaningEnglish: 'To know facts. Certain knowledge.',
        examples: [
          { norwegian: 'Jeg vet at Oslo er hovedstaden.', english: 'I know that Oslo is the capital.' },
          { norwegian: 'Vet du hva klokka er?', english: 'Do you know what time it is?' },
        ],
      },
    ],
    tags: ['think', 'believe', 'know', 'opinion', 'mening', 'tro', 'synes', 'mene', 'tenke', 'vite'],
  },
  {
    id: 'da-nar-sa',
    title: 'da vs. når vs. så',
    level: 'A2',
    category: 'conjunctions',
    tip: '«Da» = when (fortid, én gang). «Når» = when/whenever (nåtid, fremtid, gjentatt). «Så» = then (deretter).',
    tipEnglish: '"Da" = when (past, single event). "Når" = when/whenever (present, future, repeated). "Så" = then (after that).',
    words: [
      {
        word: 'da',
        meaning: 'Brukes om én bestemt gang i fortiden.',
        meaningEnglish: 'Used for a specific single event in the past.',
        examples: [
          { norwegian: 'Da jeg var liten, bodde vi i Bergen.', english: 'When I was little, we lived in Bergen.' },
          { norwegian: 'Da han kom, begynte vi å spise.', english: 'When he arrived, we started eating.' },
        ],
      },
      {
        word: 'når',
        meaning: 'Brukes om nåtid, fremtid eller gjentatte hendelser.',
        meaningEnglish: 'Used for present, future, or repeated events.',
        examples: [
          { norwegian: 'Når jeg er trøtt, legger jeg meg tidlig.', english: 'When I am tired, I go to bed early.' },
          { norwegian: 'Når du kommer hjem, kan vi lage middag.', english: 'When you get home, we can make dinner.' },
        ],
      },
      {
        word: 'så',
        meaning: 'Betyr «deretter» eller «da» som et resultat.',
        meaningEnglish: 'Means "then" or "so" as a result.',
        examples: [
          { norwegian: 'Vi spiste, og så gikk vi en tur.', english: 'We ate, and then we went for a walk.' },
          { norwegian: 'Det regnet, så vi ble hjemme.', english: 'It rained, so we stayed home.' },
        ],
      },
    ],
    tags: ['when', 'then', 'da', 'når', 'så', 'tid', 'time', 'temporal'],
  },
  {
    id: 'her-hit-der-dit',
    title: 'her vs. hit vs. der vs. dit',
    level: 'A1',
    category: 'adverbs',
    tip: '«Her/der» = posisjon (where you are). «Hit/dit» = retning (where you are going).',
    tipEnglish: '"Her/der" = position (here/there). "Hit/dit" = direction (to here / to there).',
    words: [
      {
        word: 'her',
        meaning: 'Her — posisjon, stedet du er.',
        meaningEnglish: 'Here — position, the place where you are.',
        examples: [
          { norwegian: 'Jeg bor her.', english: 'I live here.' },
          { norwegian: 'Her er det fint.', english: 'It is nice here.' },
        ],
      },
      {
        word: 'hit',
        meaning: 'Hit — retning, mot stedet du er.',
        meaningEnglish: 'To here — direction, towards where you are.',
        examples: [
          { norwegian: 'Kom hit!', english: 'Come here!' },
          { norwegian: 'Han syklet hit i dag.', english: 'He cycled here (to here) today.' },
        ],
      },
      {
        word: 'der',
        meaning: 'Der — posisjon, et annet sted.',
        meaningEnglish: 'There — position, another place.',
        examples: [
          { norwegian: 'Hun bor der.', english: 'She lives there.' },
          { norwegian: 'Der er det kaldt.', english: 'It is cold there.' },
        ],
      },
      {
        word: 'dit',
        meaning: 'Dit — retning, mot et annet sted.',
        meaningEnglish: 'To there — direction, towards another place.',
        examples: [
          { norwegian: 'Vi kjørte dit i går.', english: 'We drove there (to there) yesterday.' },
          { norwegian: 'Hvordan kommer jeg dit?', english: 'How do I get there?' },
        ],
      },
    ],
    tags: ['here', 'there', 'direction', 'position', 'her', 'hit', 'der', 'dit', 'sted', 'retning'],
  },
  {
    id: 'litt-lite-fa-noen',
    title: 'litt vs. lite vs. få vs. noen',
    level: 'A2',
    category: 'pronouns',
    tip: '«Litt» = a little (positivt). «Lite» = little (negativt/knapt). «Få» = few (tellbare). «Noen» = some/any.',
    tipEnglish: '"Litt" = a little (positive). "Lite" = little (negative/barely). "Få" = few (countable). "Noen" = some/any.',
    words: [
      {
        word: 'litt',
        meaning: 'En liten mengde, positivt ladet — «det finnes noe».',
        meaningEnglish: 'A small amount, positive nuance — "there is some".',
        examples: [
          { norwegian: 'Jeg snakker litt norsk.', english: 'I speak a little Norwegian.' },
          { norwegian: 'Vil du ha litt kaffe?', english: 'Would you like a little coffee?' },
        ],
      },
      {
        word: 'lite',
        meaning: 'En liten mengde, negativt ladet — «det er knapt nok».',
        meaningEnglish: 'A small amount, negative nuance — "there is barely enough".',
        examples: [
          { norwegian: 'Vi har lite tid.', english: 'We have little time.' },
          { norwegian: 'Det er lite å gjøre her.', english: 'There is little to do here.' },
        ],
      },
      {
        word: 'få',
        meaning: 'Et lite antall av tellbare ting.',
        meaningEnglish: 'A small number of countable things.',
        examples: [
          { norwegian: 'Det var få mennesker på festen.', english: 'There were few people at the party.' },
          { norwegian: 'Jeg har bare noen få minutter.', english: 'I only have a few minutes.' },
        ],
      },
      {
        word: 'noen',
        meaning: 'Noen stykker, noen få — «some» eller «any» (spørsmål/nektelse).',
        meaningEnglish: '"Some" or "any" (in questions/negatives).',
        examples: [
          { norwegian: 'Har du noen spørsmål?', english: 'Do you have any questions?' },
          { norwegian: 'Noen venner kom på besøk.', english: 'Some friends came to visit.' },
        ],
      },
    ],
    tags: ['quantity', 'some', 'few', 'little', 'litt', 'lite', 'få', 'noen', 'mengde'],
  },
  {
    id: 'ikke-aldri-ingen-ingenting',
    title: 'ikke vs. aldri vs. ingen vs. ingenting',
    level: 'A2',
    category: 'adverbs',
    tip: '«Ikke» = not. «Aldri» = never. «Ingen» = no one / none. «Ingenting» = nothing. Bruk bare én nektelse i norsk!',
    tipEnglish: '"Ikke" = not. "Aldri" = never. "Ingen" = no one/none. "Ingenting" = nothing. Only use one negation in Norwegian!',
    words: [
      {
        word: 'ikke',
        meaning: 'Vanlig nektelse — «not».',
        meaningEnglish: 'Standard negation — "not".',
        examples: [
          { norwegian: 'Jeg snakker ikke spansk.', english: 'I do not speak Spanish.' },
          { norwegian: 'Det er ikke langt.', english: 'It is not far.' },
        ],
      },
      {
        word: 'aldri',
        meaning: 'Betyr «never» — erstatter «ikke».',
        meaningEnglish: 'Means "never" — replaces "ikke".',
        examples: [
          { norwegian: 'Jeg har aldri vært i Tromsø.', english: 'I have never been to Tromsø.' },
          { norwegian: 'Hun kommer aldri for sent.', english: 'She never comes late.' },
        ],
      },
      {
        word: 'ingen',
        meaning: 'Betyr «no one» eller «none». Brukes om personer eller tellbare ting.',
        meaningEnglish: 'Means "no one" or "none". Used for people or countable things.',
        examples: [
          { norwegian: 'Ingen var hjemme.', english: 'No one was home.' },
          { norwegian: 'Det er ingen biler her.', english: 'There are no cars here.' },
        ],
      },
      {
        word: 'ingenting',
        meaning: 'Betyr «nothing».',
        meaningEnglish: 'Means "nothing".',
        examples: [
          { norwegian: 'Jeg hørte ingenting.', english: 'I heard nothing.' },
          { norwegian: 'Det er ingenting å bekymre seg over.', english: 'There is nothing to worry about.' },
        ],
      },
    ],
    tags: ['negation', 'not', 'never', 'nothing', 'none', 'ikke', 'aldri', 'ingen', 'ingenting', 'nektelse'],
  },
  {
    id: 'enda-enna-fortsatt-fremdeles',
    title: 'enda vs. ennå vs. fortsatt vs. fremdeles',
    level: 'B1',
    category: 'adverbs',
    tip: '«Ennå» = yet/still (med tid). «Fortsatt/fremdeles» = still (noe pågår). «Enda» = even (enda bedre = even better).',
    tipEnglish: '"Ennå" = yet/still (time-related). "Fortsatt/fremdeles" = still (ongoing). "Enda" = even (even better).',
    words: [
      {
        word: 'ennå',
        meaning: 'Betyr «ennå/enda» i betydningen «yet» eller «still» (med tid).',
        meaningEnglish: 'Means "yet" or "still" (time-related).',
        examples: [
          { norwegian: 'Er du ikke ferdig ennå?', english: 'Are you not finished yet?' },
          { norwegian: 'Hun er ennå ung.', english: 'She is still young.' },
        ],
      },
      {
        word: 'fortsatt',
        meaning: 'Betyr «still» — noe som fortsetter å være tilfelle.',
        meaningEnglish: 'Means "still" — something that continues to be the case.',
        examples: [
          { norwegian: 'Regner det fortsatt?', english: 'Is it still raining?' },
          { norwegian: 'Jeg bor fortsatt i Oslo.', english: 'I still live in Oslo.' },
        ],
      },
      {
        word: 'fremdeles',
        meaning: 'Synonym med «fortsatt». Litt mer formelt.',
        meaningEnglish: 'Synonym of "fortsatt". Slightly more formal.',
        examples: [
          { norwegian: 'Problemet er fremdeles uløst.', english: 'The problem is still unsolved.' },
        ],
      },
      {
        word: 'enda',
        meaning: 'Betyr «even» (forsterkende) — «enda bedre», «enda mer».',
        meaningEnglish: 'Means "even" (intensifier) — "even better", "even more".',
        examples: [
          { norwegian: 'Denne boka er enda bedre.', english: 'This book is even better.' },
          { norwegian: 'Det ble enda kaldere.', english: 'It got even colder.' },
        ],
      },
    ],
    tags: ['still', 'yet', 'even', 'ennå', 'fortsatt', 'fremdeles', 'enda', 'ongoing'],
  },
  {
    id: 'bli-vare',
    title: 'å bli vs. å være',
    level: 'A2',
    category: 'verbs',
    tip: '«Å være» = to be (tilstand). «Å bli» = to become (endring), eller passiv.',
    tipEnglish: '"Å være" = to be (state). "Å bli" = to become (change), or passive voice.',
    words: [
      {
        word: 'å være',
        meaning: 'Beskriver en tilstand — noe som er.',
        meaningEnglish: 'Describes a state — something that is.',
        examples: [
          { norwegian: 'Jeg er glad.', english: 'I am happy.' },
          { norwegian: 'Hun er lege.', english: 'She is a doctor.' },
        ],
      },
      {
        word: 'å bli',
        meaning: 'Beskriver en endring — noe som blir til noe annet. Også brukt for passiv.',
        meaningEnglish: 'Describes a change — something becoming something else. Also used for passive voice.',
        examples: [
          { norwegian: 'Jeg ble glad da jeg hørte nyheten.', english: 'I became happy when I heard the news.' },
          { norwegian: 'Hun vil bli lege.', english: 'She wants to become a doctor.' },
          { norwegian: 'Huset ble bygget i 1990.', english: 'The house was built in 1990.' },
        ],
      },
    ],
    tags: ['be', 'become', 'passive', 'være', 'bli', 'tilstand', 'endring'],
  },
  {
    id: 'for-fordi-siden-derfor',
    title: 'for vs. fordi vs. siden vs. derfor',
    level: 'A2',
    category: 'conjunctions',
    tip: '«Fordi» og «siden» gir årsak (because/since) — med inversjon etter «siden». «Derfor» gir resultat (therefore). «For» er en litt formell variant av «fordi».',
    tipEnglish: '"Fordi" and "siden" give cause (because/since) — "siden" triggers inversion. "Derfor" gives result (therefore). "For" is a slightly formal variant of "fordi".',
    words: [
      {
        word: 'fordi',
        meaning: 'Vanligste ordet for «because». Gir årsak.',
        meaningEnglish: 'The most common word for "because". Gives cause.',
        examples: [
          { norwegian: 'Jeg ble hjemme fordi jeg var syk.', english: 'I stayed home because I was sick.' },
        ],
      },
      {
        word: 'siden',
        meaning: 'Betyr «since/because». Når det starter setningen, kommer verbet før subjektet (inversjon).',
        meaningEnglish: 'Means "since/because". When it starts the sentence, the verb comes before the subject (inversion).',
        examples: [
          { norwegian: 'Siden det regnet, ble vi hjemme.', english: 'Since it rained, we stayed home.' },
        ],
      },
      {
        word: 'for',
        meaning: 'En litt formell variant av «fordi». Binder to hovedsetninger.',
        meaningEnglish: 'A slightly formal variant of "fordi". Connects two main clauses.',
        examples: [
          { norwegian: 'Vi gikk inn, for det begynte å regne.', english: 'We went inside, for it started to rain.' },
        ],
      },
      {
        word: 'derfor',
        meaning: 'Betyr «therefore/so». Gir resultat, ikke årsak.',
        meaningEnglish: 'Means "therefore/so". Gives result, not cause.',
        examples: [
          { norwegian: 'Jeg var syk, derfor ble jeg hjemme.', english: 'I was sick, therefore I stayed home.' },
          { norwegian: 'Det regnet, og derfor tok vi bussen.', english: 'It rained, and therefore we took the bus.' },
        ],
      },
    ],
    tags: ['because', 'therefore', 'since', 'for', 'fordi', 'siden', 'derfor', 'årsak', 'cause', 'result'],
  },
];
