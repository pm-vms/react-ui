import { useState, useRef, useEffect } from "react"
import {
  Typography, Button, InputLabel, Select, MenuItem,
  Checkbox, Chip, Badge, Box, FormControl, OutlinedInput, ListItemText,
  Divider, IconButton, Grid, Stack, Paper
} from "@mui/material"
import { Add, Close, Search, Business, Group } from "@mui/icons-material"
import apiService from "../services/api"
import { useAuth } from "../contexts/AuthContext";



export default function LeadFiltersPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    company: [] as string[],
    location: [] as string[],
    category: [] as string[],
    employeeCount: [] as string[],
    industry: [] as string[],
    revenue: [] as string[],
    pastCompany: [] as string[],
    companyType: [] as string[],
    pastLocation: [] as string[],
    profileLanguage: [] as string[],
    yearsOfExperience: [] as string[],
    currentJobTitle: [] as string[],
    seniorityLevel: [] as string[],
    pastJobTitle: [] as string[],
    yearsInCurrentCompany: [] as string[],
    connections: [] as string[],
    companyHeadquarters: [] as string[],
  })

  // --- Email Type State ---
  const [emailType, setEmailType] = useState("first email")

  const [savedFilters, setSavedFilters] = useState([])

  // --- Dropdown Option States ---
  const [companyOptions, setCompanyOptions] = useState<any[]>([])
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false)
  const companyLoaded = useRef(false)
  const [companySearch, setCompanySearch] = useState("")
  const companySearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const [locationOptions, setLocationOptions] = useState<any[]>([])
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false)
  const locationLoaded = useRef(false)
  const [locationSearch, setLocationSearch] = useState("")
  const locationSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const [categoryOptions, setCategoryOptions] = useState<any[]>([])
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const categoryLoaded = useRef(false)
  const [categorySearch, setCategorySearch] = useState("")
  const categorySearchTimeout = useRef<NodeJS.Timeout | null>(null)
  
  const [companyTypeOptions, setCompanyTypeOptions] = useState<any[]>([])
  const [companyTypeDropdownOpen, setCompanyTypeDropdownOpen] = useState(false)
  const companyTypeLoaded = useRef(false)
  const [companyTypeSearch, setCompanyTypeSearch] = useState("")
  const companyTypeSearchTimeout = useRef<NodeJS.Timeout | null>(null)
  
  const [pastCompanyOptions, setPastCompanyOptions] = useState<any[]>([])
  const [pastCompanyDropdownOpen, setPastCompanyDropdownOpen] = useState(false)
  const pastCompanyLoaded = useRef(false)

  // Add missing dropdown option states
  const [yearsOfExperienceOptions, setYearsOfExperienceOptions] = useState<any[]>([])
  const [profileLanguageOptions, setProfileLanguageOptions] = useState<any[]>([])
  const [seniorityLevelOptions, setSeniorityLevelOptions] = useState<any[]>([])
  const [pastJobTitleOptions, setPastJobTitleOptions] = useState<any[]>([])
  const [currentJobTitleOptions, setCurrentJobTitleOptions] = useState<any[]>([])
  const [industryOptions, setIndustryOptions] = useState<any[]>([])
  const [yearsInCurrentCompanyOptions, setYearsInCurrentCompanyOptions] = useState<any[]>([])
  const [connectionsOptions, setConnectionsOptions] = useState<any[]>([])
  const [companyHeadquartersOptions, setCompanyHeadquartersOptions] = useState<any[]>([])
  const [employeeCountOptions, setEmployeeCountOptions] = useState<any[]>([])

  // --- Dynamic Current Job Title ---
  const [currentJobTitleSearch, setCurrentJobTitleSearch] = useState("")
  const currentJobTitleSearchTimeout = useRef<NodeJS.Timeout | null>(null)
  const currentJobTitleSearchFirstLoad = useRef(false)

  // --- Dynamic Seniority Level ---
  const [seniorityLevelSearch, setSeniorityLevelSearch] = useState("")
  const seniorityLevelSearchTimeout = useRef<NodeJS.Timeout | null>(null)
  const seniorityLevelSearchFirstLoad = useRef(false)

  // --- Dynamic Industry ---
  const [industrySearch, setIndustrySearch] = useState("")
  const industrySearchTimeout = useRef<NodeJS.Timeout | null>(null)
  const industryFirstLoad = useRef(false)

  // --- Dynamic past company ---
  const [pastCompanySearch, setPastCompanySearch] = useState("")
  const pastCompanySearchTimeout = useRef<NodeJS.Timeout | null>(null)
  const pastCompanySearchFirstLoad = useRef(false)

  // --- Dynamic Profile Language ---
  const [profileLanguageDropdownOpen, setProfileLanguageDropdownOpen] = useState(false)
  const profileLanguageLoaded = useRef(false)
  const [profileLanguageSearch, setProfileLanguageSearch] = useState("")
  const profileLanguageSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- Dynamic Years of Experience ---
  const [yearsOfExperienceDropdownOpen, setYearsOfExperienceDropdownOpen] = useState(false)
  const yearsOfExperienceLoaded = useRef(false)
  const [yearsOfExperienceSearch, setYearsOfExperienceSearch] = useState("")
  const yearsOfExperienceSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- Dynamic Past Location ---
  const [companyHeadquartersDropdownOpen, setCompanyHeadquartersDropdownOpen] = useState(false)
  const companyHeadquartersLoaded = useRef(false)
  const [companyHeadquartersSearch, setCompanyHeadquartersSearch] = useState("")
  const companyHeadquartersSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const [employeeCountDropdownOpen, setEmployeeCountDropdownOpen] = useState(false)
  const employeeCountLoaded = useRef(false)
  const [employeeCountSearch, setEmployeeCountSearch] = useState("")
  const employeeCountSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  // --- Dropdown Open Handlers (fetch only once) ---
  const handleCompanyDropdownOpen = async () => {
    setCompanyDropdownOpen(true)
    if (!companyLoaded.current) {
      const data = await apiService.fetchOptions("COMPANY_WITH_LIST", "")
      setCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      companyLoaded.current = true
    }
  }
  const handleLocationDropdownOpen = async () => {
    setLocationDropdownOpen(true)
    if (!locationLoaded.current) {
      const data = await apiService.fetchOptions("BING_GEO", "")
      setLocationOptions(Array.isArray(data) ? data : data?.data || [])
      locationLoaded.current = true
    }
  }
  const handleCategoryDropdownOpen = async () => {
    setCategoryDropdownOpen(true)
    if (!categoryLoaded.current) {
      const data = await apiService.fetchOptions("FUNCTION", "")
      setCategoryOptions(Array.isArray(data) ? data : data?.data || [])
      categoryLoaded.current = true
    }
  }

  const handlePastCompanyDropdownOpen = async () => {
    setPastCompanyDropdownOpen(true)
    if (!pastCompanyLoaded.current) {
      const data = await apiService.fetchOptions("COMPANY_WITH_LIST", "")
      setPastCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      pastCompanyLoaded.current = true
    }
  }

  const handleCompanyTypeDropdownOpen = async () => {
    setCompanyTypeDropdownOpen(true)
    if (!companyTypeLoaded.current) {
      const data = await apiService.fetchOptions("COMPANY_TYPE", "")
      setCompanyTypeOptions(Array.isArray(data) ? data : data?.data || [])
      companyTypeLoaded.current = true
    }
  }

  const handleProfileLanguageDropdownOpen = async () => {
    setProfileLanguageDropdownOpen(true)
    if (!profileLanguageLoaded.current) {
      const data = await apiService.fetchOptions("PROFILE_LANGUAGE", "")
      setProfileLanguageOptions(Array.isArray(data) ? data : data?.data || [])
      profileLanguageLoaded.current = true
    }
  }

  const handleYearsOfExperienceDropdownOpen = async () => {
    setYearsOfExperienceDropdownOpen(true)
    if (!yearsOfExperienceLoaded.current) {
      const data = await apiService.fetchOptions("TENURE", "")
      setYearsOfExperienceOptions(Array.isArray(data) ? data : data?.data || [])
      yearsOfExperienceLoaded.current = true
    }
  }

  const handleCompanyHeadquartersDropdownOpen = async () => {
    setCompanyHeadquartersDropdownOpen(true)
    if (!companyHeadquartersLoaded.current) {
      const data = await apiService.fetchOptions("BING_GEO", "")
      setCompanyHeadquartersOptions(Array.isArray(data) ? data : data?.data || [])
      companyHeadquartersLoaded.current = true
    }
  }
  const handleEmployeeCountDropdownOpen = async () => {
    setEmployeeCountDropdownOpen(true)
    if (!employeeCountLoaded.current) {
      const data = await apiService.fetchOptions("COMPANY_SIZE", "")
      setEmployeeCountOptions(Array.isArray(data) ? data : data?.data || [])
      employeeCountLoaded.current = true
    }
  }

  // --- New: Function dropdown handlers
  const [functionOptions, setFunctionOptions] = useState<any[]>([])
  const [functionDropdownOpen, setFunctionDropdownOpen] = useState(false)
  const functionLoaded = useRef(false)
  const [functionSearch, setFunctionSearch] = useState("")
  const functionSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleFunctionDropdownOpen = async () => {
    setFunctionDropdownOpen(true)
    if (!functionLoaded.current) {
      const data = await apiService.fetchOptions("FUNCTION", "")
      setFunctionOptions(Array.isArray(data) ? data : data?.data || [])
      functionLoaded.current = true
    }
  }

  const [currentJobTitleDropdownOpen, setCurrentJobTitleDropdownOpen] = useState(false)
  const currentJobTitleSearchFirstLoaded = useRef(false)
  const handleCurrentJobTitleDropdownOpen = async () => {
    setCurrentJobTitleDropdownOpen(true)
    if (!currentJobTitleSearchFirstLoad.current) {
      const data = await apiService.fetchOptions("TITLE", "")
      setCurrentJobTitleOptions(Array.isArray(data) ? data : data?.data || [])
      currentJobTitleSearchFirstLoad.current = true
    }
  }

  // --- New: Industry dropdown handlers
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false)
  const industryLoaded = useRef(false)

  const handleIndustryDropdownOpen = async () => {
    setIndustryDropdownOpen(true)
    if (!industryFirstLoad.current) {
      const data = await apiService.fetchOptions("INDUSTRY", "")
      setIndustryOptions(Array.isArray(data) ? data : data?.data || [])
      industryFirstLoad.current = true
    }
  }

  // Add these state variables
  const [seniorityLevelDropdownOpen, setSeniorityLevelDropdownOpen] = useState(false)

  // Add these handler functions
  const handleSeniorityLevelDropdownOpen = async () => {
    setSeniorityLevelDropdownOpen(true)
    if (!seniorityLevelSearchFirstLoad.current) {
      const data = await apiService.fetchOptions("SENIORITY", "")
      setSeniorityLevelOptions(Array.isArray(data) ? data : data?.data || [])
      seniorityLevelSearchFirstLoad.current = true
    }
  }

  const handleSeniorityLevelSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSeniorityLevelSearch(value)
    if (seniorityLevelSearchTimeout.current) clearTimeout(seniorityLevelSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      seniorityLevelSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("SENIORITY", value)
        setSeniorityLevelOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- Past Job Title handlers ---
  const [pastJobTitleDropdownOpen, setPastJobTitleDropdownOpen] = useState(false)
  const pastJobTitleLoaded = useRef(false)
  const [pastJobTitleSearch, setPastJobTitleSearch] = useState("")
  const pastJobTitleSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handlePastJobTitleDropdownOpen = async () => {
    setPastJobTitleDropdownOpen(true)
    if (!pastJobTitleLoaded.current) {
      const data = await apiService.fetchOptions("TITLE", "")
      setPastJobTitleOptions(Array.isArray(data) ? data : data?.data || [])
      pastJobTitleLoaded.current = true
    }
  }

  const handlePastJobTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPastJobTitleSearch(value)
    if (pastJobTitleSearchTimeout.current) clearTimeout(pastJobTitleSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      pastJobTitleSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("TITLE", value)
        setPastJobTitleOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- Years in Current Company handlers ---
  const [yearsInCurrentCompanyDropdownOpen, setYearsInCurrentCompanyDropdownOpen] = useState(false)
  const yearsInCurrentCompanyLoaded = useRef(false)
  const [yearsInCurrentCompanySearch, setYearsInCurrentCompanySearch] = useState("")
  const yearsInCurrentCompanySearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleYearsInCurrentCompanyDropdownOpen = async () => {
    setYearsInCurrentCompanyDropdownOpen(true)
    if (!yearsInCurrentCompanyLoaded.current) {
      const data = await apiService.fetchOptions("TENURE", "")
      setYearsInCurrentCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      yearsInCurrentCompanyLoaded.current = true
    }
  }

  const handleYearsInCurrentCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setYearsInCurrentCompanySearch(value)
    if (yearsInCurrentCompanySearchTimeout.current) clearTimeout(yearsInCurrentCompanySearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      yearsInCurrentCompanySearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("TENURE", value)
        setYearsInCurrentCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- Connections handlers ---
  const [connectionsDropdownOpen, setConnectionsDropdownOpen] = useState(false)
  const connectionsLoaded = useRef(false)
  const [connectionsSearch, setConnectionsSearch] = useState("")
  const connectionsSearchTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleConnectionsDropdownOpen = async () => {
    setConnectionsDropdownOpen(true)
    if (!connectionsLoaded.current) {
      const data = await apiService.fetchOptions("RELATIONSHIP", "")
      setConnectionsOptions(Array.isArray(data) ? data : data?.data || [])
      connectionsLoaded.current = true
    }
  }

  const handleConnectionsSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConnectionsSearch(value)
    if (connectionsSearchTimeout.current) clearTimeout(connectionsSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      connectionsSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("RELATIONSHIP", value)
        setConnectionsOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- Helper for multi-select add/remove ---
  const handleMultiSelect = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const arr = prev[field] as string[]
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((v) => v !== value) }
      } else {
        return { ...prev, [field]: [...arr, value] }
      }
    })
  }

  // --- Search Handlers for Dropdowns (3-letter constraint, debounced) ---
  const handleCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCompanySearch(value)
    if (companySearchTimeout.current) clearTimeout(companySearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      companySearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("COMPANY_WITH_LIST", value)
        setCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleLocationSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocationSearch(value)
    if (locationSearchTimeout.current) clearTimeout(locationSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      locationSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("BING_GEO", value)
        setLocationOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handlePastCompanySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPastCompanySearch(value)
    if (pastCompanySearchTimeout.current) clearTimeout(pastCompanySearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      pastCompanySearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("COMPANY_WITH_LIST", value)
        setPastCompanyOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleCategorySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCategorySearch(value)
    if (categorySearchTimeout.current) clearTimeout(categorySearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      categorySearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("FUNCTION", value)
        setCategoryOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleCompanyTypeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCompanyTypeSearch(value)
    if (companyTypeSearchTimeout.current) clearTimeout(companyTypeSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      companyTypeSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("COMPANY_TYPE", value)
        setCompanyTypeOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleProfileLanguageSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setProfileLanguageSearch(value)
    if (profileLanguageSearchTimeout.current) clearTimeout(profileLanguageSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      profileLanguageSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("PROFILE_LANGUAGE", value)
        setProfileLanguageOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleYearsOfExperienceSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setYearsOfExperienceSearch(value)
    if (yearsOfExperienceSearchTimeout.current) clearTimeout(yearsOfExperienceSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      yearsOfExperienceSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("YEARS_OF_EXPERIENCE", value)
        setYearsOfExperienceOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleCompanyHeadquartersSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCompanyHeadquartersSearch(value)
    if (companyHeadquartersSearchTimeout.current) clearTimeout(companyHeadquartersSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      companyHeadquartersSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("BING_GEO", value)
        setCompanyHeadquartersOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleEmployeeCountSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmployeeCountSearch(value)
    if (employeeCountSearchTimeout.current) clearTimeout(employeeCountSearchTimeout.current)
      employeeCountSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("COMPANY_SIZE", value)
        setEmployeeCountOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
  }

  // --- New: Function search handler
  const handleFunctionSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFunctionSearch(value)
    if (functionSearchTimeout.current) clearTimeout(functionSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      functionSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("FUNCTION", value)
        setFunctionOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  const handleCurrentJobTitleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCurrentJobTitleSearch(value)
    if (currentJobTitleSearchTimeout.current) clearTimeout(currentJobTitleSearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      currentJobTitleSearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("TITLE", value)
        setCurrentJobTitleOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- New: Industry search handler
  const handleIndustrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIndustrySearch(value)
    if (industrySearchTimeout.current) clearTimeout(industrySearchTimeout.current)
    if (value.length >= 3 || value.length === 0) {
      industrySearchTimeout.current = setTimeout(async () => {
        const data = await apiService.fetchOptions("INDUSTRY", value)
        setIndustryOptions(Array.isArray(data) ? data : data?.data || [])
      }, 300)
    }
  }

  // --- Helper for removing badge ---
  const handleRemoveBadge = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].filter((v: string) => v !== value),
    }))
  }

  // --- SSR hydration mismatch fix for default values ---
  // These should only be set on the client to avoid SSR/client mismatch
  const [exportCount, setExportCount] = useState("25")
  const [exportOffset, setExportOffset] = useState("0")
  const [exportFileName, setExportFileName] = useState("output")

  let queryParam = "";

  const handleApplyFilters = async () => {
    // --- Begin LinkedIn URL generation logic ---
    // Define mapping of filter keys to LinkedIn filter types and options
    const filterFieldMap: Record<string, { filterType: string; options?: any[] }> = {
      company: { filterType: "CURRENT_COMPANY", options: companyOptions },
      employeeCount: { filterType: "COMPANY_HEADCOUNT", options: employeeCountOptions }, // No options for employee count
      location: { filterType: "REGION", options: locationOptions },
      category: { filterType: "FUNCTION", options: categoryOptions },
      industry: { filterType: "INDUSTRY", options: industryOptions },
      revenue: { filterType: "ANNUAL_REVENUE" },
      pastCompany: { filterType: "PAST_COMPANY", options: pastCompanyOptions },
      companyType: { filterType: "COMPANY_TYPE", options: companyTypeOptions },
      profileLanguage: { filterType: "PROFILE_LANGUAGE", options: profileLanguageOptions },
      yearsOfExperience: { filterType: "YEARS_OF_EXPERIENCE", options: yearsOfExperienceOptions },
      currentJobTitle: { filterType: "CURRENT_TITLE", options: currentJobTitleOptions },
      seniorityLevel: { filterType: "SENIORITY_LEVEL", options: seniorityLevelOptions },
      pastJobTitle: { filterType: "PAST_TITLE", options: pastJobTitleOptions },
      yearsInCurrentCompany: { filterType: "YEARS_AT_CURRENT_COMPANY", options: yearsInCurrentCompanyOptions },
      connections: { filterType: "RELATIONSHIP", options: connectionsOptions },
      companyHeadquarters: { filterType: "COMPANY_HEADQUARTERS", options: companyHeadquartersOptions },
    };

    const filterList = [];
    let canSubmitRequest = false;
    Object.entries(filters).forEach(([key, values]) => {
      if (!values || values.length === 0) return;
      const fieldMeta = filterFieldMap[key];
      if (!fieldMeta) return;
      let selectedValues = [];
      const options = fieldMeta.options;

      selectedValues = (values as string[]).map((v) => {
        let label = v;
        if (options) {
          const opt = options.find((o: any) => o.id === v);
          label = opt?.displayValue || v;
        }
        return {
          id: v,
          text: encodeURIComponent(label),
          selectionType: "INCLUDED",
        };
      });

      if (selectedValues.length > 0) {
        const valueList = selectedValues
          .map(
            (v) => `(id:${v.id},text:${v.text},selectionType:${v.selectionType})`
          )
          .join(",");
        filterList.push(
          `(type:${fieldMeta.filterType},values:List(${valueList}))`
        );
        canSubmitRequest = true;
      }
    });

    if (!canSubmitRequest) {
      alert("Please select at least one filter.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to apply these filters?"
    );
    if (!confirmed) {
      console.log("Submission cancelled by user.");
      return;
    }
    console.log("Filters applied:", filterList);
    const filtersParam = `List(${filterList.join(",")})`;
    queryParam = `(recentSearchParam:(doLogHistory:true),filters:${filtersParam})`;
    const fullURL = `https://www.linkedin.com/sales/search/people?query=${encodeURIComponent(
      queryParam
    )}&viewAllFilters=true`;

    // --- New: Get count, offset, fileName from form ---
    const count = parseInt(exportCount, 10) || 1
    const offset = parseInt(exportOffset, 10) || 0
    const fileName = exportFileName || "output"
    const payload = {
      linkedInUrl: fullURL,
      timestamp: new Date().toISOString(),
      filtersApplied: filterList,
      count,
      offset,
      fileName,
      emailType, // include selected email type
      userId: user?.id, // Include user ID for tracking
    };
    
    // Send payload to webhook
    try {
      const response = await fetch('http://localhost:5678/webhook-test/7534bb49-5001-418c-af65-3f2b2e0984fd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        console.log('Webhook called successfully');
        alert('Filters applied and workflow started successfully!');
      } else {
        console.error('Webhook call failed', await response.text());
        alert('Filters applied but workflow failed.');
      }
    } catch (error) {
      console.error('Error calling webhook:', error);
      alert('Filters applied but workflow failed due to an error.');
    }
  }

  // Save filter API integration
  const handleSaveFilter = async () => {
    const filterName = window.prompt("Enter a name for this filter:", `Filter ${savedFilters.length + 1}`)
    if (!filterName) return

    // Ensure queryParam is available (call handleApplyFilters first if needed)
    // If not, you can reconstruct it here using the same logic as handleApplyFilters
    // For simplicity, let's reconstruct it here:
    const filterList = [];
    const filterFieldMap: Record<string, { filterType: string; options?: any[] }> = {
      company: { filterType: "CURRENT_COMPANY", options: companyOptions },
      employeeCount: { filterType: "COMPANY_HEADCOUNT", options: employeeCountOptions },
      location: { filterType: "REGION", options: locationOptions },
      category: { filterType: "FUNCTION", options: categoryOptions },
      industry: { filterType: "INDUSTRY", options: industryOptions },
      revenue: { filterType: "ANNUAL_REVENUE" },
      pastCompany: { filterType: "PAST_COMPANY", options: pastCompanyOptions },
      companyType: { filterType: "COMPANY_TYPE", options: companyTypeOptions },
      profileLanguage: { filterType: "PROFILE_LANGUAGE", options: profileLanguageOptions },
      yearsOfExperience: { filterType: "YEARS_OF_EXPERIENCE", options: yearsOfExperienceOptions },
      currentJobTitle: { filterType: "CURRENT_TITLE", options: currentJobTitleOptions },
      seniorityLevel: { filterType: "SENIORITY_LEVEL", options: seniorityLevelOptions },
      pastJobTitle: { filterType: "PAST_TITLE", options: pastJobTitleOptions },
      yearsInCurrentCompany: { filterType: "YEARS_AT_CURRENT_COMPANY", options: yearsInCurrentCompanyOptions },
      connections: { filterType: "RELATIONSHIP", options: connectionsOptions },
      companyHeadquarters: { filterType: "COMPANY_HEADQUARTERS", options: companyHeadquartersOptions },
    };
    Object.entries(filters).forEach(([key, values]) => {
      if (!values || values.length === 0) return;
      const fieldMeta = filterFieldMap[key];
      if (!fieldMeta) return;
      let selectedValues = [];
      const options = fieldMeta.options;
      selectedValues = (values as string[]).map((v) => {
        let label = v;
        if (options) {
          const opt = options.find((o: any) => o.id === v);
          label = opt?.displayValue || v;
        }
        return {
          id: v,
          text: encodeURIComponent(label),
          selectionType: "INCLUDED",
        };
      });
      if (selectedValues.length > 0) {
        const valueList = selectedValues
          .map(
            (v) => `(id:${v.id},text:${v.text},selectionType:${v.selectionType})`
          )
          .join(",");
        filterList.push(
          `(type:${fieldMeta.filterType},values:List(${valueList}))`
        );
      }
    });
    const filtersParam = `List(${filterList.join(",")})`;
    const queryParam = `(recentSearchParam:(doLogHistory:true),filters:${filtersParam})`;

    const payload = {
      filters: queryParam,
      count: exportCount,
      offset: exportOffset,
      fileName: exportFileName,
      emailType,
    }
    try {
      await apiService.saveFilters(payload,filterName)
      // Refresh filter list after save
      const res = await apiService.getFilters();
      const data = res?.data || []
      setSavedFilters(Array.isArray(data) ? data : [])
      alert("Filter saved successfully!")
    } catch (err) {
      alert("Failed to save filter.")
    }
  }

  // When user clicks a saved filter, fetch and apply its filters
  const handleSelectSavedFilter = async (filter) => {
    if (!filter || !filter.id) return
    try {
      const filterId = typeof filter.id === 'string' ? filter.id : filter.id.toString();
      console.log("Loading filter with ID:", filterId);
      
      const response = await apiService.getFilterById(filterId);
      if (!response || !response.data) {
        console.error("No data returned from getFilterById");
        return;
      }
      
      const data = response.data;
      console.log("Filter data received:", data);
      
      // Set basic filter properties from the response
      setExportCount(data.filters?.count || "25");
      setExportOffset(data.filters?.offset || "0");
      setExportFileName(data.filters?.fileName || "output");
      setEmailType(data.filters?.emailType || "first email");
      
      // Parse the LinkedIn filter string to extract filter values
      const filterString = data.filters?.filters;
      
      // Reset current filters
      const emptyFilters = {
        company: [],
        location: [],
        category: [],
        employeeCount: [],
        industry: [],
        revenue: [],
        pastCompany: [],
        companyType: [],
        pastLocation: [],
        profileLanguage: [],
        yearsOfExperience: [],
        currentJobTitle: [],
        seniorityLevel: [],
        pastJobTitle: [],
        yearsInCurrentCompany: [],
        connections: [],
        companyHeadquarters: [],
      };
      
      // Make sure all dropdowns are closed before applying new filters
      setCompanyDropdownOpen(false);
      setLocationDropdownOpen(false);
      setCategoryDropdownOpen(false);
      setCompanyTypeDropdownOpen(false);
      setPastCompanyDropdownOpen(false);
      setEmployeeCountDropdownOpen(false);
      setCompanyHeadquartersDropdownOpen(false);
      setProfileLanguageDropdownOpen(false);
      setYearsOfExperienceDropdownOpen(false);
      setIndustryDropdownOpen(false);
      setFunctionDropdownOpen(false);
      setCurrentJobTitleDropdownOpen(false);
      setSeniorityLevelDropdownOpen(false);
      setPastJobTitleDropdownOpen(false);
      setYearsInCurrentCompanyDropdownOpen(false);
      setConnectionsDropdownOpen(false);
      
      // Load all necessary options in the background without opening dropdowns
      const loadOptions = async () => {
        try {
          await Promise.all([
            !companyLoaded.current ? apiService.fetchOptions("COMPANY_WITH_LIST", "").then(data => {
              setCompanyOptions(Array.isArray(data) ? data : data?.data || []);
              companyLoaded.current = true;
            }) : Promise.resolve(),
            
            !locationLoaded.current ? apiService.fetchOptions("BING_GEO", "").then(data => {
              setLocationOptions(Array.isArray(data) ? data : data?.data || []);
              locationLoaded.current = true;
            }) : Promise.resolve(),
            
            !categoryLoaded.current ? apiService.fetchOptions("FUNCTION", "").then(data => {
              setCategoryOptions(Array.isArray(data) ? data : data?.data || []);
              categoryLoaded.current = true;
            }) : Promise.resolve(),
            
            !employeeCountLoaded.current ? apiService.fetchOptions("COMPANY_SIZE", "").then(data => {
              setEmployeeCountOptions(Array.isArray(data) ? data : data?.data || []);
              employeeCountLoaded.current = true;
            }) : Promise.resolve(),
            
            !companyTypeLoaded.current ? apiService.fetchOptions("COMPANY_TYPE", "").then(data => {
              setCompanyTypeOptions(Array.isArray(data) ? data : data?.data || []);
              companyTypeLoaded.current = true;
            }) : Promise.resolve(),
            
            !companyHeadquartersLoaded.current ? apiService.fetchOptions("BING_GEO", "").then(data => {
              setCompanyHeadquartersOptions(Array.isArray(data) ? data : data?.data || []);
              companyHeadquartersLoaded.current = true;
            }) : Promise.resolve(),
            
            !industryFirstLoad.current ? apiService.fetchOptions("INDUSTRY", "").then(data => {
              setIndustryOptions(Array.isArray(data) ? data : data?.data || []);
              industryFirstLoad.current = true;
            }) : Promise.resolve(),
            
            !pastCompanyLoaded.current ? apiService.fetchOptions("COMPANY_WITH_LIST", "").then(data => {
              setPastCompanyOptions(Array.isArray(data) ? data : data?.data || []);
              pastCompanyLoaded.current = true;
            }) : Promise.resolve(),
          ]);
        } catch (error) {
          console.error("Error loading options:", error);
        }
      };
      
      // Start loading options in the background
      loadOptions();
      
      // Parse the filter string to extract values
      if (filterString && typeof filterString === 'string') {
        try {
          console.log("Parsing filter string:", filterString);
          
          // Create a mapping from LinkedIn filter types to our state filter keys
          const filterTypeToKey = {
            'COMPANY_HEADCOUNT': 'employeeCount',
            'COMPANY_TYPE': 'companyType',
            'COMPANY_HEADQUARTERS': 'companyHeadquarters',
            'CURRENT_COMPANY': 'company',
            'REGION': 'location',
            'FUNCTION': 'category',
            'INDUSTRY': 'industry',
            'PAST_COMPANY': 'pastCompany',
            'PROFILE_LANGUAGE': 'profileLanguage',
            'YEARS_OF_EXPERIENCE': 'yearsOfExperience',
            'CURRENT_TITLE': 'currentJobTitle',
            'SENIORITY_LEVEL': 'seniorityLevel',
            'PAST_TITLE': 'pastJobTitle',
            'YEARS_AT_CURRENT_COMPANY': 'yearsInCurrentCompany',
            'RELATIONSHIP': 'connections',
          };
          
          const newFilters = { ...emptyFilters };
          
          // Extract filter types and values
          const typeMatches = filterString.match(/\(type:([^,]+),values:List\((.*?)\)\)/g);
          
          if (typeMatches) {
            for (const typeMatch of typeMatches) {
              const typeRegex = /\(type:([^,]+),/;
              const typeResult = typeRegex.exec(typeMatch);
              
              if (typeResult && typeResult[1]) {
                const filterType = typeResult[1];
                const stateKey = filterTypeToKey[filterType];
                
                if (stateKey) {
                  // Extract IDs from the values section
                  const valueMatches = typeMatch.match(/\(id:([^,]+),/g);
                  
                  if (valueMatches) {
                    const filterValues = valueMatches.map(vm => {
                      const idRegex = /\(id:([^,]+),/;
                      const idMatch = idRegex.exec(vm);
                      return idMatch ? idMatch[1] : null;
                    }).filter(id => id !== null);
                    
                    newFilters[stateKey] = filterValues;
                    console.log(`Set ${stateKey} to:`, filterValues);
                  }
                }
              }
            }
          }
          
          // Wait a brief moment to ensure all dropdowns have closed before applying filters
          setTimeout(() => {
            // Apply the parsed filters
            setFilters(newFilters);
          }, 100);
          
        } catch (parseErr) {
          console.error("Error parsing filter string:", parseErr);
        }
      }
      
    } catch (err) {
      console.error("Error loading filter:", err);
      alert("Failed to load filter.");
    }
  }

  // Update the SearchableSelect implementation to create a more integrated search experience
  const SearchableSelect = ({ 
    value, 
    onChange, 
    options, 
    label, 
    searchValue, 
    onSearchChange, 
    placeholder, 
    selected, 
    onRemove,
    onOpen,
    onClose,
    open
  }) => {
    const searchInputRef = useRef(null);
    
    // Add a search field inside the Select component
    const customMenuProps = {
      PaperProps: {
        style: { maxHeight: 300 }
      }
    };

    // When dropdown opens, we need to focus the search field
    const handleClick = () => {
      if (!open) {
        onOpen();
      }
    };

    return (
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          multiple
          value={value}
          onChange={onChange}
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          onClick={handleClick}
          input={<OutlinedInput label={label} />}
          renderValue={selected => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map(val => {
                const opt = options.find(o => o.id === val);
                return (
                  <Chip
                    key={val}
                    label={opt?.displayValue || val}
                    onDelete={() => onRemove(val)}
                    size="small"
                    sx={{ borderRadius: 1 }}
                  />
                );
              })}
            </Box>
          )}
          MenuProps={customMenuProps}
        >
          <Box 
            sx={{ 
              p: 1, 
              position: 'sticky', 
              top: 0,
              bgcolor: 'background.paper',
              zIndex: 1,
              borderBottom: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            <OutlinedInput
              ref={searchInputRef}
              autoFocus
              fullWidth
              placeholder={placeholder}
              value={searchValue}
              onChange={onSearchChange}
              size="small"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key !== 'Escape' && e.key !== 'Tab') {
                  e.stopPropagation();
                }
              }}
              startAdornment={
                <Search sx={{ mr: 1, color: 'action.active' }} fontSize="small" />
              }
            />
          </Box>
          {options.length > 0 ? (
            options.map(opt => (
              <MenuItem key={opt.id} value={opt.id}>
                <Checkbox checked={selected.includes(opt.id)} />
                <ListItemText primary={opt.displayValue} />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <ListItemText primary="No results found" />
            </MenuItem>
          )}
        </Select>
      </FormControl>
    );
  };

  // Add this state definition near the top with other state variables
  const [loadingFilters, setLoadingFilters] = useState(false)

  // Fetch saved filters on component mount
  useEffect(() => {
    setLoadingFilters(true)
    apiService.getFilters().then((res) => {
      const data = res?.data || []
      setSavedFilters(Array.isArray(data) ? data : [])
      setLoadingFilters(false)
    }).catch(() => {
      setLoadingFilters(false)
    })
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Filters</h1>
        <p className="text-gray-600">Configure filters to target specific leads</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Filters Section */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Filter Configuration</h2>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleSaveFilter}
                className="rounded-md font-semibold normal-case"
                sx={{ boxShadow: "none", textTransform: "none" }}
              >
                Save Filter
              </Button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-8">
              {/* Company */}
              <div>
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">Company</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                    <SearchableSelect 
                      value={filters.company}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, company: value }));
                      }}
                      options={companyOptions}
                      label="Current Company"
                      searchValue={companySearch}
                      onSearchChange={handleCompanySearch}
                      placeholder="Search company..."
                      selected={filters.company}
                      onRemove={(val) => handleRemoveBadge("company", val)}
                      onOpen={handleCompanyDropdownOpen}
                      onClose={() => setCompanyDropdownOpen(false)}
                      open={companyDropdownOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Type</label>
                    <SearchableSelect 
                      value={filters.companyType}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, companyType: value }));
                      }}
                      options={companyTypeOptions}
                      label="Company Type"
                      searchValue={companyTypeSearch}
                      onSearchChange={handleCompanyTypeSearch}
                      placeholder="Search company type..."
                      selected={filters.companyType}
                      onRemove={(val) => handleRemoveBadge("companyType", val)}
                      onOpen={handleCompanyTypeDropdownOpen}
                      onClose={() => setCompanyTypeDropdownOpen(false)}
                      open={companyTypeDropdownOpen}
                    />
                  </div>
                </div>
              </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Headquarters</label>
                    <SearchableSelect 
                      value={filters.companyHeadquarters}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, companyHeadquarters: value }));
                      }}
                      options={companyHeadquartersOptions}
                      label="Past Location"
                      searchValue={companyHeadquartersSearch}
                      onSearchChange={handleCompanyHeadquartersSearch}
                      placeholder="Search past location..."
                      selected={filters.companyHeadquarters}
                      onRemove={(val) => handleRemoveBadge("companyHeadquarters", val)}
                      onOpen={handleCompanyHeadquartersDropdownOpen}
                      onClose={() => setCompanyHeadquartersDropdownOpen(false)}
                      open={companyHeadquartersDropdownOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee Count</label>
                    <SearchableSelect 
                      value={filters.employeeCount}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, employeeCount: value }));
                      }}
                      options={employeeCountOptions}
                      label="Employee Count"
                      searchValue={employeeCountSearch}
                      onSearchChange={handleEmployeeCountSearch}
                      placeholder="Search employee count..."
                      selected={filters.employeeCount}
                      onRemove={(val) => handleRemoveBadge("employeeCount", val)}
                      onOpen={handleEmployeeCountDropdownOpen}
                      onClose={() => setEmployeeCountDropdownOpen(false)}
                      open={employeeCountDropdownOpen}
                  />
                </div>
              </div>

              {/* Category */}
                <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Past Company</label>
                    <SearchableSelect 
                      value={filters.pastCompany}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, pastCompany: value }));
                      }}
                      options={pastCompanyOptions}
                      label="Past Company"
                      searchValue={pastCompanySearch}
                      onSearchChange={handlePastCompanySearch}
                      placeholder="Search past company..."
                      selected={filters.pastCompany}
                      onRemove={(val) => handleRemoveBadge("pastCompany", val)}
                      onOpen={handlePastCompanyDropdownOpen}
                      onClose={() => setPastCompanyDropdownOpen(false)}
                      open={pastCompanyDropdownOpen}
                    />
                  </div>
                </div>
              {/* </div> */}

              {/* <div> */}
                <div className="py-2">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">Personal</h3>
                </div>
                
                {/* Industry and Location section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <SearchableSelect 
                      value={filters.industry}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, industry: value }));
                      }}
                      options={industryOptions}
                      label="Industry"
                      searchValue={industrySearch}
                      onSearchChange={handleIndustrySearch}
                      placeholder="Search industry..."
                      selected={filters.industry}
                      onRemove={(val) => handleRemoveBadge("industry", val)}
                      onOpen={handleIndustryDropdownOpen}
                      onClose={() => setIndustryDropdownOpen(false)}
                      open={industryDropdownOpen}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <SearchableSelect 
                      value={filters.location}
                      onChange={e => {
                        const value = e.target.value as string[];
                        setFilters(f => ({ ...f, location: value }));
                      }}
                      options={locationOptions}
                      label="Location"
                      searchValue={locationSearch}
                      onSearchChange={handleLocationSearch}
                      placeholder="Search location..."
                      selected={filters.location}
                      onRemove={(val) => handleRemoveBadge("location", val)}
                      onOpen={handleLocationDropdownOpen}
                      onClose={() => setLocationDropdownOpen(false)}
                      open={locationDropdownOpen}
                    />
                  </div>
                </div>
              {/* Years of Experience */}
              <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <SearchableSelect 
                  value={filters.yearsOfExperience}
                  onChange={e => {
                    const value = e.target.value as string[];
                    setFilters(f => ({ ...f, yearsOfExperience: value }));
                  }}
                  options={yearsOfExperienceOptions}
                  label="Years of Experience"
                  searchValue={yearsOfExperienceSearch}
                  onSearchChange={handleYearsOfExperienceSearch}
                  placeholder="Search years of experience..."
                  selected={filters.yearsOfExperience}
                  onRemove={(val) => handleRemoveBadge("yearsOfExperience", val)}
                  onOpen={handleYearsOfExperienceDropdownOpen}
                  onClose={() => setYearsOfExperienceDropdownOpen(false)}
                  open={yearsOfExperienceDropdownOpen}
                />
              </div>
              {/* Profile Language */}
              <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Language</label>
                <SearchableSelect 
                  value={filters.profileLanguage}
                  onChange={e => {
                    const value = e.target.value as string[];
                    setFilters(f => ({ ...f, profileLanguage: value }));
                  }}
                  options={profileLanguageOptions}
                  label="Profile Language"
                  searchValue={profileLanguageSearch}
                  onSearchChange={handleProfileLanguageSearch}
                  placeholder="Search language..."
                  selected={filters.profileLanguage}
                  onRemove={(val) => handleRemoveBadge("profileLanguage", val)}
                  onOpen={handleProfileLanguageDropdownOpen}
                  onClose={() => setProfileLanguageDropdownOpen(false)}
                  open={profileLanguageDropdownOpen}
                />
              </div>
              </div>
              <div className="py-2">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">Role</h3>
              </div>

              {/* Function and Current Job Title section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Function</label>
                  <SearchableSelect 
                    value={filters.category}
                    onChange={e => {
                      const value = e.target.value as string[];
                      setFilters(f => ({ ...f, category: value }));
                    }}
                    options={functionOptions}
                    label="Function"
                    searchValue={functionSearch}
                    onSearchChange={handleFunctionSearch}
                    placeholder="Search function..."
                    selected={filters.category}
                    onRemove={(val) => handleRemoveBadge("category", val)}
                    onOpen={handleFunctionDropdownOpen}
                    onClose={() => setFunctionDropdownOpen(false)}
                    open={functionDropdownOpen}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                  <SearchableSelect 
                    value={filters.currentJobTitle}
                    onChange={e => {
                      const value = e.target.value as string[];
                      setFilters(f => ({ ...f, currentJobTitle: value }));
                    }}
                    options={currentJobTitleOptions}
                    label="Current Job Title"
                    searchValue={currentJobTitleSearch}
                    onSearchChange={handleCurrentJobTitleSearch}
                    placeholder="Search job title..."
                    selected={filters.currentJobTitle}
                    onRemove={(val) => handleRemoveBadge("currentJobTitle", val)}
                    onOpen={handleCurrentJobTitleDropdownOpen}
                  onClose={() => setCurrentJobTitleDropdownOpen(false)}
                    open={currentJobTitleDropdownOpen}
                  />
                </div>
              </div>

              {/* Seniority Level and Past Job Title section */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seniority Level</label>
                  <SearchableSelect 
                    value={filters.seniorityLevel}
                    onChange={e => {
                      const value = e.target.value as string[];
                      setFilters(f => ({ ...f, seniorityLevel: value }));
                    }}
                    options={seniorityLevelOptions}
                    label="Seniority Level"
                    searchValue={seniorityLevelSearch}
                    onSearchChange={handleSeniorityLevelSearch}
                    placeholder="Search seniority..."
                    selected={filters.seniorityLevel}
                    onRemove={(val) => handleRemoveBadge("seniorityLevel", val)}
                    onOpen={handleSeniorityLevelDropdownOpen}
                    onClose={() => setSeniorityLevelDropdownOpen(false)}
                    open={seniorityLevelDropdownOpen}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Past Job Title</label>
                  <SearchableSelect 
                    value={filters.pastJobTitle}
                    onChange={e => {
                      const value = e.target.value as string[];
                      setFilters(f => ({ ...f, pastJobTitle: value }));
                    }}
                    options={pastJobTitleOptions}
                    label="Past Job Title"
                    searchValue=""
                    onSearchChange={handlePastJobTitleSearch}
                    placeholder="Search past job title..."
                    selected={filters.pastJobTitle}
                    onRemove={(val) => handleRemoveBadge("pastJobTitle", val)}
                    onOpen={handlePastJobTitleDropdownOpen}
                    onClose={() => setPastJobTitleDropdownOpen(false)}
                    open={pastJobTitleDropdownOpen}
                  />
                </div>
              </div>

              {/* Years in Current Company */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years in Current Company</label>
                  <SearchableSelect 
                    value={filters.yearsInCurrentCompany}
                    onChange={e => {
                      const value = e.target.value as string[];
                      setFilters(f => ({ ...f, yearsInCurrentCompany: value }));
                    }}
                    options={yearsInCurrentCompanyOptions}
                    label="Years in Current Company"
                    searchValue=""
                    onSearchChange={handleYearsInCurrentCompanySearch}
                    placeholder="Search years in current company..."
                    selected={filters.yearsInCurrentCompany}
                    onRemove={(val) => handleRemoveBadge("yearsInCurrentCompany", val)}
                    onOpen={handleYearsInCurrentCompanyDropdownOpen}
                    onClose={() => setYearsInCurrentCompanyDropdownOpen(false)}
                    open={yearsInCurrentCompanyDropdownOpen}
                  />
                </div>
              </div>

              <div className="py-2">
                  <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-200 pb-1">Best In Path</h3>
              </div>
              {/* Connections */}
              <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connections</label>
                 <SearchableSelect 
                  value={filters.connections}
                  onChange={e => {
                    const value = e.target.value as string[];
                    setFilters(f => ({ ...f, connections: value }));
                  }}
                  options={connectionsOptions}
                  label="Connections"
                  searchValue=""  // Add state for this if needed
                  onSearchChange={handleConnectionsSearch}  // Add handler for this if needed
                  placeholder="Search connections..."
                  selected={filters.connections}
                  onRemove={(val) => handleRemoveBadge("connections", val)}
                  onOpen={handleConnectionsDropdownOpen}  // Add handler if API call is needed
                  onClose={() => setConnectionsDropdownOpen(false)}
                  open={connectionsDropdownOpen}  // Add state for this if needed
                />
              </div>
              </div>
              {/* Export/Email Options - Improved Alignment */}
              <div className="grid md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="EXPORT_COUNT">Count</label>
                  <Select
                    id="EXPORT_COUNT"
                    value={exportCount}
                    onChange={e => setExportCount(e.target.value)}
                    fullWidth
                  >
                    {[25, 50, 75, 100, 125, 150, 175, 200, 225, 250].map((val) => (
                      <MenuItem key={val} value={val.toString()}>{val}</MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="EXPORT_OFFSET">Offset</label>
                  <OutlinedInput
                    id="EXPORT_OFFSET"
                    type="number"
                    min={0}
                    step={1}
                    value={exportOffset}
                    onChange={e => setExportOffset(e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="EXPORT_FILE_NAME">File Name</label>
                  <OutlinedInput
                    id="EXPORT_FILE_NAME"
                    type="text"
                    value={exportFileName}
                    onChange={e => setExportFileName(e.target.value)}
                    fullWidth
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="EMAIL_TYPE">Email Type</label>
                  <Select
                    id="EMAIL_TYPE"
                    value={emailType}
                    onChange={e => setEmailType(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="first email">First Email</MenuItem>
                    <MenuItem value="cold email">Cold Email</MenuItem>
                    <MenuItem value="followup">Followup</MenuItem>
                  </Select>
                </div>
              </div>
              {/* --- End export options and email type dropdown --- */}
            </div>
            <div className="py-2"></div>
            <Divider className="my-8" />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Search />}
              onClick={handleApplyFilters}
              className="rounded-md font-semibold normal-case"
              sx={{ boxShadow: "none", textTransform: "none", py: 1.3, fontSize: 16 }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
        {/* Sidebar: Saved Filters and Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Saved Filters</h2>
            <Divider className="mb-4" />
            <div className="space-y-4">
              {loadingFilters ? (
                <div>Loading filters...</div>
              ) : (
                savedFilters.map((filter) => (
                  <div key={filter.id} className="flex items-center justify-between">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        console.log("Selected filter:", filter);
                        handleSelectSavedFilter(filter);
                      }}
                    >
                      <div className="font-semibold text-gray-900">{filter.name}</div>
                      <div className="text-xs text-gray-500">{filter.count?.toLocaleString?.() || filter.count} leads</div>
                    </div>
                    <IconButton size="small">
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Filter Preview</h2>
            <Divider className="mb-4" />
            <div className="text-center py-4">
              <div className="text-3xl font-bold text-blue-600 mb-1">1,247</div>
              <div className="text-gray-500 mb-4">Estimated leads</div>
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-1">
                  <Group fontSize="small" className="text-gray-400" />
                  <span className="text-xs text-gray-600">Tech: 68%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Business fontSize="small" className="text-gray-400" />
                  <span className="text-xs text-gray-600">Enterprise: 32%</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
export default 1;
