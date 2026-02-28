// ============================================
// ComES Website - Create Team Modal Component
// ============================================

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Search,
  UserPlus,
  Crown,
  Check,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/utils";
import { useThemeStore } from "@/store";
import { useStudentStore } from "@/store/studentStore";
import { Button, Input, Badge } from "@/components/ui";
import {
  competitionTeamService,
  type StudentSearchResult,
} from "@/services/competitionTeam.service";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SelectedMember extends StudentSearchResult {
  isLeader: boolean;
}

export const CreateTeamModal = ({ isOpen, onClose, onSuccess }: CreateTeamModalProps) => {
  const { resolvedTheme } = useThemeStore();
  const { student } = useStudentStore();
  const isDark = resolvedTheme === "dark";

  const [teamName, setTeamName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const MAX_MEMBERS = 5;

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        setSearchError(null);
        try {
          const response = await competitionTeamService.searchStudents(searchQuery);
          if (response.success && response.data) {
            // Filter out already selected members and current user
            const filtered = response.data.students.filter(
              (s) => s._id !== student?._id && !selectedMembers.some((m) => m._id === s._id),
            );
            setSearchResults(filtered);
          }
        } catch {
          setSearchError("Failed to search students");
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedMembers, student?._id]);

  const handleAddMember = useCallback(
    (member: StudentSearchResult) => {
      if (selectedMembers.length >= MAX_MEMBERS) {
        setError(`Maximum ${MAX_MEMBERS} members allowed`);
        return;
      }

      const isFirstMember = selectedMembers.length === 0;
      setSelectedMembers((prev) => [...prev, { ...member, isLeader: isFirstMember }]);
      setSearchQuery("");
      setSearchResults([]);
      setError(null);
    },
    [selectedMembers.length],
  );

  const handleRemoveMember = useCallback((memberId: string) => {
    setSelectedMembers((prev) => {
      const updated = prev.filter((m) => m._id !== memberId);
      // If we removed the leader and there are still members, make the first one the leader
      if (updated.length > 0 && !updated.some((m) => m.isLeader)) {
        updated[0].isLeader = true;
      }
      return updated;
    });
  }, []);

  const handleSetLeader = useCallback((memberId: string) => {
    setSelectedMembers((prev) =>
      prev.map((m) => ({
        ...m,
        isLeader: m._id === memberId,
      })),
    );
  }, []);

  const handleCreateTeam = async () => {
    setError(null);

    if (!teamName.trim()) {
      setError("Please enter a team name");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Please add at least one team member");
      return;
    }

    const leader = selectedMembers.find((m) => m.isLeader);
    if (!leader) {
      setError("Please select a team leader");
      return;
    }

    setIsCreating(true);

    try {
      const response = await competitionTeamService.createTeam({
        name: teamName.trim(),
        leaderId: leader._id,
        memberIds: selectedMembers.map((m) => m._id),
      });

      if (response.success) {
        onSuccess?.();
        handleClose();
      } else {
        setError(response.message || "Failed to create team");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTeamName("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMembers([]);
    setError(null);
    setSearchError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl",
            isDark ? "border border-slate-800 bg-slate-900" : "bg-white",
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "flex items-center justify-between border-b p-6",
              isDark ? "border-slate-800" : "border-gray-200",
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  isDark ? "bg-blue-500/20" : "bg-blue-100",
                )}
              >
                <Users className={cn("h-5 w-5", isDark ? "text-blue-400" : "text-blue-600")} />
              </div>
              <div>
                <h2
                  className={cn("text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}
                >
                  Create Team
                </h2>
                <p className={cn("text-sm", isDark ? "text-gray-400" : "text-gray-500")}>
                  For competitions and hackathons
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={cn(
                "rounded-lg p-2 transition-colors",
                isDark ? "text-gray-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100",
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-2 rounded-lg p-3",
                  isDark ? "bg-red-500/20 text-red-400" : "bg-red-50 text-red-600",
                )}
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Team Name */}
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Team Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter your team name"
                className={cn(
                  isDark && "border-slate-700 bg-slate-800 text-white placeholder:text-gray-500",
                )}
              />
            </div>

            {/* Search Members */}
            <div>
              <label
                className={cn(
                  "mb-2 block text-sm font-medium",
                  isDark ? "text-gray-300" : "text-gray-700",
                )}
              >
                Add Members (up to {MAX_MEMBERS})
              </label>
              <div className="relative">
                <Search
                  className={cn(
                    "absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2",
                    isDark ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or registration number..."
                  disabled={selectedMembers.length >= MAX_MEMBERS}
                  className={cn(
                    "w-full rounded-lg border py-3 pr-4 pl-10 transition-all duration-200",
                    "focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none",
                    isDark
                      ? "border-slate-700 bg-slate-800 text-white placeholder:text-gray-500"
                      : "border-gray-300 bg-white",
                    selectedMembers.length >= MAX_MEMBERS && "cursor-not-allowed opacity-50",
                  )}
                />
                {isSearching && (
                  <Loader2
                    className={cn(
                      "absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin",
                      isDark ? "text-gray-500" : "text-gray-400",
                    )}
                  />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div
                  className={cn(
                    "mt-2 overflow-hidden rounded-lg border",
                    isDark ? "border-slate-700 bg-slate-800" : "border-gray-200 bg-gray-50",
                  )}
                >
                  {searchResults.slice(0, 5).map((result) => (
                    <button
                      key={result._id}
                      onClick={() => handleAddMember(result)}
                      className={cn(
                        "flex w-full items-center gap-3 p-3 text-left transition-colors",
                        isDark ? "hover:bg-slate-700" : "hover:bg-gray-100",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                          isDark ? "bg-slate-600 text-gray-300" : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {result.avatar ? (
                          <img
                            src={result.avatar}
                            alt={result.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          result.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "truncate font-medium",
                            isDark ? "text-white" : "text-gray-900",
                          )}
                        >
                          {result.name}
                        </p>
                        <p
                          className={cn(
                            "truncate text-sm",
                            isDark ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {result.registrationNo}
                        </p>
                      </div>
                      <UserPlus
                        className={cn("h-4 w-4", isDark ? "text-blue-400" : "text-blue-600")}
                      />
                    </button>
                  ))}
                </div>
              )}

              {searchError && (
                <p className={cn("mt-2 text-sm", isDark ? "text-red-400" : "text-red-500")}>
                  {searchError}
                </p>
              )}
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div>
                <label
                  className={cn(
                    "mb-2 block text-sm font-medium",
                    isDark ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  Team Members ({selectedMembers.length}/{MAX_MEMBERS})
                </label>
                <div className="space-y-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member._id}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3",
                        member.isLeader
                          ? isDark
                            ? "border-amber-500/30 bg-amber-500/10"
                            : "border-amber-200 bg-amber-50"
                          : isDark
                            ? "border-slate-700 bg-slate-800"
                            : "border-gray-200 bg-gray-50",
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                          isDark ? "bg-slate-600 text-gray-300" : "bg-gray-200 text-gray-600",
                        )}
                      >
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                        {member.isLeader && (
                          <Crown className="absolute -top-1 -right-1 h-4 w-4 text-amber-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              "truncate font-medium",
                              isDark ? "text-white" : "text-gray-900",
                            )}
                          >
                            {member.name}
                          </p>
                          {member.isLeader && (
                            <Badge variant="warning" className="text-xs">
                              Leader
                            </Badge>
                          )}
                        </div>
                        <p
                          className={cn(
                            "truncate text-sm",
                            isDark ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {member.registrationNo}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!member.isLeader && (
                          <button
                            onClick={() => handleSetLeader(member._id)}
                            className={cn(
                              "rounded-lg p-2 transition-colors",
                              isDark
                                ? "text-gray-400 hover:bg-slate-700 hover:text-amber-400"
                                : "text-gray-500 hover:bg-gray-200 hover:text-amber-600",
                            )}
                            title="Make team leader"
                          >
                            <Crown className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          className={cn(
                            "rounded-lg p-2 transition-colors",
                            isDark
                              ? "text-gray-400 hover:bg-red-500/20 hover:text-red-400"
                              : "text-gray-500 hover:bg-red-50 hover:text-red-600",
                          )}
                          title="Remove member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info Note */}
            <div
              className={cn(
                "rounded-lg p-4",
                isDark ? "border border-blue-500/20 bg-blue-500/10" : "bg-blue-50",
              )}
            >
              <p className={cn("text-sm", isDark ? "text-blue-300" : "text-blue-700")}>
                <strong>Note:</strong> Team members will receive an invitation to join your team.
                They must approve the invitation before being added to the team.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div
            className={cn(
              "flex items-center justify-end gap-3 border-t p-6",
              isDark ? "border-slate-800" : "border-gray-200",
            )}
          >
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateTeam}
              disabled={isCreating || !teamName.trim() || selectedMembers.length === 0}
              className="gap-2"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Create Team
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateTeamModal;
