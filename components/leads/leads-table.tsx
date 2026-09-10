"use client";

import React, { useState } from "react";
import {
  MoreVertical,
  XCircle,
  Trash2,
  Phone,
  Mail,
  Building2,
  Sparkles,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LeadItem, LeadStage, LeadStatus } from "./types";

interface LeadsTableProps {
  leads: LeadItem[];
  onConvertLead: (id: string) => void;
  onMarkLost: (id: string) => void;
  onDeleteLead: (id: string) => void;
  onBatchConvert?: (ids: string[]) => void;
  onBatchDelete?: (ids: string[]) => void;
}

export function LeadsTable({
  leads,
  onConvertLead,
  onMarkLost,
  onDeleteLead,
  onBatchConvert,
  onBatchDelete,
}: LeadsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(leads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Pagination calculation
  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLeads = leads.slice(startIndex, startIndex + itemsPerPage);

  // Helper styling for Stage
  const getStageBadge = (stage: LeadStage) => {
    switch (stage) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Proposal Sent":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Negotiation":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Closed Won":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Closed Lost":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Helper styling for Status
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "Open":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Converted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 45) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Assignee Avatar Initial & Color
  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Batch Actions Bar (when selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50/90 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <span className="size-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              {selectedIds.length}
            </span>
            <span>{selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected</span>
          </div>

          <div className="flex items-center gap-2">
            {onBatchConvert && (
              <button
                type="button"
                onClick={() => {
                  onBatchConvert(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="size-3.5" /> Convert Selected
              </button>
            )}
            {onBatchDelete && (
              <button
                type="button"
                onClick={() => {
                  onBatchDelete(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" /> Delete Selected
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-indigo-100/50 rounded-lg transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 13-Column Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              {/* 1. Checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === leads.length && leads.length > 0}
                  onChange={handleSelectAll}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>

              {/* 2. Lead Name & Code */}
              <th className="py-3 px-4 min-w-[200px]">Lead Name &amp; Code</th>

              {/* 3. Business Entity */}
              <th className="py-3 px-3 min-w-[150px]">Business Entity</th>

              {/* 4. Deal Value */}
              <th className="py-3 px-3 min-w-[110px]">Deal Value</th>

              {/* 5. Stage */}
              <th className="py-3 px-3 min-w-[120px]">Stage</th>

              {/* 6. Status */}
              <th className="py-3 px-3 min-w-[90px]">Status</th>

              {/* 7. Score */}
              <th className="py-3 px-3 min-w-[100px]">Score</th>

              {/* 8. Assigned To */}
              <th className="py-3 px-3 min-w-[130px]">Assigned To</th>

              {/* 9. Source */}
              <th className="py-3 px-3 min-w-[110px]">Source</th>

              {/* 10. Created Date */}
              <th className="py-3 px-3 min-w-[100px]">Created Date</th>

              {/* 11. Phone */}
              <th className="py-3 px-3 min-w-[120px]">Phone</th>

              {/* 12. Email */}
              <th className="py-3 px-3 min-w-[160px]">Email</th>

              {/* 13. Actions */}
              <th className="py-3 px-4 w-12 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={13} className="py-12 text-center text-slate-400">
                  <div className="size-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Sparkles className="size-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">No leads found</p>
                  <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search query</p>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);

                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      isSelected ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* 1. Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(lead.id)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* 2. Lead Name & Code */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                          {lead.leadName}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                            {lead.leadCode}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            {lead.contactPerson}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Business Entity */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-700 text-xs truncate max-w-[130px]">
                          {lead.businessEntity}
                        </span>
                      </div>
                    </td>

                    {/* 4. Deal Value */}
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900 text-xs block">
                        ₹{lead.dealValue.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* 5. Stage */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStageBadge(
                          lead.stage
                        )}`}
                      >
                        {lead.stage}
                      </span>
                    </td>

                    {/* 6. Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* 7. Score Meter */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono font-bold text-slate-800">{lead.score}</span>
                          <span className="text-[9px] text-slate-400">/100</span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getScoreBarColor(lead.score)}`}
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* 8. Assigned To */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {getAvatarInitials(lead.assignedTo)}
                        </div>
                        <span className="text-slate-800 font-medium text-xs truncate max-w-[100px]">
                          {lead.assignedTo}
                        </span>
                      </div>
                    </td>

                    {/* 9. Source */}
                    <td className="py-3 px-3">
                      <span className="text-slate-600 text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {lead.source}
                      </span>
                    </td>

                    {/* 10. Created Date */}
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {lead.createdDate}
                    </td>

                    {/* 11. Phone */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <Phone className="size-3 text-slate-400 shrink-0" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>

                    {/* 12. Email */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-slate-600 truncate max-w-[150px]">
                        <Mail className="size-3 text-slate-400 shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                    </td>

                    {/* 13. Actions Menu */}
                    <td className="py-3 px-4 text-right relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === lead.id ? null : lead.id)
                        }
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === lead.id && (
                        <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                          {lead.status === "Open" && (
                            <button
                              type="button"
                              onClick={() => {
                                onConvertLead(lead.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold cursor-pointer transition-colors"
                            >
                              <UserCheck className="size-3.5" /> Convert to Client
                            </button>
                          )}

                          {lead.status === "Open" && (
                            <button
                              type="button"
                              onClick={() => {
                                onMarkLost(lead.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                            >
                              <XCircle className="size-3.5" /> Mark as Lost
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onDeleteLead(lead.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                          >
                            <Trash2 className="size-3.5 text-slate-400" /> Delete Lead
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Footer */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
        <div>
          Showing{" "}
          <span className="font-bold text-slate-700">
            {leads.length === 0 ? 0 : startIndex + 1}–
            {Math.min(startIndex + itemsPerPage, leads.length)}
          </span>{" "}
          of <span className="font-bold text-slate-700">{leads.length}</span> leads
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-2 font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
