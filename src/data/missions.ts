export type MissionId = 'website' | 'webapp' | 'mobile' | 'existing' | 'unsure'

export type MissionOption = {
  label: string
  detail?: string
}

export type MissionQuestion = {
  id: string
  title: string
  prompt: string
  helper: string
  options?: MissionOption[]
  multiple?: boolean
  textPlaceholder?: string
}

export type MissionChapter = {
  id: string
  label: string
  shortLabel: string
  questions: MissionQuestion[]
}

export type Mission = {
  id: MissionId
  index: string
  label: string
  shortLabel: string
  description: string
  accent: string
  chapters: MissionChapter[]
}

const sharedDelivery: MissionChapter = {
  id: 'delivery',
  label: 'Delivery',
  shortLabel: 'Deliver',
  questions: [
    {
      id: 'stage',
      title: 'Current stage',
      prompt: 'How far has the product already progressed?',
      helper: 'This tells us whether the engagement begins with discovery, design, development, or refinement.',
      options: [
        { label: 'Idea only', detail: 'The product still needs definition.' },
        { label: 'Requirements ready', detail: 'The scope is already documented.' },
        { label: 'Designs ready', detail: 'Flows or high-fidelity screens exist.' },
        { label: 'Existing code', detail: 'There is a product or codebase to continue.' },
      ],
      textPlaceholder: 'Describe anything that already exists…',
    },
    {
      id: 'launch-scope',
      title: 'Launch ambition',
      prompt: 'What should the first delivery accomplish?',
      helper: 'A focused first release is usually more useful than attempting every future feature at once.',
      options: [
        { label: 'Clickable prototype', detail: 'Validate the flow before development.' },
        { label: 'Focused MVP', detail: 'Launch the smallest valuable product.' },
        { label: 'Production release', detail: 'A complete public-ready first version.' },
        { label: 'Major iteration', detail: 'Improve an existing live product.' },
      ],
    },
    {
      id: 'timing',
      title: 'Timing',
      prompt: 'Is there a meaningful target date?',
      helper: 'A target is useful even when the exact delivery plan has not been estimated yet.',
      options: [
        { label: 'As soon as practical' },
        { label: 'Within 1–2 months' },
        { label: 'Within 3–4 months' },
        { label: 'Flexible' },
      ],
      textPlaceholder: 'Add a date, event, or reason behind the timing…',
    },
    {
      id: 'budget',
      title: 'Investment range',
      prompt: 'What range should the proposed scope respect?',
      helper: 'This is used to shape an appropriate first phase, not to calculate an automatic final quote.',
      options: [
        { label: 'Under $5k' },
        { label: '$5k–$15k' },
        { label: '$15k–$35k' },
        { label: '$35k+' },
        { label: 'Need guidance' },
      ],
    },
    {
      id: 'after-launch',
      title: 'After launch',
      prompt: 'What support should exist after the first delivery?',
      helper: 'Select every responsibility that should be included in the proposed engagement.',
      multiple: true,
      options: [
        { label: 'Deployment' },
        { label: 'Store submission' },
        { label: 'Monitoring' },
        { label: 'Maintenance' },
        { label: 'Feature roadmap' },
        { label: 'Team handoff' },
      ],
    },
  ],
}

const sharedReview: MissionChapter = {
  id: 'review',
  label: 'Review',
  shortLabel: 'Review',
  questions: [
    {
      id: 'final-context',
      title: 'Final context',
      prompt: 'What else would help Daniel understand the mission?',
      helper: 'Add constraints, references, concerns, existing links, or anything the structured questions missed.',
      textPlaceholder: 'Add the context that would make the first conversation productive…',
    },
    {
      id: 'contact',
      title: 'Where should the response go?',
      prompt: 'Add the contact details for this project brief.',
      helper: 'The brief remains editable until you explicitly submit it.',
      textPlaceholder: 'Name, email, company, and preferred contact method…',
    },
  ],
}

export const missions: Mission[] = [
  {
    id: 'website',
    index: '01',
    label: 'Website',
    shortLabel: 'Website',
    description: 'A focused public experience built to explain, persuade, and convert.',
    accent: '#57e8b5',
    chapters: [
      {
        id: 'foundation',
        label: 'Foundation',
        shortLabel: 'Define',
        questions: [
          {
            id: 'website-purpose',
            title: 'Primary outcome',
            prompt: 'What must this website accomplish?',
            helper: 'Choose the business outcome that should guide every page and interaction.',
            options: [
              { label: 'Generate leads' },
              { label: 'Sell products' },
              { label: 'Explain a product' },
              { label: 'Build credibility' },
              { label: 'Publish content' },
              { label: 'Launch something new' },
            ],
            textPlaceholder: 'Describe the result the website should create…',
          },
          {
            id: 'website-audience',
            title: 'Audience',
            prompt: 'Who needs to understand and act on the website?',
            helper: 'Describe the people, organizations, or communities the experience is for.',
            textPlaceholder: 'Who they are, what they care about, and what currently stops them…',
          },
          {
            id: 'website-type',
            title: 'Website type',
            prompt: 'Which shape is closest to the intended experience?',
            helper: 'This can be refined later; choose the nearest starting point.',
            options: [
              { label: 'Marketing site' },
              { label: 'E-commerce' },
              { label: 'Portfolio' },
              { label: 'Editorial / content' },
              { label: 'Campaign / launch' },
              { label: 'Immersive experience' },
            ],
          },
        ],
      },
      {
        id: 'structure',
        label: 'Structure',
        shortLabel: 'Structure',
        questions: [
          {
            id: 'website-pages',
            title: 'Essential pages',
            prompt: 'Which areas must exist at launch?',
            helper: 'Select known pages. The final information architecture can still consolidate them.',
            multiple: true,
            options: [
              { label: 'Home' }, { label: 'Product / services' }, { label: 'About' },
              { label: 'Pricing' }, { label: 'Case studies' }, { label: 'Journal' },
              { label: 'Contact' }, { label: 'Support / FAQ' }, { label: 'Legal' },
            ],
          },
          {
            id: 'website-actions',
            title: 'Visitor actions',
            prompt: 'What should visitors be able to do?',
            helper: 'Select every meaningful conversion or interaction.',
            multiple: true,
            options: [
              { label: 'Contact' }, { label: 'Book a call' }, { label: 'Purchase' },
              { label: 'Subscribe' }, { label: 'Create an account' }, { label: 'Download' },
              { label: 'Search content' }, { label: 'Use an interactive tool' },
            ],
          },
          {
            id: 'website-content',
            title: 'Content readiness',
            prompt: 'What content already exists?',
            helper: 'Content affects the structure, design schedule, and launch plan.',
            multiple: true,
            options: [
              { label: 'Brand identity' }, { label: 'Written copy' }, { label: 'Photography' },
              { label: 'Video' }, { label: 'Product data' }, { label: 'Nothing yet' },
            ],
          },
        ],
      },
      {
        id: 'systems',
        label: 'Systems',
        shortLabel: 'Systems',
        questions: [
          {
            id: 'website-systems',
            title: 'Connected systems',
            prompt: 'What must the website connect to?',
            helper: 'Select known platforms or describe existing infrastructure.',
            multiple: true,
            options: [
              { label: 'CMS' }, { label: 'Commerce' }, { label: 'CRM' },
              { label: 'Email marketing' }, { label: 'Booking' }, { label: 'Analytics' },
              { label: 'Existing API' }, { label: 'No integrations' },
            ],
            textPlaceholder: 'Name any specific services already in use…',
          },
          {
            id: 'website-discovery',
            title: 'Discovery requirements',
            prompt: 'How should people find and experience the site?',
            helper: 'These requirements influence content, performance, and architecture.',
            multiple: true,
            options: [
              { label: 'Search optimization' }, { label: 'Social sharing' }, { label: 'Multiple languages' },
              { label: 'High accessibility' }, { label: 'International audience' }, { label: 'Campaign traffic' },
            ],
          },
        ],
      },
      {
        id: 'direction',
        label: 'Direction',
        shortLabel: 'Direction',
        questions: [
          {
            id: 'website-tone',
            title: 'Experience direction',
            prompt: 'How should the finished website feel?',
            helper: 'Choose several qualities or describe a more specific direction.',
            multiple: true,
            options: [
              { label: 'Calm' }, { label: 'Editorial' }, { label: 'Technical' },
              { label: 'Playful' }, { label: 'Premium' }, { label: 'Experimental' },
              { label: 'Minimal' }, { label: 'Bold' },
            ],
            textPlaceholder: 'Add references, moods, or experiences you admire…',
          },
          {
            id: 'website-motion',
            title: 'Motion language',
            prompt: 'How expressive should interaction and animation be?',
            helper: 'Motion can be restrained, explanatory, or a defining part of the experience.',
            options: [
              { label: 'Minimal and functional' },
              { label: 'Polished and expressive' },
              { label: 'Immersive and cinematic' },
              { label: 'Need a recommendation' },
            ],
          },
        ],
      },
      sharedDelivery,
      sharedReview,
    ],
  },
  {
    id: 'webapp',
    index: '02',
    label: 'Web Application',
    shortLabel: 'Web App',
    description: 'A browser-based product for customers, teams, operations, or new ventures.',
    accent: '#9b7cff',
    chapters: [
      {
        id: 'foundation',
        label: 'Foundation',
        shortLabel: 'Define',
        questions: [
          {
            id: 'webapp-idea',
            title: 'Product mission',
            prompt: 'What should this application make possible?',
            helper: 'Describe the transformation, not only the screens or technology.',
            textPlaceholder: 'People currently struggle with… This product would let them…',
          },
          {
            id: 'webapp-type',
            title: 'Product shape',
            prompt: 'Which model is closest to the application?',
            helper: 'Select the closest match; hybrid products can be explained in the notes.',
            options: [
              { label: 'SaaS product' }, { label: 'Customer portal' }, { label: 'Marketplace' },
              { label: 'Internal tool' }, { label: 'Dashboard' }, { label: 'Community' },
              { label: 'Workflow system' }, { label: 'Something new' },
            ],
          },
          {
            id: 'webapp-audience',
            title: 'Users and customers',
            prompt: 'Who uses it, and who decides to pay for it?',
            helper: 'The user and buyer may be different people.',
            textPlaceholder: 'Describe primary users, buyers, administrators, and their context…',
          },
        ],
      },
      {
        id: 'experience',
        label: 'Experience',
        shortLabel: 'Experience',
        questions: [
          {
            id: 'webapp-roles',
            title: 'Roles and permissions',
            prompt: 'Which kinds of people need different access?',
            helper: 'Select common roles and describe any special permission rules.',
            multiple: true,
            options: [
              { label: 'Guest' }, { label: 'Member' }, { label: 'Team manager' },
              { label: 'Organization owner' }, { label: 'Administrator' }, { label: 'Support operator' },
            ],
            textPlaceholder: 'Describe uncommon roles or restrictions…',
          },
          {
            id: 'webapp-journey',
            title: 'Core workflow',
            prompt: 'What is the most important journey through the application?',
            helper: 'Explain the trigger, the work performed, and the successful outcome.',
            textPlaceholder: 'A user arrives because… then they… and succeeds when…',
          },
          {
            id: 'webapp-features',
            title: 'Core capabilities',
            prompt: 'Which systems are likely to matter at launch?',
            helper: 'Select all relevant capabilities. Each can be refined later.',
            multiple: true,
            options: [
              { label: 'Authentication' }, { label: 'Organizations / teams' }, { label: 'Search and filters' },
              { label: 'Dashboards' }, { label: 'Realtime updates' }, { label: 'Messaging' },
              { label: 'File handling' }, { label: 'Payments' }, { label: 'Subscriptions' },
              { label: 'Notifications' }, { label: 'Reporting' }, { label: 'Admin tools' },
            ],
          },
        ],
      },
      {
        id: 'systems',
        label: 'Systems',
        shortLabel: 'Systems',
        questions: [
          {
            id: 'webapp-data',
            title: 'Data and content',
            prompt: 'What information does the product create, store, or process?',
            helper: 'Include sensitive data, uploaded content, records, and reporting needs.',
            textPlaceholder: 'Describe the important records and who owns or changes them…',
          },
          {
            id: 'webapp-integrations',
            title: 'Integrations',
            prompt: 'Which external systems should participate?',
            helper: 'Select categories and name specific services in the notes.',
            multiple: true,
            options: [
              { label: 'Payments' }, { label: 'Email / SMS' }, { label: 'Calendar' },
              { label: 'Maps' }, { label: 'CRM' }, { label: 'Accounting' },
              { label: 'Existing API' }, { label: 'AI service' }, { label: 'No known integrations' },
            ],
            textPlaceholder: 'Name existing providers, APIs, or infrastructure…',
          },
          {
            id: 'webapp-operations',
            title: 'Operations',
            prompt: 'What must happen behind the customer experience?',
            helper: 'Administrative work is often as important as the public-facing product.',
            multiple: true,
            options: [
              { label: 'User administration' }, { label: 'Content moderation' }, { label: 'Refunds' },
              { label: 'Support tools' }, { label: 'Audit history' }, { label: 'Exports' },
              { label: 'Analytics' }, { label: 'Automated workflows' },
            ],
          },
        ],
      },
      {
        id: 'direction',
        label: 'Direction',
        shortLabel: 'Direction',
        questions: [
          {
            id: 'webapp-interface',
            title: 'Interface character',
            prompt: 'What should using the application feel like?',
            helper: 'Choose qualities that should guide visual density, motion, and interaction.',
            multiple: true,
            options: [
              { label: 'Fast and operational' }, { label: 'Calm and focused' }, { label: 'Data-rich' },
              { label: 'Friendly and guided' }, { label: 'Premium' }, { label: 'Experimental' },
            ],
            textPlaceholder: 'Add product references or an existing brand direction…',
          },
          {
            id: 'webapp-devices',
            title: 'Usage context',
            prompt: 'Where and how will people use the product?',
            helper: 'This determines responsive priorities and interaction patterns.',
            multiple: true,
            options: [
              { label: 'Desktop-first' }, { label: 'Mobile browser' }, { label: 'Tablet' },
              { label: 'Field work' }, { label: 'Large displays' }, { label: 'Assistive technology' },
            ],
          },
        ],
      },
      sharedDelivery,
      sharedReview,
    ],
  },
  {
    id: 'mobile',
    index: '03',
    label: 'Mobile Application',
    shortLabel: 'Mobile',
    description: 'A touch-first product designed around what people need in the moment.',
    accent: '#55c7ff',
    chapters: [
      {
        id: 'foundation',
        label: 'Foundation',
        shortLabel: 'Define',
        questions: [
          {
            id: 'mobile-idea',
            title: 'Product mission',
            prompt: 'What should this mobile product make possible?',
            helper: 'Describe the real situation, the problem, and the desired change.',
            textPlaceholder: 'When people are… they need to… so that…',
          },
          {
            id: 'mobile-audience',
            title: 'Audience',
            prompt: 'Who will reach for this application?',
            helper: 'Describe primary users, their environment, and their level of familiarity.',
            textPlaceholder: 'Describe the people, their context, and what they use today…',
          },
          {
            id: 'mobile-market',
            title: 'Product context',
            prompt: 'How will the application be used?',
            helper: 'Choose the closest product context.',
            options: [
              { label: 'Consumer product' }, { label: 'Business product' }, { label: 'Employee tool' },
              { label: 'Companion app' }, { label: 'Community' }, { label: 'Connected device' },
            ],
          },
        ],
      },
      {
        id: 'experience',
        label: 'Experience',
        shortLabel: 'Experience',
        questions: [
          {
            id: 'mobile-platforms',
            title: 'Platforms',
            prompt: 'Which devices matter for the first release?',
            helper: 'Select user-facing platforms rather than implementation technology.',
            multiple: true,
            options: [
              { label: 'iPhone' }, { label: 'Android phones' }, { label: 'iPad / tablets' },
              { label: 'Wearables' }, { label: 'Not decided' },
            ],
          },
          {
            id: 'mobile-access',
            title: 'Access model',
            prompt: 'How should people enter and identify themselves?',
            helper: 'Select all entry methods that may be relevant.',
            multiple: true,
            options: [
              { label: 'Guest access' }, { label: 'Email account' }, { label: 'Social login' },
              { label: 'Phone number' }, { label: 'Organization invite' }, { label: 'Biometrics' },
            ],
          },
          {
            id: 'mobile-journey',
            title: 'First successful journey',
            prompt: 'What should a new user accomplish in their first session?',
            helper: 'This becomes the anchor for onboarding and the initial release.',
            textPlaceholder: 'They open the app, understand…, complete…, and leave with…',
          },
        ],
      },
      {
        id: 'capabilities',
        label: 'Capabilities',
        shortLabel: 'Features',
        questions: [
          {
            id: 'mobile-features',
            title: 'Core capabilities',
            prompt: 'Which capabilities may belong in the product?',
            helper: 'Select freely. The review phase will separate launch essentials from future phases.',
            multiple: true,
            options: [
              { label: 'Profiles' }, { label: 'Search' }, { label: 'Booking' }, { label: 'Calendar' },
              { label: 'Payments' }, { label: 'Subscriptions' }, { label: 'Messaging' }, { label: 'Video / audio' },
              { label: 'Maps / location' }, { label: 'Camera' }, { label: 'Uploads' }, { label: 'Content feed' },
              { label: 'Reviews' }, { label: 'Favorites' }, { label: 'Sharing' }, { label: 'Notifications' },
            ],
          },
          {
            id: 'mobile-device',
            title: 'Device behavior',
            prompt: 'Which native capabilities should participate?',
            helper: 'Only select capabilities with a meaningful user benefit.',
            multiple: true,
            options: [
              { label: 'Offline mode' }, { label: 'Background activity' }, { label: 'Geofencing' },
              { label: 'Bluetooth' }, { label: 'Health data' }, { label: 'Wallet' },
              { label: 'Contacts' }, { label: 'Files' }, { label: 'No special hardware' },
            ],
          },
          {
            id: 'mobile-operations',
            title: 'Administration',
            prompt: 'What must operators control outside the mobile app?',
            helper: 'Many mobile products also need a secure web-based administration system.',
            multiple: true,
            options: [
              { label: 'Users' }, { label: 'Content' }, { label: 'Bookings' }, { label: 'Payments' },
              { label: 'Moderation' }, { label: 'Support' }, { label: 'Analytics' }, { label: 'No admin system' },
            ],
          },
        ],
      },
      {
        id: 'direction',
        label: 'Direction',
        shortLabel: 'Direction',
        questions: [
          {
            id: 'mobile-personality',
            title: 'Product personality',
            prompt: 'How should the application feel in someone’s hand?',
            helper: 'Select several qualities that should shape interface, language, and motion.',
            multiple: true,
            options: [
              { label: 'Effortless' }, { label: 'Focused' }, { label: 'Energetic' }, { label: 'Premium' },
              { label: 'Playful' }, { label: 'Reassuring' }, { label: 'Technical' }, { label: 'Expressive' },
            ],
            textPlaceholder: 'Add visual references, brands, or products you admire…',
          },
          {
            id: 'mobile-inclusive',
            title: 'Inclusive experience',
            prompt: 'Which broader experience requirements are known?',
            helper: 'These affect content, layout, testing, and platform behavior.',
            multiple: true,
            options: [
              { label: 'Multiple languages' }, { label: 'Screen readers' }, { label: 'Large text' },
              { label: 'Reduced motion' }, { label: 'Children / age gates' }, { label: 'Sensitive data' },
            ],
          },
        ],
      },
      sharedDelivery,
      sharedReview,
    ],
  },
  {
    id: 'existing',
    index: '04',
    label: 'Existing Product',
    shortLabel: 'Improve',
    description: 'Diagnose, redesign, rebuild, or extend something that already exists.',
    accent: '#ffb45b',
    chapters: [
      {
        id: 'diagnosis',
        label: 'Diagnosis',
        shortLabel: 'Diagnose',
        questions: [
          {
            id: 'existing-product',
            title: 'Current product',
            prompt: 'What exists today?',
            helper: 'Describe the product, its users, and its current state.',
            textPlaceholder: 'Add a link and explain what the product currently does…',
          },
          {
            id: 'existing-problem',
            title: 'Reason for change',
            prompt: 'What is not working well enough?',
            helper: 'Select symptoms and explain the underlying concern if it is known.',
            multiple: true,
            options: [
              { label: 'Users are confused' }, { label: 'Looks outdated' }, { label: 'Too slow' },
              { label: 'Hard to maintain' }, { label: 'Missing features' }, { label: 'Not converting' },
              { label: 'Unreliable' }, { label: 'Needs a new platform' },
            ],
            textPlaceholder: 'Describe evidence, complaints, or business consequences…',
          },
          {
            id: 'existing-success',
            title: 'Successful change',
            prompt: 'What would be measurably better afterward?',
            helper: 'Define the desired outcome before choosing the solution.',
            textPlaceholder: 'The work succeeds when users can… and the business sees…',
          },
        ],
      },
      {
        id: 'scope',
        label: 'Scope',
        shortLabel: 'Scope',
        questions: [
          {
            id: 'existing-work',
            title: 'Type of intervention',
            prompt: 'Which kinds of work may be required?',
            helper: 'Select all that seem relevant. Discovery may change the final recommendation.',
            multiple: true,
            options: [
              { label: 'UX audit' }, { label: 'Visual redesign' }, { label: 'Feature design' },
              { label: 'Frontend rebuild' }, { label: 'Backend work' }, { label: 'Performance' },
              { label: 'Accessibility' }, { label: 'Migration' },
            ],
          },
          {
            id: 'existing-assets',
            title: 'Available materials',
            prompt: 'What can be reviewed at the beginning?',
            helper: 'Existing evidence makes diagnosis faster and more reliable.',
            multiple: true,
            options: [
              { label: 'Source code' }, { label: 'Design files' }, { label: 'Analytics' },
              { label: 'User feedback' }, { label: 'Support tickets' }, { label: 'Product roadmap' },
            ],
          },
          {
            id: 'existing-constraints',
            title: 'Constraints',
            prompt: 'What cannot be disrupted or replaced?',
            helper: 'Include platform, contractual, compliance, team, or launch constraints.',
            textPlaceholder: 'The solution must keep, support, avoid, or integrate with…',
          },
        ],
      },
      {
        id: 'users',
        label: 'Users',
        shortLabel: 'Users',
        questions: [
          {
            id: 'existing-users',
            title: 'Current users',
            prompt: 'Who depends on the product today?',
            helper: 'Include customers, internal operators, administrators, and other affected roles.',
            textPlaceholder: 'Describe user groups, frequency of use, and their most important work…',
          },
          {
            id: 'existing-transition',
            title: 'Transition sensitivity',
            prompt: 'How carefully must existing behavior be preserved?',
            helper: 'This affects rollout, migration, training, and compatibility planning.',
            options: [
              { label: 'Can change dramatically' },
              { label: 'Needs a guided transition' },
              { label: 'Must preserve familiar workflows' },
              { label: 'Not sure' },
            ],
          },
        ],
      },
      sharedDelivery,
      sharedReview,
    ],
  },
  {
    id: 'unsure',
    index: '05',
    label: 'Not Sure Yet',
    shortLabel: 'Ask Agent',
    description: 'Begin with the goal and let the creation console identify the right shape.',
    accent: '#f17eff',
    chapters: [
      {
        id: 'discovery',
        label: 'Discovery',
        shortLabel: 'Discover',
        questions: [
          {
            id: 'unsure-idea',
            title: 'The idea',
            prompt: 'What do you want to make possible?',
            helper: 'Explain it naturally. You do not need product or technical language.',
            textPlaceholder: 'I want people to be able to…',
          },
          {
            id: 'unsure-audience',
            title: 'The people',
            prompt: 'Who should benefit from it?',
            helper: 'Describe the people, organization, or community you have in mind.',
            textPlaceholder: 'This is for people who…',
          },
          {
            id: 'unsure-moment',
            title: 'The moment',
            prompt: 'When and where would they use it?',
            helper: 'The usage context often reveals whether the product should be web, mobile, or something else.',
            multiple: true,
            options: [
              { label: 'At a desk' }, { label: 'On the move' }, { label: 'At work' },
              { label: 'At home' }, { label: 'In public' }, { label: 'Across many devices' },
            ],
            textPlaceholder: 'Describe the situation in which the need appears…',
          },
        ],
      },
      {
        id: 'shape',
        label: 'Possible Shape',
        shortLabel: 'Shape',
        questions: [
          {
            id: 'unsure-actions',
            title: 'Important actions',
            prompt: 'What should people be able to do?',
            helper: 'Select broad capabilities and add anything missing.',
            multiple: true,
            options: [
              { label: 'Discover information' }, { label: 'Complete work' }, { label: 'Buy or sell' },
              { label: 'Communicate' }, { label: 'Create content' }, { label: 'Track progress' },
              { label: 'Book something' }, { label: 'Manage a business' },
            ],
            textPlaceholder: 'They need to…',
          },
          {
            id: 'unsure-business',
            title: 'Why it should exist',
            prompt: 'What makes this worth building now?',
            helper: 'This can be a business opportunity, operational need, personal mission, or creative idea.',
            textPlaceholder: 'This matters now because…',
          },
        ],
      },
      sharedDelivery,
      sharedReview,
    ],
  },
]

export function getMission(id: MissionId) {
  return missions.find((mission) => mission.id === id) ?? missions[0]
}
