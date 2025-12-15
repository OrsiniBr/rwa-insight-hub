import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Clock,
  Filter
} from "lucide-react";

export interface FilterState {
  searchQuery: string;
  assetType: string;
  riskLevel: string;
  status: string;
  showRecent: boolean;
  sortBy: "name" | "nav" | "change" | "updated";
  sortOrder: "asc" | "desc";
  minNav: string;
  maxNav: string;
}

interface PoolFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  assetTypes: string[];
  riskLevels: string[];
  activeFiltersCount: number;
}

export function PoolFilters({
  filters,
  onFiltersChange,
  assetTypes,
  riskLevels,
  activeFiltersCount,
}: PoolFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: "",
      assetType: "all",
      riskLevel: "all",
      status: "all",
      showRecent: false,
      sortBy: "updated",
      sortOrder: "desc",
      minNav: "",
      maxNav: "",
    });
  };

  const sortOptions = [
    { value: "updated", label: "Last Updated", icon: Clock },
    { value: "name", label: "Name", icon: ArrowUpDown },
    { value: "nav", label: "NAV Value", icon: TrendingUp },
    { value: "change", label: "24h Change", icon: TrendingDown },
  ];

  return (
    <div className="space-y-3">
      {/* Search and Quick Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or tag..."
            className="pl-8 h-8 text-xs bg-muted/50 border-border/50"
            value={filters.searchQuery}
            onChange={(e) => updateFilter("searchQuery", e.target.value)}
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter("searchQuery", "")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Asset Type Quick Filter */}
          <Select value={filters.assetType} onValueChange={(v) => updateFilter("assetType", v)}>
            <SelectTrigger className="w-[100px] h-8 text-xs bg-muted/50 border-border/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Types</SelectItem>
              {assetTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()} className="text-xs">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select 
            value={filters.sortBy} 
            onValueChange={(v) => updateFilter("sortBy", v as FilterState["sortBy"])}
          >
            <SelectTrigger className="w-[110px] h-8 text-xs bg-muted/50 border-border/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-muted/50 border-border/50"
            onClick={() => updateFilter("sortOrder", filters.sortOrder === "asc" ? "desc" : "asc")}
          >
            {filters.sortOrder === "asc" ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
          </Button>

          {/* Advanced Filters Popover */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs bg-muted/50 border-border/50"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1 text-[8px]">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-3" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-medium">Advanced Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-muted-foreground"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Risk Level */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">Risk Level</Label>
                  <Select value={filters.riskLevel} onValueChange={(v) => updateFilter("riskLevel", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Levels</SelectItem>
                      {riskLevels.map((level) => (
                        <SelectItem key={level} value={level.toLowerCase()} className="text-xs">
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => updateFilter("status", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
                      <SelectItem value="healthy" className="text-xs">Healthy</SelectItem>
                      <SelectItem value="needs review" className="text-xs">Needs Review</SelectItem>
                      <SelectItem value="stale data" className="text-xs">Stale Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* NAV Range */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] text-muted-foreground">NAV Range</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Min"
                      className="h-8 text-xs"
                      type="number"
                      value={filters.minNav}
                      onChange={(e) => updateFilter("minNav", e.target.value)}
                    />
                    <span className="text-[10px] text-muted-foreground">to</span>
                    <Input
                      placeholder="Max"
                      className="h-8 text-xs"
                      type="number"
                      value={filters.maxNav}
                      onChange={(e) => updateFilter("maxNav", e.target.value)}
                    />
                  </div>
                </div>

                {/* Recent Only Toggle */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="recent-toggle" className="text-[10px] text-muted-foreground">
                    Updated in last 24h only
                  </Label>
                  <Switch
                    id="recent-toggle"
                    checked={filters.showRecent}
                    onCheckedChange={(v) => updateFilter("showRecent", v)}
                    className="scale-75"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground mr-1">Active:</span>
          
          {filters.assetType !== "all" && (
            <Badge variant="secondary" className="text-[8px] gap-0.5 pr-0.5">
              {filters.assetType}
              <button
                onClick={() => updateFilter("assetType", "all")}
                className="ml-0.5 p-0.5 hover:bg-background/50 rounded"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.riskLevel !== "all" && (
            <Badge variant="secondary" className="text-[8px] gap-0.5 pr-0.5">
              {filters.riskLevel}
              <button
                onClick={() => updateFilter("riskLevel", "all")}
                className="ml-0.5 p-0.5 hover:bg-background/50 rounded"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.status !== "all" && (
            <Badge variant="secondary" className="text-[8px] gap-0.5 pr-0.5">
              {filters.status}
              <button
                onClick={() => updateFilter("status", "all")}
                className="ml-0.5 p-0.5 hover:bg-background/50 rounded"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {filters.showRecent && (
            <Badge variant="secondary" className="text-[8px] gap-0.5 pr-0.5">
              Last 24h
              <button
                onClick={() => updateFilter("showRecent", false)}
                className="ml-0.5 p-0.5 hover:bg-background/50 rounded"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
          
          {(filters.minNav || filters.maxNav) && (
            <Badge variant="secondary" className="text-[8px] gap-0.5 pr-0.5">
              NAV: {filters.minNav || "0"} - {filters.maxNav || "∞"}
              <button
                onClick={() => {
                  updateFilter("minNav", "");
                  updateFilter("maxNav", "");
                }}
                className="ml-0.5 p-0.5 hover:bg-background/50 rounded"
              >
                <X className="h-2 w-2" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
