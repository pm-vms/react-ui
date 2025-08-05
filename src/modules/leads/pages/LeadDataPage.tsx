import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  ExternalLink,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
  Calendar,
  Star,
  Link as LinkIcon,
  User,
  Badge,
  MoreHorizontal,
  Phone,
  MessageSquare,
  Clock,
  TrendingUp,
  Users,
  Briefcase,
  Globe,
  Target,
  Activity,
  Zap,
  X,
  Settings,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "../../../shared/components/button";
import { Input } from "../../../shared/components/input";
import { Badge as BadgeComponent } from "../../../shared/components/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../shared/components/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../../shared/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "../../../shared/components/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../shared/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../shared/components/tabs";
import { Progress } from "../../../shared/components/progress";
import { Checkbox } from "../../../shared/components/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../shared/components/tooltip";
import { Textarea } from "../../../shared/components/textarea";
import { Label } from "../../../shared/components/label";
import { useAuth } from "../../auth/services/AuthContext";
import { apiService } from "../../../services/api"; // Assuming apiService is used for API calls
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  TrashIcon, // ✅ import the Trash icon
} from "@heroicons/react/24/solid";

// Define a helper to get icon + color classes based on status
const getImportStatusBadge = (status: string) => {
  switch (status) {
    case "complete":
      return {
        icon: <CheckCircleIcon className="w-4 h-4 text-green-600" />,
        text: "Completed",
        classes: "bg-green-100 text-green-600",
      };
    case "failed":
      return {
        icon: <XCircleIcon className="w-4 h-4 text-red-600" />,
        text: "Failed",
        classes: "bg-red-100 text-red-600",
      };
    case "inprogress":
      return {
        icon: <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-600" />,
        text: "In Progress",
        classes: "bg-blue-100 text-blue-600",
      };
    case "remove":
      return {
        text: "Remove",
        classes:
          "bg-red-100 text-red-600 hover:text-red-800 ml-1 cursor-pointer",
        icon: <TrashIcon className="w-4 h-4 text-red-600" />,
        showRemove: true,
      };

    default:
      return {
        icon: <ClockIcon className="w-4 h-4 text-gray-500" />,
        text: "Pending",
        classes: "bg-gray-100 text-gray-500",
      };
  }
};

// Enhanced API service with pagination
const apiServiceTest = {
  bulkAction: async (
    leadIds: string[],
    actionType: string,
    emailData?: any[]
  ) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { success: true, processed: leadIds.length };
  },

  exportLeads: async (leadIds?: string[], format: "csv" | "excel" = "csv") => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real implementation, this would generate and download the file
    const filename = `leads_export_${
      new Date().toISOString().split("T")[0]
    }.${format}`;
    return { success: true, filename, url: "#" };
  },
};

const leadBatchStatusMessages = {
  pending: {
    icon: <ClockIcon className="w-4 h-4 text-yellow-600" />,
    message: "Your links are added to the queue and will be processed shortly.",
    classes: "bg-yellow-100 text-yellow-600",
  },
  in_progress: {
    icon: <ArrowPathIcon className="w-4 h-4 animate-spin text-blue-600" />,
    message: "Your import is in progress. We’ll update you when it completes.",
    classes: "bg-blue-100 text-blue-600",
  },
  failed: {
    icon: <XCircleIcon className="w-4 h-4 text-red-600" />,
    message: "Your import failed. You can retry or delete and start over.",
    action: "Retry",
    classes: "bg-red-100 text-red-600",
  },
  complete: {
    icon: <CheckCircleIcon className="w-4 h-4 text-green-600" />,
    message:
      "Your import is complete. You can now process more or delete this batch.",
    action: "Process More",
    classes: "bg-green-100 text-green-600",
  },
};

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  position: string;
  industry: string;
  location: string;
  status: "active" | "contacted" | "converted";
  profileImage?: string;
  createdAt: string;
  tags: string[];
  rank: number;
  isImported?: boolean;
  leadScore: number;
  lastActivity: string;
  nextFollowUp: string;
  emailsSent: number;
  emailsOpened: number;
  responseRate: number;
  details: any;
}

interface BulkActionData {
  leadId: string;
  name: string;
  email: string;
  hasEmail: boolean;
  isSelected: boolean;
}

// Column configuration
const DEFAULT_COLUMNS = {
  name: { label: "Name", visible: true, required: true },
  title: { label: "Title", visible: true, required: false },
  created: { label: "Created", visible: true, required: false },
  tags: { label: "Tags", visible: true, required: false },
  location: { label: "Location", visible: true, required: false },
  score: { label: "Score", visible: true, required: false },
  company: { label: "Company", visible: false, required: false },
  industry: { label: "Industry", visible: false, required: false },
  activity: { label: "Activity", visible: false, required: false },
};

const LeadDataPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "contacted" | "converted"
  >("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");

  // Date & Time filters
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [lastContactFilter, setLastContactFilter] = useState("all");
  const [leadSourceFilter, setLeadSourceFilter] = useState("all");
  const [industrySourceFilter, setIndustrySourceFilter] = useState("all");
  const [leadScoreFilter, setLeadScoreFilter] = useState("all");
  const [importDateFilter, setImportDateFilter] = useState("all");
  const [followUpDueFilter, setFollowUpDueFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({ from: "", to: "" });
  const [leadData, setLeadData] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [linkedinUrls, setLinkedinUrls] = useState([
    { url: "", status: "pending", error: "" },
  ]);
  const [isImporting, setIsImporting] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [importNumber, setImportNumber] = useState(0);
  const [errors, setErrors] = useState<any>([""]);

  // Enhanced bulk selection with email validation
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBulkActionModalOpen, setIsBulkActionModalOpen] = useState(false);
  const [bulkActionData, setBulkActionData] = useState<BulkActionData[]>([]);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isProcessingBulkAction, setIsProcessingBulkAction] = useState(false);
  const [leadBatch, setLeadBatch] = useState<null>(null);

  // Pagination with backend support
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 1,
    from: 1,
    to: 10,
  });

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchLeadData();
  }, [
    currentPage,
    itemsPerPage,
    // searchTerm,
    // statusFilter,
    dateRangeFilter,
    lastContactFilter,
    importDateFilter,
    followUpDueFilter,
    // customDateRange,
    leadSourceFilter,
    industrySourceFilter,
    leadScoreFilter,
  ]);

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Fetches lead data from the API based on various filters and updates the component state.
   *
   * The function constructs a filter object from current state variables such as search term,
   * status, position, location, and company filters. It then calls the `apiService.getLeadsData`
   * method with the user's ID, current page, items per page, and the constructed filters.
   *
   * On a successful response, it transforms the lead data, updates the lead data state, and
   * sets the pagination state. If an error occurs during the API call, it logs the error.
   *
   * The function also manages a loading state to indicate that data fetching is in progress.
   */

  /*******  c22706cd-20ca-4670-9f80-30abac6aacfa  *******/
  const fetchLeadData = async () => {
    setLoading(true);
    try {
      const filters = {
        search: searchTerm,
        status: statusFilter,
        position: positionFilter,
        location: locationFilter,
        company: companyFilter,
        dateRange: dateRangeFilter,
        customDateRange: customDateRange,
        lastContact: lastContactFilter,
        importDate: importDateFilter,
        followUpDue: followUpDueFilter,
        leadSource: leadSourceFilter,
        industry: industrySourceFilter,
        score: leadScoreFilter,
        //   dateRangeFilter === "custom" ? customDateRange : null,
      };
      console.log("***************************");
      const response = await apiService.getLeadsData({
        keycloakId: user.id,
        currentPage,
        itemsPerPage,
        filters,
      });

      if (response.success && response.data) {
        // console.log('response.pagination',Object.keys(response))
        const transformLead = (lead: any) => ({
          ...lead,
          company: lead.companyName ?? "",
          position: lead.jobTitle ?? "",
          location: lead.location ?? "",
          status: lead.status ?? "active",
          tags: lead.tags ?? [],
          rank: Number(lead.profileRank) || 0,
          profileImage: lead.imageUrl?.includes("data:image")
            ? ""
            : lead.imageUrl,
          leadScore: 0,
          lastActivity: "N/A",
          nextFollowUp: "N/A",
          emailsSent: 0,
          emailsOpened: 0,
          responseRate: 0,
          details: {
            profileId: lead.profileId ?? "",
            aboutText: lead.aboutText ?? "",
            skills: lead.skills ?? [],
            salesProfileUrl: lead.salesProfileUrl ?? "",
            companyLink: lead.companyLink ?? "",
          },
        });
        const transformedLeads = Array.isArray(response.data)
          ? response.data.map(transformLead)
          : [transformLead(response.data)]; // Fallback: single item wrapped in array

        console.log("response.data", transformedLeads.length);

        setLeadData(transformedLeads);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error("Error fetching lead data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isImportModalOpen) {
      const loadExistingBatch = async () => {
        try {
          const res = await apiService.importFromLinkedIn(user.id);
          console.log(">>>>>res", res);
          if (res.success === true && res.data?.urls?.length > 0) {
            const batch = res.data.urls.length
              ? res.data.urls
              : [{ url: "", status: "pending", error: "" }];
            // console.log(">>>>>>>>>>>> batch", batch);
            setLinkedinUrls(batch);
            setLeadBatch(res.data);
            // setUrlStatuses(batch);
          } else {
            setLinkedinUrls([{ url: "", status: "pending", error: "" }]);
            // setUrlStatuses([]);
          }
        } catch (err) {
          console.error("Error loading previous lead batch", err);
        }
      };
      loadExistingBatch();
    }
  }, [isImportModalOpen]);

  const addLinkedInUrl = () => {
    if (linkedinUrls.length >= 5) return;
    setLinkedinUrls([
      ...linkedinUrls,
      { url: "", status: "pending", error: "" },
    ]);
  };

  const updateLinkedInUrl = (index: number, url: string) => {
    const updatedList = [...linkedinUrls];
    updatedList[index].url = url;

    if (!url.trim()) {
      updatedList[index].error = "Please enter a URL.";
    } else if (!url.includes("linkedin.com")) {
      updatedList[index].error =
        "The URL must be a valid LinkedIn profile link.";
    } else {
      updatedList[index].error = "";
    }
    setLinkedinUrls(updatedList);
  };

  const removeLinkedInUrl = (index: number) => {
    if (linkedinUrls.length > 1) {
      setLinkedinUrls(linkedinUrls.filter((_, i) => i !== index));
    }
  };

  const handleAction = async (
    batchId: string,
    action: "Retry" | "Process More"
  ) => {
    try {
      // Delete the existing batch
      const response = await apiService.deleteBatch(batchId);

      if (!response.success) {
        console.error("Failed to delete lead batch");
        return;
      }

      // Clear the lead batch from state
      setLeadBatch(null);

      if (action === "Retry") {
        console.log("Retrying import...");

        // Sanitize and reset LinkedIn URLs
        const validUrls = linkedinUrls
          .map((entry) => {
            const trimmedUrl = entry.url.trim();
            if (trimmedUrl && trimmedUrl.includes("linkedin.com")) {
              return {
                ...entry,
                url: trimmedUrl,
                status: "pending",
                error: "",
              };
            }
            return null;
          })
          .filter(Boolean) as typeof linkedinUrls;

        setLinkedinUrls(validUrls);
      }

      if (action === "Process More") {
        console.log("Ready for a new import process.");
        // You can optionally redirect or show a new import UI here
      }
    } catch (err) {
      console.error(`Failed to perform action: ${action}`, err);
      // Optionally show a user notification here
    }
  };

  const handleImportFromLinkedIn = async () => {
    const validUrls = linkedinUrls
      .map((entry) => {
        const trimmedUrl = entry.url.trim();
        if (trimmedUrl && trimmedUrl.includes("linkedin.com")) {
          return { ...entry, url: trimmedUrl, status: "inprogress", error: "" };
        }
        return null;
      })
      .filter(Boolean);

    if (validUrls.length === 0) {
      alert("Please enter at least one valid LinkedIn URL");
      return;
    }

    setIsImporting(true);

    try {
      // Prepare batch payload
      const payload = {
        urls: validUrls,
        source: "linkedin", // optional metadata
        userId: user.id, // if available
      };

      // Send to backend
      const response = await apiService.createLeadBatch(payload);
      console.log("response", response);

      if (response.success) {
        // alert(
        //   `Batch submitted successfully! It may take a few minutes to process ${validUrls.length} leads.`
        // );
        setLinkedinUrls(response.data.urls); // Reset
        setLeadBatch(response.data);
        setIsImporting(false);
        // setIsImportModalOpen(false);
        // fetchLeadData(); // Optional: Refresh lead list or polling batch status
      } else {
        alert("Failed to create lead batch. Please try again.");
      }
    } catch (error) {
      console.error("Error creating lead batch:", error);
      alert("Import failed. Please try again.");
    }
    /*  finally {
      setIsImporting(false);
    } */
  };

  // Enhanced bulk selection
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId)
        ? prev.filter((id) => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leadData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadData.map((lead) => lead.id));
    }
  };

  const isAllSelected =
    selectedLeads.length > 0 && selectedLeads.length === leadData.length;

  // Enhanced bulk actions with email validation
  const openBulkActionModal = () => {
    const selectedLeadData = leadData.filter((lead) =>
      selectedLeads.includes(lead.id)
    );
    const bulkData = selectedLeadData.map((lead) => ({
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      hasEmail: !!lead.email && lead.email.includes("@"),
      isSelected: true,
    }));

    setBulkActionData(bulkData);
    setSelectedActions([]);
    setIsBulkActionModalOpen(true);
  };

  const handleBulkActionSelection = (action: string) => {
    // Only allow one action at a time
    setSelectedActions((prev) => (prev.includes(action) ? [] : [action]));
  };

  const updateLeadEmail = (leadId: string, email: string) => {
    setBulkActionData((prev) =>
      prev.map((lead) =>
        lead.leadId === leadId
          ? { ...lead, email, hasEmail: !!email && email.includes("@") }
          : lead
      )
    );
  };

  const toggleLeadSelection = (leadId: string) => {
    setBulkActionData((prev) =>
      prev.map((lead) =>
        lead.leadId === leadId
          ? { ...lead, isSelected: !lead.isSelected }
          : lead
      )
    );
  };

  const processBulkAction = async () => {
    if (selectedActions.length === 0) {
      alert("Please select an action type");
      return;
    }

    const selectedLeadData = bulkActionData.filter((lead) => lead.isSelected);
    if (selectedLeadData.length === 0) {
      alert("Please select at least one lead");
      return;
    }

    const emailRequiredActions = [
      "Cold Email",
      "First Follow-up",
      "Warm Introduction",
    ];
    const needsEmail = selectedActions.some((action) =>
      emailRequiredActions.includes(action)
    );

    if (needsEmail) {
      const leadsWithoutEmail = selectedLeadData.filter(
        (lead) => !lead.hasEmail
      );
      if (leadsWithoutEmail.length > 0) {
        alert(
          `Cannot proceed: ${leadsWithoutEmail.length} leads are missing email addresses for ${selectedActions[0]}. Please add emails or remove them from selection.`
        );
        return;
      }
    }

    setIsProcessingBulkAction(true);
    try {
      await apiService.bulkAction(
        selectedLeadData.map((lead) => lead.leadId),
        selectedActions[0], // Only one action now
        selectedLeadData
      );

      alert(
        `Successfully processed ${selectedActions[0]} for ${selectedLeadData.length} leads!`
      );
      setSelectedLeads([]);
      setIsBulkActionModalOpen(false);
      setSelectedActions([]);
      setBulkActionData([]);
    } catch (error) {
      console.error("Error processing bulk action:", error);
      alert("Failed to process bulk action. Please try again.");
    } finally {
      setIsProcessingBulkAction(false);
    }
  };

  // Export functionality
  const handleExport = async (
    type: "all" | "selected" = "all",
    format: "csv" | "excel" = "csv"
  ) => {
    try {
      const leadIds = type === "selected" ? selectedLeads : undefined;
      const response = await apiService.exportLeads(leadIds, format);

      if (response.success) {
        // In a real app, this would trigger a download
        alert(`Export successful! File: ${response.filename}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    }
  };

  // Column visibility
  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: {
        ...prev[columnKey],
        visible: !prev[columnKey].visible,
      },
    }));
  };

  // Text truncation with tooltip
  const TruncatedText: React.FC<{
    text: string;
    maxLength: number;
    className?: string;
  }> = ({ text, maxLength, className = "" }) => {
    if (text?.length <= maxLength) {
      return <span className={className}>{text}</span>;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`cursor-help ${className}`}>
              {text?.slice(0, maxLength)}...
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{text}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const getStatusBadge = (status: string, isImported = false) => {
    const styles = {
      active:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      contacted: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
      converted:
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    };

    return (
      <div className="flex items-center gap-2">
        <BadgeComponent
          variant="outline"
          className={`${
            styles[status as keyof typeof styles]
          } border font-medium`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </BadgeComponent>
        {isImported && (
          <BadgeComponent
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200 font-medium"
          >
            New
          </BadgeComponent>
        )}
      </div>
    );
  };

  const getLeadScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-blue-600 bg-blue-50";
    if (score >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  /*  const getUniqueValues = async (field: keyof Lead) => {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2 field", leadData.length);
    // return [...new Set(leadData.map((lead) => lead[field]).filter(Boolean))];
    try {
      const response = await apiService.getFilterOptions({
        field,
        keycloakId: user.id,
      });
      if (response.success) {
        console.log("Unique values for", response?.data);
        return response?.data;
      }
      return [];
    } catch (err) {
      console.error("Failed to fetch unique values:", err);
      return [];
    }
  }; */

  const useFilterOptions = (field: keyof Lead) => {
    const [options, setOptions] = useState<string[]>([]);

    useEffect(() => {
      const fetchOptions = async () => {
        try {
          const response = await apiService.getFilterOptions({
            field,
            keycloakId: user.id,
          });
          if (response.success) {
            setOptions(response.data);
          }
        } catch (error) {
          console.error(`Error fetching ${field} options`, error);
        }
      };

      fetchOptions();
    }, [field]);

    return options;
  };
  const positionOptions = useFilterOptions("job_title");
  const locationOptions = useFilterOptions("location");
  const companyOptions = useFilterOptions("company_name");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Lead Management
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Track, analyze, and convert your prospects into customers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog
                open={isColumnModalOpen}
                onOpenChange={setIsColumnModalOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Customize Columns</DialogTitle>
                    <DialogDescription>
                      Choose which columns to display in the table
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {Object.entries(visibleColumns).map(([key, column]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={column.visible}
                          onCheckedChange={() => toggleColumnVisibility(key)}
                          disabled={column.required}
                        />
                        <Label htmlFor={key} className="text-sm font-medium">
                          {column.label}
                          {column.required && (
                            <span className="text-xs text-gray-500 ml-1">
                              (required)
                            </span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                    <LinkIcon className="w-5 h-5 mr-2" />
                    Import from LinkedIn
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader className="text-center pb-4">
                    <DialogTitle className="text-2xl font-bold">
                      Import LinkedIn Profiles
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Add one or multiple LinkedIn profile URLs (upto 5) to
                      automatically extract and import lead information
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold text-gray-900">
                          LinkedIn URLs ({linkedinUrls.length})
                        </Label>
                        {linkedinUrls.length >= 5 ? (
                          <span className="text-red-500">
                            Max Limit Reached [5]
                          </span>
                        ) : leadBatch ? (
                          <></>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addLinkedInUrl}
                            className="h-8 px-3"
                            disabled={linkedinUrls.length >= 5}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add URL
                          </Button>
                        )}
                      </div>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {linkedinUrls.map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center gap-2">
                              {/* Input container */}
                              <div className="relative flex-grow">
                                <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <Input
                                  placeholder="https://linkedin.com/in/profile-name"
                                  value={item.url}
                                  onChange={(e) =>
                                    updateLinkedInUrl(index, e.target.value)
                                  }
                                  disabled={item.status !== "pending"}
                                  className={`pl-9 h-10 w-full ${
                                    item.error && item.error.length > 0
                                      ? "border-red-500 focus:ring-red-500"
                                      : ""
                                  }`}
                                />
                              </div>

                              {/* Status or spacer */}
                              <div className="min-w-[90px]">
                                {/* const badge = getStatusBadge(item.status); */}

                                {item.status !== "pending" ? (
                                  <span
                                    className={`text-xs font-medium px-2 py-1 rounded min-w-[110px] flex items-center gap-1 justify-center ${
                                      getImportStatusBadge(item.status).classes
                                    }`}
                                  >
                                    {getImportStatusBadge(item.status).icon}
                                    {getImportStatusBadge(item.status).text}
                                  </span>
                                ) : (
                                  // <span
                                  //   className={`text-xs font-medium px-2 py-1 rounded block w-fit min-w-[100px] flex items-center gap-1 justify-center ${
                                  //     item.status === "failed"
                                  //       ? "bg-red-100 text-red-600"
                                  //       : item.status === "inprogress"
                                  //       ? "bg-blue-100 text-blue-600"
                                  //       : item.status === "complete"
                                  //       ? "bg-green-100 text-green-600"
                                  //       : "bg-gray-100 text-gray-500"
                                  //   }`}
                                  // >
                                  //   {item.status === "failed" && (
                                  //     <span className="text-red-500">❌</span>
                                  //   )}
                                  //   {item.status === "inprogress" && (
                                  //     <svg
                                  //       className="animate-spin h-4 w-4 text-blue-600"
                                  //       xmlns="http://www.w3.org/2000/svg"
                                  //       fill="none"
                                  //       viewBox="0 0 24 24"
                                  //     >
                                  //       <circle
                                  //         className="opacity-25"
                                  //         cx="12"
                                  //         cy="12"
                                  //         r="10"
                                  //         stroke="currentColor"
                                  //         strokeWidth="4"
                                  //       ></circle>
                                  //       <path
                                  //         className="opacity-75"
                                  //         fill="currentColor"
                                  //         d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                  //       ></path>
                                  //     </svg>
                                  //   )}
                                  //   {item.status === "complete" && (
                                  //     <span className="text-green-500">✅</span>
                                  //   )}
                                  //   {item?.status?.replace(/_/g, " ")}
                                  // </span>
                                  // <Button
                                  //   type="button"
                                  //   variant="ghost"
                                  //   size="sm"
                                  //   onClick={() => removeLinkedInUrl(index)}
                                  //   disabled={linkedinUrls.length === 1}
                                  //   className="h-10 w-10 p-0 hover:bg-red-50 hover:text-red-600"
                                  // >

                                  //   {/* &times; */}
                                  // </Button>
                                  <span
                                    onClick={() => removeLinkedInUrl(index)}
                                    disabled={linkedinUrls.length === 1}
                                    className={`text-xs font-medium px-2 py-1 rounded min-w-[110px] flex items-center gap-1 justify-center ${
                                      getImportStatusBadge("remove").classes
                                    }`}
                                  >
                                    {getImportStatusBadge("remove").icon}
                                    {getImportStatusBadge("remove").text}
                                  </span>
                                )}
                              </div>
                            </div>

                            {item.error && item.error.length > 0 ? (
                              <p className="text-xs text-red-600 pl-2">
                                {item.error}
                              </p>
                            ) : (
                              ""
                            )}

                            {/* Error message */}
                            {errors[index]?.message && (
                              <p className="text-xs text-red-600 pl-2">
                                {errors[index].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {isImporting && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">
                              Importing LinkedIn profiles...
                            </p>
                            <p className="text-xs text-blue-600">
                              Processing{" "}
                              {linkedinUrls.filter((u) => u.url.trim()).length}{" "}
                              URLs
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* ------------Start------------------ */}
                    {leadBatch ? (
                      <div>
                        <div
                          className={`rounded-lg p-4 ${
                            leadBatchStatusMessages[leadBatch.status].classes
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="pt-1">
                              {leadBatchStatusMessages[leadBatch.status].icon}
                            </div>
                            <div className="flex-1">
                              <p>
                                {
                                  leadBatchStatusMessages[leadBatch.status]
                                    .message
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t mt-4">
                          {leadBatchStatusMessages[leadBatch.status].action && (
                            <Button
                              onClick={() =>
                                handleAction(
                                  leadBatch.id,
                                  leadBatchStatusMessages[leadBatch.status]
                                    .action
                                )
                              }
                              className="w-full h-12 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800"
                            >
                              {leadBatchStatusMessages[leadBatch.status].action}
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3 pt-4 border-t">
                        <Button
                          onClick={handleImportFromLinkedIn}
                          disabled={
                            isImporting ||
                            !linkedinUrls.every((u) =>
                              u?.url?.includes("linkedin.com")
                            )
                          }
                          className="flex-1 h-12 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800"
                        >
                          {isImporting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Importing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Import{" "}
                              {
                                linkedinUrls.filter((u) => u?.url?.trim())
                                  .length
                              }{" "}
                              Profile
                              {linkedinUrls.filter((u) => u?.url?.trim())
                                .length !== 1
                                ? "s"
                                : ""}
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsImportModalOpen(false);
                            setLinkedinUrls([
                              { url: "", status: "pending", error: "" },
                            ]);
                          }}
                          className="h-12"
                          disabled={isImporting}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {/* ----------End --------------------- */}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">
                      Total Leads
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {pagination.total}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">
                      Converted
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {leadData.filter((l) => l.status === "converted").length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-600 text-sm font-medium">
                      Response Rate
                    </p>
                    <p className="text-2xl font-bold text-orange-900">
                      {leadData.length > 0
                        ? Math.round(
                            leadData.reduce(
                              (acc, l) => acc + l.responseRate,
                              0
                            ) / leadData.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">
                      Avg. Lead Score
                    </p>
                    <p className="text-2xl font-bold text-purple-900">
                      {leadData.length > 0
                        ? Math.round(
                            leadData.reduce((acc, l) => acc + l.leadScore, 0) /
                              leadData.length
                          )
                        : 0}
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 shadow-lg">
        <div
          className="max-w-8xl mx-auto px-6 py-8 space-y-8"
          style={{ backgroundColor: "#8080800d" }}
        >
          {/* Advanced Filters */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <Input
                          placeholder="Search leads..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as any)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={positionFilter}
                      onValueChange={setPositionFilter}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Positions</SelectItem>
                        {positionOptions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position.length > 20
                              ? `${position.slice(0, 20)}...`
                              : position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={locationFilter}
                      onValueChange={setLocationFilter}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locationOptions.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={companyFilter}
                      onValueChange={setCompanyFilter}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Companies</SelectItem>
                        {companyOptions.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Last Activity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Activity</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Follow-up Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Follow-ups</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Email Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Emails</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="opened">Opened</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Response Rate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rates</SelectItem>
                        <SelectItem value="high">High (&gt;80%)</SelectItem>
                        <SelectItem value="medium">Medium (50-80%)</SelectItem>
                        <SelectItem value="low">Low (&lt;50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-6">
                  <div className="space-y-6">
                    {/* Lead Quality Filters */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block">
                        Lead Quality & Source
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          value={leadScoreFilter}
                          onValueChange={setLeadScoreFilter}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Lead Score" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Scores</SelectItem>
                            <SelectItem value="excellent">
                              Excellent (90+)
                            </SelectItem>
                            <SelectItem value="good">Good (70-89)</SelectItem>
                            <SelectItem value="fair">Fair (50-69)</SelectItem>
                            <SelectItem value="poor">Poor (&lt;50)</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={industrySourceFilter}
                          onValueChange={setIndustrySourceFilter}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Industries</SelectItem>
                            <SelectItem value="tech">Technology</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={leadSourceFilter}
                          onValueChange={setLeadSourceFilter}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="imported">Imported</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Date & Time Filters */}
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-3 block flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                        Date & Time Filters
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">
                            Created Date
                          </Label>
                          <Select
                            value={dateRangeFilter}
                            onValueChange={setDateRangeFilter}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Created Date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="yesterday">
                                Yesterday
                              </SelectItem>
                              <SelectItem value="last7days">
                                Last 7 days
                              </SelectItem>
                              <SelectItem value="last30days">
                                Last 30 days
                              </SelectItem>
                              <SelectItem value="last90days">
                                Last 90 days
                              </SelectItem>
                              <SelectItem value="thisweek">
                                This Week
                              </SelectItem>
                              <SelectItem value="thismonth">
                                This Month
                              </SelectItem>
                              <SelectItem value="lastmonth">
                                Last Month
                              </SelectItem>
                              <SelectItem value="thisquarter">
                                This Quarter
                              </SelectItem>
                              <SelectItem value="custom">
                                Custom Range
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">
                            Last Contact
                          </Label>
                          <Select
                            value={lastContactFilter}
                            onValueChange={setLastContactFilter}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Last Contact" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Any Time</SelectItem>
                              <SelectItem value="ever">
                                Ever Contacted
                              </SelectItem>
                              <SelectItem value="never">
                                Never Contacted
                              </SelectItem>
                              <SelectItem value="today">
                                Contacted Today
                              </SelectItem>
                              <SelectItem value="yesterday">
                                Contacted Yesterday
                              </SelectItem>
                              <SelectItem value="thisweek">
                                This Week
                              </SelectItem>
                              <SelectItem value="lastweek">
                                Last Week
                              </SelectItem>
                              <SelectItem value="last30days">
                                Last 30 Days
                              </SelectItem>
                              <SelectItem value="last90days">
                                Last 90 Days
                              </SelectItem>
                              <SelectItem value="over90days">
                                Over 90 Days Ago
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">
                            Import Date
                          </Label>
                          <Select
                            value={importDateFilter}
                            onValueChange={setImportDateFilter}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Import Date" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Imports</SelectItem>
                              <SelectItem value="today">
                                Imported Today
                              </SelectItem>
                              <SelectItem value="yesterday">
                                Imported Yesterday
                              </SelectItem>
                              <SelectItem value="thisweek">
                                This Week
                              </SelectItem>
                              <SelectItem value="lastweek">
                                Last Week
                              </SelectItem>
                              <SelectItem value="thismonth">
                                This Month
                              </SelectItem>
                              <SelectItem value="lastmonth">
                                Last Month
                              </SelectItem>
                              <SelectItem value="recent">
                                Recent Imports (7 days)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">
                            Follow-up Due
                          </Label>
                          <Select
                            value={followUpDueFilter}
                            onValueChange={setFollowUpDueFilter}
                          >
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Follow-up Due" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Follow-ups
                              </SelectItem>
                              <SelectItem value="overdue">
                                🔴 Overdue
                              </SelectItem>
                              <SelectItem value="today">
                                📅 Due Today
                              </SelectItem>
                              <SelectItem value="tomorrow">
                                ⏰ Due Tomorrow
                              </SelectItem>
                              <SelectItem value="thisweek">
                                📆 This Week
                              </SelectItem>
                              <SelectItem value="nextweek">
                                📋 Next Week
                              </SelectItem>
                              <SelectItem value="thismonth">
                                📊 This Month
                              </SelectItem>
                              <SelectItem value="nodate">
                                ❓ No Follow-up Set
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Custom Date Range Picker */}
                      {dateRangeFilter === "custom" && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <Label className="text-sm font-semibold text-blue-900 mb-3 block">
                            Custom Date Range
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-blue-700">
                                From Date
                              </Label>
                              <Input
                                type="date"
                                value={customDateRange.from}
                                onChange={(e) =>
                                  setCustomDateRange((prev) => ({
                                    ...prev,
                                    from: e.target.value,
                                  }))
                                }
                                className="h-10"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs text-blue-700">
                                To Date
                              </Label>
                              <Input
                                type="date"
                                value={customDateRange.to}
                                onChange={(e) =>
                                  setCustomDateRange((prev) => ({
                                    ...prev,
                                    to: e.target.value,
                                  }))
                                }
                                className="h-10"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-blue-600">
                              {customDateRange.from && customDateRange.to
                                ? `Showing leads created between ${new Date(
                                    customDateRange.from
                                  ).toLocaleDateString()} and ${new Date(
                                    customDateRange.to
                                  ).toLocaleDateString()}`
                                : "Select both dates to apply custom range"}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setCustomDateRange({ from: "", to: "" });
                                setDateRangeFilter("all");
                              }}
                              className="h-8 text-xs"
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Quick Date Shortcuts */}
                      <div className="mt-4">
                        <Label className="text-xs text-gray-600 mb-2 block">
                          Quick Shortcuts
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {[
                            {
                              label: "�� Today",
                              value: "today",
                              filter: "dateRangeFilter",
                            },
                            {
                              label: "📆 This Week",
                              value: "thisweek",
                              filter: "dateRangeFilter",
                            },
                            {
                              label: "📊 This Month",
                              value: "thismonth",
                              filter: "dateRangeFilter",
                            },
                            {
                              label: "🔴 Overdue Follow-ups",
                              value: "overdue",
                              filter: "followUpDueFilter",
                            },
                            {
                              label: "❓ Never Contacted",
                              value: "never",
                              filter: "lastContactFilter",
                            },
                            {
                              label: "🆕 Recent Imports",
                              value: "recent",
                              filter: "importDateFilter",
                            },
                          ].map((shortcut) => (
                            <Button
                              key={shortcut.value}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (shortcut.filter === "dateRangeFilter")
                                  setDateRangeFilter(shortcut.value);
                                if (shortcut.filter === "followUpDueFilter")
                                  setFollowUpDueFilter(shortcut.value);
                                if (shortcut.filter === "lastContactFilter")
                                  setLastContactFilter(shortcut.value);
                                if (shortcut.filter === "importDateFilter")
                                  setImportDateFilter(shortcut.value);
                              }}
                              className="h-8 text-xs hover:bg-blue-50 hover:border-blue-300"
                            >
                              {shortcut.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Enhanced Bulk Actions Bar */}
          {selectedLeads.length > 0 && (
            <Card className="shadow-lg border-brand-200 bg-gradient-to-r from-brand-50 to-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <BadgeComponent className="bg-brand-600 text-white">
                        {selectedLeads.length} selected
                      </BadgeComponent>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLeads([])}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Clear selection
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={openBulkActionModal}
                      className="bg-brand-600 hover:bg-brand-700 text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Bulk Actions
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleExport("selected", "csv")}
                        >
                          Export Selected (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExport("selected", "excel")}
                        >
                          Export Selected (Excel)
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleExport("all", "csv")}
                        >
                          Export All (CSV)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleExport("all", "excel")}
                        >
                          Export All (Excel)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">
                Showing {pagination.from}-{pagination.to} of {pagination.total}{" "}
                leads
              </span>
              {/* Active Filters Indicator */}
              <div className="flex items-center space-x-2">
                {(dateRangeFilter !== "all" ||
                  lastContactFilter !== "all" ||
                  importDateFilter !== "all" ||
                  followUpDueFilter !== "all") && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">
                      Date filters active
                    </span>
                  </div>
                )}
                {searchTerm && (
                  <BadgeComponent
                    variant="outline"
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Search: "{searchTerm}"
                  </BadgeComponent>
                )}
                {statusFilter !== "all" && (
                  <BadgeComponent
                    variant="outline"
                    className="text-xs bg-green-50 text-green-700 border-green-200"
                  >
                    Status: {statusFilter}
                  </BadgeComponent>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport("all", "csv")}>
                    Export All (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport("all", "excel")}
                  >
                    Export All (Excel)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" className="hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Save Filter
              </Button>
            </div>
          </div>

          {/* Enhanced Leads Table */}
          <Card className="shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-4 w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        className="data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
                      />
                    </th>
                    {visibleColumns.name.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Name
                      </th>
                    )}
                    {visibleColumns.title.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Title
                      </th>
                    )}
                    {visibleColumns.created.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Created
                      </th>
                    )}
                    {visibleColumns.tags.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Tags
                      </th>
                    )}
                    {visibleColumns.location.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Location
                      </th>
                    )}
                    {visibleColumns.score.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Score
                      </th>
                    )}
                    {visibleColumns.company.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Company
                      </th>
                    )}
                    {visibleColumns.industry.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Industry
                      </th>
                    )}
                    {visibleColumns.activity.visible && (
                      <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                        Activity
                      </th>
                    )}
                    <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {leadData.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        selectedLeads.includes(lead.id)
                          ? "bg-brand-50 hover:bg-brand-100"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => handleSelectLead(lead.id)}
                          className="data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
                        />
                      </td>

                      {visibleColumns.name.visible && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={lead.profileImage}
                                alt={lead.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                              />
                              {lead.isImported && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                                  <Plus className="w-2 h-2 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <TruncatedText
                                text={lead.name}
                                maxLength={25}
                                className="text-sm font-semibold text-gray-900 block"
                              />
                              <div className="mt-1">
                                {getStatusBadge(lead.status, lead.isImported)}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.title.visible && (
                        <td className="py-4 px-6">
                          <div className="max-w-xs">
                            <TruncatedText
                              text={lead.position}
                              maxLength={30}
                              className="text-sm font-medium text-gray-900 block"
                            />
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Building className="w-3 h-3 mr-1 flex-shrink-0" />
                              <TruncatedText
                                text={lead.company}
                                maxLength={20}
                              />
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.created.visible && (
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {lead.lastActivity}
                          </div>
                        </td>
                      )}

                      {visibleColumns.tags.visible && (
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-32">
                            {lead.tags.slice(0, 2).map((tag, idx) => (
                              <BadgeComponent
                                key={idx}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </BadgeComponent>
                            ))}
                            {lead.tags.length > 2 && (
                              <BadgeComponent
                                variant="secondary"
                                className="text-xs"
                              >
                                +{lead.tags.length - 2}
                              </BadgeComponent>
                            )}
                          </div>
                        </td>
                      )}

                      {visibleColumns.location.visible && (
                        <td className="py-4 px-6">
                          <div className="flex items-center text-sm text-gray-600 max-w-32">
                            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                            <TruncatedText
                              text={lead.location}
                              maxLength={15}
                            />
                          </div>
                        </td>
                      )}

                      {visibleColumns.score.visible && (
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getLeadScoreColor(
                                lead.leadScore
                              )}`}
                            >
                              {lead.leadScore}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
                              {lead.rank}
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.company.visible && (
                        <td className="py-4 px-6">
                          <TruncatedText
                            text={lead.company}
                            maxLength={20}
                            className="text-sm text-gray-900"
                          />
                        </td>
                      )}

                      {visibleColumns.industry.visible && (
                        <td className="py-4 px-6">
                          <TruncatedText
                            text={lead.industry}
                            maxLength={25}
                            className="text-sm text-gray-600"
                          />
                        </td>
                      )}

                      {visibleColumns.activity.visible && (
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-600">
                            <div>{lead.lastActivity}</div>
                            <div className="text-xs text-orange-600 mt-1">
                              {lead.nextFollowUp}
                            </div>
                          </div>
                        </td>
                      )}

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedLead(lead.details);
                              setIsModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600"
                            onClick={() => {
                              const userId = lead.details.profileId;
                              window.open(
                                `/lead-intelligence/${userId}`,
                                "_blank"
                              );
                            }}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Enhanced Pagination */}
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 font-medium">
                    Show
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600 font-medium">
                    per page
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="h-10"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, pagination.total_pages) },
                      (_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        );
                      }
                    )}
                    {pagination.total_pages > 5 && (
                      <>
                        <span className="px-2 text-gray-400">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(pagination.total_pages)}
                          className="w-10 h-10 p-0"
                        >
                          {pagination.total_pages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.total_pages, prev + 1)
                      )
                    }
                    disabled={currentPage === pagination.total_pages}
                    className="h-10"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Bulk Action Modal */}
          <Dialog
            open={isBulkActionModalOpen}
            onOpenChange={setIsBulkActionModalOpen}
          >
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center">
                  <MessageSquare className="w-6 h-6 mr-2 text-brand-600" />
                  Bulk Actions for {selectedLeads.length} Leads
                </DialogTitle>
                <DialogDescription>
                  Choose actions to perform and manage your selected leads below
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-8 pt-6">
                {/* Action Selection */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Select Action to Perform (Choose One)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          id: "Cold Email",
                          label: "Cold Email",
                          description: "Send personalized cold outreach emails",
                          icon: Mail,
                          color: "blue",
                          requiresEmail: true,
                        },
                        {
                          id: "LinkedIn Message",
                          label: "LinkedIn Message",
                          description: "Direct message via LinkedIn platform",
                          icon: LinkIcon,
                          color: "blue",
                          requiresEmail: false,
                        },
                        {
                          id: "First Follow-up",
                          label: "First Follow-up",
                          description: "Automated follow-up sequence",
                          icon: Clock,
                          color: "orange",
                          requiresEmail: true,
                        },
                        {
                          id: "Warm Introduction",
                          label: "Warm Introduction",
                          description: "Personalized introduction email",
                          icon: User,
                          color: "green",
                          requiresEmail: true,
                        },
                      ].map((action) => (
                        <Card
                          key={action.id}
                          className={`cursor-pointer transition-all ${
                            selectedActions.includes(action.id)
                              ? "ring-2 ring-brand-500 bg-brand-50"
                              : "hover:shadow-md border-gray-200"
                          }`}
                          onClick={() => handleBulkActionSelection(action.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="mt-1">
                                <div
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    selectedActions.includes(action.id)
                                      ? "border-brand-500 bg-brand-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedActions.includes(action.id) && (
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <action.icon
                                    className={`w-5 h-5 text-${action.color}-600`}
                                  />
                                  <span className="font-semibold">
                                    {action.label}
                                  </span>
                                  {action.requiresEmail && (
                                    <BadgeComponent
                                      variant="outline"
                                      className="text-xs text-orange-600 border-orange-200"
                                    >
                                      Requires Email
                                    </BadgeComponent>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">
                                  {action.description}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Lead Management */}
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <Users className="w-5 h-5 mr-2 text-gray-700" />
                        Manage Selected Leads (
                        {
                          bulkActionData.filter((l) => l.isSelected).length
                        } of {bulkActionData.length})
                        {selectedActions.length > 0 &&
                          selectedActions.some((action) =>
                            [
                              "Cold Email",
                              "First Follow-up",
                              "Warm Introduction",
                            ].includes(action)
                          ) && (
                            <BadgeComponent
                              variant="outline"
                              className="ml-2 text-xs text-orange-600 border-orange-200"
                            >
                              Email Required for {selectedActions[0]}
                            </BadgeComponent>
                          )}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsBulkActionModalOpen(false)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back to Select More
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const allSelected = bulkActionData.every(
                              (lead) => lead.isSelected
                            );
                            setBulkActionData((prev) =>
                              prev.map((lead) => ({
                                ...lead,
                                isSelected: !allSelected,
                              }))
                            );
                          }}
                        >
                          {bulkActionData.every((lead) => lead.isSelected)
                            ? "Deselect All"
                            : "Select All"}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {bulkActionData.map((lead, index) => {
                        const leadDetails = leadData.find(
                          (l) => l.id === lead.leadId
                        );
                        return (
                          <Card
                            key={lead.leadId}
                            className={`transition-all ${
                              lead.isSelected
                                ? "ring-2 ring-brand-500 bg-brand-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center space-x-4">
                                <Checkbox
                                  checked={lead.isSelected}
                                  onCheckedChange={() =>
                                    toggleLeadSelection(lead.leadId)
                                  }
                                  className="mt-1"
                                />

                                <div className="flex items-center space-x-3 flex-1">
                                  <img
                                    src={leadDetails?.profileImage}
                                    alt={lead.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-semibold text-gray-900 truncate">
                                        {lead.name}
                                      </h4>
                                      <div className="flex items-center space-x-2">
                                        {!lead.hasEmail && (
                                          <BadgeComponent
                                            variant="outline"
                                            className="text-red-600 border-red-200 bg-red-50"
                                          >
                                            <AlertCircle className="w-3 h-3 mr-1" />
                                            Missing Email
                                          </BadgeComponent>
                                        )}
                                        {leadDetails?.isImported && (
                                          <BadgeComponent
                                            variant="outline"
                                            className="text-orange-600 border-orange-200 bg-orange-50"
                                          >
                                            New Import
                                          </BadgeComponent>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">
                                      {leadDetails?.position} at{" "}
                                      {leadDetails?.company}
                                    </p>
                                    {/* Show email field only if action requires email */}
                                    {selectedActions.length > 0 &&
                                      selectedActions.some((action) =>
                                        [
                                          "Cold Email",
                                          "First Follow-up",
                                          "Warm Introduction",
                                        ].includes(action)
                                      ) && (
                                        <div className="flex items-center space-x-2">
                                          <Mail className="w-4 h-4 text-gray-400" />
                                          <Input
                                            placeholder="Enter email address"
                                            value={lead.email}
                                            onChange={(e) =>
                                              updateLeadEmail(
                                                lead.leadId,
                                                e.target.value
                                              )
                                            }
                                            className="h-8 text-sm flex-1"
                                            disabled={!lead.isSelected}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      toggleLeadSelection(lead.leadId)
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    {lead.isSelected ? (
                                      <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Plus className="w-4 h-4 text-gray-400" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setBulkActionData((prev) =>
                                        prev.filter(
                                          (l) => l.leadId !== lead.leadId
                                        )
                                      );
                                      setSelectedLeads((prev) =>
                                        prev.filter((id) => id !== lead.leadId)
                                      );
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Summary and Action Buttons */}
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4">
                          {selectedActions.length > 0 ? (
                            <BadgeComponent className="bg-brand-600 text-white">
                              {selectedActions[0]} Selected
                            </BadgeComponent>
                          ) : (
                            <BadgeComponent
                              variant="outline"
                              className="text-gray-600"
                            >
                              No Action Selected
                            </BadgeComponent>
                          )}
                          <BadgeComponent className="bg-green-600 text-white">
                            {bulkActionData.filter((l) => l.isSelected).length}{" "}
                            Leads Selected
                          </BadgeComponent>
                          {selectedActions.length > 0 &&
                            selectedActions.some((action) =>
                              [
                                "Cold Email",
                                "First Follow-up",
                                "Warm Introduction",
                              ].includes(action)
                            ) && (
                              <BadgeComponent
                                className={`${
                                  bulkActionData.filter(
                                    (l) => l.isSelected && l.hasEmail
                                  ).length ===
                                  bulkActionData.filter((l) => l.isSelected)
                                    .length
                                    ? "bg-green-600 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                              >
                                {
                                  bulkActionData.filter(
                                    (l) => l.isSelected && l.hasEmail
                                  ).length
                                }{" "}
                                /{" "}
                                {
                                  bulkActionData.filter((l) => l.isSelected)
                                    .length
                                }{" "}
                                with Email
                              </BadgeComponent>
                            )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {selectedActions.length > 0 &&
                          bulkActionData.filter((l) => l.isSelected).length > 0
                            ? (() => {
                                const selectedLeadsCount =
                                  bulkActionData.filter(
                                    (l) => l.isSelected
                                  ).length;
                                const requiresEmail = selectedActions.some(
                                  (action) =>
                                    [
                                      "Cold Email",
                                      "First Follow-up",
                                      "Warm Introduction",
                                    ].includes(action)
                                );
                                const leadsWithEmail = bulkActionData.filter(
                                  (l) => l.isSelected && l.hasEmail
                                ).length;

                                if (
                                  requiresEmail &&
                                  leadsWithEmail < selectedLeadsCount
                                ) {
                                  return `⚠️ ${
                                    selectedLeadsCount - leadsWithEmail
                                  } leads missing email for ${
                                    selectedActions[0]
                                  }`;
                                }
                                return `Ready to process ${selectedActions[0]} for ${selectedLeadsCount} leads`;
                              })()
                            : "Select an action and leads to proceed"}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setIsBulkActionModalOpen(false)}
                          disabled={isProcessingBulkAction}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={processBulkAction}
                          disabled={(() => {
                            if (
                              isProcessingBulkAction ||
                              selectedActions.length === 0 ||
                              bulkActionData.filter((l) => l.isSelected)
                                .length === 0
                            ) {
                              return true;
                            }

                            // Check if email is required and missing
                            const requiresEmail = selectedActions.some(
                              (action) =>
                                [
                                  "Cold Email",
                                  "First Follow-up",
                                  "Warm Introduction",
                                ].includes(action)
                            );
                            if (requiresEmail) {
                              const selectedLeadData = bulkActionData.filter(
                                (lead) => lead.isSelected
                              );
                              const leadsWithoutEmail = selectedLeadData.filter(
                                (lead) => !lead.hasEmail
                              );
                              return leadsWithoutEmail.length > 0;
                            }

                            return false;
                          })()}
                          className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400"
                        >
                          {isProcessingBulkAction ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4 mr-2" />
                              Execute{" "}
                              {selectedActions.length > 0
                                ? selectedActions[0]
                                : "Action"}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </DialogContent>
          </Dialog>

          {/* Lead Details Modal */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-2xl font-bold">
                  Lead Profile
                </DialogTitle>
              </DialogHeader>
              {selectedLead && (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-start space-x-6 pb-6 border-b">
                    <img
                      src={selectedLead.profileImage}
                      alt={selectedLead.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        {selectedLead.name}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {selectedLead.position}
                      </p>
                      <p className="text-gray-500">{selectedLead.company}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <Button
                          size="sm"
                          className="bg-brand-600 hover:bg-brand-700"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <LinkIcon className="w-4 h-4 mr-2" />
                          View LinkedIn
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          Contact Information
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              Email:
                            </span>
                            <p className="text-gray-600">
                              {selectedLead.email || "Not provided"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Location:
                            </span>
                            <p className="text-gray-600">
                              {selectedLead.location}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Company:
                            </span>
                            <p className="text-gray-600">
                              {selectedLead.companyName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          Professional Details
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">
                              About:
                            </span>
                            <p className="text-gray-600">
                              {selectedLead.aboutText ||
                                "No description available"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">
                              Skills:
                            </span>
                            <p className="text-gray-600">
                              {selectedLead.skills
                                ?.map((skill: any) => skill.skill)
                                .join(", ") || "No skills listed"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          Engagement Metrics
                        </h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">
                              Lead Score
                            </span>
                            <span className="font-bold text-lg">85%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">
                              Response Rate
                            </span>
                            <span className="font-bold text-lg">67%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">
                              Emails Sent
                            </span>
                            <span className="font-bold text-lg">3</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">
                          Links
                        </h4>
                        <div className="space-y-2">
                          <a
                            href={selectedLead.salesProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-brand-600 hover:text-brand-700 hover:underline"
                          >
                            LinkedIn Profile →
                          </a>
                          <a
                            href={selectedLead.companyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-brand-600 hover:text-brand-700 hover:underline"
                          >
                            Company Website →
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default 1;
