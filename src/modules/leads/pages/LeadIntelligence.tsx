import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../../shared/components/card";
import { Badge } from "../../../shared/components/badge";
import { Button } from "../../../shared/components/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../shared/components/avatar";
import { Separator } from "../../../shared/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shared/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/select";
import { Textarea } from "../../../shared/components/textarea";
import { Input } from "../../../shared/components/input";
import { Label } from "../../../shared/components/label";
import { Progress } from "../../../shared/components/progress";
import { Switch } from "../../../shared/components/switch";
import { Checkbox } from "../../../shared/components/checkbox";
import { useToast } from "../../../shared/hooks/use-toast";
import {
  Mail,
  MessageSquare,
  Clock,
  Eye,
  Sparkles,
  FileText,
  TrendingUp,
  MapPin,
  Building,
  User,
  Star,
  Copy,
  RefreshCw,
  Send,
  Check,
  Phone,
  Video,
  Calendar,
  History,
  Edit3,
  ArrowRight,
  ArrowLeft,
  GitCompare,
  Download,
  Share,
  Settings,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  ExternalLink,
  Zap,
  Target,
  Users,
  Briefcase,
  BarChart3,
  PieChart,
  LineChart,
  DollarSign,
  Percent,
  Globe,
  LinkIcon,
  Bell,
  Play,
  Pause,
  SkipForward,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Workflow,
  Database,
  Shield,
  Mic,
  Camera,
  FileDown,
  Layers,
  Brain,
  Radar,
  Activity,
  Gauge,
  Network,
  Webhook,
  Bot,
  Lightbulb,
  Trophy,
  Rocket,
  Timer,
  CircleDot,
  Flame,
  Snowflake,
  TrendingDown,
} from "lucide-react";
import { apiService } from "../../../services/api";

type MainSection =
  | "overview"
  | "communication"
  | "analytics"
  | "automation"
  | "timeline"
  | "notes"
  | "team";
type CommunicationType =
  | "cold-email"
  | "linkedin"
  | "follow-up"
  | "video-call"
  | "audio-call"
  | "meeting";
type CommunicationTab = "compose" | "history" | "sequences" | "templates";

interface CommunicationMessage {
  id: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  tone: string;
  template: string;
  timestamp: string;
  status:
    | "draft"
    | "sent"
    | "replied"
    | "opened"
    | "scheduled"
    | "bounced"
    | "clicked";
  metrics?: {
    opens?: number;
    clicks?: number;
    replies?: number;
    sentiment?: "positive" | "neutral" | "negative";
  };
  aiScore?: number;
  sequenceId?: string;
}

interface LeadScore {
  overall: number;
  engagement: number;
  fitScore: number;
  intentScore: number;
  responseRate: number;
  factors: {
    positive: string[];
    negative: string[];
  };
}

interface CompanyIntel {
  fundingStage: string;
  lastFunding: string;
  growthRate: string;
  recentNews: string[];
  technicalStack: string[];
  competitors: string[];
  decisionMakers: number;
  budgetEstimate: string;
}

const LeadIntelligence = () => {
  const [activeSection, setActiveSection] = useState<MainSection>("overview");
  const [communicationType, setCommunicationType] =
    useState<CommunicationType>("cold-email");
  const [communicationTab, setCommunicationTab] =
    useState<CommunicationTab>("compose");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [autoSequenceEnabled, setAutoSequenceEnabled] = useState(false);
  const { userId } = useParams();
  const [valid, setValid] = useState<null | boolean>(null);
  const { toast } = useToast();
  const [leadData, setLeadData] = useState({
    name: "Sarah Chen",
    title: "VP of Engineering",
    company: "TechFlow Inc.",
    location: "San Francisco, CA",
    score: "hot" as const,
    status: "Contacted",
    email: "sarah.chen@techflow.com",
    phone: "+1 (555) 123-4567",
    linkedinProfile: null,
    linkedin: "linkedin.com/in/sarahchen",
    avatar: "/placeholder.svg",
    tags: [
      "Recently Promoted",
      "Hiring",
      "Active Poster",
      "Budget Holder",
      "Tech Leader",
    ],
    intentScore: 85,
    companySize: "500-1000",
    industry: "SaaS",
    technologies: [
      "AWS",
      "React",
      "Node.js",
      "PostgreSQL",
      "Kubernetes",
      "Docker",
    ],
    painPoints: [
      "Infrastructure Scaling",
      "Cost Optimization",
      "Team Management",
      "Security Compliance",
    ],
    profileData: {
      about:
        "VP of Engineering at TechFlow Inc. Leading a team of 50+ engineers. Passionate about scaling infrastructure and building high-performance teams.",
      skills: [
        "Engineering Leadership",
        "Cloud Infrastructure",
        "Team Building",
        "Product Strategy",
        "Agile Management",
      ],
      positions: [
        {
          title: "VP of Engineering",
          company: "TechFlow Inc.",
          duration: "2022 - Present",
        },
        {
          title: "Senior Engineering Manager",
          company: "CloudScale",
          duration: "2019 - 2022",
        },
        { title: "Tech Lead", company: "StartupXYZ", duration: "2017 - 2019" },
      ],
    },
  });

  // const leadData = {
  //   name: "Sarah Chen",
  //   title: "VP of Engineering",
  //   company: "TechFlow Inc.",
  //   location: "San Francisco, CA",
  //   score: "hot" as const,
  //   status: "Contacted",
  //   email: "sarah.chen@techflow.com",
  //   phone: "+1 (555) 123-4567",
  //   linkedin: "linkedin.com/in/sarahchen",
  //   avatar: "/placeholder.svg",
  //   tags: [
  //     "Recently Promoted",
  //     "Hiring",
  //     "Active Poster",
  //     "Budget Holder",
  //     "Tech Leader",
  //   ],
  //   intentScore: 85,
  //   companySize: "500-1000",
  //   industry: "SaaS",
  //   technologies: [
  //     "AWS",
  //     "React",
  //     "Node.js",
  //     "PostgreSQL",
  //     "Kubernetes",
  //     "Docker",
  //   ],
  //   painPoints: [
  //     "Infrastructure Scaling",
  //     "Cost Optimization",
  //     "Team Management",
  //     "Security Compliance",
  //   ],
  //   profileData: {
  //     about:
  //       "VP of Engineering at TechFlow Inc. Leading a team of 50+ engineers. Passionate about scaling infrastructure and building high-performance teams.",
  //     skills: [
  //       "Engineering Leadership",
  //       "Cloud Infrastructure",
  //       "Team Building",
  //       "Product Strategy",
  //       "Agile Management",
  //     ],
  //     positions: [
  //       {
  //         title: "VP of Engineering",
  //         company: "TechFlow Inc.",
  //         duration: "2022 - Present",
  //       },
  //       {
  //         title: "Senior Engineering Manager",
  //         company: "CloudScale",
  //         duration: "2019 - 2022",
  //       },
  //       { title: "Tech Lead", company: "StartupXYZ", duration: "2017 - 2019" },
  //     ],
  //   },
  // };

  const leadScore: LeadScore = {
    overall: 89,
    engagement: 78,
    fitScore: 95,
    intentScore: 85,
    responseRate: 67,
    factors: {
      positive: [
        "Recent promotion",
        "Active on LinkedIn",
        "Budget authority",
        "Pain point match",
        "Company growth",
      ],
      negative: [
        "High email volume",
        "Previous vendor relationship",
        "Busy schedule",
      ],
    },
  };

  const companyIntel: CompanyIntel = {
    fundingStage: "Series B",
    lastFunding: "$50M (6 months ago)",
    growthRate: "150% YoY",
    recentNews: [
      "Raised $50M Series B funding",
      "Expanded engineering team by 200%",
      "Launched new product line",
      "Acquired startup competitor",
    ],
    technicalStack: [
      "AWS",
      "React",
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Elasticsearch",
    ],
    competitors: ["Competitor A", "Competitor B", "Competitor C"],
    decisionMakers: 3,
    budgetEstimate: "$500K - $2M annually",
  };

  const communicationTypes = [
    { id: "cold-email", label: "Cold Email", icon: Mail, color: "bg-blue-500" },
    {
      id: "linkedin",
      label: "LinkedIn Message",
      icon: MessageSquare,
      color: "bg-blue-600",
    },
    {
      id: "follow-up",
      label: "Follow-up",
      icon: RefreshCw,
      color: "bg-green-500",
    },
    {
      id: "video-call",
      label: "Video Call",
      icon: Video,
      color: "bg-purple-500",
    },
    {
      id: "audio-call",
      label: "Phone Call",
      icon: Phone,
      color: "bg-orange-500",
    },
    { id: "meeting", label: "Meeting", icon: Calendar, color: "bg-red-500" },
  ];

  const tones = [
    {
      id: "professional",
      label: "Professional",
      description: "Formal and business-focused",
    },
    { id: "casual", label: "Casual", description: "Friendly and approachable" },
    { id: "direct", label: "Direct", description: "Straight to the point" },
    { id: "playful", label: "Playful", description: "Light and engaging" },
    {
      id: "consultative",
      label: "Consultative",
      description: "Advisory and helpful",
    },
    {
      id: "urgent",
      label: "Urgent",
      description: "Time-sensitive and compelling",
    },
  ];

  const templates = {
    "cold-email": [
      "Problem-Solution Framework",
      "Social Proof Template",
      "Curiosity Gap Template",
      "Mutual Connection Template",
      "Value Proposition Template",
      "Question-Based Opening",
      "AIDA Framework",
      "PAS (Problem-Agitate-Solution)",
    ],
    linkedin: [
      "Connection Request",
      "InMail Template",
      "Follow-up Message",
      "Introduction Template",
      "Event Follow-up",
      "Content Engagement",
      "Referral Request",
      "Partnership Inquiry",
    ],
    "follow-up": [
      "First Follow-up",
      "Second Follow-up",
      "Final Follow-up",
      "Break-up Email",
      "Re-engagement",
      "Meeting Reminder",
      "Value-add Follow-up",
      "Competitor Mention",
    ],
  };

  const sampleMessages: CommunicationMessage[] = [
    {
      id: "1",
      type: "cold-email",
      subject: "Quick question about TechFlow's infrastructure scaling",
      content: `Hi Sarah,\n\nI noticed your recent LinkedIn post about scaling infrastructure at TechFlow - the challenges you mentioned around handling 10x growth really resonated with me.\n\nI'm reaching out because I've been working with VP's of Engineering at similar high-growth companies who've faced the exact same scaling bottlenecks you described. Companies like CloudScale and StartupXYZ have used our platform to reduce infrastructure costs by 40% while improving performance.\n\nGiven your background and TechFlow's current growth trajectory, I'd love to show you how we helped CloudScale's engineering team (similar size to yours) solve their scaling challenges in just 8 weeks.\n\nWould you be open to a brief 15-minute conversation this week?\n\nBest regards,\nAlex`,
      tone: "professional",
      template: "Problem-Solution Framework",
      timestamp: "2024-01-15 10:30",
      status: "sent",
      metrics: { opens: 2, clicks: 1, replies: 0, sentiment: "neutral" },
      aiScore: 87,
      sequenceId: "seq-1",
    },
    {
      id: "2",
      type: "linkedin",
      content: `Hi Sarah, I saw your recent post about engineering leadership challenges. As someone who's helped other VPs of Engineering scale their teams efficiently, I'd love to connect and share some insights that might be valuable for TechFlow's growth.`,
      tone: "casual",
      template: "Connection Request",
      timestamp: "2024-01-14 15:45",
      status: "sent",
      metrics: { opens: 1, sentiment: "positive" },
      aiScore: 82,
    },
    {
      id: "3",
      type: "follow-up",
      subject: "Following up on infrastructure scaling discussion",
      content: `Hi Sarah,\n\nI wanted to follow up on my email from last week about infrastructure scaling solutions. I know you're busy, but I thought you might find this case study interesting - it shows how a similar company reduced their AWS costs by 45% in 60 days.\n\nWould next Tuesday or Wednesday work for a quick 10-minute call?\n\nBest,\nAlex`,
      tone: "consultative",
      template: "First Follow-up",
      timestamp: "2024-01-12 09:15",
      status: "opened",
      metrics: { opens: 3, clicks: 2, replies: 1, sentiment: "positive" },
      aiScore: 91,
      sequenceId: "seq-1",
    },
  ];

  const mainSections = [
    { id: "overview", label: "Overview", icon: User },
    { id: "communication", label: "Communication Hub", icon: MessageSquare },
    { id: "analytics", label: "Analytics & Insights", icon: BarChart3 },
    { id: "automation", label: "Automation & Sequences", icon: Workflow },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "notes", label: "Notes & Tasks", icon: FileText },
    { id: "team", label: "Team & Performance", icon: Users },
  ];

  const getScoreColor = (score: string) => {
    switch (score) {
      case "hot":
        return "bg-status-hot text-white";
      case "warm":
        return "bg-status-warm text-white";
      case "cold":
        return "bg-status-cold text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Prospect":
        return "bg-muted text-muted-foreground";
      case "Contacted":
        return "bg-primary text-primary-foreground";
      case "Replied":
        return "bg-success text-success-foreground";
      case "Qualified":
        return "bg-warning text-warning-foreground";
      case "Converted":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    toast({
      title: "AI is generating content...",
      description: `Creating personalized ${communicationType.replace(
        "-",
        " "
      )} using advanced algorithms 🧠`,
    });

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsGenerating(false);
    toast({
      title: "Content Generated Successfully! 🎯",
      description:
        "AI has created an optimized message with 89% predicted success rate",
    });
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard! 📋",
      description: "Content has been copied successfully.",
    });
  };

  const handleSend = () => {
    toast({
      title: "Message sent successfully! 🚀",
      description: `Your ${communicationType.replace(
        "-",
        " "
      )} has been delivered and is being tracked.`,
    });
  };

  const handleCompareMessages = (messageIds: string[]) => {
    if (messageIds.length === 2) {
      toast({
        title: "Comparing Messages 🔍",
        description:
          "AI analysis of message performance and optimization suggestions generated.",
      });
    }
  };

  useEffect(() => {
    console.log("Checking access for userId:", userId);
    async function checkAccess() {
      try {
        /*   const res = await fetch(`/api/verify-user/${userId}`, {
          credentials: "include", // sends cookies
        }); */
        const res = await apiService.leadProfile(userId);
        console.log("res", res);
        // const result = await res.json();
        setValid(res?.success === true);
        if (res?.success === true) {
          setLeadData({
            ...leadData,
            name: res?.data?.profileDetails?.name || "",
            title: res?.data?.profileDetails?.jobTitle || "",
            company: res?.data?.profileDetails?.companyName || "",
            location: res?.data?.profileDetails?.location || "",
            email: res?.data?.profileDetails?.email || "Missing Email",
            phone: res?.data?.profileDetails?.phone || "Missing Phone",
            linkedin: res?.data?.profileDetails?.email || "Missing LinkedIn",
            linkedinProfile: res?.data?.profileDetails?.linkedinProfile || null,
          });
        }
        // setLeadData({
        //   name: res?.data?.name || "",
        // });
      } catch (err) {
        setValid(false);
      }
    }

    checkAccess();
  }, [userId]);

  useEffect(() => {
    if (selectedMessages.length === 2) {
      handleCompareMessages(selectedMessages);
    }
  }, [selectedMessages]);

  if (valid === null) return <p>Loading...</p>;
  console.log("valid", valid);
  if (valid === false) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={leadData.avatar} alt={leadData.name} />
            <AvatarFallback>
              {leadData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-semibold text-foreground">{leadData.name}</h1>
            <p className="text-sm text-muted-foreground">{leadData.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={getScoreColor(leadData.score)}
              variant="secondary"
            >
              {leadData.score.toUpperCase()}
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-screen lg:h-auto">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-sidebar border-r border-sidebar-border overflow-y-auto">
          <div className="p-6">
            {/* Lead Overview */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        leadData.linkedinProfile
                          ? leadData.linkedinProfile
                          : leadData.avatar
                      }
                      alt={leadData.name}
                    />
                    {/* {leadData.linkedinProfile} */}
                    <AvatarFallback className="text-lg">
                      {leadData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">
                      {leadData.name}
                    </h2>
                    <p className="text-muted-foreground">{leadData.title}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Building className="h-3 w-3" />
                      {leadData.company}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {leadData.location}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  <Badge className={getScoreColor(leadData.score)}>
                    {leadData.score.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(leadData.status)}>
                    {leadData.status}
                  </Badge>
                </div>

                {/* AI Lead Score */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      AI Lead Score
                    </span>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-ai-glow" />
                      <span className="text-sm font-bold text-ai-glow">
                        {leadScore.overall}/100
                      </span>
                    </div>
                  </div>
                  <Progress value={leadScore.overall} className="h-2" />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fit:</span>
                      <span className="font-medium">{leadScore.fitScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Intent:</span>
                      <span className="font-medium">
                        {leadScore.intentScore}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engagement:</span>
                      <span className="font-medium">
                        {leadScore.engagement}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response:</span>
                      <span className="font-medium">
                        {leadScore.responseRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <nav className="space-y-1 mb-6">
              {mainSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as MainSection)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>

            {/* Quick Stats */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Performance Metrics
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Messages Sent:
                    </span>
                    <span className="text-foreground font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Open Rate:</span>
                    <span className="text-green-600 font-medium">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Response Rate:
                    </span>
                    <span className="text-blue-600 font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Conversion Rate:
                    </span>
                    <span className="text-purple-600 font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Contact:</span>
                    <span className="text-foreground">6 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Tags */}
            <Card className="mb-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Smart Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {leadData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <TrendingUp className="h-4 w-4" />
                Find Similar Leads
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Users className="h-4 w-4" />
                Company Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Network className="h-4 w-4" />
                Connection Map
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Briefcase className="h-4 w-4" />
                Export Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Navigation */}
          <div className="lg:hidden bg-white border-b border-border">
            <div className="flex overflow-x-auto p-2">
              {mainSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as MainSection)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeSection === section.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 lg:p-6">
            {activeSection === "overview" && (
              <OverviewSection
                leadData={leadData}
                companyIntel={companyIntel}
                leadScore={leadScore}
              />
            )}
            {activeSection === "communication" && (
              <CommunicationHub
                leadData={leadData}
                communicationType={communicationType}
                setCommunicationType={setCommunicationType}
                communicationTab={communicationTab}
                setCommunicationTab={setCommunicationTab}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                isGenerating={isGenerating}
                handleGenerate={handleGenerate}
                handleCopy={handleCopy}
                handleSend={handleSend}
                communicationTypes={communicationTypes}
                tones={tones}
                templates={templates}
                sampleMessages={sampleMessages}
                compareMode={compareMode}
                setCompareMode={setCompareMode}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
              />
            )}
            {activeSection === "analytics" && (
              <AnalyticsSection leadData={leadData} />
            )}
            {activeSection === "automation" && <AutomationSection />}
            {activeSection === "timeline" && <TimelineSection />}
            {activeSection === "notes" && <NotesSection />}
            {activeSection === "team" && <TeamSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

const OverviewSection = ({
  leadData,
  companyIntel,
  leadScore,
}: {
  leadData: any;
  companyIntel: CompanyIntel;
  leadScore: LeadScore;
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Lead Intelligence Overview
          </h1>
          <p className="text-muted-foreground">
            Complete profile analysis and strategic insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Zap className="h-4 w-4" />
            Quick Action
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground">{leadData.email}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(leadData.email)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Phone</Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground">{leadData.phone}</p>
                <Button variant="ghost" size="sm">
                  <Phone className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">LinkedIn</Label>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground truncate">
                  {leadData.linkedin}
                </p>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Intelligence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm text-muted-foreground">
                Funding Stage
              </Label>
              <p className="text-sm text-foreground font-medium">
                {companyIntel.fundingStage}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Last Funding
              </Label>
              <p className="text-sm text-foreground">
                {companyIntel.lastFunding}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Growth Rate
              </Label>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-sm text-green-600 font-medium">
                  {companyIntel.growthRate}
                </p>
              </div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">
                Budget Estimate
              </Label>
              <p className="text-sm text-foreground font-medium">
                {companyIntel.budgetEstimate}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Scoring Breakdown */}
        <Card className="ai-gradient">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="h-5 w-5 text-ai-glow" />
              AI Lead Scoring
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Fit Score</span>
                  <span className="font-medium">{leadScore.fitScore}%</span>
                </div>
                <Progress value={leadScore.fitScore} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Intent Score</span>
                  <span className="font-medium">{leadScore.intentScore}%</span>
                </div>
                <Progress value={leadScore.intentScore} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Engagement</span>
                  <span className="font-medium">{leadScore.engagement}%</span>
                </div>
                <Progress value={leadScore.engagement} className="h-2" />
              </div>
            </div>

            <div className="pt-3 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-ai-glow">
                  {leadScore.overall}
                </div>
                <div className="text-sm text-muted-foreground">
                  Overall Score
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Company News */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Recent Company News & Signals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companyIntel.recentNews.map((news, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="text-sm text-foreground">{news}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 days ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {companyIntel.technicalStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pain Points Analysis */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI-Identified Pain Points & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-green-600 mb-3 flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4" />
                  Positive Signals
                </h4>
                <div className="space-y-2">
                  {leadScore.factors.positive.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-orange-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Challenges to Address
                </h4>
                <div className="space-y-2">
                  {leadScore.factors.negative.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg"
                    >
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-orange-700">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface CommunicationHubProps {
  leadData: any;
  communicationType: CommunicationType;
  setCommunicationType: (type: CommunicationType) => void;
  communicationTab: CommunicationTab;
  setCommunicationTab: (tab: CommunicationTab) => void;
  selectedTone: string;
  setSelectedTone: (tone: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isGenerating: boolean;
  handleGenerate: () => void;
  handleCopy: (content: string) => void;
  handleSend: () => void;
  communicationTypes: any[];
  tones: any[];
  templates: any;
  sampleMessages: CommunicationMessage[];
  compareMode: boolean;
  setCompareMode: (mode: boolean) => void;
  selectedMessages: string[];
  setSelectedMessages: (messages: string[]) => void;
}

const CommunicationHub = ({
  leadData,
  communicationType,
  setCommunicationType,
  communicationTab,
  setCommunicationTab,
  selectedTone,
  setSelectedTone,
  selectedTemplate,
  setSelectedTemplate,
  customPrompt,
  setCustomPrompt,
  isGenerating,
  handleGenerate,
  handleCopy,
  handleSend,
  communicationTypes,
  tones,
  templates,
  sampleMessages,
  compareMode,
  setCompareMode,
  selectedMessages,
  setSelectedMessages,
}: CommunicationHubProps) => {
  const filteredMessages = sampleMessages.filter(
    (msg) => msg.type === communicationType
  );

  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Communication Hub
          </h1>
          <p className="text-muted-foreground">
            AI-powered communication management and optimization
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-ai-glow-soft rounded-full">
          <Sparkles className="h-4 w-4 text-ai-glow" />
          <span className="text-sm font-medium text-ai-glow">AI Enhanced</span>
        </div>
      </div>

      {/* Communication Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {communicationTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => setCommunicationType(type.id as CommunicationType)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                communicationType === type.id
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-2 rounded-lg ${type.color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-center">
                {type.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Communication Interface */}
      <Card className="ai-gradient">
        <CardContent className="p-6">
          <Tabs
            value={communicationTab}
            onValueChange={(value) =>
              setCommunicationTab(value as CommunicationTab)
            }
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <TabsList className="grid w-full sm:w-auto grid-cols-4">
                <TabsTrigger value="compose" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  Compose
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger value="sequences" className="gap-2">
                  <Workflow className="h-4 w-4" />
                  Sequences
                </TabsTrigger>
                <TabsTrigger value="templates" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Templates
                </TabsTrigger>
              </TabsList>

              {communicationTab === "history" && (
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <Button
                    variant={compareMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setCompareMode(!compareMode);
                      if (!compareMode) {
                        setSelectedMessages([]);
                        toast({
                          title: "Compare Mode Enabled 🔍",
                          description:
                            "Select up to 2 messages to compare performance and optimization",
                        });
                      } else {
                        toast({
                          title: "Compare Mode Disabled",
                          description: "Comparison mode has been turned off",
                        });
                      }
                    }}
                    className="gap-2"
                  >
                    <GitCompare className="h-4 w-4" />
                    Compare {compareMode && `(${selectedMessages.length}/2)`}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              )}
            </div>

            <TabsContent value="compose" className="space-y-6">
              <ComposeInterface
                communicationType={communicationType}
                selectedTone={selectedTone}
                setSelectedTone={setSelectedTone}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                customPrompt={customPrompt}
                setCustomPrompt={setCustomPrompt}
                isGenerating={isGenerating}
                handleGenerate={handleGenerate}
                handleCopy={handleCopy}
                handleSend={handleSend}
                tones={tones}
                templates={templates}
                leadData={leadData}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <HistoryInterface
                messages={filteredMessages}
                communicationType={communicationType}
                compareMode={compareMode}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
                handleCopy={handleCopy}
              />
            </TabsContent>

            <TabsContent value="sequences" className="space-y-4">
              <SequencesInterface />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <TemplatesInterface
                templates={templates}
                communicationType={communicationType}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ComposeInterface = ({
  communicationType,
  selectedTone,
  setSelectedTone,
  selectedTemplate,
  setSelectedTemplate,
  customPrompt,
  setCustomPrompt,
  isGenerating,
  handleGenerate,
  handleCopy,
  handleSend,
  tones,
  templates,
  leadData,
}: any) => {
  const getGeneratedContent = () => {
    switch (communicationType) {
      case "cold-email":
        return `Subject: Quick question about TechFlow's infrastructure scaling

Hi ${leadData.name},

I noticed your recent LinkedIn post about scaling infrastructure at TechFlow - the challenges you mentioned around handling 10x growth really resonated with me.

I'm reaching out because I've been working with VP's of Engineering at similar high-growth companies who've faced the exact same scaling bottlenecks you described. Companies like CloudScale and StartupXYZ have used our platform to reduce infrastructure costs by 40% while improving performance.

Given your background and TechFlow's current growth trajectory, I'd love to show you how we helped CloudScale's engineering team (similar size to yours) solve their scaling challenges in just 8 weeks.

Would you be open to a brief 15-minute conversation this week? I can share the specific results CloudScale achieved and how it might apply to TechFlow.

Best regards,
Alex

P.S. I saw TechFlow recently raised $50M - congratulations! This kind of growth often brings the exact infrastructure challenges our platform solves best.`;

      case "linkedin":
        return `Hi ${leadData.name}, 

I noticed your insightful post about managing 50+ engineers at TechFlow. As a fellow engineering leader who's helped scale teams at companies like yours, I'd love to connect.

I recently worked with a VP of Engineering at a similar Series B SaaS company who faced the same infrastructure scaling challenges you mentioned. We helped them reduce AWS costs by 45% while improving performance.

Would love to share some insights that might be valuable for TechFlow's continued growth. 

Best,
Alex`;

      case "follow-up":
        return `Hi ${leadData.name},

I wanted to follow up on my previous message about infrastructure scaling solutions. I know you're incredibly busy leading TechFlow's engineering team, especially with your recent $50M funding round.

I thought you might find this relevant: I just helped another Series B SaaS company (similar size to TechFlow) reduce their infrastructure costs by 45% in 60 days while improving performance by 30%.

Given TechFlow's rapid growth and your focus on scaling efficiently, would you be open to a quick 10-minute call this week? I can share the specific strategies that worked for them.

Best,
Alex

P.S. Happy to send over the case study if you'd prefer to review it first.`;

      case "video-call":
        return `Video Meeting: TechFlow Infrastructure Scaling Strategy Session

Duration: 30 minutes
Platform: Zoom (link will be provided)

Agenda:
1. Current infrastructure challenges at TechFlow (5 min)
2. Case study review - Similar company's 45% cost reduction (10 min)  
3. Custom solution walkthrough for TechFlow (10 min)
4. Q&A and next steps (5 min)

What to expect:
- Detailed analysis of your current setup
- Specific recommendations for immediate improvements
- ROI projections based on your scale
- No-pressure discussion focused on value

Meeting preparation:
- Brief overview of current infrastructure setup
- Key pain points you're experiencing
- Budget considerations (if comfortable sharing)

Looking forward to our conversation!`;

      case "audio-call":
        return `Phone Call: TechFlow Infrastructure Consultation

Duration: 15 minutes
Type: Discovery call

Discussion points:
- Your current infrastructure challenges
- Recent scaling bottlenecks you've experienced
- Quick overview of solutions that worked for similar companies
- Determine if there's a fit for further conversation

Benefits of a quick call:
✓ Get immediate answers to your scaling questions
✓ Learn about cost optimization strategies
✓ Understand how other VPs of Engineering tackled similar challenges
✓ No commitment - just valuable insights

When would work best for you this week? I have availability:
- Tuesday: 2-4 PM PST
- Wednesday: 10 AM - 12 PM PST  
- Thursday: 3-5 PM PST

Looking forward to connecting!`;

      case "meeting":
        return `In-Person Meeting Request: Strategic Infrastructure Planning Session

Purpose: Deep-dive discussion on TechFlow's infrastructure scaling strategy
Location: Your office or neutral location (SF Bay Area)
Duration: 45-60 minutes

Proposed agenda:
1. Infrastructure assessment and current challenges (15 min)
2. Detailed case studies from similar companies (15 min)
3. Custom solution design for TechFlow (20 min)
4. Implementation roadmap and next steps (10 min)

What I'll bring:
- Detailed analysis of your technology stack
- Custom ROI projections for TechFlow
- Implementation timeline and resource requirements
- References from similar engineering leaders

What would be helpful from you:
- High-level overview of current infrastructure
- Key stakeholders who should be involved
- Timeline for making decisions
- Budget parameters (if comfortable sharing)

Available dates:
- Next Tuesday, January 23rd
- Wednesday, January 24th  
- Thursday, January 25th

Would any of these work for your schedule?`;

      default:
        return "Generated content will appear here...";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                AI Recommendations
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                Based on Sarah's profile and recent activity, here are optimal
                strategies:
              </p>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>
                  • Best send time: Tuesday 2-4 PM PST (67% higher open rate)
                </li>
                <li>• Mention recent funding ($50M Series B) for relevance</li>
                <li>• Focus on cost optimization (identified pain point)</li>
                <li>
                  • Use "consultative" tone (matches her communication style)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Tone
          </Label>
          <Select value={selectedTone} onValueChange={setSelectedTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((tone) => (
                <SelectItem key={tone.id} value={tone.id}>
                  <div>
                    <div className="font-medium">{tone.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {tone.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Template
          </Label>
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates[communicationType]?.map((template: string) => (
                <SelectItem key={template} value={template}>
                  {template}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Custom Prompt
          </Label>
          <Input
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g., 'focus on ROI'"
          />
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full gap-2"
          >
            {isGenerating ? (
              <>
                <Brain className="h-4 w-4 animate-pulse" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-foreground">
            AI-Generated Content
          </Label>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Gauge className="h-3 w-3" />
              AI Score: 89%
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Target className="h-3 w-3" />
              Success Rate: 67%
            </Badge>
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4 min-h-64 relative">
          <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">
            {getGeneratedContent()}
          </pre>
          {isGenerating && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-ai-glow animate-pulse" />
                <span className="text-sm font-medium">
                  AI is analyzing and generating optimal content...
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => handleCopy(getGeneratedContent())}
            variant="outline"
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button onClick={handleSend} className="gap-2">
            <Send className="h-4 w-4" />
            Send Now
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline" className="gap-2">
            <Share className="h-4 w-4" />
            Share for Review
          </Button>
        </div>
      </div>
    </div>
  );
};

const HistoryInterface = ({
  messages,
  communicationType,
  compareMode,
  selectedMessages,
  setSelectedMessages,
  handleCopy,
}: any) => {
  const handleMessageSelect = (messageId: string) => {
    if (compareMode) {
      if (selectedMessages.includes(messageId)) {
        setSelectedMessages(
          selectedMessages.filter((id: string) => id !== messageId)
        );
      } else if (selectedMessages.length < 2) {
        setSelectedMessages([...selectedMessages, messageId]);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Send className="h-4 w-4 text-blue-500" />;
      case "opened":
        return <Eye className="h-4 w-4 text-green-500" />;
      case "replied":
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case "clicked":
        return <ExternalLink className="h-4 w-4 text-orange-500" />;
      case "draft":
        return <Edit3 className="h-4 w-4 text-gray-500" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case "bounced":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <CircleDot className="h-4 w-4 text-gray-500" />;
    }
  };

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground">No messages yet</h3>
        <p className="text-muted-foreground">
          Start composing your first {communicationType.replace("-", " ")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Comparison View */}
      {compareMode && selectedMessages.length === 2 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-blue-600" />
              Message Comparison Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {selectedMessages.map((messageId: string, index: number) => {
                const message = messages.find((m: any) => m.id === messageId);
                if (!message) return null;

                return (
                  <div key={messageId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-blue-900">
                        Message {index + 1}
                      </h4>
                      <Badge variant="outline" className="gap-1">
                        <Gauge className="h-3 w-3" />
                        AI Score: {message.aiScore}%
                      </Badge>
                    </div>

                    <div className="bg-white rounded-lg p-4 border space-y-3">
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Sent: {message.timestamp}</div>
                        <div>
                          Tone: {message.tone} • Template: {message.template}
                        </div>
                      </div>

                      <div className="text-sm text-foreground line-clamp-4">
                        {message.content}
                      </div>

                      {message.metrics && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>Opens:</span>
                            <span className="font-medium">
                              {message.metrics.opens || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Clicks:</span>
                            <span className="font-medium">
                              {message.metrics.clicks || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Replies:</span>
                            <span className="font-medium">
                              {message.metrics.replies || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sentiment:</span>
                            <span className="flex items-center gap-1">
                              {getSentimentIcon(
                                message.metrics.sentiment || "neutral"
                              )}
                              <span className="capitalize">
                                {message.metrics.sentiment || "neutral"}
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-medium text-blue-900 mb-2">
                AI Optimization Suggestions
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Message 1 performed better due to specific pain point
                  mention
                </li>
                <li>
                  • Message 2's direct approach resulted in higher click-through
                  rate
                </li>
                <li>
                  • Combine Message 1's personalization with Message 2's urgency
                </li>
                <li>
                  �� Optimal send time appears to be Tuesday afternoon based on
                  open rates
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message List */}
      {messages.map((message: CommunicationMessage) => (
        <Card
          key={message.id}
          className={`transition-all cursor-pointer ${
            compareMode && selectedMessages.includes(message.id)
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:shadow-md"
          } ${compareMode ? "hover:ring-1 hover:ring-primary/50" : ""}`}
          onClick={() => handleMessageSelect(message.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                {message.subject && (
                  <h4 className="font-medium text-foreground mb-1">
                    {message.subject}
                  </h4>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                  {getStatusIcon(message.status)}
                  <span className="capitalize">{message.status}</span>
                  <span>•</span>
                  <span>{message.timestamp}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {message.tone}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {message.template}
                  </Badge>
                  {message.aiScore && (
                    <>
                      <span>•</span>
                      <Badge variant="secondary" className="text-xs gap-1">
                        <Brain className="h-3 w-3" />
                        AI: {message.aiScore}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {compareMode && (
                  <Checkbox
                    checked={selectedMessages.includes(message.id)}
                    disabled={
                      !selectedMessages.includes(message.id) &&
                      selectedMessages.length >= 2
                    }
                    className="mr-2"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(message.content);
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-foreground mb-3 line-clamp-3">
              {message.content}
            </div>

            {message.metrics && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {message.metrics.opens && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {message.metrics.opens} opens
                  </span>
                )}
                {message.metrics.clicks && (
                  <span className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    {message.metrics.clicks} clicks
                  </span>
                )}
                {message.metrics.replies && (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    {message.metrics.replies} replies
                  </span>
                )}
                {message.metrics.sentiment && (
                  <span className="flex items-center gap-1">
                    {getSentimentIcon(message.metrics.sentiment)}
                    <span className="capitalize">
                      {message.metrics.sentiment} sentiment
                    </span>
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const SequencesInterface = () => {
  const sequences = [
    {
      id: "seq-1",
      name: "Infrastructure Scaling Outreach",
      status: "active",
      messages: 4,
      openRate: "78%",
      replyRate: "23%",
      leads: 12,
    },
    {
      id: "seq-2",
      name: "Engineering Leadership Connect",
      status: "paused",
      messages: 3,
      openRate: "65%",
      replyRate: "18%",
      leads: 8,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Sequences</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Sequence
        </Button>
      </div>

      {sequences.map((sequence) => (
        <Card key={sequence.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-foreground">{sequence.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {sequence.messages} messages • {sequence.leads} leads
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    sequence.status === "active" ? "default" : "secondary"
                  }
                >
                  {sequence.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Open Rate</span>
                <p className="font-medium text-green-600">
                  {sequence.openRate}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Reply Rate</span>
                <p className="font-medium text-blue-600">
                  {sequence.replyRate}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Status</span>
                <p className="font-medium capitalize">{sequence.status}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const TemplatesInterface = ({ templates, communicationType }: any) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Message Templates</h3>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates[communicationType]?.map(
          (template: string, index: number) => (
            <Card
              key={template}
              className="cursor-pointer hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{template}</h4>
                  <Badge variant="secondary" className="text-xs">
                    {Math.floor(Math.random() * 30 + 70)}% success rate
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Optimized template for {communicationType.replace("-", " ")}{" "}
                  communication
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm">
                    Use Template
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

const AnalyticsSection = ({ leadData }: { leadData: any }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Analytics & Insights
        </h1>
        <p className="text-muted-foreground">
          Performance metrics and AI-powered analysis
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Key Metrics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Sent</span>
            </div>
            <div className="text-2xl font-bold text-foreground">24</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +12% vs last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-5 w-5 text-green-500" />
              <span className="text-sm text-muted-foreground">Open Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground">78%</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +5% vs average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-muted-foreground">Reply Rate</span>
            </div>
            <div className="text-2xl font-bold text-foreground">35%</div>
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +8% vs average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">Conversion</span>
            </div>
            <div className="text-2xl font-bold text-foreground">12%</div>
            <div className="text-sm text-red-600 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -2% vs last month
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Communication Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-2" />
              <span>Performance chart would be rendered here</span>
            </div>
          </CardContent>
        </Card>

        {/* Best Performing Messages */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Top Performing Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((rank) => (
              <div
                key={rank}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-medium">
                  {rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Infrastructure scaling question
                  </p>
                  <p className="text-xs text-muted-foreground">
                    89% open rate • 45% reply rate
                  </p>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Gauge className="h-3 w-3" />
                  {90 - rank}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="lg:col-span-4 ai-gradient">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-ai-glow" />
              AI Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">
                  Optimization Opportunities
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Send times: Tuesday 2-4 PM show 23% higher open rates
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Subject lines with numbers perform 31% better
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5" />
                    Consultative tone matches Sarah's response patterns
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">
                  Predictive Analysis
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Radar className="h-4 w-4 text-blue-500 mt-0.5" />
                    67% probability of response to next follow-up
                  </li>
                  <li className="flex items-start gap-2">
                    <Radar className="h-4 w-4 text-blue-500 mt-0.5" />
                    Best approach: Technical case study focus
                  </li>
                  <li className="flex items-start gap-2">
                    <Radar className="h-4 w-4 text-blue-500 mt-0.5" />
                    Optimal follow-up timing: 3-4 days
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AutomationSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Automation & Sequences
        </h1>
        <p className="text-muted-foreground">
          Set up automated workflows and follow-up sequences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Sequences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Active Sequences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-green-900">
                  Infrastructure Outreach
                </p>
                <p className="text-sm text-green-600">4 steps • 12 leads</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">Active</Badge>
                <Button variant="ghost" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="font-medium text-orange-900">Follow-up Series</p>
                <p className="text-sm text-orange-600">3 steps • 8 leads</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Paused</Badge>
                <Button variant="ghost" size="sm">
                  <Play className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Smart Automation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Auto-schedule follow-ups
                </p>
                <p className="text-sm text-muted-foreground">
                  When email is opened
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Lead scoring updates
                </p>
                <p className="text-sm text-muted-foreground">
                  Real-time AI scoring
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Smart send times</p>
                <p className="text-sm text-muted-foreground">
                  AI-optimized timing
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Trigger Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="h-5 w-5" />
              Trigger-Based Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Email Triggers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      Email opened → Schedule follow-up
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      Link clicked → Update lead score
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      Reply received → Notify team
                    </span>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-foreground">
                  Behavioral Triggers
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      Website visit → Send follow-up
                    </span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      LinkedIn view → Connect request
                    </span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">
                      No response → Break-up email
                    </span>
                    <Switch />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TimelineSection = () => {
  const events = [
    {
      type: "email",
      title: "Cold email sent",
      description: "Infrastructure scaling email sent via Gmail",
      time: "2 hours ago",
      status: "sent",
      details:
        "Subject: Quick question about TechFlow's infrastructure scaling",
      metrics: { opens: 2, clicks: 1 },
    },
    {
      type: "view",
      title: "Email opened",
      description: "Email viewed for 15 seconds on mobile device",
      time: "1 hour ago",
      status: "opened",
      details: "Device: iPhone 14 Pro, Location: San Francisco, Duration: 15s",
    },
    {
      type: "linkedin",
      title: "LinkedIn profile viewed",
      description: "Sarah visited your LinkedIn profile",
      time: "45 minutes ago",
      status: "viewed",
      details: "Duration: 2 minutes, Sections viewed: Experience, About",
    },
    {
      type: "email",
      title: "Email link clicked",
      description: "Clicked case study link in email",
      time: "35 minutes ago",
      status: "clicked",
      details: "Link: CloudScale case study PDF, Time on page: 3 minutes",
    },
    {
      type: "reply",
      title: "Email replied",
      description: "Positive response - interested in learning more",
      time: "30 minutes ago",
      status: "replied",
      details:
        'Reply: "This sounds interesting. Can we schedule a call next week?"',
    },
    {
      type: "meeting",
      title: "Meeting scheduled",
      description: "Demo call booked for next Tuesday",
      time: "10 minutes ago",
      status: "scheduled",
      details: "Meeting: Infrastructure Demo, Duration: 30 min, Platform: Zoom",
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "linkedin":
        return MessageSquare;
      case "view":
        return Eye;
      case "reply":
        return RefreshCw;
      case "meeting":
        return Calendar;
      case "call":
        return Phone;
      default:
        return Clock;
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-500";
      case "opened":
        return "bg-green-500";
      case "viewed":
        return "bg-purple-500";
      case "replied":
        return "bg-orange-500";
      case "scheduled":
        return "bg-red-500";
      case "clicked":
        return "bg-yellow-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Lead Timeline
          </h1>
          <p className="text-muted-foreground">
            Complete chronological interaction history
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {events.map((event, index) => {
              const Icon = getEventIcon(event.type);
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${getEventColor(
                        event.status
                      )}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < events.length - 1 && (
                      <div className="w-px h-12 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <h4 className="text-base font-medium text-foreground">
                        {event.title}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {event.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {event.description}
                    </p>

                    <div className="bg-muted rounded-lg p-3 mb-3">
                      <p className="text-xs text-muted-foreground">
                        {event.details}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {event.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs capitalize">
                        {event.type.replace("-", " ")}
                      </Badge>
                      {event.metrics && (
                        <Badge variant="outline" className="text-xs">
                          {event.metrics.opens} opens • {event.metrics.clicks}{" "}
                          clicks
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const NotesSection = () => {
  const [newNote, setNewNote] = useState("");
  const [newTask, setNewTask] = useState("");

  const notes = [
    {
      id: "1",
      content:
        "Very interested in cost optimization solutions. Mentioned they're currently spending 40% more than budgeted on AWS. Team is growing rapidly and infrastructure costs are a major concern.",
      timestamp: "2024-01-15 14:30",
      author: "Alex Johnson",
      type: "observation",
      priority: "high",
    },
    {
      id: "2",
      content:
        "Follow up needed: Send case study about CloudScale's 45% cost reduction. Sarah specifically asked for ROI calculations and implementation timeline.",
      timestamp: "2024-01-15 10:15",
      author: "Alex Johnson",
      type: "action",
      priority: "high",
    },
    {
      id: "3",
      content:
        "Company is scaling rapidly - team grew from 20 to 50 engineers in 6 months. Planning to double team size in next 12 months. Infrastructure needs to scale accordingly.",
      timestamp: "2024-01-14 16:45",
      author: "Alex Johnson",
      type: "insight",
      priority: "medium",
    },
  ];

  const tasks = [
    {
      id: "1",
      task: "Send CloudScale case study with ROI breakdown",
      dueDate: "2024-01-16",
      priority: "high",
      completed: false,
      assignee: "Alex Johnson",
    },
    {
      id: "2",
      task: "Schedule demo call for next week",
      dueDate: "2024-01-17",
      priority: "high",
      completed: false,
      assignee: "Alex Johnson",
    },
    {
      id: "3",
      task: "Research TechFlow's competitor analysis",
      dueDate: "2024-01-18",
      priority: "medium",
      completed: true,
      assignee: "Research Team",
    },
  ];

  const activities = [
    {
      id: "1",
      action: "Email sent",
      description: "Cold email about infrastructure scaling",
      timestamp: "2024-01-15 10:30",
      status: "completed",
    },
    {
      id: "2",
      action: "LinkedIn connection",
      description: "Connection request sent",
      timestamp: "2024-01-14 15:45",
      status: "pending",
    },
    {
      id: "3",
      action: "Research completed",
      description: "Company background and tech stack analysis",
      timestamp: "2024-01-14 09:20",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Notes & Tasks
        </h1>
        <p className="text-muted-foreground">
          Organize information and track action items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Note */}
            <div className="space-y-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this lead..."
                className="min-h-20"
              />
              <div className="flex gap-2">
                <Select defaultValue="observation">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="observation">Observation</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="insight">Insight</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setNewNote("")} className="flex-1 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </div>

            <Separator />

            {/* Notes List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="p-3 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {note.type}
                      </Badge>
                      {note.priority === "high" && (
                        <Badge variant="destructive" className="text-xs">
                          High Priority
                        </Badge>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-foreground mb-2">{note.content}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{note.author}</span>
                    <span>{note.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tasks & Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Task */}
            <div className="space-y-3">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
              />
              <div className="flex gap-2">
                <Input type="date" className="w-32" />
                <Select defaultValue="medium">
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setNewTask("")} className="flex-1 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tasks List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3 rounded-lg border ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : "bg-background"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={task.completed} className="mt-1" />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.task}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Due: {task.dueDate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {task.assignee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === "completed"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <Badge
                        variant={
                          activity.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TeamSection = () => {
  const teamMembers = [
    {
      id: "1",
      name: "Alex Johnson",
      role: "Senior Sales Rep",
      avatar: "/placeholder.svg",
      stats: { leads: 45, meetings: 12, closed: 8 },
      performance: 89,
    },
    {
      id: "2",
      name: "Sarah Kim",
      role: "Sales Rep",
      avatar: "/placeholder.svg",
      stats: { leads: 32, meetings: 8, closed: 5 },
      performance: 76,
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Sales Manager",
      avatar: "/placeholder.svg",
      stats: { leads: 28, meetings: 15, closed: 12 },
      performance: 95,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Team Performance
        </h1>
        <p className="text-muted-foreground">
          Track team metrics and collaboration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Active Leads:
                      </span>
                      <span className="font-medium">{member.stats.leads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Meetings:</span>
                      <span className="font-medium">
                        {member.stats.meetings}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Closed:</span>
                      <span className="font-medium">{member.stats.closed}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span className="font-medium">{member.performance}%</span>
                    </div>
                    <Progress value={member.performance} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadIntelligence;
