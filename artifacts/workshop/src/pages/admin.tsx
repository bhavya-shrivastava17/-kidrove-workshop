import { useState } from "react";
import { useListEnquiries } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  CalendarDays,
  TrendingUp,
  RefreshCw,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";

type SortField = "id" | "name" | "email" | "createdAt";
type SortDir = "asc" | "desc";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 text-slate-400" />;
  return sortDir === "asc"
    ? <ArrowUp className="ml-1 h-3.5 w-3.5 text-blue-500" />
    : <ArrowDown className="ml-1 h-3.5 w-3.5 text-blue-500" />;
}

export default function Admin() {
  const { data, isLoading, isError, refetch, isFetching } = useListEnquiries();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const rows = data?.data ?? [];

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.phone.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let av: string | number = "";
    let bv: string | number = "";
    if (sortField === "id") { av = a.id; bv = b.id; }
    else if (sortField === "name") { av = a.name.toLowerCase(); bv = b.name.toLowerCase(); }
    else if (sortField === "email") { av = a.email.toLowerCase(); bv = b.email.toLowerCase(); }
    else if (sortField === "createdAt") { av = a.createdAt; bv = b.createdAt; }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) +
      " · " +
      d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const getDayBuckets = () => {
    const buckets: Record<string, number> = {};
    rows.forEach((r) => {
      const day = new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      buckets[day] = (buckets[day] ?? 0) + 1;
    });
    return Object.entries(buckets)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7);
  };

  const dayBuckets = getDayBuckets();
  const maxBucket = Math.max(...dayBuckets.map((d) => d[1]), 1);

  return (
    <div className="min-h-screen bg-slate-50 font-body">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Enquiries Dashboard</h1>
              <p className="text-xs text-slate-500">AI & Robotics Summer Workshop</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              data-testid="link-back-to-landing"
            >
              Back to Landing Page
            </a>
            <Button
              size="sm"
              variant="outline"
              onClick={() => refetch()}
              disabled={isFetching}
              data-testid="button-refresh"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Stat Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" data-testid="stats-grid">
            <StatCard icon={Users} label="Total Enquiries" value={data?.total ?? 0} color="bg-blue-500" />
            <StatCard icon={CalendarDays} label="Today" value={data?.todayCount ?? 0} color="bg-emerald-500" />
            <StatCard icon={TrendingUp} label="This Week" value={data?.thisWeekCount ?? 0} color="bg-violet-500" />
          </div>
        )}

        {/* Enrollment Trend */}
        {!isLoading && dayBuckets.length > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-700">Enrollment Trend (Last 7 Days)</h2>
            <div className="flex items-end gap-2 h-28" data-testid="trend-chart">
              {dayBuckets.map(([day, count]) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-slate-600">{count}</span>
                  <div
                    className="w-full rounded-t-md bg-blue-500 transition-all"
                    style={{ height: `${(count / maxBucket) * 80}px`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-slate-400 text-center leading-tight">{day}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-700">
              All Registrations
              {search && (
                <span className="ml-2 text-sm font-normal text-slate-400">
                  {sorted.length} of {rows.length} shown
                </span>
              )}
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search name, email, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm"
                data-testid="input-search"
              />
            </div>
          </div>

          {isError ? (
            <div className="px-6 py-12 text-center text-sm text-red-500">
              Failed to load enquiries. Click Refresh to try again.
            </div>
          ) : isLoading ? (
            <div className="space-y-2 p-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-sm font-medium text-slate-500">
                {search ? "No results match your search." : "No enquiries yet. Share the landing page to get started!"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead
                      className="w-12 cursor-pointer select-none"
                      onClick={() => handleSort("id")}
                      data-testid="th-id"
                    >
                      <span className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        # <SortIcon field="id" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("name")}
                      data-testid="th-name"
                    >
                      <span className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Name <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                      data-testid="th-email"
                    >
                      <span className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Email <SortIcon field="email" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</TableHead>
                    <TableHead className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Message</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("createdAt")}
                      data-testid="th-date"
                    >
                      <span className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Submitted <SortIcon field="createdAt" sortField={sortField} sortDir={sortDir} />
                      </span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50 transition-colors"
                      data-testid={`row-enquiry-${row.id}`}
                    >
                      <TableCell className="text-sm text-slate-400 font-mono">#{row.id}</TableCell>
                      <TableCell className="font-medium text-slate-800">{row.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${row.email}`}
                          className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm"
                          data-testid={`link-email-${row.id}`}
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          {row.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${row.phone}`}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-sm transition-colors"
                          data-testid={`link-phone-${row.id}`}
                        >
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {row.phone}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        {row.message ? (
                          <div className="flex items-start gap-1.5">
                            <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                            <span className="line-clamp-2 text-sm text-slate-500">{row.message}</span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs font-normal text-slate-400">—</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 whitespace-nowrap">
                        {formatDate(row.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
