import { useState } from 'react';
import { useAchievements } from '../context/AchievementContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  TrendingUp,
  Users,
  FileText,
  Filter,
  Calendar,
  Mail,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminDashboard() {
  const { achievements, updateAchievementStatus, deleteAchievement } = useAchievements();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleApprove = (id: string) => {
    updateAchievementStatus(id, 'approved');
    toast.success('Achievement approved successfully!');
  };

  const handleReject = (id: string) => {
    updateAchievementStatus(id, 'rejected');
    toast.error('Achievement rejected');
  };

  const handleDelete = (id: string) => {
    deleteAchievement(id);
    toast.success('Achievement deleted');
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = 
      achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (achievement.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || achievement.department === filterDepartment;
    const matchesType = filterType === 'all' || achievement.achievementType === filterType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const pendingAchievements = filteredAchievements.filter(a => a.status === 'pending');
  const approvedAchievements = filteredAchievements.filter(a => a.status === 'approved');
  const rejectedAchievements = filteredAchievements.filter(a => a.status === 'rejected');

  // Stats
  const totalSubmissions = achievements.length;
  const totalApproved = achievements.filter(a => a.status === 'approved').length;
  const totalPending = achievements.filter(a => a.status === 'pending').length;
  const uniqueStudents = new Set(achievements.map(a => a.rollNumber || a.hallTicketNumber)).size;

  const AchievementTable = ({ achievements, showActions = true }: { achievements: typeof filteredAchievements, showActions?: boolean }) => (
    <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-white/80">Student</TableHead>
            <TableHead className="text-white/80">Department</TableHead>
            <TableHead className="text-white/80">Achievement</TableHead>
            <TableHead className="text-white/80">Type</TableHead>
            <TableHead className="text-white/80">Date</TableHead>
            <TableHead className="text-white/80">Status</TableHead>
            {showActions && <TableHead className="text-white/80 text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="text-center text-white/50 py-8">
                No achievements found
              </TableCell>
            </TableRow>
          ) : (
            achievements.map((achievement) => (
              <TableRow key={achievement.id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <div>
                    <div className="font-medium text-white">{achievement.studentName}</div>
                    <div className="text-sm text-white/50">{achievement.rollNumber || achievement.hallTicketNumber}</div>
                    <div className="text-xs text-white/40 flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {achievement.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-white">{achievement.department || achievement.stream}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-white line-clamp-1">{achievement.title || achievement.awardName}</div>
                    <div className="text-sm text-white/60 line-clamp-2 mt-1">{achievement.description || achievement.eventName}</div>
                    {(achievement.certificateLink || achievement.proof) && (
                      <div className="text-xs text-[#0ea5e9] mt-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <a
                          href={achievement.certificateLink || achievement.proof}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline truncate max-w-[160px] inline-block"
                        >
                          View Certificate
                        </a>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    {achievement.achievementType}
                  </Badge>
                </TableCell>
                <TableCell className="text-white/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/50" />
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={achievement.status === 'approved' ? 'default' : 'secondary'}
                    className={
                      achievement.status === 'approved'
                        ? 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/30'
                        : achievement.status === 'pending'
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30'
                        : 'bg-[#ef4444]/20 text-[#ef4444] border-[#ef4444]/30'
                    }
                  >
                    {achievement.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {achievement.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                    {achievement.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                    {achievement.status}
                  </Badge>
                </TableCell>
                {showActions && (
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {achievement.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(achievement.id)}
                            className="bg-[#10b981]/20 text-[#10b981] hover:bg-[#10b981]/30 border border-[#10b981]/30"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(achievement.id)}
                            className="bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30 border border-[#ef4444]/30"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(achievement.id)}
                        className="text-white/50 hover:text-[#ef4444] hover:bg-[#ef4444]/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/60">Review and manage student achievement submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Submissions</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-white mt-1">{totalSubmissions}</p>
                  <p className="text-[#0ea5e9] text-xs mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Approved</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#10b981] mt-1">{totalApproved}</p>
                  <p className="text-[#10b981] text-xs mt-2">
                    {totalSubmissions > 0 ? Math.round((totalApproved / totalSubmissions) * 100) : 0}% success rate
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Pending Review</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#f59e0b] mt-1">{totalPending}</p>
                  <p className="text-[#f59e0b] text-xs mt-2">Requires action</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Active Students</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-white mt-1">{uniqueStudents}</p>
                  <p className="text-[#0ea5e9] text-xs mt-2">Unique contributors</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#38bdf8] to-[#0ea5e9] flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#0ea5e9]" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search by name, title, or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#0ea5e9] focus:ring-[#0ea5e9]"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2749] border-white/10">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="AI & DS">AI &amp; DS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-[#1e2749] border-white/10">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Inter-University">Inter-University</SelectItem>
                  <SelectItem value="State">State</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Table */}
        <Card className="border-white/10 bg-[rgba(30,39,73,0.6)] backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#0ea5e9]" />
              Achievement Submissions
            </CardTitle>
            <CardDescription className="text-white/60">
              Review and manage all student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="pending" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                  Pending ({pendingAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                  Approved ({approvedAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                  Rejected ({rejectedAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-[#0ea5e9] data-[state=active]:text-white">
                  All ({filteredAchievements.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <AchievementTable achievements={pendingAchievements} />
              </TabsContent>

              <TabsContent value="approved" className="mt-4">
                <AchievementTable achievements={approvedAchievements} showActions={false} />
              </TabsContent>

              <TabsContent value="rejected" className="mt-4">
                <AchievementTable achievements={rejectedAchievements} showActions={false} />
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <AchievementTable achievements={filteredAchievements} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}