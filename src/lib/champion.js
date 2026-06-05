// Single source of truth for all Nunu & Willump content + asset paths.
// Asset filenames contain spaces and "&"; always render through asset() so
// spaces are percent-encoded (browsers choke on raw spaces in src/url()).

export const asset = (p) => encodeURI(p);

// Number of JPGs in public/hero_frames/ (see scripts/extract-frames.mjs).
export const HERO_FRAME_COUNT = 216;
export const heroFrameSrc = (i) =>
  asset(`/hero_frames/frame_${String(i).padStart(4, "0")}.jpg`);

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
  { name: "Nunu & Willump Default", tier: "base", img: "/skins/nunu & willump default.jpg" },
  { name: "Sasquatch Nunu & Willump", tier: "legacy", img: "/skins/sasquatch nunu & willump.jpg" },
  { name: "Workshop Nunu & Willump", tier: "legacy", img: "/skins/workshop nunu & willump.jpg" },
  { name: "Nunu & Willump Bot", tier: "legacy", img: "/skins/nunu & willump bot.jpg" },
  { name: "Demolisher Nunu & Willump", tier: "legacy", img: "/skins/demolisher nunu & willump.jpg" },
  { name: "Grungy Nunu & Willump", tier: "legacy", img: "/skins/grungy nunu & willump.jpg" },
  { name: "TPA Nunu & Willump", tier: "legacy", img: "/skins/TPA nunu & willump.jpg" },
  { name: "Zombie Nunu & Willump", tier: "legacy", img: "/skins/zombie nunu & willump.jpg" },
  { name: "Papercraft Nunu & Willump", tier: "epic", img: "/skins/papercraft nunu & willump.jpg" },
  { name: "Space Groove Nunu & Willump", tier: "epic", img: "/skins/space groove nunu & willump.jpg" },
  { name: "Nunu & Beelump", tier: "epic", img: "/skins/nunu & beelump.jpg" },
  { name: "Cosmic Paladins Nunu & Willump", tier: "epic", img: "/skins/cosmic paladins nunu & willump.jpg" },
  { name: "Fright Night Nunu & Willump", tier: "epic", img: "/skins/fright night nunu & willump.jpg" },
];

export const navLinks = [
  { label: "Story", target: "#story" },
  { label: "Abilities", target: "#abilities" },
  { label: "Skins", target: "#skins" },
  { label: "End", target: "#end" },
];
