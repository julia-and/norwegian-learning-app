import type { CEFRLevel } from '@/lib/resources';

export interface PrepGuideEntry {
  id: string;
  word: string;
  level: CEFRLevel;
  explanationNorsk: string;
  explanationEnglish: string;
  examples: { norwegian: string; english: string }[];
  exceptions?: { norwegian: string; english: string; note: string }[];
}

export interface PrepExercise {
  id: string;
  level: CEFRLevel;
  sentence: string;   // ___ marks the blank
  answer: string;
  explanationNorsk: string;
  explanationEnglish: string;
}

// ── Guide entries ─────────────────────────────────────────────────────────────

export const PREP_GUIDE: PrepGuideEntry[] = [
  {
    id: 'i',
    word: 'i',
    level: 'A1',
    explanationNorsk:
      '«I» brukes om plassering inni noe, om tidsperioder (måneder, år, sesonger), og om tilstander. Det tilsvarer ofte «in» på engelsk, men ikke alltid.',
    explanationEnglish:
      '"I" is used for location inside something, time periods (months, years, seasons), and states. It often corresponds to "in" in English, but not always.',
    examples: [
      { norwegian: 'Boken er i skuffen.', english: 'The book is in the drawer.' },
      { norwegian: 'Jeg bor i Oslo.', english: 'I live in Oslo.' },
      { norwegian: 'Vi møtes i januar.', english: 'We meet in January.' },
      { norwegian: 'Hun er i godt humør.', english: 'She is in a good mood.' },
    ],
    exceptions: [
      { norwegian: 'i går', english: 'yesterday', note: 'Fixed expression — not "on yesterday"' },
      { norwegian: 'i dag', english: 'today', note: 'Fixed expression' },
    ],
  },
  {
    id: 'paa',
    word: 'på',
    level: 'A1',
    explanationNorsk:
      '«På» betyr «on» (på overflaten av noe), men brukes også om steder som øyer, arbeidsplasser, og arrangementer, og i mange faste uttrykk.',
    explanationEnglish:
      '"På" means "on" (on the surface of something), but is also used for islands, workplaces, events, and many fixed expressions.',
    examples: [
      { norwegian: 'Koppen er på bordet.', english: 'The cup is on the table.' },
      { norwegian: 'Han jobber på sykehuset.', english: 'He works at the hospital.' },
      { norwegian: 'Vi bor på Svalbard.', english: 'We live on Svalbard.' },
      { norwegian: 'Jeg er på fest.', english: 'I am at a party.' },
    ],
    exceptions: [
      { norwegian: 'på skolen / på jobben', english: 'at school / at work', note: 'Use «på», not «i»' },
      { norwegian: 'på norsk', english: 'in Norwegian', note: 'Language expression uses «på»' },
    ],
  },
  {
    id: 'til',
    word: 'til',
    level: 'A1',
    explanationNorsk:
      '«Til» angir retning (bevegelse mot et mål), mottaker, og hensikt. Det tilsvarer «to» eller «for» på engelsk.',
    explanationEnglish:
      '"Til" indicates direction (movement toward a goal), recipient, and purpose. It corresponds to "to" or "for" in English.',
    examples: [
      { norwegian: 'Jeg reiser til Bergen.', english: 'I travel to Bergen.' },
      { norwegian: 'Gi dette til ham.', english: 'Give this to him.' },
      { norwegian: 'Hva er det til middag?', english: 'What is for dinner?' },
      { norwegian: 'til slutt', english: 'in the end / finally' },
    ],
  },
  {
    id: 'fra',
    word: 'fra',
    level: 'A1',
    explanationNorsk:
      '«Fra» angir utgangspunkt — både i rom og tid. Det tilsvarer «from» på engelsk.',
    explanationEnglish:
      '"Fra" indicates the starting point — both in space and time. It corresponds to "from" in English.',
    examples: [
      { norwegian: 'Jeg kommer fra Norge.', english: 'I come from Norway.' },
      { norwegian: 'fra klokka ni til tre', english: 'from nine o\'clock to three' },
      { norwegian: 'Et brev fra vennen min.', english: 'A letter from my friend.' },
    ],
  },
  {
    id: 'med',
    word: 'med',
    level: 'A1',
    explanationNorsk:
      '«Med» betyr «with» — om følgeskap, instrument, eller middel.',
    explanationEnglish:
      '"Med" means "with" — company, instrument, or means.',
    examples: [
      { norwegian: 'Jeg spiser med en skje.', english: 'I eat with a spoon.' },
      { norwegian: 'Hun går med hunden.', english: 'She walks with the dog.' },
      { norwegian: 'Jeg er enig med deg.', english: 'I agree with you.' },
    ],
  },
  {
    id: 'for',
    word: 'for',
    level: 'A1',
    explanationNorsk:
      '«For» brukes om hensikt, mottaker, årsak, og i sammenligninger. Det tilsvarer «for» eller «because of» på engelsk.',
    explanationEnglish:
      '"For" is used for purpose, recipient, cause, and in comparisons. It corresponds to "for" or "because of" in English.',
    examples: [
      { norwegian: 'Jeg kjøpte dette for deg.', english: 'I bought this for you.' },
      { norwegian: 'for to år siden', english: 'two years ago' },
      { norwegian: 'Det er for dyrt.', english: 'It is too expensive.' },
    ],
    exceptions: [
      { norwegian: 'for … siden', english: 'ago', note: '«for» + time + «siden» = X ago' },
    ],
  },
  {
    id: 'av',
    word: 'av',
    level: 'A2',
    explanationNorsk:
      '«Av» uttrykker opprinnelse, materiale, årsak, eller at noe er en del av noe. Det tilsvarer «of», «by», eller «from» på engelsk.',
    explanationEnglish:
      '"Av" expresses origin, material, cause, or partitiveness. It corresponds to "of", "by", or "from" in English.',
    examples: [
      { norwegian: 'Et glass av krystall.', english: 'A glass made of crystal.' },
      { norwegian: 'Romanen er skrevet av Ibsen.', english: 'The novel is written by Ibsen.' },
      { norwegian: 'Jeg er lei av det.', english: 'I am tired of it.' },
      { norwegian: 'av og til', english: 'from time to time / occasionally' },
    ],
  },
  {
    id: 'om',
    word: 'om',
    level: 'A2',
    explanationNorsk:
      '«Om» kan bety «about» (angående noe), «in» (framtidig tid), eller «around» (omring). Konteksten avgjør betydningen.',
    explanationEnglish:
      '"Om" can mean "about" (regarding something), "in" (future time), or "around". Context determines the meaning.',
    examples: [
      { norwegian: 'Vi snakket om deg.', english: 'We talked about you.' },
      { norwegian: 'Toget går om fem minutter.', english: 'The train leaves in five minutes.' },
      { norwegian: 'Han gikk om hjørnet.', english: 'He went around the corner.' },
    ],
  },
  {
    id: 'ved',
    word: 'ved',
    level: 'A2',
    explanationNorsk:
      '«Ved» betyr «by», «near», eller «at» — nærhet til noe. Det brukes også i faste uttrykk om tidspunkt.',
    explanationEnglish:
      '"Ved" means "by", "near", or "at" — proximity to something. It is also used in fixed expressions about time.',
    examples: [
      { norwegian: 'Huset ligger ved sjøen.', english: 'The house is by the sea.' },
      { norwegian: 'Hun sitter ved vinduet.', english: 'She sits by the window.' },
      { norwegian: 'ved midnatt', english: 'at midnight' },
    ],
  },
  {
    id: 'hos',
    word: 'hos',
    level: 'A2',
    explanationNorsk:
      '«Hos» betyr «at» i betydningen hos en person — det angir at du er på eller besøker noen sin plass. Det brukes ikke om steder generelt.',
    explanationEnglish:
      '"Hos" means "at" in the sense of being at someone\'s place. It implies visiting or being with a person, not a general location.',
    examples: [
      { norwegian: 'Jeg er hos tannlegen.', english: 'I am at the dentist\'s.' },
      { norwegian: 'Vi spiste middag hos henne.', english: 'We had dinner at her place.' },
      { norwegian: 'Han jobber hos Telenor.', english: 'He works at Telenor.' },
    ],
  },
  {
    id: 'mot',
    word: 'mot',
    level: 'A2',
    explanationNorsk:
      '«Mot» betyr «towards» (retning) eller «against» (motstand). Det er et preposisjon om bevegelse og opposisjon.',
    explanationEnglish:
      '"Mot" means "towards" (direction) or "against" (opposition). It covers movement and contrast.',
    examples: [
      { norwegian: 'Han gikk mot utgangen.', english: 'He walked towards the exit.' },
      { norwegian: 'De spilte mot hverandre.', english: 'They played against each other.' },
      { norwegian: 'mot kvelden', english: 'towards the evening' },
    ],
  },
  {
    id: 'etter',
    word: 'etter',
    level: 'B1',
    explanationNorsk:
      '«Etter» betyr «after» (tid eller rekkefølge) eller «for» i betydningen å søke / lengte etter noe.',
    explanationEnglish:
      '"Etter" means "after" (time or sequence) or "for" in the sense of seeking / longing for something.',
    examples: [
      { norwegian: 'Vi møtes etter lunsj.', english: 'We meet after lunch.' },
      { norwegian: 'Hun leter etter nøklene.', english: 'She is looking for the keys.' },
      { norwegian: 'Etter min mening …', english: 'In my opinion …' },
    ],
  },
  {
    id: 'foer',
    word: 'før',
    level: 'B1',
    explanationNorsk:
      '«Før» betyr «before» — om tidspunkt eller rekkefølge. Det kan også brukes som konjunksjon i bisetninger.',
    explanationEnglish:
      '"Før" means "before" — referring to time or order. It can also function as a conjunction in subordinate clauses.',
    examples: [
      { norwegian: 'Spis opp før du går.', english: 'Eat up before you leave.' },
      { norwegian: 'Jeg hadde aldri sett det før.', english: 'I had never seen it before.' },
      { norwegian: 'Ringer du før du kommer?', english: 'Will you call before you come?' },
    ],
  },
  {
    id: 'mellom',
    word: 'mellom',
    level: 'B1',
    explanationNorsk:
      '«Mellom» betyr «between» (to eller flere ting) eller «among». Det brukes om rom, tid, og abstrakte relasjoner.',
    explanationEnglish:
      '"Mellom" means "between" (two or more things) or "among". It is used for space, time, and abstract relations.',
    examples: [
      { norwegian: 'Huset ligger mellom to trær.', english: 'The house is between two trees.' },
      { norwegian: 'mellom klokka to og fire', english: 'between two and four o\'clock' },
      { norwegian: 'Det er et problem mellom oss.', english: 'There is a problem between us.' },
    ],
  },
  {
    id: 'ut-av',
    word: 'ut av',
    level: 'B2',
    explanationNorsk:
      '«Ut av» betyr «out of» — bevegelse fra innsiden og ut. Det kombinerer retningsdelen «ut» med kilden «av».',
    explanationEnglish:
      '"Ut av" means "out of" — movement from inside outward. It combines the directional "ut" with the source "av".',
    examples: [
      { norwegian: 'Han gikk ut av rommet.', english: 'He walked out of the room.' },
      { norwegian: 'Ta pengene ut av lommeboken.', english: 'Take the money out of the wallet.' },
      { norwegian: 'Bilen kjørte ut av garasjen.', english: 'The car drove out of the garage.' },
    ],
  },
];

// ── Exercises ─────────────────────────────────────────────────────────────────

export const PREP_EXERCISES: PrepExercise[] = [
  // A1
  {
    id: 'ex-a1-01',
    level: 'A1',
    sentence: 'Jeg bor ___ Oslo.',
    answer: 'i',
    explanationNorsk: 'Vi bruker «i» om å bo i en by.',
    explanationEnglish: 'Use "i" when talking about living in a city.',
  },
  {
    id: 'ex-a1-02',
    level: 'A1',
    sentence: 'Boken er ___ bordet.',
    answer: 'på',
    explanationNorsk: '«På» brukes når noe er på overflaten av noe annet.',
    explanationEnglish: '"På" is used when something is on the surface of something else.',
  },
  {
    id: 'ex-a1-03',
    level: 'A1',
    sentence: 'Jeg reiser ___ Bergen i morgen.',
    answer: 'til',
    explanationNorsk: '«Til» angir retning — der du er på vei.',
    explanationEnglish: '"Til" indicates direction — where you are heading.',
  },
  {
    id: 'ex-a1-04',
    level: 'A1',
    sentence: 'Hun kommer ___ Frankrike.',
    answer: 'fra',
    explanationNorsk: '«Fra» angir utgangspunkt.',
    explanationEnglish: '"Fra" indicates origin or starting point.',
  },
  {
    id: 'ex-a1-05',
    level: 'A1',
    sentence: 'Kan du hjelpe meg ___ leksene?',
    answer: 'med',
    explanationNorsk: '«Med» brukes i uttrykket «hjelpe med noe».',
    explanationEnglish: '"Med" is used in the expression "help with something".',
  },
  {
    id: 'ex-a1-06',
    level: 'A1',
    sentence: 'Jeg kjøper en gave ___ mamma.',
    answer: 'til',
    explanationNorsk: '«Til» brukes om mottakeren av noe.',
    explanationEnglish: '"Til" is used for the recipient of something.',
  },
  {
    id: 'ex-a1-07',
    level: 'A1',
    sentence: 'Møtet er ___ klokka tre.',
    answer: 'på',
    explanationNorsk: 'Klokkeslett bruker «på» — «på klokka tre».',
    explanationEnglish: 'Clock times use "på" — "på klokka tre" (at three o\'clock).',
  },
  {
    id: 'ex-a1-08',
    level: 'A1',
    sentence: 'Vi sees ___ mandag.',
    answer: 'på',
    explanationNorsk: 'Ukedager bruker «på» i norsk.',
    explanationEnglish: 'Days of the week use "på" in Norwegian.',
  },
  {
    id: 'ex-a1-09',
    level: 'A1',
    sentence: 'Han spiser ___ en skje.',
    answer: 'med',
    explanationNorsk: '«Med» brukes om redskapet man bruker.',
    explanationEnglish: '"Med" is used for the instrument you use.',
  },
  {
    id: 'ex-a1-10',
    level: 'A1',
    sentence: 'Sukkeret er ___ skapet.',
    answer: 'i',
    explanationNorsk: '«I» brukes om plassering inni noe.',
    explanationEnglish: '"I" is used for location inside something.',
  },

  // A2
  {
    id: 'ex-a2-01',
    level: 'A2',
    sentence: 'Han jobber ___ sykehuset.',
    answer: 'på',
    explanationNorsk: 'Arbeidsplasser bruker ofte «på» i norsk.',
    explanationEnglish: 'Workplaces often use "på" in Norwegian.',
  },
  {
    id: 'ex-a2-02',
    level: 'A2',
    sentence: 'Jeg er lei ___ å vente.',
    answer: 'av',
    explanationNorsk: '«Lei av» betyr «tired of» — fast uttrykk.',
    explanationEnglish: '"Lei av" means "tired of" — a fixed expression.',
  },
  {
    id: 'ex-a2-03',
    level: 'A2',
    sentence: 'Vi snakker ___ været.',
    answer: 'om',
    explanationNorsk: '«Om» brukes i betydningen «about» — angående noe.',
    explanationEnglish: '"Om" is used in the sense of "about" — regarding something.',
  },
  {
    id: 'ex-a2-04',
    level: 'A2',
    sentence: 'Huset ligger ___ sjøen.',
    answer: 'ved',
    explanationNorsk: '«Ved» betyr «by» — nær noe.',
    explanationEnglish: '"Ved" means "by" — near something.',
  },
  {
    id: 'ex-a2-05',
    level: 'A2',
    sentence: 'Jeg er ___ tannlegen nå.',
    answer: 'hos',
    explanationNorsk: '«Hos» brukes om å være på noen sin plass.',
    explanationEnglish: '"Hos" is used for being at someone\'s place.',
  },
  {
    id: 'ex-a2-06',
    level: 'A2',
    sentence: 'Toget går ___ ti minutter.',
    answer: 'om',
    explanationNorsk: '«Om» + tid = «in X minutes/hours» (fremtid).',
    explanationEnglish: '"Om" + time = "in X minutes/hours" (future).',
  },
  {
    id: 'ex-a2-07',
    level: 'A2',
    sentence: 'Hun gikk ___ utgangen.',
    answer: 'mot',
    explanationNorsk: '«Mot» brukes om retning — «towards».',
    explanationEnglish: '"Mot" is used for direction — "towards".',
  },
  {
    id: 'ex-a2-08',
    level: 'A2',
    sentence: 'Romanen er skrevet ___ Sigrid Undset.',
    answer: 'av',
    explanationNorsk: '«Av» brukes i passiv om hvem som utfører handlingen («by»).',
    explanationEnglish: '"Av" is used in passive constructions for the agent ("by").',
  },
  {
    id: 'ex-a2-09',
    level: 'A2',
    sentence: 'Vi spiste middag ___ dem i går.',
    answer: 'hos',
    explanationNorsk: '«Hos» brukes om å besøke noen og spise/være der.',
    explanationEnglish: '"Hos" is used for visiting someone at their place.',
  },
  {
    id: 'ex-a2-10',
    level: 'A2',
    sentence: 'Jeg bor ___ Tromsø, nord ___ Norge.',
    answer: 'i',
    explanationNorsk: '«I» brukes om å bo i en by eller et land.',
    explanationEnglish: '"I" is used for living in a city or country.',
  },
  {
    id: 'ex-a2-11',
    level: 'A2',
    sentence: 'Hva tenker du ___ forslaget?',
    answer: 'om',
    explanationNorsk: '«Tenke om» betyr «to think about/of» noe.',
    explanationEnglish: '"Tenke om" means "to think about/of" something.',
  },
  {
    id: 'ex-a2-12',
    level: 'A2',
    sentence: 'Jeg kjøpte dette ___ to år siden.',
    answer: 'for',
    explanationNorsk: '«For … siden» er uttrykket for «ago».',
    explanationEnglish: '"For … siden" is the expression for "ago".',
  },
  {
    id: 'ex-a2-13',
    level: 'A2',
    sentence: 'De spiller ___ hverandre på lørdag.',
    answer: 'mot',
    explanationNorsk: '«Mot» brukes om å spille «against» noen.',
    explanationEnglish: '"Mot" is used when competing "against" someone.',
  },
  {
    id: 'ex-a2-14',
    level: 'A2',
    sentence: 'Hun sitter ___ vinduet og leser.',
    answer: 'ved',
    explanationNorsk: '«Ved» betyr «by» — sittende nær noe.',
    explanationEnglish: '"Ved" means "by" — sitting near something.',
  },
  {
    id: 'ex-a2-15',
    level: 'A2',
    sentence: 'Glasset er laget ___ krystall.',
    answer: 'av',
    explanationNorsk: '«Av» brukes om materialet noe er laget av.',
    explanationEnglish: '"Av" is used for the material something is made of.',
  },

  // B1
  {
    id: 'ex-b1-01',
    level: 'B1',
    sentence: 'Vi møtes ___ lunsj i morgen.',
    answer: 'etter',
    explanationNorsk: '«Etter» betyr «after» i tid.',
    explanationEnglish: '"Etter" means "after" in time.',
  },
  {
    id: 'ex-b1-02',
    level: 'B1',
    sentence: 'Spis opp maten ___ du går.',
    answer: 'før',
    explanationNorsk: '«Før» betyr «before» — tidspunkt.',
    explanationEnglish: '"Før" means "before" — a point in time.',
  },
  {
    id: 'ex-b1-03',
    level: 'B1',
    sentence: 'Huset ligger ___ to store trær.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» betyr «between».',
    explanationEnglish: '"Mellom" means "between".',
  },
  {
    id: 'ex-b1-04',
    level: 'B1',
    sentence: 'Hun leter ___ jobben sin.',
    answer: 'etter',
    explanationNorsk: '«Lete etter» betyr «to look for» noe.',
    explanationEnglish: '"Lete etter" means "to look for" something.',
  },
  {
    id: 'ex-b1-05',
    level: 'B1',
    sentence: '___ min mening er dette feil.',
    answer: 'Etter',
    explanationNorsk: '«Etter min mening» = «in my opinion» — fast uttrykk.',
    explanationEnglish: '"Etter min mening" = "in my opinion" — fixed expression.',
  },
  {
    id: 'ex-b1-06',
    level: 'B1',
    sentence: 'Forholdet ___ dem er komplisert.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» brukes om relasjoner mellom personer.',
    explanationEnglish: '"Mellom" is used for relationships between people.',
  },
  {
    id: 'ex-b1-07',
    level: 'B1',
    sentence: 'Ring meg ___ du ankommer.',
    answer: 'før',
    explanationNorsk: '«Før» som konjunksjon: «before you arrive».',
    explanationEnglish: '"Før" as a conjunction: "before you arrive".',
  },
  {
    id: 'ex-b1-08',
    level: 'B1',
    sentence: 'Møtet er ___ klokka to og fire.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» brukes om et tidsintervall.',
    explanationEnglish: '"Mellom" is used for a time interval.',
  },
  {
    id: 'ex-b1-09',
    level: 'B1',
    sentence: 'Jeg kom ___ maten ble ferdig.',
    answer: 'før',
    explanationNorsk: '«Før» betyr «before» i en tidsrekkefølge.',
    explanationEnglish: '"Før" means "before" in a sequence of events.',
  },
  {
    id: 'ex-b1-10',
    level: 'B1',
    sentence: 'Han lengte ___ hjemstedet sitt.',
    answer: 'etter',
    explanationNorsk: '«Lengte etter» = «to long for» — fast uttrykk.',
    explanationEnglish: '"Lengte etter" = "to long for" — fixed expression.',
  },
  {
    id: 'ex-b1-11',
    level: 'B1',
    sentence: 'Prisen er ___ hundre og to hundre kroner.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» brukes om et tall- eller prisintervall.',
    explanationEnglish: '"Mellom" is used for a numerical or price range.',
  },
  {
    id: 'ex-b1-12',
    level: 'B1',
    sentence: 'De diskuterte saken ___ møtet.',
    answer: 'etter',
    explanationNorsk: '«Etter møtet» betyr «after the meeting».',
    explanationEnglish: '"Etter møtet" means "after the meeting".',
  },
  {
    id: 'ex-b1-13',
    level: 'B1',
    sentence: 'Aldri hadde jeg sett det ___.',
    answer: 'før',
    explanationNorsk: '«Aldri … før» = «never … before» — fast mønster.',
    explanationEnglish: '"Aldri … før" = "never … before" — fixed pattern.',
  },
  {
    id: 'ex-b1-14',
    level: 'B1',
    sentence: 'Det er stor forskjell ___ de to dialektene.',
    answer: 'mellom',
    explanationNorsk: '«Forskjell mellom» = «difference between».',
    explanationEnglish: '"Forskjell mellom" = "difference between".',
  },
  {
    id: 'ex-b1-15',
    level: 'B1',
    sentence: 'Hun søker ___ en ny leilighet.',
    answer: 'etter',
    explanationNorsk: '«Søke etter» = «to search for».',
    explanationEnglish: '"Søke etter" = "to search for".',
  },

  // B2
  {
    id: 'ex-b2-01',
    level: 'B2',
    sentence: 'Han gikk ___ rommet uten å si noe.',
    answer: 'ut av',
    explanationNorsk: '«Ut av» betyr «out of» — bevegelse fra innsiden.',
    explanationEnglish: '"Ut av" means "out of" — movement from inside.',
  },
  {
    id: 'ex-b2-02',
    level: 'B2',
    sentence: 'Situasjonen er ___ kontroll.',
    answer: 'ut av',
    explanationNorsk: '«Ut av kontroll» = «out of control» — fast uttrykk.',
    explanationEnglish: '"Ut av kontroll" = "out of control" — fixed expression.',
  },
  {
    id: 'ex-b2-03',
    level: 'B2',
    sentence: 'Det er vanskelig å komme seg ___ det vante mønsteret.',
    answer: 'ut av',
    explanationNorsk: '«Komme seg ut av» = «to get out of» (et mønster, en situasjon).',
    explanationEnglish: '"Komme seg ut av" = "to get out of" (a pattern, a situation).',
  },
  {
    id: 'ex-b2-04',
    level: 'B2',
    sentence: '___ et historisk perspektiv er dette interessant.',
    answer: 'Fra',
    explanationNorsk: '«Fra et perspektiv» = «from a perspective».',
    explanationEnglish: '"Fra et perspektiv" = "from a perspective".',
  },
  {
    id: 'ex-b2-05',
    level: 'B2',
    sentence: 'Bilen kjørte ___ garasjen.',
    answer: 'ut av',
    explanationNorsk: '«Ut av» brukes om bevegelse ut fra et lukket rom.',
    explanationEnglish: '"Ut av" is used for movement out of an enclosed space.',
  },
  {
    id: 'ex-b2-06',
    level: 'B2',
    sentence: '___ ettermiddagen ble det klart.',
    answer: 'Mot',
    explanationNorsk: '«Mot ettermiddagen» = «towards the afternoon» — omtrentlig tid.',
    explanationEnglish: '"Mot ettermiddagen" = "towards the afternoon" — approximate time.',
  },
  {
    id: 'ex-b2-07',
    level: 'B2',
    sentence: 'Han tok pengene ___ lommeboken.',
    answer: 'ut av',
    explanationNorsk: '«Ut av» angir at noe tas fra innsiden av noe annet.',
    explanationEnglish: '"Ut av" indicates something taken from inside something else.',
  },
  {
    id: 'ex-b2-08',
    level: 'B2',
    sentence: 'Prosjektet gikk ___ budsjettet.',
    answer: 'ut av',
    explanationNorsk: '«Gå ut av budsjettet» = «to exceed / go over budget».',
    explanationEnglish: '"Gå ut av budsjettet" = "to exceed / go over budget".',
  },
  {
    id: 'ex-b2-09',
    level: 'B2',
    sentence: 'Avstanden ___ de to byene er stor.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» brukes om avstand mellom to steder.',
    explanationEnglish: '"Mellom" is used for distance between two places.',
  },
  {
    id: 'ex-b2-10',
    level: 'B2',
    sentence: 'Avtalen ble inngått ___ de to partiene.',
    answer: 'mellom',
    explanationNorsk: '«Mellom» brukes om avtaler og relasjoner mellom parter.',
    explanationEnglish: '"Mellom" is used for agreements and relations between parties.',
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const LEVEL_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2'];

/** Pick up to `n` exercises at the given level, plus one level below for variety. */
export function sampleExercises(level: CEFRLevel, n = 10): PrepExercise[] {
  const idx = LEVEL_ORDER.indexOf(level);
  const allowed = idx > 0
    ? [level, LEVEL_ORDER[idx - 1]]
    : [level];

  const pool = PREP_EXERCISES.filter(e => allowed.includes(e.level));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}
