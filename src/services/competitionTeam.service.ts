// ============================================
// ComES Website - Competition Team Service
// ============================================

import api, { type ApiResponse } from "./api";
import type { CompetitionTeam, TeamInvitation, TeamMemberStatus } from "@/types";

export interface CreateCompetitionTeamData {
  name: string;
  leaderId: string;
  memberIds: string[];
}

export interface StudentSearchResult {
  _id: string;
  name: string;
  email: string;
  registrationNo: string;
  avatar?: string;
}

export const competitionTeamService = {
  // Create a new competition team
  createTeam: async (
    data: CreateCompetitionTeamData,
  ): Promise<ApiResponse<{ team: CompetitionTeam }>> => {
    const response = await api.post<ApiResponse<{ team: CompetitionTeam }>>(
      "/competition-teams",
      data,
    );
    return response.data;
  },

  // Get all teams for current student
  getMyTeams: async (): Promise<ApiResponse<{ teams: CompetitionTeam[] }>> => {
    const response = await api.get<ApiResponse<{ teams: CompetitionTeam[] }>>(
      "/competition-teams/my-teams",
    );
    return response.data;
  },

  // Get team by ID
  getTeamById: async (teamId: string): Promise<ApiResponse<{ team: CompetitionTeam }>> => {
    const response = await api.get<ApiResponse<{ team: CompetitionTeam }>>(
      `/competition-teams/${teamId}`,
    );
    return response.data;
  },

  // Get pending invitations for current student
  getPendingInvitations: async (): Promise<ApiResponse<{ invitations: TeamInvitation[] }>> => {
    const response = await api.get<ApiResponse<{ invitations: TeamInvitation[] }>>(
      "/competition-teams/invitations",
    );
    return response.data;
  },

  // Respond to team invitation
  respondToInvitation: async (
    teamId: string,
    status: TeamMemberStatus,
  ): Promise<ApiResponse<{ team: CompetitionTeam }>> => {
    const response = await api.post<ApiResponse<{ team: CompetitionTeam }>>(
      `/competition-teams/${teamId}/respond`,
      { status },
    );
    return response.data;
  },

  // Search students for team creation
  searchStudents: async (
    query: string,
  ): Promise<ApiResponse<{ students: StudentSearchResult[] }>> => {
    const response = await api.get<ApiResponse<{ students: StudentSearchResult[] }>>(
      "/students/search",
      { params: { query } },
    );
    return response.data;
  },

  // Leave a team
  leaveTeam: async (teamId: string): Promise<ApiResponse<null>> => {
    const response = await api.post<ApiResponse<null>>(`/competition-teams/${teamId}/leave`);
    return response.data;
  },

  // Disband a team (leader only)
  disbandTeam: async (teamId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>(`/competition-teams/${teamId}`);
    return response.data;
  },

  // Remove member from team (leader only)
  removeMember: async (
    teamId: string,
    memberId: string,
  ): Promise<ApiResponse<{ team: CompetitionTeam }>> => {
    const response = await api.delete<ApiResponse<{ team: CompetitionTeam }>>(
      `/competition-teams/${teamId}/members/${memberId}`,
    );
    return response.data;
  },
};
