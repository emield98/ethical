// Centralized options for each step in the chatbot builder

export const budgetOptions = [
  {
    id: "small",
    label: "Small Budget",
    description:
      "Perfect for startups and small projects. You'll need to make careful choices and focus on essential features.",
    amount: 50000,
  },
  {
    id: "medium",
    label: "Medium Budget",
    description:
      "Good for established companies. You can afford quality features but still need to prioritize.",
    amount: 500000,
  },
  {
    id: "large",
    label: "Large Budget",
    description:
      "Enterprise-level budget. You can afford premium features and comprehensive solutions.",
    amount: 5000000,
  },
];

export const dataOptions = [
  {
    id: "public",
    label: "Public Internet Data",
    description:
      "Web scraping, social media, forums, and other publicly available content",
  },
  {
    id: "curated",
    label: "Curated Premium Sources",
    description:
      "Academic journals, textbooks, verified news sources, and expert-reviewed content",
  },
  {
    id: "proprietary",
    label: "Proprietary + Human Annotation",
    description:
      "Custom data collection with human verification and quality control",
  },
];

export const filteringOptions = [
  {
    id: "minimal",
    label: "Minimal Filtering",
    description:
      "Your AI will only block illegal content. It allows full access to information but the risk of generating offensive or harmful material increases.",
  },
  {
    id: "moderate",
    label: "Moderate Filtering",
    description:
      "Your AI can have respectful discussions on sensitive topics (e.g. gender identity, racism, politics, or religion) while blocking harmful content.",
  },
  {
    id: "strict",
    label: "Enterprise Filtering",
    description:
      "Use advanced AI models alongside human moderators to provide thorough, context-sensitive filtering. Your AI is designed to minimize harm while preserving meaningful dialogue.",
  },
];

export const behaviorOptions = [
  {
    id: "directive",
    label: "Directive",
    quote: `"I'm here to help you find the right answers"`,
    description:
      "Your AI will speak with authority and confidence, providing direct answers and actively correcting misinformation. It positions itself as a reliable expert that users can trust for accurate information.",
    characteristics:
      "Authoritative tone, definitive answers, expert positioning, corrects misinformation",
  },
  {
    id: "empathetic",
    label: "Empathetic",
    quote: `"I understand how you feel, let's work through this together"`,
    description:
      "Your AI will prioritize emotional connection and user comfort, using emotional language and avoiding conflicts. It creates a warm, supportive interaction style that feels naturally human.",
    characteristics:
      "Emotional language, mirrors user feelings, avoids conflicts, warm and supportive",
  },
  {
    id: "transparent",
    label: "Transparent",
    quote: `"I'm an AI assistant with limitations - let me help while you stay in control"`,
    description:
      "Your AI will frequently remind users of its artificial nature and limitations, encouraging critical thinking and independent verification. It maintains professional distance while promoting user autonomy.",
    characteristics:
      "Acknowledges AI nature, encourages verification, promotes critical thinking, professional distance",
  },
];

export const biasOptions = [
  {
    id: "transparent",
    label: "Acknowledge Transparently",
    description:
      "No debiasing, instead openly disclose potential biases and limitations when providing information.",
  },
  {
    id: "values",
    label: "Debiasing the Dataset",
    description:
      "Attempting to remove harmful biases in the data before training.",
  },
  {
    id: "minimize",
    label: "Minimize All Biases",
    description:
      "Debiasing at every step of the models training using methods such as GN-Glove and Hard-Debiased.",
  },
];

export const costs: Record<string, Record<string, Record<string, number | null>>> = {
  data: {
    public: { small: 10000, medium: 25000, large: 50000 },
    curated: { small: 30000, medium: 150000, large: 700000 },
    proprietary: { small: 40000, medium: 500000, large: 2500000 },
  },
  filtering: {
    minimal: { small: 500, medium: 5000, large: 20000 },
    moderate: { small: null, medium: 100000, large: 400000 },
    strict: { small: null, medium: null, large: 1200000 },
  },
  behavior: {
    directive: { small: 10000, medium: 80000, large: 200000 },
    empathetic: { small: 15000, medium: 100000, large: 300000 },
    transparent: { small: 12000, medium: 60000, large: 150000 },
  },
  bias: {
    transparent: { small: 8000, medium: 30000, large: 80000 },
    values: { small: null, medium: 200000, large: 800000 },
    minimize: { small: null, medium: null, large: 1500000 },
  },
};

export const explanations: Record<string, Record<string, Record<string, string>>> = {
  data: {
    public: {
      small: "Gives you basic training data from public sources like Wikipedia and blogs. Good for general knowledge, but quality varies.",
      medium: "Adds better structure and multilingual support using cleaned public data. More reliable for global audiences.",
      large: "Advanced processing of massive public datasets from across the web, with expert filtering and formatting.",
    },
    curated: {
      medium: "Includes licensed access to trusted sources like academic journals or verified news. Improves fact accuracy.",
      large: "Full library access to professional content like legal texts, textbooks, or financial reports — perfect for experts.",
    },
    proprietary: {
      small: "Small custom dataset built with freelancer help. Useful for focused use cases like a niche support bot.",
      medium: "Moderate-scale dataset with human-checked examples. Good for company-specific or regulated environments.",
      large: "Top-tier data built by large teams with quality control and review. Needed for enterprise or high-stakes use.",
    },
  },
  filtering: {
    minimal: {
      small: "Basic filters that block illegal or clearly harmful content. Fast, but not very safe for all users.",
      medium: "Adds smarter filters using commercial tools. Good balance between safety and flexibility.",
      large: "Robust fallback filters used by big tech companies. Includes alerts and tracking for risky content.",
    },
    moderate: {
      medium: "AI filters with human spot-checking. Better for communities or youth apps.",
      large: "Custom filters trained on your topics with part-time moderators, good for semi-sensitive content.",
    },
    strict: {
      large: "Enterprise-level filtering: custom dashboards, trained moderators across time zones, and full audit logs.",
    },
  },
  behavior: {
    directive: {
      small: "Uses prompts to sound confident and helpful, like a virtual librarian. No deep AI training needed.",
      medium: "Fine-tuned to be more accurate and direct. Great for Q&A or tech support bots.",
      large: "Includes advanced logic for detecting mistakes and correcting them on the fly. Ideal for medical or legal tools.",
    },
    empathetic: {
      small: "Basic tone adjustment to sound friendly and caring. Helpful for casual or wellness-focused bots.",
      medium: "Trained on emotional language and tested with real users to feel more human.",
      large: "Custom emotional responses in different languages and cultures. Used in therapy, HR, or coaching tools.",
    },
    transparent: {
      small: "Adds simple messages like 'I'm an AI assistant' to keep expectations clear.",
      medium: "Gives context about answers, including where they come from. Encourages critical thinking.",
      large: "Provides source citations and confidence scores. Ideal for education or journalism use.",
    },
  },
  bias: {
    transparent: {
      small: "Clearly explains that the AI may have limitations or blind spots. Helps users stay informed.",
      medium: "Reviews answers internally to catch common bias issues and adjust prompts.",
      large: "Audits bias across different topics, collects user feedback, and continuously improves reporting.",
    },
    values: {
      medium: "Consults experts to adjust dataset in order to reduce the biases contained in it.",
      large: "Builds an entire ethical strategy, using tools such as Hard-debiasing.",
    },
    minimize: {
      large: "A full AI safety team works to reduce as much bias as possible using tools such as GN-Glove and Hard-Debiasing.",
    },
  },
};

export const unavailableReasons: Record<
  string,
  Record<string, Record<string, string>>
> = {
  data: {
    curated: {
      small: "Trusted sources like journals and newspapers are too expensive for smaller projects.",
    },
    proprietary: {
      small: "Custom-made data with human review takes too much time and money for a small budget.",
    },
  },
  filtering: {
    moderate: {
      small: "Combining AI filters with human review isn’t feasible without more resources.",
    },
    strict: {
      small: "A full moderation team and dashboards are far beyond what a starter budget can handle.",
      medium: "Medium budgets still can’t afford 24/7 global moderation and enterprise oversight.",
    },
  },
  behavior: {
    directive: {
      small: "Confident, fact-checked answers need more training and validation than this budget allows.",
    },
    empathetic: {
      small: "Emotionally intelligent responses need custom training — too costly for small projects.",
    },
    transparent: {
      small: "Explaining limitations and sources in detail requires advanced systems not supported here.",
    },
  },
  bias: {
    values: {
      small: "Aligning the AI with specific ethical goals involves expert input and review — not doable at this level.",
    },
    minimize: {
      small: "You’d need a dedicated research team and tooling to minimize bias, which isn’t affordable here.",
      medium: "Full-scale bias mitigation is complex and resource-heavy — even medium budgets fall short.",
    },
  },
};