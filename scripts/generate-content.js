#!/usr/bin/env node

/**
 * Content Generation Script
 * Generates Frysian-Dutch lesson content using OpenAI API
 * 
 * Usage: 
 *   node scripts/generate-content.js <skill-id> <lesson-number>
 *   node scripts/generate-content.js <skill-id> --all
 *   node scripts/generate-content.js --init
 *   node scripts/generate-content.js --generate-all
 *   node scripts/generate-content.js --missing
 * 
 * Examples:
 *   node scripts/generate-content.js basics-1 1
 *   node scripts/generate-content.js basics-1 --all
 *   node scripts/generate-content.js --generate-all
 *   node scripts/generate-content.js --missing
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Constants
const MAX_RETRIES = 3;
const LESSONS_PER_SKILL = 4;
const VOCAB_ITEMS_PER_LESSON = 6; // Increased from 5 for better practice variety
const EXERCISES_PER_LESSON = 12; // Increased from 10 for more practice

// Skill definitions with detailed descriptions
// CRITICAL: Each skill should build on previous skills
// Lessons within a skill should have clear progression
const SKILLS = {
  'basics-1': {
    title: 'Basis 1',
    description: 'Essentiële woorden en begroetingen',
    longDescription: 'Begin je Friese reis met de belangrijkste woorden en zinnen. Leer hoe je mensen begroet, afscheid neemt en basisbeleefdheden uitdrukt in het Fries.',
    topics: ['begroetingen', 'afscheid nemen', 'bedanken', 'beleefdheid'],
    lessonDescriptions: [
      'Leer de belangrijkste begroetingen: hallo, goedemorgen, goedemiddag, goedenavond.',
      'Leer afscheid nemen: tot ziens, tot morgen, tot straks, goedenacht.',
      'Leer bedanken: dankjewel, dankuwel, graag gedaan, geen dank.',
      'Beleefde woorden: alsjeblieft, alstublieft, sorry, pardon.'
    ],
    // What vocabulary should be taught per lesson (for reference)
    vocabGuide: [
      ['Goeie (hallo)', 'Goeiemoarn', 'Goeiemiddei', 'Goeiejûn', 'Hoi', 'Hallo'],
      ['Oant sjen (tot ziens)', 'Oant moarn', 'Oant aanst', 'Goeienacht', 'Oant letter', 'Sjoch'],
      ['Tankewol', 'Tige tank', 'Graach dien', 'Gjin tank', 'Tank', 'Tige tankber'],
      ['Asjeblyft', 'Asjebleaft', 'Sorry', 'It spyt my', 'Ferskûldigje', 'Pardon']
    ],
    difficulty: 1,
  },
  'basics-2': {
    title: 'Basis 2',
    description: 'Persoonlijke voornaamwoorden en zijn/hebben',
    longDescription: 'Bouw je eerste zinnen in het Fries. Leer de persoonlijke voornaamwoorden en de werkwoorden "wêze" (zijn) en "hawwe" (hebben).',
    topics: ['ik/jij/hij/zij', 'wêze (zijn)', 'hawwe (hebben)', 'eenvoudige zinnen'],
    lessonDescriptions: [
      'Persoonlijke voornaamwoorden: ik, jij, hij, zij, het, wij, jullie, zij.',
      'Het werkwoord "wêze" (zijn): ik bin, do bist, hy/sy is, wy binne.',
      'Het werkwoord "hawwe" (hebben): ik ha, do hast, hy/sy hat, wy hawwe.',
      'Combineer voornaamwoorden met zijn en hebben in eenvoudige zinnen.'
    ],
    difficulty: 2,
  },
  'numbers': {
    title: 'Getallen',
    description: 'Tellen van 1 tot 100',
    longDescription: 'Leer tellen in het Fries! Van de basis getallen tot grotere nummers.',
    topics: ['1-10', '11-20', 'tientallen (10-100)', 'samengestelde getallen'],
    lessonDescriptions: [
      'Leer tellen van 1 tot 10: ien, twa, trije, fjouwer, fiif, seis, sân, acht, njoggen, tsien.',
      'Leer tellen van 11 tot 20: alve, tolve, trettjin... tweintich.',
      'Leer de tientallen: tsien, tweintich, tritich, fjirtich... hûndert.',
      'Samengestelde getallen: eenentwintig, tweeëndertig, etc.'
    ],
    difficulty: 1,
  },
  'family': {
    title: 'Familie',
    description: 'Familieleden en relaties',
    longDescription: 'Leer praten over je familie in het Fries. Van ouders tot grootouders, broers, zussen en meer.',
    topics: ['ouders', 'kinderen', 'grootouders', 'overige familie'],
    lessonDescriptions: [
      'Leer de woorden voor vader (heit), moeder (mem), ouders (âlders).',
      'Leer de woorden voor kinderen: zoon (soan), dochter (dochter), kind (bern).',
      'Grootouders: opa (pake), oma (beppe), grootouders (pake en beppe).',
      'Overige familie: broer (broer), zus (sus), oom (omke), tante (muoike).'
    ],
    difficulty: 2,
  },
  'colors': {
    title: 'Kleuren',
    description: 'Alle basiskleuren',
    longDescription: 'Maak je Fries kleurrijk! Leer alle basiskleuren om de wereld om je heen te beschrijven.',
    topics: ['basiskleuren', 'meer kleuren', 'licht en donker', 'kleuren gebruiken'],
    lessonDescriptions: [
      'Basiskleuren: rood (read), blauw (blau), geel (giel), groen (grien).',
      'Meer kleuren: oranje (oranje), paars (pears), roze (roze), bruin (brún).',
      'Licht en donker: wit (wyt), zwart (swart), grijs (griis), licht (ljocht), donker (tsjuster).',
      'Gebruik kleuren in zinnen: "De auto is read" (De auto is rood).'
    ],
    difficulty: 1,
  },
  'food': {
    title: 'Eten & Drinken',
    description: 'Dagelijkse woordenschat voor eten',
    longDescription: 'Leer over eten en drinken in het Fries. Van ontbijt tot avondeten.',
    topics: ['basis eten', 'drinken', 'maaltijden', 'bestellen'],
    lessonDescriptions: [
      'Basis eten: brood (bôle), kaas (tsiis), boter (bûter), ei (aai), vlees (fleis).',
      'Drinken: water (wetter), melk (molke), koffie (kofje), thee (tee), sap (sop).',
      'Maaltijden: ontbijt (moarnsiten), lunch (middeis iten), avondeten (jûnsiten).',
      'In het restaurant: bestellen, rekening vragen, smakelijk eten.'
    ],
    difficulty: 2,
  },
  'animals': {
    title: 'Dieren',
    description: 'Gewone dieren en huisdieren',
    longDescription: 'Ontdek de dierenwereld in het Fries! Van huisdieren tot boerderijdieren.',
    topics: ['huisdieren', 'boerderijdieren', 'wilde dieren', 'dieren beschrijven'],
    lessonDescriptions: [
      'Huisdieren: hond (hûn), kat (kat), vogel (fûgel), vis (fisk), konijn (knyn).',
      'Boerderijdieren: koe (ko), varken (baarch), kip (hin), paard (hynder), schaap (skiep).',
      'Wilde dieren: vos (foks), hert (hart), wolf (wolf), beer (bear), uil (ûle).',
      'Beschrijf dieren met kleuren en eigenschappen die je al kent.'
    ],
    difficulty: 1,
  },
  'time': {
    title: 'Tiid & Kalinder',
    description: 'Dagen, maanden en klokkijken',
    longDescription: 'Leer over tijd in het Fries. Van dagen van de week tot maanden en het vertellen van de tijd.',
    topics: ['dagen van de week', 'maanden', 'tijden van de dag', 'klokkijken'],
    lessonDescriptions: [
      'Dagen van de week: moandei, tiisdei, woansdei, tongersdei, freed, sneon, snein.',
      'Maanden van het jaar: jannewaris, febrewaris, maart, april, maaie, juny...',
      'Tijden van de dag: moarns (\'s ochtends), middeis (\'s middags), jûns (\'s avonds), nachts (\'s nachts).',
      'De klok: hoe let is it? It is trije oere. Kwart oer trije.'
    ],
    difficulty: 2,
  },
  'weather': {
    title: 'Waar & Seizoenen',
    description: 'Weer en jaargetijden',
    longDescription: 'Praat over het weer in het Fries! Leer de seizoenen en weersomstandigheden.',
    topics: ['seizoenen', 'weersomstandigheden', 'temperatuur', 'weer praten'],
    lessonDescriptions: [
      'De vier seizoenen: linte (lente), simmer (zomer), hjerst (herfst), winter (winter).',
      'Weersomstandigheden: sinne (zon), rein (regen), wyn (wind), snie (sneeuw), bewolkt.',
      'Temperatuur: waarm (warm), kâld (koud), hjit (heet), fris (fris), lekker.',
      'Praat over het weer: "Hoe is it waar?" "It is moai waar hjoed."'
    ],
    difficulty: 2,
  },
  'body': {
    title: 'Lichem',
    description: 'Lichaamsdelen',
    longDescription: 'Leer de lichaamsdelen in het Fries. Nuttig voor gezondheidsgesprekken en beschrijvingen.',
    topics: ['holle en gesicht', 'lichem', 'hânnen en fuotten', 'gefoel en sear'],
    lessonDescriptions: [
      'Hoofd en gezicht: holle (hoofd), eagen (ogen), noas (neus), mûle (mond), earen (oren).',
      'Lichaam: lichem (lichaam), hals (hals), boarst (borst), rêch (rug), búk (buik).',
      'Handen en voeten: hân (hand), finger (vinger), foet (voet), tean (teen), earm (arm), been (been).',
      'Gevoel en pijn: "Myn holle docht sear" (Mijn hoofd doet zeer), sûn (gezond), siik (ziek).'
    ],
    difficulty: 2,
  },
  'house': {
    title: 'Hûs & Thús',
    description: 'Kamers en meubels',
    longDescription: 'Leer over je huis in het Fries. Van kamers tot meubels en huishoudelijke items.',
    topics: ['kamers', 'meubels', 'huishouden', 'yn \'e hûs'],
    lessonDescriptions: [
      'Kamers: keamer (kamer), keuken (keuken), badkeamer (badkamer), sliepeseamer (slaapkamer), tún (tuin).',
      'Meubels: stoel (stoel), tafel (tafel), bêd (bed), kast (kast), bank (bank).',
      'Huishoudelijk: doar (deur), finster (raam), ljocht (lamp), trep (trap), mûre (muur).',
      'In huis: "Yn \'e keamer" (In de kamer), "Op \'e tafel" (Op de tafel).'
    ],
    difficulty: 2,
  },
  'clothing': {
    title: 'Klean',
    description: 'Kleding en accessoires',
    longDescription: 'Leer kledingstukken in het Fries. Combineer met kleuren die je al kent!',
    topics: ['basiskleding', 'accessoires', 'kleding en kleuren', 'oandwaan'],
    lessonDescriptions: [
      'Basiskleding: broek (broek), heve (trui),jas (jas), rok (rok), T-shirt.',
      'Schoenen en accessoires: skoech (schoenen), sokken (sokken), hoed (hoed), bril (bril), sjaal.',
      'Kleding en kleuren: "In read heve" (Een rode trui), "Swarte skoech" (Zwarte schoenen).',
      'Aantrekken: "Ik doch myn jas oan" (Ik trek mijn jas aan), "Wat hast oan?" (Wat heb je aan?)'
    ],
    difficulty: 2,
  },
  'verbs': {
    title: 'Werkwurden',
    description: 'Dagelijkse handelingen',
    longDescription: 'Leer de belangrijkste werkwoorden voor dagelijkse activiteiten. Essentieel voor echte gesprekken!',
    topics: ['basiswerkwoorden', 'beweging', 'dagelijkse handelingen', 'tegenwoordige tijd'],
    lessonDescriptions: [
      'Basiswerkwoorden: ite (eten), drinke (drinken), sliepe (slapen), wurde (worden), meitsje (maken).',
      'Beweging: rinne (lopen), springe (springen), sitten (zitten), stean (staan), lizze (liggen).',
      'Dagelijkse handelingen: wurkje (werken),learje (leren), spylje (spelen), lêze (lezen), skriuwe (schrijven).',
      'Vervoeging oefenen: "Ik rin, do rinst, hy rint" en zinnen maken.'
    ],
    difficulty: 3,
  },
  'places': {
    title: 'Plakken & Rjochting',
    description: 'Locaties en richtingen',
    longDescription: 'Navigeer in het Fries! Leer over plekken, richtingen en voorzetsels.',
    topics: ['plakken', 'rjochtingen', 'foarsetsels', 'wêr is...?'],
    lessonDescriptions: [
      'Plaatsen: stêd (stad), doarp (dorp), skoalle (school), wurk (werk), winkel (winkel), hûs (huis).',
      'Richtingen: lofts (links), rjochts (rechts), foarút (vooruit), efterút (achteruit), boppe (boven), ûnder (onder).',
      'Voorzetsels: yn (in), op (op), ûnder (onder), neist (naast), tusken (tussen), by (bij).',
      'Vragen stellen: "Wêr is de winkel?" (Waar is de winkel?), "Hoe kom ik dêr?" (Hoe kom ik daar?)'
    ],
    difficulty: 3,
  },
  'adjectives': {
    title: 'Bywurden',
    description: 'Beschrijvende woorden',
    longDescription: 'Maak je zinnen rijker met bijvoeglijke naamwoorden. Beschrijf grootte, kwaliteit en gevoelens.',
    topics: ['grutte', 'kwaliteit', 'gefoel', 'tsjinstellings'],
    lessonDescriptions: [
      'Grootte: grut (groot), lyts (klein), lang (lang), koart (kort), breed (breed), smel (smal).',
      'Kwaliteit: goed (goed), min (slecht), moai (mooi), lelik (lelijk), nij (nieuw), âld (oud).',
      'Gevoelens: bliid (blij), tryst (verdrietig),reas (boos), bang (bang), grutsk (trots), leafst (liefst).',
      'Tegenstellingen en gradaties: "grutter dan" (groter dan), "it grutste" (het grootst).'
    ],
    difficulty: 2,
  },
  'shopping': {
    title: 'Winkelje',
    description: 'Winkelen en kopen',
    longDescription: 'Leer winkelen in het Fries! Van winkels tot prijzen en praktische gesprekken.',
    topics: ['winkels', 'keapje', 'prizen', 'gesprekken'],
    lessonDescriptions: [
      'Soorten winkels: winkel (winkel), bakker (bakker), slachter (slager), supermerkt, apteek (apotheek).',
      'Kopen: "Ik wol graach..." (Ik wil graag...), "Hofolle kostet dit?" (Hoeveel kost dit?)',
      'Prijzen en hoeveelheden: euro, sint, kilo, gram, stik (stuk), "Te djoer" (Te duur).',
      'Praktische gesprekken: bestellen, betalen, korting vragen, "Kinne jo my helpe?" (Kunt u mij helpen?)'
    ],
    difficulty: 3,
  },
  'hobbies': {
    title: 'Hobbyʼs',
    description: 'Vrije tijd en activiteiten',
    longDescription: 'Praat over je hobby\'s in het Fries! Van sport tot kunst en andere vrijetijdsbesteding.',
    topics: ['sport', 'kultuer', 'bûtendoar', 'wat dochsto graach?'],
    lessonDescriptions: [
      'Sport: fuotbalje (voetballen), fytse (fietsen), swimme (zwemmen), rinne (hardlopen), tennis.',
      'Cultuur: lêze (lezen), filme sjen (films kijken), muzyk hearke (muziek luisteren), sjonge (zingen).',
      'Buitenactiviteiten: wandelje (wandelen), kampearje (kamperen), fiskerje (vissen), tuinierje.',
      'Praten over hobby\'s: "Wat dochsto graach?" (Wat doe je graag?), "Ik hâld fan..." (Ik hou van...)'
    ],
    difficulty: 3,
  },
};

// Dutch part of speech mapping
const PART_OF_SPEECH_NL = {
  'noun': 'zelfstandig naamwoord',
  'verb': 'werkwoord',
  'adjective': 'bijvoeglijk naamwoord',
  'adverb': 'bijwoord',
  'pronoun': 'voornaamwoord',
  'preposition': 'voorzetsel',
  'conjunction': 'voegwoord',
  'interjection': 'tussenwerpsel',
  'phrase': 'uitdrukking',
  'article': 'lidwoord',
  'numeral': 'telwoord',
};

/**
 * Retry wrapper for API calls
 */
async function withRetry(fn, maxRetries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`⚠️  Poging ${attempt}/${maxRetries} mislukt: ${error.message}`);
      if (attempt < maxRetries) {
        const delay = attempt * 2000;
        console.log(`   Opnieuw proberen over ${delay / 1000} seconden...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Validate vocabulary structure
 */
function validateVocabulary(vocabulary) {
  if (!Array.isArray(vocabulary) || vocabulary.length === 0) {
    throw new Error('Woordenschat moet een niet-lege array zijn');
  }

  const requiredFields = ['id', 'frysian', 'dutch', 'partOfSpeech', 'exampleSentence', 'exampleTranslation'];
  
  vocabulary.forEach((item, index) => {
    requiredFields.forEach(field => {
      if (!item[field]) {
        throw new Error(`Woordenschat item ${index + 1} mist vereist veld: ${field}`);
      }
    });
    
    // Validate Frisian characters are present (basic check)
    const hasFrisianChars = /[ûêôâúíïŵŷ]/.test(item.frysian) || 
                           /^[a-zA-Z\s]+$/.test(item.frysian); // Simple words are also valid
    
    // Check example sentence is actually in Frisian (should contain some Frisian words)
    if (item.exampleSentence === item.exampleTranslation) {
      console.warn(`⚠️  Waarschuwing: Voorbeeldzin lijkt niet Fries: "${item.exampleSentence}"`);
    }
  });

  return true;
}

/**
 * Validate exercises structure with stricter checks
 */
function validateExercises(exercises, vocabulary) {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    throw new Error('Oefeningen moet een niet-lege array zijn');
  }

  const validTypes = ['translation', 'fill-in-blank', 'multiple-choice', 'sentence-build'];
  const vocabFrysian = vocabulary.map(v => v.frysian.toLowerCase());
  const vocabDutch = vocabulary.map(v => v.dutch.toLowerCase());
  
  exercises.forEach((exercise, index) => {
    if (!exercise.type || !validTypes.includes(exercise.type)) {
      throw new Error(`Oefening ${index + 1} heeft een ongeldig type: ${exercise.type}`);
    }
    if (!exercise.id) {
      throw new Error(`Oefening ${index + 1} mist een id`);
    }
    
    // Type-specific validation
    switch (exercise.type) {
      case 'translation':
        if (!exercise.question || !exercise.correctAnswer) {
          throw new Error(`Vertaaloefening ${index + 1} mist question of correctAnswer`);
        }
        break;
        
      case 'fill-in-blank':
        if (!exercise.sentence || exercise.blankIndex === undefined || !exercise.correctAnswer) {
          throw new Error(`Invuloefening ${index + 1} mist vereiste velden`);
        }
        // Check that sentence is in Frisian (not Dutch)
        if (exercise.sentence.includes('___') === false) {
          throw new Error(`Invuloefening ${index + 1}: zin moet ___ bevatten`);
        }
        break;
        
      case 'multiple-choice':
        if (!exercise.question || !exercise.correctAnswer || !exercise.options || exercise.options.length < 3) {
          throw new Error(`Meerkeuze ${index + 1} mist vereiste velden of heeft te weinig opties`);
        }
        if (!exercise.options.includes(exercise.correctAnswer)) {
          throw new Error(`Meerkeuze ${index + 1}: correctAnswer zit niet in options`);
        }
        break;
        
      case 'sentence-build':
        if (!exercise.prompt || !exercise.correctOrder || !exercise.distractorWords) {
          throw new Error(`Zin-bouw ${index + 1} mist vereiste velden`);
        }
        if (exercise.correctOrder.length < 2) {
          throw new Error(`Zin-bouw ${index + 1}: correctOrder moet minimaal 2 woorden hebben`);
        }
        break;
    }
  });

  return true;
}

/**
 * Generate vocabulary for a lesson
 */
async function generateVocabulary(skill, lessonNumber) {
  const skillInfo = SKILLS[skill];
  const topic = skillInfo.topics[(lessonNumber - 1) % skillInfo.topics.length];
  const lessonDesc = skillInfo.lessonDescriptions[(lessonNumber - 1)];
  const vocabHints = skillInfo.vocabGuide ? skillInfo.vocabGuide[(lessonNumber - 1)] : null;
  
  const prompt = `Je bent een taalkundige expert in het Fries (Westerlauwers Fries, de officiële taal van Friesland).

TAAK: Genereer exact ${VOCAB_ITEMS_PER_LESSON} woordenschat items voor een les over "${topic}".

LES CONTEXT:
- Vaardigheid: ${skillInfo.title}
- Les ${lessonNumber} van ${LESSONS_PER_SKILL}
- Lesbeschrijving: ${lessonDesc}
${vocabHints ? `- Voorgestelde woorden (gebruik als richtlijn): ${vocabHints.join(', ')}` : ''}

KRITISCHE VEREISTEN:

1. FRIESE SPELLING (Fryske Akademy standaard):
   - Gebruik correcte speciale tekens: û, ê, ô, â, ú, í, ï, ŵ, ŷ
   - Let op: "Goeie" (hallo), "Goeiemoarn" (goedemorgen), "Goeiejûn" (goedenavond)
   - û = oe-klank, ê = ee-klank, ô = oo-klank

2. VOORBEELDZINNEN:
   - MOETEN in het Fries zijn, NIET in het Nederlands
   - Houd ze KORT en SIMPEL (max 5-6 woorden)
   - Gebruik alleen woorden die een beginner kan begrijpen
   - Voeg een Nederlandse vertaling toe van de voorbeeldzin

3. MOEILIJKHEIDSGRAAD:
   - Dit is les ${lessonNumber} van een beginnerscursus
   - Kies frequente, praktische woorden
   - Vermijd zeldzame of formele woorden

4. WOORDSOORTEN in het NEDERLANDS:
   - "zelfstandig naamwoord", "werkwoord", "bijvoeglijk naamwoord"
   - "tussenwerpsel" (voor begroetingen), "uitdrukking" (voor zinnen)

RETOURNEER exact dit JSON formaat:
{
  "vocabularyItems": [
    {
      "id": "unieke-slug-id",
      "frysian": "Fries woord",
      "dutch": "Nederlandse vertaling",
      "partOfSpeech": "woordsoort in Nederlands",
      "exampleSentence": "Korte Friese zin met dit woord",
      "exampleTranslation": "Nederlandse vertaling van de voorbeeldzin"
    }
  ]
}

Genereer nu ${VOCAB_ITEMS_PER_LESSON} woorden voor het onderwerp "${topic}".`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  const vocabulary = parsed.vocabularyItems || parsed.vocabulary || parsed;
  
  // Ensure it's an array
  const vocabArray = Array.isArray(vocabulary) ? vocabulary : [vocabulary];
  
  validateVocabulary(vocabArray);
  return vocabArray;
}

/**
 * Get difficulty configuration based on lesson number
 * Lessons 1-2: Single words only
 * Lessons 3-4: Phrases and sentences
 */
function getDifficultyConfig(lessonNumber) {
  if (lessonNumber <= 2) {
    return {
      level: 'beginner',
      translationFormat: 'ALLEEN losse woorden, GEEN zinnen',
      fillInFormat: 'Zeer korte zinnen (2-3 woorden)',
      sentenceBuildEnabled: false,
      multipleChoiceFormat: 'Losse woorden',
      description: 'Focus op individuele woorden leren'
    };
  } else {
    return {
      level: 'intermediate',
      translationFormat: 'Korte zinnen (3-5 woorden)',
      fillInFormat: 'Korte zinnen (4-6 woorden)',
      sentenceBuildEnabled: true,
      multipleChoiceFormat: 'Woorden en korte zinnen',
      description: 'Combineer geleerde woorden in zinnen'
    };
  }
}

/**
 * Post-process exercises to ensure distractors only contain lesson vocabulary
 * @param {Array} exercises - Generated exercises
 * @param {Array} vocabulary - Lesson vocabulary
 * @returns {Array} - Cleaned exercises
 */
function postProcessExercises(exercises, vocabulary) {
  // Create set of valid Frisian words from vocabulary
  const validFrysianWords = new Set(vocabulary.map(v => v.frysian.toLowerCase()));
  const validDutchWords = new Set(vocabulary.map(v => v.dutch.toLowerCase()));
  
  // Create mapping for easy lookup
  const frysianToDutch = new Map(vocabulary.map(v => [v.frysian.toLowerCase(), v.dutch]));
  const dutchToFrysian = new Map(vocabulary.map(v => [v.dutch.toLowerCase(), v.frysian]));

  return exercises.map(exercise => {
    const cleaned = { ...exercise };

    // Clean wordBank for fill-in-blank exercises
    if (exercise.type === 'fill-in-blank' && exercise.wordBank) {
      cleaned.wordBank = exercise.wordBank.filter(word => 
        validFrysianWords.has(word.toLowerCase()) || 
        word.toLowerCase() === exercise.correctAnswer.toLowerCase()
      );
      // Ensure we have at least 4 options, pad with valid words if needed
      if (cleaned.wordBank.length < 4) {
        const additionalWords = vocabulary
          .map(v => v.frysian)
          .filter(w => !cleaned.wordBank.map(x => x.toLowerCase()).includes(w.toLowerCase()));
        cleaned.wordBank = [...cleaned.wordBank, ...additionalWords].slice(0, 4);
      }
    }

    // Clean options for multiple-choice exercises
    if (exercise.type === 'multiple-choice' && exercise.options) {
      const isReverseDirection = exercise.direction === 'frysian-to-dutch';
      const validWords = isReverseDirection ? validDutchWords : validFrysianWords;
      
      cleaned.options = exercise.options.filter(word => 
        validWords.has(word.toLowerCase()) || 
        word.toLowerCase() === exercise.correctAnswer.toLowerCase()
      );
      // Ensure we have at least 4 options
      if (cleaned.options.length < 4) {
        const source = isReverseDirection 
          ? vocabulary.map(v => v.dutch)
          : vocabulary.map(v => v.frysian);
        const additionalWords = source
          .filter(w => !cleaned.options.map(x => x.toLowerCase()).includes(w.toLowerCase()));
        cleaned.options = [...cleaned.options, ...additionalWords].slice(0, 4);
      }
    }

    // Clean distractorWords for sentence-build exercises
    if (exercise.type === 'sentence-build' && exercise.distractorWords) {
      cleaned.distractorWords = exercise.distractorWords.filter(word => {
        const lowerWord = word.toLowerCase().replace(/[!?.,]/g, '');
        return validFrysianWords.has(lowerWord);
      });
      // Ensure we have at least 2 distractors
      if (cleaned.distractorWords.length < 2) {
        const usedWords = new Set(exercise.correctOrder.map(w => w.toLowerCase().replace(/[!?.,]/g, '')));
        const additionalWords = vocabulary
          .map(v => v.frysian)
          .filter(w => !usedWords.has(w.toLowerCase()));
        cleaned.distractorWords = [...cleaned.distractorWords, ...additionalWords].slice(0, 3);
      }
    }

    return cleaned;
  });
}

/**
 * Generate exercises for a lesson
 * CRITICAL: Exercises must only use vocabulary from this lesson
 */
async function generateExercises(vocabulary, skill, lessonNumber) {
  const skillInfo = SKILLS[skill];
  const difficulty = getDifficultyConfig(lessonNumber);
  
  // Create a clear list of what words are available
  const wordList = vocabulary.map(v => `- "${v.frysian}" = "${v.dutch}"`).join('\n');
  
  // Determine exercise distribution based on difficulty
  const exerciseDistribution = difficulty.sentenceBuildEnabled
    ? `1. VERTALING Nederlands→Fries (3 oefeningen)
2. VERTALING Fries→Nederlands (2 oefeningen) - NIEUW! Omgekeerde richting
3. INVULOEFENING (3 oefeningen)
4. MEERKEUZE Nederlands→Fries (2 oefeningen)
5. MEERKEUZE Fries→Nederlands (1 oefening) - NIEUW! Omgekeerde richting
6. ZIN-BOUW (1 oefening)`
    : `1. VERTALING Nederlands→Fries (4 oefeningen) - ALLEEN losse woorden
2. VERTALING Fries→Nederlands (3 oefeningen) - NIEUW! Omgekeerde richting, ALLEEN losse woorden
3. INVULOEFENING (3 oefeningen) - Zeer korte zinnen
4. MEERKEUZE Nederlands→Fries (2 oefeningen) - Losse woorden`;
  
  const prompt = `Je maakt oefeningen voor een Friese taal-leer app.

BESCHIKBARE WOORDENSCHAT (ALLEEN DEZE WOORDEN GEBRUIKEN):
${wordList}

MOEILIJKHEIDSGRAAD: ${difficulty.level.toUpperCase()}
- ${difficulty.description}
- Vertalingen: ${difficulty.translationFormat}
- Invuloefeningen: ${difficulty.fillInFormat}

KRITISCHE REGELS:
1. Gebruik ALLEEN de bovenstaande woorden in alle oefeningen
2. GEEN nieuwe Friese woorden introduceren
3. Alle instructies en hints in het NEDERLANDS
4. Invuloefeningen: de ZIN moet in het FRIES zijn met een ___ voor het ontbrekende woord
5. Zin-bouw: afleidingswoorden MOETEN uit de bovenstaande woordenlijst komen
6. BIDIRECTIONEEL: Maak zowel Nederlands→Fries als Fries→Nederlands oefeningen

OEFENINGEN TE GENEREREN (${EXERCISES_PER_LESSON} totaal):

${exerciseDistribution}

OEFENINGSTYPES MET VOORBEELDEN:

1. VERTALING Nederlands→Fries (direction: "dutch-to-frysian"):
   {
     "type": "translation",
     "id": "trans-1",
     "question": "hallo",  // Nederlands
     "correctAnswer": "Goeie",  // Fries
     "acceptedAnswers": ["Goeie"],
     "hint": "Informele begroeting",
     "explanation": "'Goeie' is de meest gebruikte begroeting",
     "direction": "dutch-to-frysian"
   }

2. VERTALING Fries→Nederlands (direction: "frysian-to-dutch") - NIEUW:
   {
     "type": "translation",
     "id": "trans-rev-1",
     "question": "Goeie",  // Fries
     "correctAnswer": "hallo",  // Nederlands
     "acceptedAnswers": ["hallo", "dag"],
     "hint": "Een begroeting",
     "explanation": "'Goeie' betekent hallo in het Nederlands",
     "direction": "frysian-to-dutch"
   }

3. INVULOEFENING (fill-in-blank):
   {
     "type": "fill-in-blank",
     "id": "fill-1",
     "sentence": "___! Hoe giet it?",  // FRIESE zin
     "blankIndex": 0,
     "correctAnswer": "Goeie",
     "wordBank": ["Goeie", "Goeiemoarn", "Goeiejûn", "Oant sjen"],  // ALLEEN uit woordenlijst
     "hint": "Een algemene begroeting",
     "explanation": "'Goeie' betekent hallo"
   }

4. MEERKEUZE Nederlands→Fries (direction: "dutch-to-frysian"):
   {
     "type": "multiple-choice",
     "id": "mc-1",
     "question": "Hoe zeg je 'goedemorgen' in het Fries?",
     "correctAnswer": "Goeiemoarn",
     "options": ["Goeie", "Goeiemoarn", "Goeiejûn", "Oant sjen"],
     "hint": "Het is een ochtendbegroeting",
     "explanation": "'Goeiemoarn' betekent goedemorgen",
     "direction": "dutch-to-frysian"
   }

5. MEERKEUZE Fries→Nederlands (direction: "frysian-to-dutch") - NIEUW:
   {
     "type": "multiple-choice",
     "id": "mc-rev-1",
     "question": "Wat betekent 'Goeiemoarn'?",
     "correctAnswer": "goedemorgen",
     "options": ["hallo", "goedemorgen", "goedenavond", "tot ziens"],  // NEDERLANDSE opties
     "hint": "Het is een ochtendbegroeting",
     "explanation": "'Goeiemoarn' betekent goedemorgen",
     "direction": "frysian-to-dutch"
   }

${difficulty.sentenceBuildEnabled ? `6. ZIN-BOUW (sentence-build):
   {
     "type": "sentence-build",
     "id": "build-1",
     "prompt": "Zeg 'Hallo! Tot ziens!' in het Fries",
     "correctOrder": ["Goeie!", "Oant", "sjen!"],
     "distractorWords": ["Goeiemoarn", "moarn"],  // ALLEEN uit woordenlijst
     "hint": "Begin met de begroeting, dan het afscheid"
   }` : '// GEEN zin-bouw oefeningen voor dit beginnende niveau'}

BELANGRIJK:
- Wissel de oefeningstypes af (niet alle vertalingen achter elkaar)
- Begin makkelijk, word geleidelijk moeilijker
- Elke oefening moet een uniek id hebben
- Hints en explanations ALTIJD in het Nederlands
- Zorg voor een mix van beide richtingen (Nederlands→Fries EN Fries→Nederlands)

RETOURNEER als JSON object met "exercises" array.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);
  
  // Handle various response formats
  let exercises = parsed.exercises || parsed;
  
  // If exercises is not an array, try to extract from object
  if (!Array.isArray(exercises)) {
    if (typeof exercises === 'object' && exercises !== null) {
      exercises = [exercises];
    } else {
      throw new Error('Ongeldige oefeningen response format');
    }
  }
  
  // Validate exercises
  validateExercises(exercises, vocabulary);
  
  // Post-process to clean up distractors and ensure only lesson vocabulary is used
  const cleanedExercises = postProcessExercises(exercises, vocabulary);
  console.log('🧹 Oefeningen opgeschoond: distractors gefilterd op leswoordenschat');
  
  return cleanedExercises;
}

/**
 * Generate a complete lesson
 */
async function generateLesson(skill, lessonNumber) {
  console.log(`\n🎯 Genereren les ${lessonNumber} voor vaardigheid: ${skill}`);
  
  const skillInfo = SKILLS[skill];
  if (!skillInfo) {
    throw new Error(`Onbekende vaardigheid: ${skill}. Beschikbaar: ${Object.keys(SKILLS).join(', ')}`);
  }

  // Generate vocabulary with retry
  console.log('📚 Woordenschat genereren...');
  const vocabulary = await withRetry(() => generateVocabulary(skill, lessonNumber));
  console.log(`✅ ${vocabulary.length} woordenschat items gegenereerd`);
  
  // Log generated vocabulary for review
  console.log('   Gegenereerde woorden:');
  vocabulary.forEach(v => console.log(`   - ${v.frysian} = ${v.dutch}`));

  // Generate exercises with retry
  console.log('✏️  Oefeningen genereren...');
  const exercises = await withRetry(() => generateExercises(vocabulary, skill, lessonNumber));
  console.log(`✅ ${exercises.length} oefeningen gegenereerd`);

  // Create intro cards with example translations
  const introCards = vocabulary.map((word, index) => ({
    id: `intro-${skill}-${lessonNumber}-${index}`,
    vocabulary: {
      id: word.id,
      frysian: word.frysian,
      dutch: word.dutch,
      partOfSpeech: word.partOfSpeech,
      exampleSentence: word.exampleSentence,
      exampleTranslation: word.exampleTranslation,
    },
    exampleSentence: word.exampleSentence,
    exampleTranslation: word.exampleTranslation,
  }));

  // Build lesson object
  const topic = skillInfo.topics[(lessonNumber - 1) % skillInfo.topics.length];
  const lessonDescription = skillInfo.lessonDescriptions?.[(lessonNumber - 1)] || `Leer over ${topic}`;
  
  const lesson = {
    id: `${skill}-${lessonNumber}`,
    skillId: skill,
    lessonNumber,
    title: `${skillInfo.title} - Les ${lessonNumber}`,
    description: lessonDescription,
    topic: topic,
    difficulty: skillInfo.difficulty,
    estimatedMinutes: Math.ceil((introCards.length * 0.5) + (exercises.length * 0.5)), // Estimate time
    introCards,
    exercises,
    targetVocabulary: vocabulary.map(v => v.id),
    reviewVocabulary: [], // Could be populated with words from previous lessons
  };

  return lesson;
}

/**
 * Save lesson to file
 */
async function saveLesson(lesson) {
  const lessonsDir = path.join(__dirname, '../data/lessons');
  
  // Ensure directory exists
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }

  const filePath = path.join(lessonsDir, `${lesson.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(lesson, null, 2));
  
  console.log(`💾 Les opgeslagen: ${filePath}`);
}

/**
 * Generate skill tree
 */
async function generateSkillTree() {
  const skillTree = {
    skills: Object.entries(SKILLS).map(([id, info], index) => ({
      id,
      title: info.title,
      description: info.description,
      longDescription: info.longDescription,
      icon: getSkillIcon(id),
      order: index,
      difficulty: info.difficulty,
      lessons: Array.from({ length: LESSONS_PER_SKILL }, (_, i) => ({
        id: `${id}-${i + 1}`,
        title: `Les ${i + 1}`,
        description: info.lessonDescriptions?.[i] || `Leer over ${info.topics[i] || info.topics[0]}`,
        topic: info.topics[i] || info.topics[0],
      })),
      prerequisites: index > 0 ? [Object.keys(SKILLS)[index - 1]] : [],
      color: getSkillColor(index),
    })),
    totalLessons: Object.keys(SKILLS).length * LESSONS_PER_SKILL,
  };

  const filePath = path.join(__dirname, '../data/skills.json');
  fs.writeFileSync(filePath, JSON.stringify(skillTree, null, 2));
  
  console.log(`🌳 Vaardigheidsboom opgeslagen: ${filePath}`);
}

/**
 * Get icon for skill
 */
function getSkillIcon(skillId) {
  const icons = {
    'basics-1': '👋',
    'basics-2': '🗣️',
    'numbers': '🔢',
    'family': '👨‍👩‍👧‍👦',
    'colors': '🎨',
    'food': '🍽️',
    'animals': '🐾',
  };
  return icons[skillId] || '📚';
}

/**
 * Get color for skill
 */
function getSkillColor(index) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
  return colors[index % colors.length];
}

/**
 * Generate all lessons for a skill
 */
async function generateAllLessonsForSkill(skill) {
  console.log(`\n🚀 Alle lessen genereren voor ${skill}...`);
  
  for (let i = 1; i <= LESSONS_PER_SKILL; i++) {
    try {
      const lesson = await generateLesson(skill, i);
      await saveLesson(lesson);
      
      // Small delay between lessons to avoid rate limiting
      if (i < LESSONS_PER_SKILL) {
        console.log('⏳ Even wachten voor volgende les...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Fout bij genereren les ${i}: ${error.message}`);
    }
  }
  
  console.log(`\n✨ Alle lessen voor ${skill} zijn klaar!`);
}

/**
 * Generate all lessons for all skills
 */
async function generateAllContent() {
  console.log('\n🚀 ALLE CONTENT GENEREREN...\n');
  
  // First generate skill tree
  await generateSkillTree();
  
  // Then generate all lessons for each skill
  for (const skillId of Object.keys(SKILLS)) {
    await generateAllLessonsForSkill(skillId);
    console.log('\n---\n');
  }
  
  console.log('\n🎉 ALLE CONTENT IS GEGENEREERD!\n');
}

/**
 * Check which lessons exist
 */
function getLessonFilePath(skillId, lessonNumber) {
  const lessonsDir = path.join(__dirname, '..', 'data', 'lessons');
  return path.join(lessonsDir, `${skillId}-${lessonNumber}.json`);
}

function lessonExists(skillId, lessonNumber) {
  const filePath = getLessonFilePath(skillId, lessonNumber);
  return fs.existsSync(filePath);
}

/**
 * Generate only missing lessons
 */
async function generateMissingLessons() {
  console.log('\n🔍 Controleren welke lessen ontbreken...\n');
  
  const missingLessons = [];
  
  // Check all skills and lessons
  for (const skillId of Object.keys(SKILLS)) {
    for (let lessonNum = 1; lessonNum <= LESSONS_PER_SKILL; lessonNum++) {
      if (!lessonExists(skillId, lessonNum)) {
        missingLessons.push({ skillId, lessonNum });
      }
    }
  }
  
  if (missingLessons.length === 0) {
    console.log('✅ Alle lessen bestaan al! Niets te genereren.\n');
    return;
  }
  
  console.log(`📋 ${missingLessons.length} ontbrekende lessen gevonden:\n`);
  missingLessons.forEach(({ skillId, lessonNum }) => {
    console.log(`   - ${skillId} les ${lessonNum}`);
  });
  console.log('');
  
  // Generate skill tree first (in case it's missing)
  const skillTreePath = path.join(__dirname, '..', 'data', 'skills.json');
  if (!fs.existsSync(skillTreePath)) {
    console.log('🌳 Vaardigheidsboom ontbreekt, eerst genereren...\n');
    await generateSkillTree();
  }
  
  // Generate each missing lesson
  let generated = 0;
  for (const { skillId, lessonNum } of missingLessons) {
    try {
      console.log(`\n[${generated + 1}/${missingLessons.length}] Genereren: ${skillId} les ${lessonNum}`);
      const lesson = await generateLesson(skillId, lessonNum);
      await saveLesson(lesson);
      generated++;
      
      // Small delay to avoid rate limiting
      if (generated < missingLessons.length) {
        console.log('⏳ Even wachten voor volgende les...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Fout bij genereren ${skillId} les ${lessonNum}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Klaar! ${generated} van ${missingLessons.length} lessen gegenereerd.\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Gebruik: node scripts/generate-content.js <skill-id> <les-nummer>');
    console.log('         node scripts/generate-content.js <skill-id> --all');
    console.log('         node scripts/generate-content.js --init');
    console.log('         node scripts/generate-content.js --generate-all');
    console.log('         node scripts/generate-content.js --missing');
    console.log('\nBeschikbare vaardigheden:', Object.keys(SKILLS).join(', '));
    process.exit(1);
  }

  if (args[0] === '--init') {
    console.log('🚀 Vaardigheidsboom initialiseren...');
    await generateSkillTree();
    console.log('✅ Vaardigheidsboom geïnitialiseerd!');
    return;
  }

  if (args[0] === '--generate-all') {
    await generateAllContent();
    return;
  }

  if (args[0] === '--missing') {
    await generateMissingLessons();
    return;
  }

  const skill = args[0];
  
  if (!SKILLS[skill]) {
    console.error(`❌ Onbekende vaardigheid: ${skill}`);
    console.log('Beschikbare vaardigheden:', Object.keys(SKILLS).join(', '));
    process.exit(1);
  }

  if (args[1] === '--all') {
    await generateAllLessonsForSkill(skill);
    return;
  }

  const lessonNumber = parseInt(args[1]);
  
  if (isNaN(lessonNumber) || lessonNumber < 1 || lessonNumber > LESSONS_PER_SKILL) {
    console.error(`❌ Ongeldig les nummer: ${args[1]}. Moet 1-${LESSONS_PER_SKILL} zijn.`);
    process.exit(1);
  }

  try {
    const lesson = await generateLesson(skill, lessonNumber);
    await saveLesson(lesson);
    console.log('\n✨ Les generatie compleet!');
  } catch (error) {
    console.error('❌ Fout bij genereren les:', error.message);
    process.exit(1);
  }
}

main();
