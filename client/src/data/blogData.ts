export interface BlogSection {
  type:
    | "heading"
    | "subheading"
    | "paragraph"
    | "quote"
    | "bullet-list"
    | "callout";
  text?: string;
  items?: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  /** Responsive srcSet for <img srcSet> — populated by Strapi service */
  featuredImageSrcSet?: string;
  /** Map of Strapi breakpoint name → url (e.g. small, medium, large) */
  featuredImageFormats?: Record<string, string>;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  content: BlogSection[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: `how-student-innovators-are-changing-india`,
    title: `How Student Innovators Are Quietly Changing India — One Project at a Time`,
    excerpt: `Across IITs, NITs, and small-town colleges, a new generation of student innovators is building solutions that matter. Here's what's fueling India's grassroots innovation movement.`,
    featuredImage: `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80`,
    author: `Arjun Mehta`,
    authorRole: `Co-Founder, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80`,
    date: `February 14, 2026`,
    readTime: `7 min read`,
    category: `Innovation`,
    tags: [`Student Innovation`, `India`, `Crowdfunding`, `Research`],
    content: [
      {
        type: `paragraph`,
        text: `Walk into any engineering college in India and you'll find them — students bent over circuit boards at midnight, scribbling equations in cafeteria margins, debating solutions to problems most people haven't even noticed yet. India has over 40 million college students. Somewhere in that crowd is the next big breakthrough. But talent without opportunity fades quickly.`,
      },
      {
        type: `heading`,
        text: `The Silent Innovation Crisis`,
      },
      {
        type: `paragraph`,
        text: `The numbers tell a sobering story. Fewer than 0.1% of student innovators across India receive any meaningful funding. Traditional funding pathways — banks, venture capital, government grants — are built for established entities, not for a 19-year-old with a brilliant idea and an empty wallet. The result is a massive squandering of human potential.`,
      },
      {
        type: `paragraph`,
        text: `We've met students in Tier-3 cities who built working prototypes with Rs 5,000 borrowed from parents. We've spoken to researchers who shelved impactful projects because they couldn't afford basic lab materials. The bottleneck isn't intelligence or drive. It's access.`,
      },
      {
        type: `quote`,
        text: `"I had the algorithm. I had the dataset. I just didn't have the Rs 25,000 for a GPU rental. For six months, I watched my project sit idle." — Priya, Computer Science student, Nagpur`,
      },
      {
        type: `subheading`,
        text: `What India's Student Innovators Are Building`,
      },
      {
        type: `paragraph`,
        text: `The diversity of ideas is staggering. From low-cost prosthetics designed for rural India to AI-powered crop disease detection tools, the scope of student innovation goes well beyond the stereotype of app development. We're seeing students tackle healthcare, agriculture, education, clean energy, and infrastructure challenges — problems that directly affect hundreds of millions of lives.`,
      },
      {
        type: `bullet-list`,
        items: [
          `Affordable soil sensors for precision farming in Vidarbha`,
          `Sign language translation apps for the hearing impaired`,
          `Low-cost water purification systems for flood-affected districts`,
          `AI diagnostic tools for early tuberculosis detection in rural clinics`,
          `Solar-powered e-learning kits for off-grid village schools`,
        ],
      },
      {
        type: `subheading`,
        text: `Why Crowdfunding Is the Natural Solution`,
      },
      {
        type: `paragraph`,
        text: `Crowdfunding bypasses traditional gatekeepers. It allows the public — alumni, corporates, parents, impact investors — to directly back the ideas they believe in. More importantly, it validates demand. A student who raises Rs 1 lakh for their project hasn't just funded it — they've proven that real people care about the problem they're solving.`,
      },
      {
        type: `paragraph`,
        text: `At DreamXec, we believe the infrastructure for funding student innovation is just as important as the innovation itself. We're building the platform, the community, and the trust that enables this ecosystem to flourish.`,
      },
      {
        type: `callout`,
        text: `DreamXec has helped over 200 student projects get discovered by donors and mentors across India. The journey from idea to impact starts with visibility.`,
      },
      {
        type: `heading`,
        text: `The Road Ahead`,
      },
      {
        type: `paragraph`,
        text: `India is at an inflection point. The government's push for innovation through initiatives like Startup India and the National Innovation Ecosystem has created policy momentum. But policy alone doesn't build prototypes. Students need direct funding, mentorship, and a platform that believes in them early.`,
      },
      {
        type: `paragraph`,
        text: `The student innovators quietly changing India don't ask for much. They ask for a chance. DreamXec exists to give them that chance — one campaign, one mentor connection, one funding milestone at a time.`,
      },
    ],
  },
  {
    id: 2,
    slug: `the-complete-guide-to-launching-your-first-crowdfunding-campaign`,
    title: `The Complete Guide to Launching Your First Crowdfunding Campaign as a Student`,
    excerpt: `Planning to crowdfund your project? This step-by-step guide covers everything — from crafting your pitch to hitting your funding goal — built from hard lessons learned on the ground.`,
    featuredImage: `https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80`,
    author: `Sneha Iyer`,
    authorRole: `Head of Student Success, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80`,
    date: `February 8, 2026`,
    readTime: `10 min read`,
    category: `Guides`,
    tags: [`Crowdfunding`, `Student Projects`, `Fundraising`, `Tips`],
    content: [
      {
        type: `paragraph`,
        text: `Your project is ready. Your team is motivated. Now comes the part that most students find terrifying: asking strangers on the internet to believe in your idea enough to fund it. But here's the truth — crowdfunding isn't a lottery. It's a skill. And skills can be learned.`,
      },
      {
        type: `heading`,
        text: `Before You Launch: Get Your Foundation Right`,
      },
      {
        type: `subheading`,
        text: `1. Validate Your Idea First`,
      },
      {
        type: `paragraph`,
        text: `Before you write a single word of your campaign, talk to at least 20 people who represent your target audience. Not your friends. Not your family. Real people who would actually benefit from your project. Their feedback will sharpen your story and give you real data to quote in your campaign.`,
      },
      {
        type: `subheading`,
        text: `2. Build Your Budget Bottom-Up`,
      },
      {
        type: `paragraph`,
        text: `Nothing destroys a campaign's credibility faster than a vague or inflated budget. Document every rupee: equipment, materials, lab fees, software licenses, travel, contingency. A transparent, itemized budget builds donor trust and helps you defend your funding goal.`,
      },
      {
        type: `quote`,
        text: `"The campaigns that succeed are the ones where donors feel they'd be crazy NOT to contribute. That feeling comes from a compelling story backed by concrete numbers." — DreamXec Campaign Review Team`,
      },
      {
        type: `heading`,
        text: `Writing a Campaign That Converts`,
      },
      {
        type: `paragraph`,
        text: `Your campaign page has about 8 seconds to hook a visitor. The opening paragraph needs to do three things: establish the problem, introduce you as the person solving it, and hint at why your solution is different. Don't lead with your technical approach. Lead with the human impact.`,
      },
      {
        type: `bullet-list`,
        items: [
          `Start with the problem, not the solution`,
          `Use specific numbers and real statistics to establish urgency`,
          `Include a high-quality featured image that tells your story visually`,
          `Break down your milestones so donors see exactly how their money is used`,
          `Add a short 90-second video — campaigns with video raise 3x more`,
        ],
      },
      {
        type: `subheading`,
        text: `Structuring Your Campaign for Momentum`,
      },
      {
        type: `paragraph`,
        text: `Campaigns that hit 30% of their goal in the first 48 hours typically reach 100%. This means your launch plan is as important as your campaign page. Before you go live, build a list of 50 people who have pre-committed to donating on Day 1. These early backers create the social proof that draws in strangers.`,
      },
      {
        type: `heading`,
        text: `Post-Launch: Keeping Momentum Alive`,
      },
      {
        type: `paragraph`,
        text: `Most campaigns experience a "dead zone" between Day 3 and Day 20. This is where most teams give up. The antidote is consistent, high-value content. Share progress updates. Introduce your team. Show behind-the-scenes work. Post a short video of your prototype in action. Give backers reasons to share your campaign with their networks.`,
      },
      {
        type: `callout`,
        text: `Pro tip: Send a personal thank-you message to every backer within 24 hours of their donation. The conversion rate for one-time backers becoming repeat backers increases by 40% with a simple, genuine thank-you.`,
      },
      {
        type: `paragraph`,
        text: `Crowdfunding is hard work. But for those willing to do the groundwork — validating, storytelling, networking, and following up — it is one of the most democratizing funding mechanisms ever created. Your next milestone is one campaign away.`,
      },
    ],
  },
  {
    id: 3,
    slug: `why-mentorship-matters-more-than-money-for-student-projects`,
    title: `Why Mentorship Matters More Than Money for Student Innovation Projects`,
    excerpt: `Funding is important, but the projects that have a lasting impact are the ones guided by experienced mentors. We explore the unseen value of mentorship in the student innovation journey.`,
    featuredImage: `https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80`,
    author: `Dr. Kavita Rao`,
    authorRole: `Mentor Program Lead, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80`,
    date: `January 29, 2026`,
    readTime: `8 min read`,
    category: `Mentorship`,
    tags: [`Mentorship`, `Student Growth`, `Innovation`, `Career`],
    content: [
      {
        type: `paragraph`,
        text: `Ask any founder what made the biggest difference in their early years, and the answer is almost never "the money." It's almost always "the person who believed in me and knew more than I did." Mentorship is the highest-leverage input a student innovator can receive — and it's the most undervalued.`,
      },
      {
        type: `heading`,
        text: `The Compounding Value of Good Guidance`,
      },
      {
        type: `paragraph`,
        text: `A great mentor compresses the learning curve. What might take a student three years to figure out on their own — the right market positioning, the technical approach that won't become a dead end, the network connection that opens a critical door — a good mentor can shortcut in a single conversation. This isn't just motivational rhetoric. It's the mathematical reality of experience.`,
      },
      {
        type: `quote`,
        text: `"My mentor saved me 18 months of wrong turns in the first three hours of our engagement. He had made exactly the mistakes I was about to make. That conversation was worth more than the Rs 2 lakh in funding I received." — Rahul, Biotech Innovator`,
      },
      {
        type: `subheading`,
        text: `What Good Mentorship Actually Looks Like`,
      },
      {
        type: `paragraph`,
        text: `Mentorship isn't advice-giving. Advice is easy and often unhelpful. Real mentorship is context-specific, challenge-based, and relationship-driven. The best mentors ask hard questions instead of giving easy answers. They hold students accountable to the commitments they make. They open doors when the time is right — and only when the time is right.`,
      },
      {
        type: `bullet-list`,
        items: [
          `Helping students identify the real problem behind their stated problem`,
          `Connecting students with industry experts and potential partners`,
          `Providing honest feedback on technical and business viability`,
          `Sharing failure stories — mentors who share their mistakes are twice as valuable`,
          `Helping students navigate university bureaucracy and IPR processes`,
        ],
      },
      {
        type: `heading`,
        text: `The DreamXec Mentorship Model`,
      },
      {
        type: `paragraph`,
        text: `At DreamXec, we've built our mentor-matching system around specificity. Generic mentors don't move the needle. We match students with mentors who have direct domain experience — a biotech founder mentoring healthcare projects, an ex-ISRO engineer mentoring aerospace students, a rural development professional mentoring agri-tech projects.`,
      },
      {
        type: `paragraph`,
        text: `Our data shows that projects with active mentors complete their campaigns with 68% higher success rates and raise 2.3x more on average than projects without mentor support. The correlation isn't coincidental — mentored projects are more credible, better prepared, and more clearly communicated to donors.`,
      },
      {
        type: `callout`,
        text: `DreamXec's mentor network includes 300+ professionals across 40 industries. If you're a working professional who wants to give back, become a DreamXec mentor and help shape the next generation of Indian innovators.`,
      },
      {
        type: `subheading`,
        text: `For Students: How to Get the Most from a Mentor`,
      },
      {
        type: `bullet-list`,
        items: [
          `Come to every session with specific questions, not vague asks`,
          `Take notes and share them after the session — it shows you're serious`,
          `Act on feedback between sessions — mentors invest more in students who implement`,
          `Be honest about failures and blockers — mentors can't help with problems they don't know about`,
          `Express gratitude concretely — share a milestone update when you succeed`,
        ],
      },
      {
        type: `paragraph`,
        text: `The students who get the most from mentorship are the ones who treat it as a professional relationship, not a casual service. When you show up prepared, implement feedback, and communicate progress, great mentors will go far beyond the formal engagement to support you.`,
      },
    ],
  },
  {
    id: 4,
    slug: `india-student-innovation-ecosystem-2026`,
    title: `State of India's Student Innovation Ecosystem in 2026: What's Changed and What Hasn't`,
    excerpt: `From government policy wins to persistent funding gaps, here is an honest assessment of where India's student innovation ecosystem stands in 2026 — and what needs to change next.`,
    featuredImage: `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80`,
    author: `Vikram Nair`,
    authorRole: `Head of Research, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80`,
    date: `January 18, 2026`,
    readTime: `12 min read`,
    category: `Insights`,
    tags: [`Ecosystem`, `India 2026`, `Policy`, `Student Innovation`],
    content: [
      {
        type: `paragraph`,
        text: `The past five years have brought significant structural changes to how India supports — or fails to support — its student innovators. Some of these changes are encouraging. Others reveal how much ground remains to be covered. This annual review examines both, with data from DreamXec's engagement across 400+ colleges and 18 states.`,
      },
      {
        type: `heading`,
        text: `What Has Improved`,
      },
      {
        type: `subheading`,
        text: `Policy-Level Recognition`,
      },
      {
        type: `paragraph`,
        text: `The National Education Policy 2020 explicitly embedded innovation and research as core pedagogical objectives. Atal Tinkering Labs have now reached over 10,000 schools. NIRF rankings now include an innovation criterion. These are meaningful signals that the policy direction has shifted.`,
      },
      {
        type: `subheading`,
        text: `Early-Stage Incubation Access`,
      },
      {
        type: `paragraph`,
        text: `Technology Business Incubators (TBIs) and Atal Incubation Centres have expanded significantly. Today, over 800 government-supported incubators exist in India, up from fewer than 200 in 2018. For students at Tier-1 institutions, access to incubation support is genuinely better than it was five years ago.`,
      },
      {
        type: `heading`,
        text: `What Hasn't Changed`,
      },
      {
        type: `quote`,
        text: `"The incubation infrastructure exists. The problem is that most of it is inaccessible to students outside the top 50 institutions. For a student in a Tier-3 college in Madhya Pradesh, the ecosystem might as well not exist." — State-level Innovation Coordinator, Madhya Pradesh`,
      },
      {
        type: `subheading`,
        text: `The Tier-2 and Tier-3 College Gap`,
      },
      {
        type: `paragraph`,
        text: `Of the 800+ incubators in India, fewer than 12% actively serve students from non-IIT/NIT institutions. The talent distribution in India isn't concentrated — it is everywhere. But the support infrastructure remains deeply centralized.`,
      },
      {
        type: `bullet-list`,
        items: [
          `88% of funded student projects come from Tier-1 institutions`,
          `Less than 3% of Atal Tinkering Labs meet minimum equipment standards in practice`,
          `Average wait time for government seed grant disbursement: 14 months`,
          `Female student innovators receive funding in less than 8% of all funded projects`,
          `70% of student startups fold within 18 months of their first funding round`,
        ],
      },
      {
        type: `heading`,
        text: `The Role of Platforms Like DreamXec`,
      },
      {
        type: `paragraph`,
        text: `Government-led ecosystems will always be slow. This isn't a criticism — it's the nature of institutional change at scale. The role of platforms like DreamXec is to fill the gaps that policy can't fill quickly enough: direct funding access, mentorship networks, visibility for projects from underrepresented colleges, and community for students who often feel isolated in their innovation journey.`,
      },
      {
        type: `paragraph`,
        text: `In 2026, we're cautiously optimistic. The momentum is real. But optimism without honesty is indulgence. The systemic changes needed — equitable incubation access, faster government disbursement, meaningful representation of women and rural students in innovation pipelines — will require sustained pressure from platforms, educators, and donors alike.`,
      },
      {
        type: `callout`,
        text: `DreamXec actively prioritizes projects from Tier-2 and Tier-3 colleges in its campaign discovery algorithms. If you're a donor, consider filtering by First-Generation and Rural project tags to direct your impact where it's needed most.`,
      },
    ],
  },
  {
    id: 5,
    slug: `from-hostel-room-to-prototype-the-dreamxec-story`,
    title: `From Hostel Room to Prototype: The DreamXec Origin Story`,
    excerpt: `Every platform starts somewhere. Ours started in a cramped NIT hostel room, with a dial-up connection and a promise to solve a problem no one else seemed to care about.`,
    featuredImage: `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80`,
    author: `Arjun Mehta`,
    authorRole: `Co-Founder, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80`,
    date: `January 5, 2026`,
    readTime: `6 min read`,
    category: `Our Story`,
    tags: [`DreamXec`, `Origin Story`, `Startup`, `India Innovation`],
    content: [
      {
        type: `paragraph`,
        text: `In 2021, I was a third-year student at NIT Trichy with a project that I genuinely believed could help rural farmers detect crop diseases three weeks earlier than any existing solution. The prototype worked. The data was compelling. The professor supervising my project called it the best undergraduate research he'd supervised in fifteen years.`,
      },
      {
        type: `paragraph`,
        text: `I needed Rs 80,000 to build the hardware component and run a proper field trial. I received zero. The MHRD grant I applied for took eleven months before anyone even acknowledged receipt. The college innovation cell had a budget of Rs 50,000 for the entire year, split across forty projects. Two Kickstarter campaigns for far less impactful projects raised thousands of dollars from American donors who had no idea what India needed.`,
      },
      {
        type: `quote`,
        text: `"What if the problem wasn't the idea? What if the problem was the infrastructure — or the complete lack of it — for funding student innovation in India?"`,
      },
      {
        type: `heading`,
        text: `The Moment of Clarity`,
      },
      {
        type: `paragraph`,
        text: `That question, asked at 2am in a hostel room with three friends, became the seed of DreamXec. We spent the next six months talking to 300+ students across 40 colleges. The pattern was relentless: brilliant people, important problems, zero access to funding. We heard about a student in Pune who had to dismantle her prototype to pay her rent. A team in Jaipur that had been waiting two years for a government decision. A first-generation student in Odisha who didn't know you could even apply for innovation funding.`,
      },
      {
        type: `subheading`,
        text: `Building the First Version`,
      },
      {
        type: `paragraph`,
        text: `Our first version was, charitably, terrible. The UI looked like it was designed in 2010. The payment integration broke constantly. The database went down twice in the first week. But 37 students posted campaigns. And eleven of them raised their full goal. Those eleven projects changed everything. They became proof — stubborn, beautiful, data-backed proof — that people in India would donate to student innovation projects from students they'd never met.`,
      },
      {
        type: `paragraph`,
        text: `From that wobbly beginning, we grew. We rebuilt the platform four times. We made mistakes that cost us dearly and learned lessons we couldn't have bought. We found the team members who understood not just the technology, but the human stakes of what we were building.`,
      },
      {
        type: `heading`,
        text: `Where We Are Today`,
      },
      {
        type: `paragraph`,
        text: `Today, DreamXec hosts campaigns from students across 18 states. We have a mentor network of 300+ professionals. We've helped students raise over Rs 2 crore in total funding. We've facilitated 40+ mentor-student pairings that turned into long-term relationships. And we've watched projects born on our platform go on to win national competitions, get patent approvals, and in three remarkable cases, become registered companies.`,
      },
      {
        type: `callout`,
        text: `We started because we lived the problem. We're still here because every morning, we get messages from students who remind us why we started. If you are one of those students — this platform was built for you.`,
      },
    ],
  },
  {
    id: 6,
    slug: `impact-of-csr-funding-on-student-research-projects`,
    title: `How Corporate CSR Funding Is Transforming Student Research in India`,
    excerpt: `A new wave of forward-thinking companies is directing CSR budgets toward student innovation. The results — for students, for companies, and for India — are significant.`,
    featuredImage: `https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&auto=format&fit=crop&q=80`,
    author: `Priya Sharma`,
    authorRole: `Partnerships Manager, DreamXec`,
    authorAvatar: `https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80`,
    date: `December 28, 2025`,
    readTime: `9 min read`,
    category: `Impact`,
    tags: [`CSR`, `Corporate Partnerships`, `Student Research`, `Impact`],
    content: [
      {
        type: `paragraph`,
        text: `For decades, corporate CSR in India followed a familiar script: donate to an NGO, sponsor a school building, plant some trees. Those activities served legitimate purposes. But a growing number of progressive companies have recognized that one of the highest-return investments they can make — for India and for themselves — is funding student innovation at the earliest stage.`,
      },
      {
        type: `heading`,
        text: `Why Companies Are Turning to Student Innovation`,
      },
      {
        type: `paragraph`,
        text: `The logic is straightforward. Students are working on real problems. Their solutions are often technically sophisticated and commercially viable. They're desperate for funding and deeply grateful for support. And the talent pipeline they represent is exactly what growing Indian companies need.`,
      },
      {
        type: `bullet-list`,
        items: [
          `Direct visibility into emerging talent across India`,
          `Early-stage IP access in relevant technical domains`,
          `Authentic ESG impact metrics with documented outcomes`,
          `Brand equity among India's next generation of professionals and consumers`,
          `Potential first-mover advantage in recruiting top innovators`,
        ],
      },
      {
        type: `quote`,
        text: `"We funded five DreamXec projects in the clean energy space. Two of those students are now our full-time R&D employees. We also hold co-inventor status on one patent that came out of the grant. The ROI was extraordinary." — CSR Director, Mid-size Indian Energy Company`,
      },
      {
        type: `heading`,
        text: `The DreamXec Corporate Partnership Model`,
      },
      {
        type: `subheading`,
        text: `Thematic Innovation Grants`,
      },
      {
        type: `paragraph`,
        text: `Companies define a thematic challenge — sustainable agriculture, accessible healthcare, fintech for underserved populations — and DreamXec curates relevant student projects for a dedicated grant pool. Donors get full transparency on project selection, progress updates, and final impact reports.`,
      },
      {
        type: `subheading`,
        text: `Employee Volunteerism as Mentorship`,
      },
      {
        type: `paragraph`,
        text: `Beyond funding, companies can offer their employees as mentors. This deepens employee engagement, creates genuine social impact, and gives your team a direct connection to India's innovation pipeline. DreamXec handles all scheduling, matching, and coordination — the company just shows up.`,
      },
      {
        type: `paragraph`,
        text: `The shift in corporate CSR from transactional to transformational is one of the most encouraging developments in India's innovation ecosystem. When companies begin to see student innovators not as charity recipients but as early-stage partners in India's technological future, everyone wins.`,
      },
      {
        type: `callout`,
        text: `Interested in structuring a corporate partnership with DreamXec? Email partnerships@dreamxec.com to discuss your budget, sector priorities, and impact objectives.`,
      },
    ],
  },
];
