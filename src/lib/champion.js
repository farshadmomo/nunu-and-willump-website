// Single source of truth for all Nunu & Willump content + asset paths.
// Asset filenames contain spaces and "&"; always render through asset() so
// spaces are percent-encoded (browsers choke on raw spaces in src/url()).

export const asset = (p) => encodeURI(p);

// Number of JPGs in public/hero_frames/ (see scripts/extract-frames.mjs).
export const HERO_FRAME_COUNT = 216;
export const heroFrameSrc = (i) =>
  asset(`/hero_frames/frame_${String(i).padStart(4, "0")}.jpg`);

// Frozen-maw bite animation frames (see scripts/extract-bite.mjs). Scrubbed by
// BiteTransition: maw open -> snap -> dive through fangs -> frost white-out.
export const BITE_FRAME_COUNT = 92;
export const biteFrameSrc = (i) =>
  asset(`/bite_frames/frame_${String(i).padStart(4, "0")}.jpg`);

export const champion = {
  name: "Nunu & Willump",
  title: "the Boy and His Yeti",
  role: "Tank / Mage",
  region: "Freljord",
  difficulty: 2, // out of 3
  difficultyMax: 3,
  tagline: "A boy, a yeti, and the biggest snowball ever.",
  lore: "Once upon a time, there was a boy who wanted to prove he was a hero by slaying a fearsome monster, only to discover that the beast, a lonely and magical yeti, merely needed a friend. Bound together by ancient power and a shared love of snowballs, Nunu and Willump now ramble wildly across the Freljord, breathing life into imagined adventures. They hope that somewhere out there, they will find Nunu's mother. If they can save her, maybe they will be heroes after all.",
  endingQuote: "Maybe they will be heroes after all.",
};

// Long-form biography. Rendered in the immersive reader (StoryReader), opened
// from the Tales section. Text is canon (Riot lore) kept verbatim, minus the
// short opening line that already lives in champion.lore above the section.
export const biography = {
  id: "origin",
  kicker: "BIOGRAPHY",
  title: "Origin",
  cover: "/skins/nunu & willump default.jpg",
  excerpt:
    "One of the Notai, a nomadic tribe that long traveled the Freljord, Nunu learned from his mother, Layka, that behind every thing is a story. The deeper telling of how a lonely boy and the last magical yeti found each other.",
  pullQuote: {
    text: "Pull the fur outta your earholes, Willump! This is gonna be the bestest story ever!",
    by: "Nunu & Willump",
  },
  paragraphs: [
    "One of the Notai, a nomadic tribe that long traveled the Freljord, Nunu learned from his mother, Layka, that behind every thing is a story. Together, they gathered tales that Layka turned into songs. For Nunu, nothing was better than journeying from village to village, hearing his mother sing of ancient heroes. With music and dance, the Notai brought one last celebration to everyone they met, as each winter’s chill set in.",
    "Riding the wave of frost spilling from Anivia’s wings, his heart beating the rhythm of a jubilant song, Nunu’s world was full of possibility.",
    "On his fifth nameday, Layka gave Nunu a special gift: a flute, so he could learn to play her melodies himself. In the safety of their cart, the two bundled together and followed the knotted string that served as Layka’s heart-song, recording everywhere they’d been together, as the years came and went.",
    "When the caravan was attacked by raiders, Nunu was separated from his mother. Dragged to safety by a band of Frostguard, the surviving Notai children were taken to a village near their towering citadel. Nunu was left to wonder what happened to Layka, waiting to hear her songs on the wind.",
    "Snow fell. Weeks passed.",
    "Nunu missed his mother desperately, but the Frostguard assured him no child could safely search for her. They weren’t even impressed when he showed them the flute he now called Svellsongur—the name of a mighty blade existing only in his imagination.",
    "Nunu spent more and more time alone, escaping into his mother’s songs—the legends and heroes of old. He yearned to be one of these heroes, a warrior like the Frostguard, who could have saved his mother. He even met their leader, Lissandra, who asked countless questions about his mother’s stories, always seeking information about one particular song.",
    "No one believed Nunu could be a hero, not even the other Notai children, who teased him for his flute when they now had daggers. But Nunu knew the songs in his heart, and one night, he realized how he could prove himself and earn the Frostguard’s help to find his mother.",
    "From Lissandra, he’d learned of a fierce monster that killed all who sought its power, thwarting the Frostguard who were sent each year, never to return. There was a song that Nunu’s mother sang… could it be the one Lissandra would always ask about? Suddenly, Nunu understood. Lissandra wanted to know about the yeti.",
    "Nunu could name the beast. It would answer his challenge, and feel the wrath of Svellsongur!",
    "Using his flute to tame a herd of elkyr, Nunu snuck out into the snow. One lonely child traveled to face a monster, finally living out a legend that not even he could imagine.",
    "An ancient and noble race that once ruled over the mountains of the Freljord, the yeti civilization was destroyed in a cataclysm of ice. Forced to watch his brethren descending into savagery after being stripped of their magic, one yeti swore to protect what remained of their power—a gem that swirled with the frozen dreams of any mortal mind nearby.",
    "As the last magical yeti, the guardian was also shaped by perception. Though he had been chosen to safeguard the magic until it would be needed again, he could find no worthy vessel. The men who intruded upon his ruined home had only malice in their hearts… and so a monster greeted them with fang and claw.",
    "But the guardian knew he was forgetting something. His name… and the names of those he had loved...",
    "Once, there had been song.",
    "That all changed when a young boy stumbled into the ruins. After centuries of unbroken vigil, the monster was prepared to end the boy’s life, snarling as he sensed the human approach.",
    "Unexpectedly, the gem brought forth images of heroes slaying dragons and beheading ancient serpents from the boy’s mind. The child roared, drawing his flute like a fearsome sword. But the blow never came, for even as the boy saw visions of heroes swirling around him, he realized the deeper truths of the songs his mother sang…",
    "When he looked at the guardian, he didn’t see a monster. He saw someone who needed a friend.",
    "Still enraged, the yeti did not expect the first snowball to the face. Or the second. Snowball fight! In anger, then shock, then joy, the guardian joined in, shaped not by fear, but by a child’s imagination. He was growing furrier and friendlier. His growl was becoming a laugh.",
    "Until the beast accidentally broke the boy’s flute.",
    "As the child began to cry, the guardian felt a kindred grief take shape around the gem. For centuries, he had looked into it and seen the end of his people—the threat they had buried, betrayal by the blind one—and now, instead, he saw a caravan burning. He heard a voice on the wind. He sensed something else within the boy, something he had never felt from a human, not even the three sisters who had come to him long ago. It was love, fighting back despair.",
    "In that moment, the guardian knew the Freljord’s only hope lay in the power already within this child. The magic he’d been guarding was a tool; what truly mattered was the heart that would shape it. With a gesture, the magic passed from the gem into the boy, giving him the ability to make his imagination real. To repair his flute, freezing it in dreams that hardened into True Ice.",
    "To imagine a best friend named “Willump.”",
    "Escaping into the Freljordian plains, Nunu’s heart and Willump’s strength now enable the pair to do what they never could alone: to have an adventure! Following the songs of Nunu’s mother, they snowball wildly from one place to the next, holding onto the hope that she is still out there, somewhere.",
    "But Willump knows that with magic and dreams come responsibility. One day the games will end, as the dark ice at the heart of the Freljord thaws, and thaws…",
  ],
};

// Two short stories. Full text fetched on demand from the .txt files in
// public/stories/ (StoryReader strips the leading title lines). Cover art is
// keyed to the file names the user provided.
export const stories = [
  {
    id: "frozen-hearts",
    kicker: "TALE ONE",
    title: "Frozen Hearts",
    blurb:
      "Before the snowball, before the yeti, there was a mother, a flute, and a caravan full of songs. Nunu and Layka name the Freljord one knotted note at a time.",
    cover: "/stories/story 1 top.webp",
    coverEnd: "/stories/story 1 bottom.webp",
    file: "/stories/story1.txt",
  },
  {
    id: "stone-cold",
    kicker: "TALE TWO",
    title: "Stone Cold",
    blurb:
      "A song leads Nunu to a village turned to stone. No prayer lifts the curse, so the boy answers the only way he knows how: with the biggest snowball ever.",
    cover: "/stories/story two.webp",
    file: "/stories/story2.txt",
  },
];

// Abilities in scroll order. side = which edge the loop frame reveals on.
export const abilities = [
  {
    key: "P",
    name: "Call of the Freljord",
    blurb:
      "Willump's roar empowers Nunu and nearby allies, granting bonus attack speed and movement, with a partner-fueled bite that hits harder.",
    video: "/ability_videos/nunu passive.mp4",
    cover: "/ability_cover_images/NunuPassive cover.png",
    side: "left",
  },
  {
    key: "Q",
    name: "Consume",
    blurb:
      "Willump takes a giant bite, dealing heavy damage and healing the pair. Snack on monsters to grow even stronger.",
    video: "/ability_videos/nunu Q.mp4",
    cover: "/ability_cover_images/NunuQ cover.png",
    side: "right",
  },
  {
    key: "W",
    name: "Biggest Snowball Ever!",
    blurb:
      "Start rolling a snowball that grows and accelerates as it travels, then crashes into enemies, knocking them up.",
    video: "/ability_videos/nunu W.mp4",
    cover: "/ability_cover_images/NunuW cover.png",
    side: "left",
  },
  {
    key: "E",
    name: "Snowball Barrage",
    blurb:
      "Hurl a flurry of snowballs at range, slowing foes and rooting them once enough land.",
    video: "/ability_videos/nunu E.mp4",
    cover: "/ability_cover_images/NunuE cover.png",
    side: "right",
  },
  {
    key: "R",
    name: "Absolute Zero",
    blurb:
      "Channel a blizzard that slows everyone caught inside, then erupts in a massive burst of frost damage.",
    video: "/ability_videos/nunuR.mp4",
    cover: "/ability_cover_images/NunuR cover.png",
    side: "center",
  },
];

// Skins from public/skins/. Names mirror the file names, properly cased.
// tier is flavor only.
export const skins = [
  {
    name: "Nunu & Willump Default",
    tier: "base",
    img: "/skins/nunu & willump default.jpg",
    blurb: "The boy and his yeti as the Freljord first knew them.",
  },
  {
    name: "Sasquatch Nunu & Willump",
    tier: "legacy",
    img: "/skins/sasquatch nunu & willump.jpg",
    blurb: "Wild, shaggy and snow-crusted, straight out of a mountain legend.",
  },
  {
    name: "Workshop Nunu & Willump",
    tier: "legacy",
    img: "/skins/workshop nunu & willump.jpg",
    blurb: "Clockwork and brass, a tinkerer's take on the wandering duo.",
  },
  {
    name: "Nunu & Willump Bot",
    tier: "legacy",
    img: "/skins/nunu & willump bot.jpg",
    blurb: "All gears and rivets, Willump rebuilt as a friendly machine.",
  },
  {
    name: "Demolisher Nunu & Willump",
    tier: "legacy",
    img: "/skins/demolisher nunu & willump.jpg",
    blurb: "Hard hats on, here to knock the whole thing down.",
  },
  {
    name: "Grungy Nunu & Willump",
    tier: "legacy",
    img: "/skins/grungy nunu & willump.jpg",
    blurb: "Punk patches and attitude, snowballs with a bad streak.",
  },
  {
    name: "TPA Nunu & Willump",
    tier: "legacy",
    img: "/skins/TPA nunu & willump.jpg",
    blurb: "World champion colors, worn proudly onto the Rift.",
  },
  {
    name: "Zombie Nunu & Willump",
    tier: "legacy",
    img: "/skins/zombie nunu & willump.jpg",
    blurb: "Stitched and undead, but still up for a snowball fight.",
  },
  {
    name: "Papercraft Nunu & Willump",
    tier: "epic",
    img: "/skins/papercraft nunu & willump.jpg",
    blurb: "Folded entirely from paper, a craft-table adventure come to life.",
  },
  {
    name: "Space Groove Nunu & Willump",
    tier: "epic",
    img: "/skins/space groove nunu & willump.jpg",
    blurb: "Cosmic disco vibes, dancing across the stars.",
  },
  {
    name: "Nunu & Beelump",
    tier: "epic",
    img: "/skins/nunu & beelump.jpg",
    blurb: "Buzzing and striped, Willump reimagined as a giant bee.",
  },
  {
    name: "Cosmic Paladins Nunu & Willump",
    tier: "epic",
    img: "/skins/cosmic paladins nunu & willump.jpg",
    blurb: "Celestial armor and starlight, guardians of the cosmos.",
  },
  {
    name: "Fright Night Nunu & Willump",
    tier: "epic",
    img: "/skins/fright night nunu & willump.jpg",
    blurb: "A spooky-season costume with a monstrous twist.",
  },
];

export const navLinks = [
  { label: "Story", target: "#story" },
  { label: "Tales", target: "#tales" },
  { label: "Abilities", target: "#abilities" },
  { label: "Skins", target: "#skins" },
  { label: "End", target: "#end" },
];
