// ============================================
// ComES Website - Student Teams Page
// ============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Crown, 
  Check, 
  X,
  Loader2,
  Mail,
  Clock,
  Trash2,
  LogOut
} from 'lucide-react';
import { useStudentStore } from '@/store/studentStore';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Badge, CreateTeamModal } from '@/components/ui';
import { Navbar, Footer } from '@/components/layout';
import { competitionTeamService } from '@/services/competitionTeam.service';
import type { CompetitionTeam, TeamInvitation } from '@/types';

export const TeamsPage = () => {
  const { student } = useStudentStore();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const [teams, setTeams] = useState<CompetitionTeam[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [teamsRes, invitationsRes] = await Promise.all([
        competitionTeamService.getMyTeams(),
        competitionTeamService.getPendingInvitations()
      ]);

      if (teamsRes.status === 'success' && teamsRes.data) {
        setTeams(teamsRes.data.teams);
      }
      if (invitationsRes.status === 'success' && invitationsRes.data) {
        setInvitations(invitationsRes.data.invitations);
      }
    } catch (error) {
      console.error('Failed to fetch teams data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespondToInvitation = async (teamId: string, accept: boolean) => {
    setRespondingTo(teamId);
    try {
      await competitionTeamService.respondToInvitation(teamId, accept ? 'approved' : 'rejected');
      await fetchData();
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
    } finally {
      setRespondingTo(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'disbanded':
        return <Badge variant="secondary">Disbanded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col font-comes transition-colors duration-300',
      isDark ? 'bg-slate-950 text-gray-100' : 'bg-white text-gray-900'
    )}>
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <div className={cn(
          'min-h-screen pt-8 pb-12',
          isDark ? 'bg-slate-950' : 'bg-gray-50'
        )}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
            >
              <div>
                <h1 className={cn('text-3xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                  My Teams
                </h1>
                <p className={cn('text-lg', isDark ? 'text-gray-400' : 'text-gray-600')}>
                  Manage your competition teams and invitations
                </p>
              </div>
              <Button 
                variant="primary" 
                className="gap-2"
                onClick={() => setIsCreateTeamModalOpen(true)}
              >
                <UserPlus className="w-4 h-4" />
                Create Team
              </Button>
            </motion.div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className={cn('w-8 h-8 animate-spin', isDark ? 'text-gray-400' : 'text-gray-500')} />
              </div>
            ) : (
              <>
                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h2 className={cn('text-xl font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                      <Mail className="w-5 h-5" />
                      Pending Invitations
                      <Badge variant="warning">{invitations.length}</Badge>
                    </h2>
                    <div className="space-y-3">
                      {invitations.map((invitation) => (
                        <motion.div
                          key={invitation._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            'flex items-center gap-4 p-4 rounded-xl border',
                            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
                          )}
                        >
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                            isDark ? 'bg-amber-500/20' : 'bg-amber-100'
                          )}>
                            <Users className={cn('w-6 h-6', isDark ? 'text-amber-400' : 'text-amber-600')} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn('font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                              {invitation.teamName}
                            </p>
                            <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-500')}>
                              Invited by {invitation.leaderName}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleRespondToInvitation(invitation.teamId, false)}
                              disabled={respondingTo === invitation.teamId}
                              className="gap-1"
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleRespondToInvitation(invitation.teamId, true)}
                              disabled={respondingTo === invitation.teamId}
                              className="gap-1"
                            >
                              {respondingTo === invitation.teamId ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              Accept
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* My Teams */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className={cn('text-xl font-semibold mb-4 flex items-center gap-2', isDark ? 'text-white' : 'text-gray-900')}>
                    <Users className="w-5 h-5" />
                    Your Teams
                  </h2>

                  {teams.length === 0 ? (
                    <div className={cn(
                      'text-center py-16 rounded-2xl border',
                      isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200'
                    )}>
                      <Users className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-gray-600' : 'text-gray-300')} />
                      <h3 className={cn('text-xl font-semibold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
                        No Teams Yet
                      </h3>
                      <p className={cn('mb-6', isDark ? 'text-gray-400' : 'text-gray-500')}>
                        Create your first team for competitions and hackathons
                      </p>
                      <Button 
                        variant="primary" 
                        className="gap-2"
                        onClick={() => setIsCreateTeamModalOpen(true)}
                      >
                        <UserPlus className="w-4 h-4" />
                        Create Team
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <motion.div
                          key={team._id}
                          whileHover={{ y: -2 }}
                          className={cn(
                            'p-6 rounded-2xl border transition-all',
                            isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
                          )}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className={cn('text-xl font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                                  {team.name}
                                </h3>
                                {getStatusBadge(team.status)}
                              </div>
                              <p className={cn('text-sm flex items-center gap-2', isDark ? 'text-gray-400' : 'text-gray-500')}>
                                <Clock className="w-4 h-4" />
                                Created {new Date(team.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {team.leaderId === student?._id && (
                              <Badge variant="warning" className="flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                You're the Leader
                              </Badge>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className={cn('text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
                              Team Members ({team.members.length}/5)
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {team.members.map((member) => (
                                <div
                                  key={member.id}
                                  className={cn(
                                    'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                                    member.status === 'approved'
                                      ? isDark ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'
                                      : isDark ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                                  )}
                                >
                                  <div className={cn(
                                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                                    isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                                  )}>
                                    {member.name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className={cn('text-sm', isDark ? 'text-gray-300' : 'text-gray-700')}>
                                    {member.name}
                                  </span>
                                  {member.id === team.leaderId && (
                                    <Crown className="w-3 h-3 text-amber-500" />
                                  )}
                                  {member.status === 'pending' && (
                                    <span className={cn('text-xs', isDark ? 'text-amber-400' : 'text-amber-600')}>
                                      (pending)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2">
                            {team.leaderId !== student?._id && (
                              <Button variant="secondary" size="sm" className="gap-1">
                                <LogOut className="w-4 h-4" />
                                Leave Team
                              </Button>
                            )}
                            {team.leaderId === student?._id && (
                              <Button variant="secondary" size="sm" className="gap-1 text-red-500 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Disband Team
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateTeamModalOpen}
        onClose={() => setIsCreateTeamModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default TeamsPage;
