import { automations, type Automation, type InsertAutomation, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Automation methods
  getAllAutomations(): Promise<Automation[]>;
  getAutomationsByCategory(category: string): Promise<Automation[]>;
  searchAutomations(query: string): Promise<Automation[]>;
  getAutomationById(id: number): Promise<Automation | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private automations: Map<number, Automation>;
  currentUserId: number;
  currentAutomationId: number;

  constructor() {
    this.users = new Map();
    this.automations = new Map();
    this.currentUserId = 1;
    this.currentAutomationId = 1;
    this.initializeAutomations();
  }

  private initializeAutomations() {
    const automationData: Omit<Automation, 'id'>[] = [
      {
        title: "Automatically Save Gmail Attachments to Google Drive",
        description: "This Zap automatically saves you hours of manual work by organizing your client files, invoices, or important documents, ensuring nothing gets lost in your inbox.",
        category: "marketing",
        badge: "Popular",
        apps: ["Gmail", "Google Drive"],
        trigger: "Gmail - New Attachment. Connect your Gmail account. You can optionally specify a label or sender to watch (e.g., only watch for emails with the label 'Invoices').",
        action: "Google Drive - Upload File. Connect your Google Drive account and configure: Drive: Select 'My Google Drive', Folder: Choose the specific folder where you want attachments to be saved, File: Select the 'Attachment' data pill from the Gmail trigger step, File Name: Use the 'Subject' or 'From Name' from the Gmail trigger step as the file name.",
        proTip: "Add a Filter by Zapier step between the trigger and action to only proceed if the attachment's file name contains specific keywords like 'invoice' or 'report'.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 95
      },
      {
        title: "Add New Form Submissions to CRM",
        description: "Never miss a lead again! This automation instantly adds new form submissions to your CRM, ensuring immediate follow-up and better lead management.",
        category: "marketing",
        badge: "Essential",
        apps: ["Google Forms", "HubSpot"],
        trigger: "Google Forms - New Form Response. Connect your Google account and select the specific form you want to monitor for new submissions.",
        action: "HubSpot - Create Contact. Map form fields to CRM fields: Email: Use the email field from the form, First Name: Map to the name field, Company: Map to the company field if available, Lead Source: Set to 'Website Form' or the specific form name.",
        proTip: "Add a second action to send a Slack notification to your sales team when a high-value lead submits a form, based on company size or budget indicated in the form.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 90
      },
      {
        title: "Auto-Post Blog Content to Social Media",
        description: "Maximize your content reach by automatically sharing new blog posts across all your social media platforms, saving hours of manual posting.",
        category: "marketing",
        badge: "Content",
        apps: ["RSS by Zapier", "Twitter", "LinkedIn"],
        trigger: "RSS by Zapier - New Item in Feed. Enter your blog's RSS feed URL (usually yoursite.com/feed or yoursite.com/rss).",
        action: "Twitter - Create Tweet. Create an engaging tweet format: Message: 'New blog post: [Title] [Link] #hashtags', Include relevant hashtags for your industry.",
        proTip: "Use Delay by Zapier to stagger your social media posts - post to Twitter immediately, LinkedIn after 1 hour, and Facebook after 2 hours to maximize engagement.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 85
      },
      {
        title: "Score Leads Based on Website Activity",
        description: "Automatically identify your hottest leads by tracking website behavior and updating lead scores in your CRM, helping sales focus on the most promising prospects.",
        category: "marketing",
        badge: "Advanced",
        apps: ["Google Analytics", "HubSpot", "Webhooks by Zapier"],
        trigger: "Webhooks by Zapier - Catch Hook. Set up website tracking to send data when users visit key pages like pricing, demo, or contact pages.",
        action: "HubSpot - Update Contact. Update lead score based on page visited: Pricing page: +10 points, Demo request: +25 points, Contact page: +15 points, Blog post: +5 points.",
        proTip: "Add a Filter step to trigger a sales notification when a lead's score reaches 50+ points, indicating they're ready for direct outreach.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 70
      },
      {
        title: "Send Welcome Email Series to New Subscribers",
        description: "Nurture new subscribers automatically with a personalized welcome email series that builds relationships and drives engagement from day one.",
        category: "marketing",
        badge: "Popular",
        apps: ["Mailchimp", "ConvertKit", "Delay by Zapier"],
        trigger: "Mailchimp - New Subscriber. Connect your Mailchimp account and select the audience you want to monitor for new subscribers.",
        action: "ConvertKit - Add Tag to Subscriber. Add subscriber to welcome sequence: Email: Use subscriber email from trigger, Tag: 'Welcome Series', Sequence: Add to automated welcome email sequence.",
        proTip: "Segment your welcome series based on the signup source (blog, social media, paid ads) to send more targeted content that resonates with each audience.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 88
      },
      {
        title: "Track Social Media Mentions",
        description: "Stay on top of your brand reputation by automatically tracking mentions across social media platforms and getting instant notifications for engagement opportunities.",
        category: "marketing",
        badge: "Monitoring",
        apps: ["Twitter", "Slack", "Google Sheets"],
        trigger: "Twitter - New Mention. Set up monitoring for your brand name, product names, or relevant keywords.",
        action: "Slack - Send Message. Send immediate notifications to your marketing team with mention details, sentiment, and engagement metrics.",
        proTip: "Set up different notification channels for positive vs. negative mentions to prioritize your response strategy effectively.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 75
      },
      {
        title: "Generate Marketing Reports",
        description: "Automatically compile marketing performance data from multiple sources into comprehensive reports, saving hours of manual data gathering.",
        category: "marketing",
        badge: "Analytics",
        apps: ["Google Analytics", "Facebook Ads", "Google Sheets"],
        trigger: "Schedule by Zapier - Every Week. Set up weekly reporting schedule to compile data from all marketing channels.",
        action: "Google Sheets - Create Spreadsheet Row. Compile data including website traffic, social media engagement, ad performance, and conversion metrics.",
        proTip: "Schedule this automation to run weekly and automatically email the report to stakeholders using Gmail integration.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 78
      },
      {
        title: "Update CRM with Email Engagement",
        description: "Keep your CRM updated with email engagement data to help sales teams understand prospect interest and tailor their outreach accordingly.",
        category: "marketing",
        badge: "Integration",
        apps: ["Mailchimp", "Salesforce", "Filter by Zapier"],
        trigger: "Mailchimp - Campaign Sent. Monitor email campaigns for opens, clicks, and engagement metrics.",
        action: "Salesforce - Update Contact. Update contact records with engagement data: Email Opened: Add engagement tag, Link Clicked: Increase lead score, Unsubscribed: Update contact status.",
        proTip: "Create different automation paths for different engagement levels - opened emails get one tag, clicked links get another, helping sales prioritize follow-ups.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 72
      },
      {
        title: "Send Order Confirmation Emails",
        description: "Provide immediate order confirmation to customers with detailed information, building trust and reducing support inquiries about order status.",
        category: "sales",
        badge: "Essential",
        apps: ["Shopify", "Gmail", "Formatter by Zapier"],
        trigger: "Shopify - New Order. Monitor your Shopify store for new orders and gather all order details.",
        action: "Gmail - Send Email. Send personalized confirmation emails with order details, shipping information, and tracking numbers.",
        proTip: "Include personalized product recommendations in your confirmation emails based on the customer's purchase history to increase repeat sales.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 92
      },
      {
        title: "Track High-Value Orders",
        description: "Get instant notifications for high-value orders so you can provide VIP customer service and ensure smooth fulfillment of important purchases.",
        category: "sales",
        badge: "Premium",
        apps: ["WooCommerce", "Slack", "Filter by Zapier"],
        trigger: "WooCommerce - New Order. Monitor your WooCommerce store for new orders and filter by order value.",
        action: "Slack - Send Message. Send immediate notifications to your team for orders above a certain threshold with customer and order details.",
        proTip: "Create different alert channels for different order values - $500+ goes to sales team, $1000+ goes to management, $5000+ goes to CEO.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 80
      },
      {
        title: "Follow Up on Abandoned Carts",
        description: "Recover lost sales by automatically sending personalized follow-up emails to customers who abandon their shopping carts, often recovering 10-30% of lost revenue.",
        category: "sales",
        badge: "Revenue",
        apps: ["Shopify", "Mailchimp", "Delay by Zapier"],
        trigger: "Shopify - Abandoned Cart. Monitor for customers who add items to cart but don't complete purchase.",
        action: "Mailchimp - Send Email. Send personalized recovery emails with cart contents, customer name, and incentives to complete purchase.",
        proTip: "Send a series of emails: first reminder after 1 hour, second after 24 hours with a small discount, and final reminder after 72 hours with a larger discount.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 87
      },
      {
        title: "Create Customer Support Tickets",
        description: "Automatically create support tickets from customer inquiries, ensuring no customer request falls through the cracks and improving response times.",
        category: "sales",
        badge: "Support",
        apps: ["Gmail", "Zendesk", "Filter by Zapier"],
        trigger: "Gmail - New Email. Monitor support email addresses for new customer inquiries and questions.",
        action: "Zendesk - Create Ticket. Create support tickets with customer information, inquiry details, and appropriate priority levels.",
        proTip: "Use keywords in the email subject line to automatically categorize tickets (e.g., 'bug', 'billing', 'feature request') and route them to the appropriate team.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 83
      },
      {
        title: "Update Inventory Across Platforms",
        description: "Keep inventory levels synchronized across multiple sales channels to prevent overselling and maintain accurate stock levels everywhere you sell.",
        category: "sales",
        badge: "Sync",
        apps: ["Shopify", "eBay", "Amazon Seller Central"],
        trigger: "Shopify - Updated Product. Monitor your main store for inventory changes and product updates.",
        action: "eBay - Update Listing. Sync inventory levels, pricing, and product information across all selling platforms.",
        proTip: "Set up low-stock alerts to automatically notify you when inventory falls below a certain threshold, so you can reorder before running out.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 76
      },
      {
        title: "Generate Sales Reports",
        description: "Automatically compile comprehensive sales reports with key metrics and insights, saving hours of manual data analysis and helping make data-driven decisions.",
        category: "sales",
        badge: "Analytics",
        apps: ["Shopify", "Google Sheets", "Schedule by Zapier"],
        trigger: "Schedule by Zapier - Every Month. Set up monthly reporting schedule to compile sales data and performance metrics.",
        action: "Google Sheets - Create Spreadsheet Row. Compile sales data including revenue, orders, top products, and customer analytics.",
        proTip: "Schedule this automation to run monthly and automatically email the report to stakeholders, including charts and trend analysis for better insights.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 81
      },
      {
        title: "Create Tasks from Emails",
        description: "Turn important emails into actionable tasks automatically, ensuring nothing gets lost in your inbox and maintaining clear project organization.",
        category: "project",
        badge: "Essential",
        apps: ["Gmail", "Asana", "Filter by Zapier"],
        trigger: "Gmail - New Email. Monitor specific email addresses or labels for emails that require action or follow-up.",
        action: "Asana - Create Task. Create tasks with email content, set due dates, assign team members, and organize into appropriate projects.",
        proTip: "Use email labels or specific sender addresses to automatically assign tasks to the right team members and set appropriate due dates based on urgency keywords.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 89
      },
      {
        title: "Send Slack Notifications for Project Updates",
        description: "Keep your team instantly informed about project progress with automated Slack notifications, improving communication and reducing status update meetings.",
        category: "project",
        badge: "Team",
        apps: ["Trello", "Slack", "Filter by Zapier"],
        trigger: "Trello - Card Moved. Monitor project boards for card movements, updates, and status changes.",
        action: "Slack - Send Message. Send notifications to relevant team channels with project updates, assignee changes, and deadline reminders.",
        proTip: "Create different Slack channels for different project types or urgency levels, and customize the notification format to include relevant project details and next steps.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 84
      },
      {
        title: "Track Time Across Projects",
        description: "Automatically track time spent on different projects and generate accurate billing reports, ensuring you never miss billable hours again.",
        category: "project",
        badge: "Tracking",
        apps: ["Toggl", "Google Sheets", "Schedule by Zapier"],
        trigger: "Toggl - New Time Entry. Monitor time tracking for all projects and team members.",
        action: "Google Sheets - Create Spreadsheet Row. Log time entries with project details, team member, hourly rates, and billing information.",
        proTip: "Set up automatic weekly time reports that are sent to project managers and clients, including project progress and budget utilization summaries.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 77
      },
      {
        title: "Backup Project Files",
        description: "Protect your valuable project files by automatically backing them up to cloud storage, ensuring you never lose important work due to hardware failures or accidents.",
        category: "project",
        badge: "Security",
        apps: ["Google Drive", "Dropbox", "Schedule by Zapier"],
        trigger: "Schedule by Zapier - Every Day. Set up daily backup schedule for critical project files and documents.",
        action: "Dropbox - Upload File. Create organized backup folders with date stamps and sync important project files across storage platforms.",
        proTip: "Create date-stamped backup folders and set up notifications to confirm successful backups, giving you peace of mind about your data security.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 79
      },
      {
        title: "Generate Project Status Reports",
        description: "Automatically compile comprehensive project status reports with progress metrics, helping stakeholders stay informed without manual report creation.",
        category: "project",
        badge: "Reporting",
        apps: ["Asana", "Google Sheets", "Gmail"],
        trigger: "Schedule by Zapier - Every Week. Set up weekly reporting schedule to compile project progress and status updates.",
        action: "Google Sheets - Create Spreadsheet Row. Compile project data including task completion, milestone progress, team productivity, and budget utilization.",
        proTip: "Include visual progress charts and highlight both completed milestones and upcoming deadlines to make reports more engaging and actionable.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 74
      },
      {
        title: "Sync Calendar Events with Project Tasks",
        description: "Keep your calendar and project management system in perfect sync, ensuring deadlines are visible in your daily schedule and nothing gets forgotten.",
        category: "project",
        badge: "Sync",
        apps: ["Google Calendar", "Monday.com", "Filter by Zapier"],
        trigger: "Monday.com - New Item. Monitor project boards for new tasks, deadlines, and milestone creation.",
        action: "Google Calendar - Create Event. Create calendar events for project deadlines, meetings, and important milestones with appropriate reminders.",
        proTip: "Use different calendar colors for different project types and set up automatic reminders 24 hours before task deadlines to ensure nothing slips through the cracks.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 73
      },
      {
        title: "Client Communication Automation",
        description: "Keep clients informed with automated progress updates and milestone notifications, improving client satisfaction and reducing manual communication overhead.",
        category: "project",
        badge: "Client",
        apps: ["Basecamp", "Gmail", "Formatter by Zapier"],
        trigger: "Basecamp - New Message. Monitor project communication and milestone completion for client updates.",
        action: "Gmail - Send Email. Send automated progress updates to clients with project status, completed milestones, and next steps.",
        proTip: "Personalize automated emails with project-specific details and include next steps or action items to keep clients engaged and informed about the project timeline.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 71
      },
      {
        title: "Create Social Media Content Calendar",
        description: "Automatically populate your content calendar with scheduled posts across multiple platforms, ensuring consistent social media presence without manual planning.",
        category: "content",
        badge: "Planning",
        apps: ["Google Sheets", "Buffer", "Schedule by Zapier"],
        trigger: "Google Sheets - New Row. Monitor your content planning spreadsheet for new content ideas and scheduled posts.",
        action: "Buffer - Create Post. Schedule posts across multiple social media platforms with optimized timing and platform-specific formatting.",
        proTip: "Use different posting schedules for different content types - educational content in the morning, engaging content in the afternoon, and promotional content in the evening for maximum impact.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 82
      },
      {
        title: "Curate Content from Multiple Sources",
        description: "Automatically collect and organize relevant content from various sources for your content marketing efforts, saving hours of manual research and curation.",
        category: "content",
        badge: "Curation",
        apps: ["RSS by Zapier", "Notion", "Filter by Zapier"],
        trigger: "RSS by Zapier - New Item in Feed. Monitor multiple RSS feeds from industry publications, blogs, and news sources.",
        action: "Notion - Create Database Item. Organize curated content in a structured database with tags, source information, and relevance scores.",
        proTip: "Set up keyword filters to only capture content relevant to your niche and automatically tag content by topic for easier organization and future reference.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 76
      },
      {
        title: "Cross-Post Content to Multiple Platforms",
        description: "Maximize your content reach by automatically publishing the same content across multiple social media platforms with platform-specific optimizations.",
        category: "content",
        badge: "Distribution",
        apps: ["Instagram", "Facebook", "Twitter"],
        trigger: "Instagram - New Photo. Monitor your main social media account for new content posts.",
        action: "Facebook - Create Post. Automatically share content to other platforms with customized messaging and formatting for each platform.",
        proTip: "Customize the message format for each platform - use hashtags for Instagram, mentions for Twitter, and longer descriptions for Facebook to optimize engagement on each platform.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 78
      },
      {
        title: "Track Content Performance",
        description: "Automatically collect and analyze content performance metrics across all platforms, helping you understand what resonates with your audience and optimize your content strategy.",
        category: "content",
        badge: "Analytics",
        apps: ["Google Analytics", "Facebook Insights", "Google Sheets"],
        trigger: "Schedule by Zapier - Every Week. Set up weekly data collection for content performance across all platforms.",
        action: "Google Sheets - Create Spreadsheet Row. Compile performance metrics including reach, engagement, clicks, and conversions for each piece of content.",
        proTip: "Set up weekly performance reports that highlight top-performing content and identify trends, helping you replicate successful content strategies.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 80
      },
      {
        title: "Auto-Generate Content Ideas",
        description: "Never run out of content ideas by automatically generating topic suggestions based on trending topics, keywords, and audience interests.",
        category: "content",
        badge: "Ideas",
        apps: ["Google Trends", "Airtable", "RSS by Zapier"],
        trigger: "Google Trends - New Trending Topic. Monitor trending topics and keywords in your industry for content inspiration.",
        action: "Airtable - Create Record. Generate and organize content ideas with trend data, keyword information, and content type suggestions.",
        proTip: "Combine trending topics with your brand keywords and industry insights to generate content ideas that are both timely and relevant to your audience.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 75
      },
      {
        title: "Save Articles for Later Reading",
        description: "Automatically save interesting articles you find online to a reading list, helping you stay organized and never lose track of valuable content.",
        category: "productivity",
        badge: "Reading",
        apps: ["Pocket", "Twitter", "Filter by Zapier"],
        trigger: "Twitter - New Tweet by You. Monitor your Twitter activity for shared articles and interesting links.",
        action: "Pocket - Save Item. Automatically save articles, blog posts, and resources to your reading list with tags and categories.",
        proTip: "Use tags to categorize saved articles by topic or priority, making it easier to find relevant content when you have time to read.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 73
      },
      {
        title: "Track Personal Expenses",
        description: "Automatically track and categorize your expenses from multiple sources, making budgeting and tax preparation much easier and more accurate.",
        category: "productivity",
        badge: "Finance",
        apps: ["Gmail", "Google Sheets", "Formatter by Zapier"],
        trigger: "Gmail - New Email. Monitor your email for receipts, invoices, and expense-related emails from various sources.",
        action: "Google Sheets - Create Spreadsheet Row. Extract expense information and categorize spending with amounts, dates, vendors, and categories.",
        proTip: "Set up automatic categorization rules based on keywords in email receipts and create monthly budget reports to track your spending patterns.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 79
      },
      {
        title: "Create Daily Agenda",
        description: "Start each day with a personalized agenda that includes your calendar events, tasks, and priorities, helping you stay organized and focused.",
        category: "productivity",
        badge: "Planning",
        apps: ["Google Calendar", "Todoist", "Gmail"],
        trigger: "Schedule by Zapier - Every Day. Set up daily schedule to compile your agenda and daily priorities.",
        action: "Gmail - Send Email. Send yourself a daily agenda email with calendar events, task priorities, and important reminders.",
        proTip: "Include weather information and inspirational quotes in your daily agenda to make it more engaging and help you start the day positively.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 77
      },
      {
        title: "Backup Important Files",
        description: "Protect your important personal and work files by automatically backing them up to multiple cloud storage services, ensuring you never lose critical data.",
        category: "productivity",
        badge: "Security",
        apps: ["Google Drive", "Dropbox", "OneDrive"],
        trigger: "Google Drive - New File. Monitor your primary cloud storage for new or updated important files.",
        action: "Dropbox - Upload File. Create redundant backups across multiple cloud storage platforms for critical files and documents.",
        proTip: "Set up versioning for your backups and create a rotation schedule to keep multiple versions of important files, giving you recovery options for different time periods.",
        videoId: "YOUTUBE_VIDEO_ID_PLACEHOLDER",
        popularity: 81
      }
    ];

    automationData.forEach((automation, index) => {
      const id = this.currentAutomationId++;
      this.automations.set(id, { id, ...automation });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAutomations(): Promise<Automation[]> {
    return Array.from(this.automations.values());
  }

  async getAutomationsByCategory(category: string): Promise<Automation[]> {
    return Array.from(this.automations.values()).filter(
      (automation) => automation.category === category
    );
  }

  async searchAutomations(query: string): Promise<Automation[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.automations.values()).filter(
      (automation) => 
        automation.title.toLowerCase().includes(lowercaseQuery) ||
        automation.description.toLowerCase().includes(lowercaseQuery) ||
        automation.apps.some(app => app.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getAutomationById(id: number): Promise<Automation | undefined> {
    return this.automations.get(id);
  }
}

export const storage = new MemStorage();
