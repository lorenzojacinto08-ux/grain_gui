"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import {
  LucideBarChart,
  Search,
  Plus,
  Edit,
  Trash,
  Bell,
  MapPin,
  Sprout,
  CheckCircle,
  Mountain,
  ImageIcon,
  Users,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Eye,
  XCircle,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleApprovalUpdate = async (approvalId: number, status: string) => {
    try {
      const response = await fetch(`/api/approvals/${approvalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        // Revalidate the approvals data
        mutateApprovals()
        mutateApprovalStats()
      }
    } catch (error) {
      console.error("[v0] Error updating approval:", error)
    }
  }

  const { data: dashboardStats } = useSWR("/api/dashboard/stats", fetcher)
  const { data: dashboardFarmAreas = [] } = useSWR("/api/dashboard/farm-areas", fetcher)
  const { data: soilDistribution = [] } = useSWR("/api/dashboard/soil-distribution", fetcher)

  const { data: userStats } = useSWR("/api/users/stats", fetcher)
  const { data: users = [] } = useSWR("/api/users", fetcher)

  const { data: farmAreaStats } = useSWR("/api/farm-areas/stats", fetcher)
  const { data: farmAreas = [] } = useSWR("/api/farm-areas", fetcher)

  const { data: approvalStats } = useSWR("/api/approvals/stats", fetcher)
  const { data: approvals = [], mutate: mutateApprovals } = useSWR("/api/approvals", fetcher)
  const { mutate: mutateApprovalStats } = useSWR("/api/approvals/stats", fetcher)

  const renderDashboard = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Farm Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor your farm areas and harvest data</p>
        </div>
        <p className="text-sm text-muted-foreground">October 13, 2025</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Areas</p>
                <h3 className="text-3xl font-bold text-foreground">{dashboardStats?.totalAreas || 0}</h3>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +3 this month
                </p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Farms</p>
                <h3 className="text-3xl font-bold text-foreground">{dashboardStats?.activeFarms || 0}</h3>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  67% utilization
                </p>
              </div>
              <div className="bg-emerald-500/10 p-3 rounded-lg">
                <Sprout className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
                <h3 className="text-3xl font-bold text-foreground">{dashboardStats?.pendingApprovals || 0}</h3>
                <p className="text-xs text-amber-500 mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Needs review
                </p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Hectares</p>
                <h3 className="text-3xl font-bold text-foreground">{dashboardStats?.totalHectares || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Across all areas</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Mountain className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farm Areas Table */}
      <Card className="bg-card border-border mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-medium text-foreground">Farm Areas</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage and monitor your registered farm areas</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Area Name</TableHead>
                  <TableHead className="text-muted-foreground">Region</TableHead>
                  <TableHead className="text-muted-foreground">Province</TableHead>
                  <TableHead className="text-muted-foreground">Organization</TableHead>
                  <TableHead className="text-muted-foreground">Slope</TableHead>
                  <TableHead className="text-muted-foreground">Elevation</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboardFarmAreas.length > 0 ? (
                  dashboardFarmAreas.map((area: any) => (
                    <TableRow key={area.area_id} className="border-border hover:bg-secondary/50">
                      <TableCell className="font-medium text-foreground">{area.area_name}</TableCell>
                      <TableCell className="text-muted-foreground">{area.region}</TableCell>
                      <TableCell className="text-muted-foreground">{area.province}</TableCell>
                      <TableCell className="text-muted-foreground">{area.organization}</TableCell>
                      <TableCell className="text-muted-foreground">{area.slope}°</TableCell>
                      <TableCell className="text-muted-foreground">{area.elevation}m</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            area.approval_status === "Approved"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : area.approval_status === "Rejected"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        >
                          {area.approval_status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No farm areas found. Add your first area to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground">Soil Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {soilDistribution.length > 0 ? (
                soilDistribution.map((soil: any, index: number) => {
                  const total = soilDistribution.reduce((sum: number, s: any) => sum + s.count, 0)
                  return (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-foreground">{soil.soil_type}</span>
                        <span className="text-muted-foreground">{soil.count} areas</span>
                      </div>
                      <Progress value={(soil.count / total) * 100} className="h-2" />
                    </div>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No soil data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-foreground">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <MapPin className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">New area registered</p>
                  <p className="text-xs text-muted-foreground">Cagayan Farm added 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Area approved</p>
                  <p className="text-xs text-muted-foreground">Vigan farm approved 5 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-amber-500/10 p-2 rounded-lg">
                  <ImageIcon className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">Images uploaded</p>
                  <p className="text-xs text-muted-foreground">Naga Farm images added 1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

  const renderUsers = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage system users and their permissions</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                <h3 className="text-3xl font-bold text-foreground">{userStats?.totalUsers || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Registered accounts</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Administrators</p>
                <h3 className="text-3xl font-bold text-foreground">{userStats?.admins || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Admin accounts</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Regular Users</p>
                <h3 className="text-3xl font-bold text-foreground">{userStats?.regularUsers || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Standard accounts</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-medium text-foreground">All Users</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">View and manage user accounts</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Contact</TableHead>
                  <TableHead className="text-muted-foreground">User Type</TableHead>
                  <TableHead className="text-muted-foreground">Created At</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user: any) => (
                    <TableRow key={user.user_id} className="border-border hover:bg-secondary/50">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{user.contact}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.user_type === "Admin"
                              ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                              : "bg-green-500/10 text-green-500 border-green-500/20"
                          }
                        >
                          {user.user_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderFarmAreas = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Farm Areas</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage and monitor all registered farm areas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Areas</p>
                <h3 className="text-3xl font-bold text-foreground">{farmAreaStats?.totalAreas || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Registered areas</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-foreground">{farmAreaStats?.pendingApprovals || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Slope</p>
                <h3 className="text-3xl font-bold text-foreground">{farmAreaStats?.avgSlope || 0}°</h3>
                <p className="text-xs text-muted-foreground mt-1">Average slope</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <Mountain className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Elevation</p>
                <h3 className="text-3xl font-bold text-foreground">{farmAreaStats?.avgElevation || 0}m</h3>
                <p className="text-xs text-muted-foreground mt-1">Mean ASL</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <Mountain className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Farm Areas Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-medium text-foreground">All Farm Areas</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Complete list of registered farm areas with details</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Add Area
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Area Name</TableHead>
                  <TableHead className="text-muted-foreground">Region</TableHead>
                  <TableHead className="text-muted-foreground">Province</TableHead>
                  <TableHead className="text-muted-foreground">Organization</TableHead>
                  <TableHead className="text-muted-foreground">Slope</TableHead>
                  <TableHead className="text-muted-foreground">Elevation</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {farmAreas.length > 0 ? (
                  farmAreas.map((area: any) => (
                    <TableRow key={area.area_id} className="border-border hover:bg-secondary/50">
                      <TableCell className="text-muted-foreground">{area.area_id}</TableCell>
                      <TableCell className="font-medium text-foreground">{area.area_name}</TableCell>
                      <TableCell className="text-muted-foreground">{area.region}</TableCell>
                      <TableCell className="text-muted-foreground">{area.province}</TableCell>
                      <TableCell className="text-muted-foreground">{area.organization}</TableCell>
                      <TableCell className="text-muted-foreground">{area.slope}°</TableCell>
                      <TableCell className="text-muted-foreground">{area.elevation}m</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            area.approval_status === "Approved"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : area.approval_status === "Rejected"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        >
                          {area.approval_status || "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No farm areas found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderApprovals = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Area Approvals</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and approve farm area registrations</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending</p>
                <h3 className="text-3xl font-bold text-foreground">{approvalStats?.pending || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
              </div>
              <div className="bg-amber-500/10 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Approved</p>
                <h3 className="text-3xl font-bold text-foreground">{approvalStats?.approved || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                <h3 className="text-3xl font-bold text-foreground">{approvalStats?.rejected || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="bg-red-500/10 p-3 rounded-lg">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Reviewed</p>
                <h3 className="text-3xl font-bold text-foreground">{approvalStats?.totalRequests || 0}</h3>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-medium text-foreground">Pending Approvals</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Review farm area submissions and approve or reject</p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Area Name</TableHead>
                  <TableHead className="text-muted-foreground">Region</TableHead>
                  <TableHead className="text-muted-foreground">Province</TableHead>
                  <TableHead className="text-muted-foreground">Organization</TableHead>
                  <TableHead className="text-muted-foreground">Submitted</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.length > 0 ? (
                  approvals.map((approval: any) => (
                    <TableRow key={approval.approval_id} className="border-border hover:bg-secondary/50">
                      <TableCell className="text-muted-foreground">{approval.area_id}</TableCell>
                      <TableCell className="font-medium text-foreground">{approval.area_name}</TableCell>
                      <TableCell className="text-muted-foreground">{approval.region}</TableCell>
                      <TableCell className="text-muted-foreground">{approval.province}</TableCell>
                      <TableCell className="text-muted-foreground">{approval.organization}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(approval.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            approval.status === "Approved"
                              ? "bg-green-500/10 text-green-500 border-green-500/20"
                              : approval.status === "Rejected"
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          }
                        >
                          {approval.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {approval.status === "Pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10"
                                onClick={() => handleApprovalUpdate(approval.approval_id, "Approved")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                onClick={() => handleApprovalUpdate(approval.approval_id, "Rejected")}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No pending approvals.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Sidebar Toggle */}
      {isMobile && !sidebarOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg bg-card border-border"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={`${isMobile ? "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out" : "w-64"} ${isMobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"} bg-card border-r border-border flex flex-col`}
      >
        {isMobile && (
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h1 className="text-xl font-semibold text-green-500">FarmOS</h1>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}
        {!isMobile && (
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-semibold text-green-500">FarmOS</h1>
            <p className="text-xs text-muted-foreground mt-1">Farm Management System</p>
          </div>
        )}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            <button
              onClick={() => {
                setActiveSection("dashboard")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "dashboard" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <LucideBarChart className="mr-3 h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveSection("areas")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "areas" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <MapPin className="mr-3 h-5 w-5" />
              Farm Areas
            </button>
            <button
              onClick={() => {
                setActiveSection("approvals")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "approvals" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <CheckCircle className="mr-3 h-5 w-5" />
              Approvals
            </button>
            <button
              onClick={() => {
                setActiveSection("harvests")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "harvests" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <Sprout className="mr-3 h-5 w-5" />
              Harvest Data
            </button>
            <button
              onClick={() => {
                setActiveSection("topography")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "topography" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <Mountain className="mr-3 h-5 w-5" />
              Topography
            </button>
            <button
              onClick={() => {
                setActiveSection("users")
                if (isMobile) setSidebarOpen(false)
              }}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeSection === "users" ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
            >
              <Users className="mr-3 h-5 w-5" />
              Users
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border flex items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" className="mr-2" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="bg-primary text-primary-foreground">A</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border-border">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeSection === "dashboard" && renderDashboard()}
          {activeSection === "users" && renderUsers()}
          {activeSection === "areas" && renderFarmAreas()}
          {activeSection === "approvals" && renderApprovals()}
          {activeSection !== "dashboard" &&
            activeSection !== "users" &&
            activeSection !== "areas" &&
            activeSection !== "approvals" && (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Coming Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      The{" "}
                      {activeSection === "harvests"
                        ? "Harvest Data"
                        : activeSection === "topography"
                          ? "Topography"
                          : "Unknown"}{" "}
                      module is currently being built. Please check back later.
                    </p>
                    <Button
                      onClick={() => setActiveSection("dashboard")}
                      className="mt-4 bg-primary hover:bg-primary/90"
                    >
                      Return to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
        </main>
      </div>
    </div>
  )
}
