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
  const [filterAcademicYear, setFilterAcademicYear] = useState('all');

  const handleApprove = async (id: string) => {
    await updateAchievementStatus(id, 'approved');
    toast.success('Achievement approved successfully!');
  };

  const handleReject = async (id: string) => {
    await updateAchievementStatus(id, 'rejected');
    toast.error('Achievement rejected');
  };

  const handleDelete = async (id: string) => {
    await deleteAchievement(id);
    toast.success('Achievement deleted');
  };

  // Get unique academic years for filter
  const academicYears = [...new Set(achievements.map((a) => a.academicYear).filter(Boolean))].sort().reverse();

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch =
      achievement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (achievement.rollNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = filterDepartment === 'all' || achievement.department === filterDepartment;
    const matchesType = filterType === 'all' || achievement.achievementType === filterType;
    const matchesAcademicYear = filterAcademicYear === 'all' || achievement.academicYear === filterAcademicYear;

    return matchesSearch && matchesDepartment && matchesType && matchesAcademicYear;
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
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-accent">
            <TableHead className="text-muted-foreground">Student</TableHead>
            <TableHead className="text-muted-foreground">Department</TableHead>
            <TableHead className="text-muted-foreground">Achievement</TableHead>
            <TableHead className="text-muted-foreground">Type</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Year</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            {showActions && <TableHead className="text-muted-foreground text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {achievements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 8 : 7} className="text-center text-muted-foreground py-8">
                No achievements found
              </TableCell>
            </TableRow>
          ) : (
            achievements.map((achievement) => (
              <TableRow key={achievement.id} className="border-border hover:bg-accent/50">
                <TableCell>
                  <div>
                    <div className="font-medium text-foreground">{achievement.studentName}</div>
                    <div className="text-sm text-muted-foreground">{achievement.rollNumber || achievement.hallTicketNumber}</div>
                    <div className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1">
                      <Mail className="w-3 h-3" />
                      {achievement.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">{achievement.department || achievement.stream}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="font-medium text-foreground line-clamp-1">{achievement.title || achievement.awardName}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{achievement.description || achievement.eventName}</div>
                    {(achievement.certificateLink || achievement.proof) && (
                      <div className="text-xs text-foreground/70 mt-1 flex items-center gap-1">
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
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {achievement.achievementType}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground/60" />
                    {new Date(achievement.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {achievement.academicYear}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={achievement.status === 'approved' ? 'default' : 'secondary'}
                    className={
                      achievement.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : achievement.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
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
                            className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReject(achievement.id)}
                            className="bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30 border border-red-500/30"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(achievement.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
          <h1 className="font-['Plus_Jakarta_Sans'] text-4xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Review and manage student achievement submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border bg-card backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Submissions</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-foreground mt-1">{totalSubmissions}</p>
                  <p className="text-muted-foreground text-xs mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    All time
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalApproved}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2">
                    {totalSubmissions > 0 ? Math.round((totalApproved / totalSubmissions) * 100) : 0}% success rate
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Pending Review</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{totalPending}</p>
                  <p className="text-amber-600 dark:text-amber-400 text-xs mt-2">Requires action</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card backdrop-blur-xl shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Students</p>
                  <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-foreground mt-1">{uniqueStudents}</p>
                  <p className="text-muted-foreground text-xs mt-2">Unique contributors</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card backdrop-blur-xl shadow-2xl mb-6">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, title, or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input-background border-border text-foreground placeholder:text-muted-foreground/50 focus:border-foreground focus:ring-foreground"
                />
              </div>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger className="bg-input-background border-border text-foreground">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="AI&DS">AI&amp;DS</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-input-background border-border text-foreground">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Inter-University">Inter-University</SelectItem>
                  <SelectItem value="State">State</SelectItem>
                  <SelectItem value="National">National</SelectItem>
                  <SelectItem value="International">International</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterAcademicYear} onValueChange={setFilterAcademicYear}>
                <SelectTrigger className="bg-input-background border-border text-foreground">
                  <SelectValue placeholder="All Academic Years" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Academic Years</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Achievements Table */}
        <Card className="border-border bg-card backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-foreground" />
              Achievement Submissions
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Review and manage all student submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="bg-secondary border border-border">
                <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Pending ({pendingAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Approved ({approvedAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Rejected ({rejectedAchievements.length})
                </TabsTrigger>
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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