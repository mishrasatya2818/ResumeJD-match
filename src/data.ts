export interface PreloadExample {
  id: string;
  roleName: string;
  companyName: string;
  resumeText: string;
  jdText: string;
}

export const EXAMPLES: PreloadExample[] = [
  {
    id: "frontend-engineer",
    roleName: "Senior Frontend Engineer",
    companyName: "WebScale Inc.",
    resumeText: `SATYA MISHRA
Senior Software Developer
Email: satya@example.com | Phone: +1 555-019-2834 | San Francisco, CA

SUMMARY
Enthusiastic and results-driven Software Developer with 5+ years of experience building web applications. Expert in HTML, CSS, JavaScript, and React. Passionate about creating responsive, accessible user interfaces and collaborating with product teams to build scalable web products.

EXPERIENCE
Software Developer | TechCorp (2022 - Present)
- Developed responsive web interfaces using React and JavaScript, improving page speed by 15%.
- Maintained legacy codebase, refactored older components, and reduced bundle size by 10%.
- Worked closely with UX designers to translate wireframes into high-fidelity web layouts.
- Used Git for version control and participated in daily standups and agile sprint planning.

Frontend Engineer | DevStudio (2020 - 2022)
- Built interactive customer dashboards using React, Redux, and Tailwind CSS.
- Handled API integrations with Express/Node.js backends.
- Optimized user flows, which resulted in a 12% increase in customer conversions.
- Wrote unit tests using Jest and React Testing Library.

SKILLS
- Languages: JavaScript (ES6+), TypeScript (Basic), HTML5, CSS3
- Frameworks: React, Redux, Next.js, Express, Node.js
- Styling: Tailwind CSS, CSS Modules, SASS
- Tools: Git, Webpack, Babel, Jest, npm, VS Code`,
    jdText: `Senior Frontend Engineer (React/TypeScript) - WebScale Inc.

ABOUT THE ROLE
WebScale Inc. is seeking a Senior Frontend Engineer to join our Core UI Platform team. You will lead the development of our flagship product dashboards, build reusable component libraries, and spearhead the migration of our remaining legacy codebases to Next.js and TypeScript.

KEY RESPONSIBILITIES
- Architect and develop high-performance, responsive single-page applications using React and Next.js.
- Champion TypeScript adoption across the frontend organization, maintaining strict typing and code quality.
- Design, build, and document reusable, accessible components complying with WCAG 2.1 AA standards.
- Optimize client-side rendering performance, state management (using Zustand or Redux Toolkit), and core web vitals.
- Conduct thorough code reviews, mentor junior engineers, and drive best practices in testing (Jest, Cypress).

REQUIREMENTS
- 6+ years of professional software engineering experience.
- Deep, expert-level understanding of React, Next.js, and modern CSS (Tailwind CSS, CSS-in-JS).
- Strong proficiency in TypeScript, including advanced types, generics, and configuration.
- Proven experience with state management libraries like Zustand, Redux Toolkit, or Jotai.
- Hands-on experience with end-to-end testing frameworks like Cypress or Playwright.
- Excellent communication skills and experience working in cross-functional agile teams.`
  },
  {
    id: "data-scientist",
    roleName: "Lead Data Scientist",
    companyName: "InsightAI Corp",
    resumeText: `SATYA MISHRA
Data Analyst & AI Enthusiast
Email: satya@example.com | Phone: +1 555-019-2834 | New York, NY

SUMMARY
Detail-oriented Data Analyst with 3+ years of experience analyzing business metrics, building SQL queries, and creating Tableau dashboards. Proficient in Python, Pandas, and machine learning fundamentals. Looking to transition into a Data Scientist role to build advanced predictive models.

EXPERIENCE
Data Analyst | FinanceGroup (2023 - Present)
- Designed and maintained complex SQL queries to extract data from PostgreSQL databases, reducing query times by 20%.
- Created interactive BI dashboards in Tableau to track daily transactional volume and company-wide financial KPIs.
- Performed statistical ad-hoc analyses using Python (Pandas, NumPy) to identify seasonal trends.
- Collaborated with database administrators to ensure data integrity and cleanliness.

Junior Data Scientist | StartupHub (2021 - 2023)
- Assisted in clean-up and preprocessing of large datasets using Pandas.
- Trained basic regression models in Scikit-Learn to predict customer churn rates, achieving 78% accuracy.
- Documented data pipelines and analytical findings in Jupyter Notebooks.
- Visualized predictive outputs using Matplotlib and Seaborn for executive presentations.

SKILLS
- Languages: Python, SQL (PostgreSQL, MySQL), R (Basic)
- Libraries: Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn
- Visualization: Tableau, Power BI, Excel
- Tools: Git, Jupyter Notebooks, PostgreSQL, Anaconda`,
    jdText: `Lead Data Scientist (Machine Learning & LLMs) - InsightAI Corp

POSITION OVERVIEW
InsightAI Corp is looking for an experienced Lead Data Scientist to join our Advanced Analytics division. In this role, you will design, deploy, and monitor scalable machine learning models, build predictive analytics pipelines, and integrate state-of-the-art Large Language Models (LLMs) to enhance our customer insights product suite.

RESPONSIBILITIES
- Lead the end-to-end design, development, and deployment of predictive models (classification, regression, clustering) in production.
- Build robust, clean, and optimized data pipelines using PySpark, AWS Glue, and SQL on massive enterprise data lakes.
- Fine-tune and evaluate LLMs (using libraries like Hugging Face, LangChain) for document semantic search, automated summarization, and query processing.
- Design rigorous A/B experiments to validate model impact and present analytical results to senior executives.
- Establish MLOps standards for model tracking, deployment (Docker, Kubernetes), and drift detection.

QUALIFICATIONS
- Master's or Ph.D. in Computer Science, Statistics, Mathematics, or a highly quantitative field.
- 5+ years of hands-on experience building and deploying machine learning models in production.
- Expert-level Python programming and deep proficiency in PyTorch, TensorFlow, Scikit-Learn, and Hugging Face Transformers.
- Deep expertise with cloud environments (specifically AWS or GCP) and big data technologies (Spark, Databricks).
- Hands-on experience with MLOps tools (MLflow, Kubeflow) and containerization (Docker, Kubernetes).`
  },
  {
    id: "product-manager",
    roleName: "Technical Product Manager",
    companyName: "NovaSaaS Labs",
    resumeText: `SATYA MISHRA
Technical Product Manager
Email: satya@example.com | Phone: +1 555-019-2834 | Austin, TX

SUMMARY
Strategic Technical Product Manager with 4+ years of experience leading cross-functional teams to design and build digital B2B solutions. Proven track record of launching web products, collecting user feedback, and coordinating engineering sprints. Skilled in writing product requirements and analyzing metrics.

EXPERIENCE
Product Manager | SaaSify (2022 - Present)
- Managed the lifecycle of a B2B billing dashboard, leading to a 25% decrease in developer integration friction.
- Wrote clear product requirements documents (PRDs) and user stories for an engineering team of 8 developers.
- Conducted 30+ user interviews, synthesizing feedback into a prioritized product roadmap.
- Defined and tracked core product KPIs using Mixpanel and Google Analytics.

Associate Product Manager | DevTools Ltd (2020 - 2022)
- Collaborated with lead PMs to manage sprint backlogs, run scrum meetings, and coordinate bi-weekly release notes.
- Performed market and competitive analysis to identify product expansion opportunities.
- Coordinated with customer support to identify, prioritize, and resolve major platform bugs.
- Designed early-stage low-fidelity product wireframes in Figma.

SKILLS
- Product: Product Roadmapping, PRDs, User Research, Agile/Scrum, Backlog Grooming, Figma Wireframing
- Analytics: Mixpanel, Google Analytics, Amplitude, Excel, SQL
- Communication: Jira, Confluence, Slack, Cross-functional alignment`,
    jdText: `Technical Product Manager (API & Platform) - NovaSaaS Labs

THE OPPORTUNITY
NovaSaaS Labs is seeking a Technical Product Manager to own our Developer API platform. You will be responsible for defining the strategy, roadmap, and core features of our public REST and GraphQL APIs, webhooks, and developer portal, enabling developers worldwide to seamlessly build integrations on top of NovaSaaS.

WHAT YOU'LL DO
- Define and execute the product vision and roadmap for NovaSaaS APIs, Developer Portal, and partner integration SDKs.
- Translate highly technical system architectures into user-centric product requirements, writing detailed API specs, schemas, and developer-friendly guides.
- Work intimately with engineering architects to optimize API latency, rate limiting policies, and authentication (OAuth2) standards.
- Partner with developer relations and marketing to cultivate a thriving third-party developer ecosystem.
- Deeply analyze developer integration analytics, error rates, and API usage patterns to inform future enhancements.

WHO YOU ARE
- Bachelor's degree in Computer Science, Engineering, or a related technical field (or equivalent practical experience).
- 3+ years of product management experience, specifically owning API platforms, SaaS infrastructure, or developer tools.
- Strong technical literacy with solid understanding of REST, GraphQL, gRPC, OAuth2, and cloud architectures.
- Experience with analytics tools (Amplitude, Datadog) and writing SQL to query user behavior data.
- Outstanding empathy for external developers and a passion for creating pristine documentation and DX (Developer Experience).`
  }
];
