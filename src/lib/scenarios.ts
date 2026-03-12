import type { CEFRLevel } from '@/lib/resources';
export type { CEFRLevel };

export interface ConversationScenario {
  id: string;
  level: CEFRLevel;
  title: string;        // Norwegian title, shown in UI
  titleEn: string;      // English title
  role: string;         // AI character description (English, used in system prompt)
  situation: string;    // Norwegian situation description for the learner
  situationEn: string;  // English translation of situation
  openingLine: string;  // AI's first message in Norwegian
  maxTurns: number;
  vocabulary?: string[]; // Optional key vocab hints
}

export const SCENARIOS: ConversationScenario[] = [
  // ─── A1 ─────────────────────────────────────────────────────────────────
  {
    id: 'a1-kassen',
    level: 'A1',
    title: 'På kassen',
    titleEn: 'At the checkout',
    role: 'You are Kari, a friendly cashier at a Rema 1000 grocery store in Oslo. Keep your language extremely simple.',
    situation: 'Du er på Rema 1000. Kari er kassadamen. Du skal betale for varene dine.',
    situationEn: "You're at Rema 1000. Kari is the cashier. You need to pay for your groceries.",
    openingLine: 'Hei! Har du Rema-kort?',
    maxTurns: 4,
    vocabulary: ['betale', 'kort', 'kontant', 'pose', 'kvittering'],
  },
  {
    id: 'a1-kafeen',
    level: 'A1',
    title: 'På kafeen',
    titleEn: 'At the café',
    role: 'You are Lars, a barista at a small café in Bergen. Speak very simply and slowly as if to a beginner.',
    situation: 'Du er på en kafé. Lars jobber der. Du vil bestille noe å drikke og spise.',
    situationEn: "You're at a café. Lars works there. You want to order something to drink and eat.",
    openingLine: 'Hei! Hva kan jeg hjelpe deg med?',
    maxTurns: 4,
    vocabulary: ['kaffe', 'te', 'kake', 'vann', 'bestille', 'stor', 'liten'],
  },
  {
    id: 'a1-presentere',
    level: 'A1',
    title: 'Presentere seg',
    titleEn: 'Introducing yourself',
    role: 'You are Erik, a friendly Norwegian student meeting someone new. Ask simple questions about name, where they are from, and what they do.',
    situation: 'Du møter Erik på et språkkurs. Han vil snakke med deg.',
    situationEn: "You meet Erik at a language course. He wants to talk with you.",
    openingLine: 'Hei! Jeg heter Erik. Hva heter du?',
    maxTurns: 4,
    vocabulary: ['hete', 'komme fra', 'bo', 'studere', 'jobbe', 'år gammel'],
  },
  {
    id: 'a1-legen',
    level: 'A1',
    title: 'Hos legen',
    titleEn: "At the doctor's",
    role: 'You are Dr. Hansen, a general practitioner. Ask simple questions about symptoms. Keep language very basic.',
    situation: 'Du er syk og er hos legen. Dr. Hansen skal undersøke deg.',
    situationEn: "You are sick and at the doctor's. Dr. Hansen will examine you.",
    openingLine: 'God dag. Sett deg ned. Hva er problemet?',
    maxTurns: 3,
    vocabulary: ['vondt', 'hode', 'mage', 'feber', 'hoste', 'syk', 'siden'],
  },

  // ─── A2 ─────────────────────────────────────────────────────────────────
  {
    id: 'a2-pizza',
    level: 'A2',
    title: 'Bestille pizza på telefon',
    titleEn: 'Ordering pizza by phone',
    role: 'You are an employee at Pizza Kiosk taking a phone order. Ask about the pizza type, size, address, and payment.',
    situation: 'Du ringer Pizza Kiosk for å bestille pizza til hjem. De tar imot bestillingen.',
    situationEn: 'You call Pizza Kiosk to order pizza for delivery. They take your order.',
    openingLine: 'Hei, du har ringt Pizza Kiosk! Hva kan jeg hjelpe deg med?',
    maxTurns: 5,
    vocabulary: ['bestille', 'størrelse', 'adresse', 'leveringstid', 'betale', 'margherita'],
  },
  {
    id: 'a2-biblioteket',
    level: 'A2',
    title: 'På biblioteket',
    titleEn: 'At the library',
    role: 'You are Turid, a librarian at a public library. Help the visitor find books and explain library services.',
    situation: 'Du er på biblioteket. Turid jobber der og kan hjelpe deg.',
    situationEn: 'You are at the library. Turid works there and can help you.',
    openingLine: 'Hei, kan jeg hjelpe deg med noe?',
    maxTurns: 5,
    vocabulary: ['låne', 'bok', 'lånekort', 'returnere', 'reservere', 'frist'],
  },
  {
    id: 'a2-buss',
    level: 'A2',
    title: 'Kjøpe bussbillett',
    titleEn: 'Buying a bus ticket',
    role: 'You are a bus driver in Trondheim. Help the passenger with tickets and give directions.',
    situation: 'Du er på bussen og skal kjøpe billett. Sjåføren hjelper deg.',
    situationEn: 'You are on the bus and need to buy a ticket. The driver helps you.',
    openingLine: 'Neste stopp! Hvor skal du?',
    maxTurns: 4,
    vocabulary: ['billett', 'stasjon', 'stopp', 'enkeltbillett', 'månedskort', 'bytte'],
  },
  {
    id: 'a2-naebo',
    level: 'A2',
    title: 'Vær-samtale med nabo',
    titleEn: 'Weather chat with neighbour',
    role: 'You are Olav, a friendly middle-aged neighbour. Chat about the weather and make small talk.',
    situation: 'Du møter naboen Olav utenfor. Han vil snakke om været og hverdagen.',
    situationEn: 'You meet your neighbour Olav outside. He wants to chat about the weather and everyday life.',
    openingLine: 'Hei, naboen! Herlig vær i dag, ikke sant?',
    maxTurns: 5,
    vocabulary: ['vær', 'sol', 'regn', 'kaldt', 'varmt', 'i dag', 'i morgen', 'helgen'],
  },

  // ─── B1 ─────────────────────────────────────────────────────────────────
  {
    id: 'b1-telia',
    level: 'B1',
    title: 'Ringe Telia for internett',
    titleEn: 'Calling Telia for internet support',
    role: 'You are Marte, a customer service representative at Telia. Help the customer with their internet connection problem, ask for account details, and troubleshoot.',
    situation: 'Du ringer Telia fordi internett ikke fungerer hjemme. Marte hjelper deg.',
    situationEn: 'You call Telia because your home internet is not working. Marte helps you.',
    openingLine: 'Takk for at du ringer Telia. Mitt navn er Marte, hva kan jeg hjelpe deg med i dag?',
    maxTurns: 6,
    vocabulary: ['tilkobling', 'ruter', 'abonnement', 'feilmelding', 'tekniker', 'pinge'],
  },
  {
    id: 'b1-jobbintervju',
    level: 'B1',
    title: 'Jobbintervju',
    titleEn: 'Job interview',
    role: 'You are Anne-Lise, an HR manager at a Norwegian tech company interviewing a candidate for an office assistant position. Ask standard interview questions.',
    situation: 'Du er på jobbintervju for en stilling som kontormedarbeider. Anne-Lise er HR-lederen.',
    situationEn: 'You are at a job interview for an office assistant position. Anne-Lise is the HR manager.',
    openingLine: 'Velkommen! Takk for at du kom. Kan du starte med å fortelle litt om deg selv?',
    maxTurns: 6,
    vocabulary: ['erfaring', 'kvalifikasjoner', 'stilling', 'arbeidsoppgaver', 'lønn', 'team'],
  },
  {
    id: 'b1-leilighet',
    level: 'B1',
    title: 'Leie leilighet',
    titleEn: 'Inquiring about renting a flat',
    role: 'You are Bjørn, a landlord showing a flat for rent in Oslo. Answer questions about the flat, terms, and neighbourhood.',
    situation: 'Du er interessert i å leie en leilighet av Bjørn i Storgata. Dere snakker om leiligheten og vilkårene.',
    situationEn: "You are interested in renting a flat from Bjørn in Storgata. You discuss the flat and the terms.",
    openingLine: 'Hei! Du ringte om leiligheten i Storgata? Den er ledig fra første mai.',
    maxTurns: 6,
    vocabulary: ['husleie', 'depositum', 'kvadratmeter', 'inkludert', 'strøm', 'nabolag'],
  },
  {
    id: 'b1-helgeplaner',
    level: 'B1',
    title: 'Diskutere helgeplaner',
    titleEn: 'Discussing weekend plans',
    role: 'You are Silje, a friendly colleague having lunch with a coworker. Chat about upcoming weekend plans and share your own.',
    situation: 'Du spiser lunsj med kollega Silje. Dere snakker om hva dere skal gjøre i helgen.',
    situationEn: 'You are having lunch with your colleague Silje. You chat about what you plan to do this weekend.',
    openingLine: 'Hei! Gleder du deg til helgen? Har du noen planer?',
    maxTurns: 5,
    vocabulary: ['hytte', 'fjell', 'ski', 'venner', 'konsert', 'avslappe', 'planlegge'],
  },

  // ─── B2 ─────────────────────────────────────────────────────────────────
  {
    id: 'b2-klage',
    level: 'B2',
    title: 'Klage på en vare',
    titleEn: 'Complaining about a product',
    role: 'You are a customer service representative at an electronics store. Handle the customer\'s complaint professionally but follow company policy — start by asking for proof of purchase.',
    situation: 'Du har kjøpt en defekt vare og vil klage. Kundeservicemedarbeideren hjelper (eller ikke) deg.',
    situationEn: 'You bought a defective product and want to complain. The customer service rep helps (or not) you.',
    openingLine: 'Hei, velkommen til kundeservice. Hva kan jeg hjelpe deg med?',
    maxTurns: 8,
    vocabulary: ['reklamasjon', 'kvittering', 'garanti', 'defekt', 'refusjon', 'bytte', 'forbrukerlov'],
  },
  {
    id: 'b2-nyheter',
    level: 'B2',
    title: 'Diskutere nyheter med kollega',
    titleEn: 'Discussing news with a colleague',
    role: 'You are Ingrid, an engaged colleague who loves discussing current events. Share opinions on a climate summit and ask for theirs. Be willing to debate politely.',
    situation: 'Du og kollega Ingrid diskuterer siste nyheter om et klimatoppmøte under kaffepausen.',
    situationEn: 'You and your colleague Ingrid discuss the latest news about a climate summit during the coffee break.',
    openingLine: 'Hei! Har du fått med deg det siste om klimatoppmøtet? Ganske interessant, synes jeg.',
    maxTurns: 7,
    vocabulary: ['klimaavtale', 'utslipp', 'fornybalt', 'forhandlinger', 'konsekvenser', 'enig', 'uenig'],
  },
  {
    id: 'b2-frisør',
    level: 'B2',
    title: 'Bestille time hos frisør',
    titleEn: 'Booking at the hairdresser',
    role: 'You are Nina, an experienced hairdresser. Discuss what the customer wants, suggest styles, explain what\'s possible with their hair type, and book an appointment.',
    situation: 'Du er hos frisøren Nina. Dere diskuterer hva du vil ha gjort med håret og bestiller time.',
    situationEn: 'You are at the hairdresser Nina. You discuss what you want done with your hair and book an appointment.',
    openingLine: 'Hei! Jeg er Nina. Hva kan jeg gjøre for deg i dag? Vil du klippe, farge, eller noe annet?',
    maxTurns: 7,
    vocabulary: ['klippe', 'farge', 'highlights', 'fringe', 'lag', 'tone', 'behandling', 'time'],
  },
  {
    id: 'b2-lønn',
    level: 'B2',
    title: 'Lønnsforhandling',
    titleEn: 'Salary negotiation',
    role: 'You are Håkon, a department manager conducting a salary review. You have a budget limit but are open to negotiation. Start slightly below what the employee expects.',
    situation: 'Du forhandler om lønn med sjefen din Håkon. Du har forberedt deg godt og vet hva du er verdt.',
    situationEn: 'You are negotiating your salary with your manager Håkon. You have prepared well and know your worth.',
    openingLine: 'Kom inn, kom inn! Vi hadde jo avtalt å snakke om lønnen din. Har du hatt tid til å tenke over hva du ønsker?',
    maxTurns: 8,
    vocabulary: ['lønnsøkning', 'markedslønn', 'kompetanse', 'ansvar', 'resultater', 'forhandle', 'tilbud'],
  },
];

export function scenariosForLevel(level: CEFRLevel): ConversationScenario[] {
  return SCENARIOS.filter(s => s.level === level);
}
