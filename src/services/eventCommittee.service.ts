import api from "./api";
import type { ApiEvent } from "./events.service";

export interface CommitteeMemberProfile {
  _id: string;
  name: string;
  registrationNo: string;
  username?: string;
  avatar?: string;
}

export interface CommitteeAssignment {
  member: CommitteeMemberProfile;
  role: string;
  team: string;
  isChair: boolean;
  contributions: string;
}

export interface OrganizedEvent extends ApiEvent {
  organizingCommittee: CommitteeAssignment[];
}

export type OrganizingMode = "admin" | "chair";
const eventPath = (id: string, mode: OrganizingMode) =>
  mode === "admin" ? `/events/${id}` : `/students/organized-events/${id}`;

export const eventCommitteeService = {
  searchMembers: async (search: string): Promise<CommitteeMemberProfile[]> => {
    const response = await api.get("/events/committee-members", { params: { search } });
    return response.data.data.members;
  },
  getMine: async (): Promise<
    Pick<ApiEvent, "_id" | "title" | "date" | "location" | "type" | "status">[]
  > => {
    const response = await api.get("/students/organized-events");
    return response.data.data.events;
  },
  getEvent: async (id: string, mode: OrganizingMode): Promise<OrganizedEvent> => {
    const response = await api.get(`${eventPath(id, mode)}${mode === "admin" ? "/committee" : ""}`);
    return response.data.data.event;
  },
  saveAssignment: async (
    id: string,
    memberId: string,
    assignment: Pick<CommitteeAssignment, "role" | "team" | "isChair">,
  ): Promise<OrganizedEvent> => {
    const response = await api.put(`/events/${id}/committee/${memberId}`, assignment);
    return response.data.data.event;
  },
  removeMember: async (id: string, memberId: string): Promise<OrganizedEvent> => {
    const response = await api.delete(`/events/${id}/committee/${memberId}`);
    return response.data.data.event;
  },
  saveContributions: async (
    id: string,
    memberId: string,
    contributions: string,
    mode: OrganizingMode,
  ): Promise<OrganizedEvent> => {
    const response = await api.patch(`${eventPath(id, mode)}/committee/${memberId}/contributions`, {
      contributions,
    });
    return response.data.data.event;
  },
  saveDetails: async (
    id: string,
    details: Partial<ApiEvent>,
    mode: OrganizingMode,
  ): Promise<void> => {
    await api.patch(eventPath(id, mode), details);
  },
};
