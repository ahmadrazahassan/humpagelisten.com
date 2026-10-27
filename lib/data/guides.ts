import type { Faq, Guide } from "@/lib/types";

export const guides: Guide[] = [
  {
    slug: "audiobook-credits-explained",
    title: "Audiobook credits explained: how they work on each app",
    excerpt: "What a credit buys, when it expires, and what happens to your books when you cancel, app by app.",
    category: "Basics",
    readingMinutes: 6,
    image: "/images/guides/credits.png",
    publishedAt: "2026-10-20",
    sections: [
      {
        heading: "What a credit is",
        paragraphs: [
          "A credit is a token that buys one audiobook, whatever its list price. You get one or more each month on your billing date. Because long or brand new audiobooks often cost much more than a monthly fee, spending a credit on an expensive book is where the value is.",
        ],
      },
      {
        heading: "How the main apps compare",
        paragraphs: ["Here is how credits behave on the services I review, using each company's own pages as of October 2026."],
        list: [
          "Audiobooks.com: $14.95 a month for one credit, with 2 and 3 credit plans. Member Deals let one credit buy two books.",
          "Audible Premium: $14.95 a month for one credit. Credits roll over and expire twelve months after they are issued, and unused ones are lost if you cancel.",
          "Libro.fm: $14.99 a month for one credit, or $169.99 a year for twelve. Credits never expire.",
          "Everand uses unlocks instead of credits. Unlocked books stay only while you subscribe.",
        ],
      },
      {
        heading: "Three rules I follow",
        paragraphs: [],
        list: [
          "Spend credits on long or expensive books, and buy cheap ones with cash or on Chirp deals.",
          "Never let credits pile up on a service where they expire.",
          "Before cancelling, spend every credit you have.",
        ],
      },
    ],
    sources: [
      { title: "Audiobooks.com pricing", url: "https://www.audiobooks.com/pricing" },
      { title: "Audible plans", url: "https://www.audible.com/whatis" },
      { title: "Libro.fm membership", url: "https://libro.fm/membership" },
    ],
  },
  {
    slug: "try-audiobooks-free-without-forgetting-to-cancel",
    title: "How to try audiobooks for free without forgetting to cancel",
    excerpt: "Free trials are generous right now. Here is how to get the most from one and not pay for a month you did not want.",
    category: "Saving money",
    readingMinutes: 5,
    image: "/images/guides/free-trial.png",
    publishedAt: "2026-10-18",
    sections: [
      {
        heading: "Pick the trial that gives you the most",
        paragraphs: [
          "Audiobooks.com currently includes one premium audiobook plus two bonus VIP Rewards audiobooks in its 30 day trial. Audible offers 30 days on both its Standard and Premium plans. Everand gives 30 days with one free unlock. If you want to sample several books, the Audiobooks.com trial gives you the most to listen to.",
        ],
      },
      {
        heading: "Set the reminder the same minute you sign up",
        paragraphs: [
          "Every trial converts to a paid plan automatically. Put a reminder in your phone calendar for two days before the trial ends, with the cancel page link in the note. That way you decide calmly instead of noticing a charge.",
        ],
      },
      {
        heading: "Use the books before you decide",
        paragraphs: [
          "Download your trial books first, then decide whether to stay. On credit services, books bought during the trial normally stay in your library after cancelling, but check the terms on the day you sign up because they can change.",
        ],
      },
    ],
    sources: [
      { title: "Audiobooks.com pricing", url: "https://www.audiobooks.com/pricing" },
      { title: "Audible plans", url: "https://www.audible.com/whatis" },
      { title: "Everand", url: "https://www.everand.com/" },
    ],
  },
  {
    slug: "audiobooks-com-vs-audible-yearly-cost",
    title: "Audiobooks.com vs Audible: which costs less over a year",
    excerpt: "Both charge $14.95 for a monthly credit. The difference is in the extras, the trial, and what you keep.",
    category: "Comparisons",
    readingMinutes: 5,
    image: "/images/guides/compare.png",
    publishedAt: "2026-10-15",
    sections: [
      {
        heading: "The headline numbers",
        paragraphs: [
          "Audiobooks.com and Audible Premium both cost $14.95 a month for one credit, or $179.40 a year before tax. Audible also sells Premium annually at $149.50 for the first year.",
        ],
      },
      {
        heading: "Where Audiobooks.com comes out ahead",
        paragraphs: [
          "The trial includes three books rather than one, and Member Deals regularly let one credit buy two audiobooks. If you use a Member Deal every other month, you end the year with eighteen books for the same $179.40.",
        ],
      },
      {
        heading: "Where Audible comes out ahead",
        paragraphs: [
          "Audible Premium includes the Plus Catalog, a large library of included titles and Originals. If you listen to a lot beyond your monthly credit and enjoy what is in that catalog, it adds real value. Audible's catalog is also the largest overall.",
        ],
      },
      {
        heading: "My verdict",
        paragraphs: [
          "For one carefully chosen book a month plus a few deals, Audiobooks.com is the better value. For heavy listeners happy to explore an included catalog, Audible Premium wins.",
        ],
      },
    ],
    sources: [
      { title: "Audiobooks.com pricing", url: "https://www.audiobooks.com/pricing" },
      { title: "Audible plans", url: "https://www.audible.com/whatis" },
    ],
  },
  {
    slug: "free-audiobooks-with-libby",
    title: "Free audiobooks through your library with Libby",
    excerpt: "A library card and one free app. How to set it up, beat the waitlists, and when it is worth paying instead.",
    category: "Saving money",
    readingMinutes: 5,
    image: "/images/sections/how-we-review.png",
    publishedAt: "2026-10-12",
    sections: [
      {
        heading: "Setting up",
        paragraphs: [
          "Install Libby, find your library, and enter your card number. Many libraries let you sign up for a card online. Some cities also share collections with neighbouring libraries, which you can add as a second card.",
        ],
      },
      {
        heading: "Beating the waitlist",
        paragraphs: [],
        list: [
          "Place holds early, even months ahead, on books you know you will want.",
          "Add more than one library card if you are eligible.",
          "Use the tag feature to keep a list of books that are available now.",
        ],
      },
      {
        heading: "When paying makes sense",
        paragraphs: [
          "If you want a new release the week it comes out, or you listen faster than holds arrive, add a credit plan for the books you cannot wait for and keep Libby for everything else.",
        ],
      },
    ],
    sources: [{ title: "Libby", url: "https://libbyapp.com/" }],
  },
  {
    slug: "how-to-pick-a-narrator",
    title: "How to pick a narrator you will not get tired of",
    excerpt: "The narrator matters as much as the book. Five things I check in the sample before I spend a credit.",
    category: "Listening",
    readingMinutes: 4,
    image: "/images/guides/narrator.png",
    publishedAt: "2026-10-08",
    sections: [
      {
        heading: "Always play the sample",
        paragraphs: [
          "Every store offers a short sample. Listen to at least two minutes, ideally a passage with dialogue, before you commit twenty hours of your life to one voice.",
        ],
      },
      {
        heading: "What I listen for",
        paragraphs: [],
        list: [
          "Pace: can you follow it at your usual speed?",
          "Character voices: distinct without being cartoonish.",
          "Accents: consistent and respectful.",
          "Breathing and mouth sounds: some listeners notice these more on headphones.",
          "Fit: does the voice match the book's mood?",
        ],
      },
      {
        heading: "Authors reading their own books",
        paragraphs: [
          "For memoir, an author narrator often adds something no actor can, as Michelle Obama does in Becoming. For fiction, a trained narrator is usually the safer bet.",
        ],
      },
    ],
    sources: [],
  },
  {
    slug: "audiobook-apps-for-kids-and-families",
    title: "Audiobook apps for kids and families",
    excerpt: "Sharing a plan, setting up a child's library, and the free options that work best for young listeners.",
    category: "Families",
    readingMinutes: 5,
    image: "/images/guides/kids.png",
    publishedAt: "2026-10-04",
    sections: [
      {
        heading: "Start free",
        paragraphs: [
          "Libby is the best first stop. Most libraries have deep children's audio collections, and picture book read alongs are often available with short waitlists.",
        ],
      },
      {
        heading: "Sharing a paid plan",
        paragraphs: [
          "On Spotify, only the plan manager on Family and Duo plans gets audiobook hours, so children on the plan cannot use them. Storytel sells family plans in many of its countries. On credit services, the simplest approach is one account on a shared family device.",
        ],
      },
      {
        heading: "Good first listens",
        paragraphs: [
          "Andy Serkis reading The Hobbit is a wonderful family car journey listen for older children. For younger ones, look for short books with full cast narration and sound effects.",
        ],
      },
    ],
    sources: [
      { title: "Spotify audiobooks in Premium", url: "https://support.spotify.com/us/article/audiobooks-premium-plans/" },
      { title: "Libby", url: "https://libbyapp.com/" },
    ],
  },
];

export const homeFaqs: Faq[] = [
  { q: "Which audiobook app has the best free trial?", a: "Right now Audiobooks.com gives the most in its 30 day trial: one premium audiobook plus two bonus VIP Rewards audiobooks." },
  { q: "Do I keep my audiobooks if I cancel?", a: "On credit services such as Audiobooks.com, Audible Premium and Libro.fm, books you buy stay yours. On streaming style services such as Spotify, Everand, Kobo Plus and Storytel, access ends when you cancel." },
  { q: "Which app has the biggest catalog?", a: "Audible has the largest English language catalog. Most bestsellers are also on Audiobooks.com and Libro.fm." },
  { q: "Is Spotify's audiobook time enough for one book a month?", a: "Usually. Premium Individual in the US includes 15 hours a month, which covers an average length novel. Time is counted at normal speed, so listening faster does not save hours." },
  { q: "Can I listen offline?", a: "Yes, on every app I review. Download the book in the app before you lose signal." },
  { q: "What is the cheapest way to listen to audiobooks?", a: "Libby, which is free with a library card. For buying books, Chirp's limited time deals are often the cheapest." },
  { q: "How do you make money?", a: "Some links on HumPage Listen are affiliate links, so we may earn a commission if you sign up. It never changes scores or verdicts, and I explain the details on the disclosure page." },
  { q: "How often are prices checked?", a: "Every price on the site is checked against the official page by hand, and each review shows the date it was last checked." },
];
