"use client"

import { useState, useEffect } from "react"
import { format, addWeeks, differenceInWeeks } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Target, Plus, Calendar, TrendingUp, Award, CheckCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/hooks/use-sidebar"
import { cn } from "@/lib/utils"
import { getWeightEntries } from "@/actions/weight-actions"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

interface WeightEntry {
  id: number
  weight: number
  entryDate: Date
  note: string | null
}

interface Goal {
  id: string
  title: string
  description: string
  type: "weight" | "calorie" | "exercise" | "habit"
  targetValue: number
  currentValue: number
  unit: string
  deadline: Date
  status: "active" | "completed" | "paused"
  createdAt: Date
}

export default function GoalsPage() {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([])
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Lose 20 pounds",
      description: "Reach my target weight of 160 lbs",
      type: "weight",
      targetValue: 20,
      currentValue: 5,
      unit: "lbs",
      deadline: addWeeks(new Date(), 20),
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Stay under 1800 calories daily",
      description: "Maintain calorie deficit for weight loss",
      type: "calorie",
      targetValue: 1800,
      currentValue: 1650,
      unit: "cal/day",
      deadline: addWeeks(new Date(), 12),
      status: "active",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Exercise 5 times per week",
      description: "Build a consistent workout routine",
      type: "exercise",
      targetValue: 5,
      currentValue: 3,
      unit: "times/week",
      deadline: addWeeks(new Date(), 8),
      status: "active",
      createdAt: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  // New goal form state
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [newGoalType, setNewGoalType] = useState<"weight" | "calorie" | "exercise" | "habit">("weight")
  const [newGoalTarget, setNewGoalTarget] = useState("")
  const [newGoalUnit, setNewGoalUnit] = useState("lbs")
  const [newGoalDeadline, setNewGoalDeadline] = useState("")

  const isMobile = useMobile()
  const { collapsed } = useSidebar()

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const weights = await getWeightEntries()
        setWeightEntries(weights)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateGoal = () => {
    if (!newGoalTitle || !newGoalTarget || !newGoalDeadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      description: newGoalDescription,
      type: newGoalType,
      targetValue: Number.parseFloat(newGoalTarget),
      currentValue: 0,
      unit: newGoalUnit,
      deadline: new Date(newGoalDeadline),
      status: "active",
      createdAt: new Date(),
    }

    setGoals([...goals, newGoal])

    // Reset form
    setNewGoalTitle("")
    setNewGoalDescription("")
    setNewGoalType("weight")
    setNewGoalTarget("")
    setNewGoalUnit("lbs")
    setNewGoalDeadline("")

    toast({
      title: "Success",
      description: "Goal created successfully!",
    })
  }

  const calculateProgress = (goal: Goal) => {
    if (goal.type === "weight" && weightEntries.length > 0) {
      const startWeight = weightEntries[weightEntries.length - 1]?.weight || 0
      const currentWeight = weightEntries[0]?.weight || 0
      const weightLost = startWeight - currentWeight
      return Math.min((weightLost / goal.targetValue) * 100, 100)
    }
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "weight":
        return <Target className="h-4 w-4" />
      case "calorie":
        return <TrendingUp className="h-4 w-4" />
      case "exercise":
        return <Award className="h-4 w-4" />
      case "habit":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const activeGoals = goals.filter((goal) => goal.status === "active")
  const completedGoals = goals.filter((goal) => goal.status === "completed")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main
          className={cn(
            "flex-1 p-4 md:p-6 overflow-auto",
            !isMobile && (collapsed ? "md:ml-16" : "md:ml-64"),
            "transition-all duration-300",
          )}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Goals</h1>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 border-2 border-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 border-gray-200 dark:border-gray-600">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>Set a new goal to track your progress</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="goalTitle">Goal Title *</Label>
                    <Input
                      id="goalTitle"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="e.g., Lose 10 pounds"
                      className="border-2 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalDescription">Description</Label>
                    <Input
                      id="goalDescription"
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      placeholder="Optional description"
                      className="border-2 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goalType">Goal Type</Label>
                      <Select value={newGoalType} onValueChange={(value: any) => setNewGoalType(value)}>
                        <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight">Weight Loss</SelectItem>
                          <SelectItem value="calorie">Calorie Target</SelectItem>
                          <SelectItem value="exercise">Exercise</SelectItem>
                          <SelectItem value="habit">Habit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="goalTarget">Target Value *</Label>
                      <Input
                        id="goalTarget"
                        type="number"
                        value={newGoalTarget}
                        onChange={(e) => setNewGoalTarget(e.target.value)}
                        className="border-2 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goalUnit">Unit</Label>
                      <Select value={newGoalUnit} onValueChange={setNewGoalUnit}>
                        <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lbs">lbs</SelectItem>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="cal">calories</SelectItem>
                          <SelectItem value="times">times</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="goalDeadline">Deadline *</Label>
                      <Input
                        id="goalDeadline"
                        type="date"
                        value={newGoalDeadline}
                        onChange={(e) => setNewGoalDeadline(e.target.value)}
                        className="border-2 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateGoal} className="bg-green-600 hover:bg-green-700">
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 border-2 border-gray-200 dark:border-gray-600">
              <TabsTrigger value="active">Active Goals</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGoals.map((goal) => {
                  const progress = calculateProgress(goal)
                  const weeksLeft = differenceInWeeks(goal.deadline, new Date())

                  return (
                    <Card
                      key={goal.id}
                      className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
                    >
                      <CardHeader className="border-b-2 border-blue-200 dark:border-blue-700">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(goal.type)}
                            <CardTitle className="text-lg text-blue-700 dark:text-blue-300">{goal.title}</CardTitle>
                          </div>
                          <Badge className={`${getStatusColor(goal.status)} border-2`}>{goal.status}</Badge>
                        </div>
                        <CardDescription>{goal.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{progress.toFixed(1)}%</span>
                            </div>
                            <Progress value={progress} className="h-2 border border-blue-300 dark:border-blue-600" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                              <div className="text-gray-600 dark:text-gray-400">Current</div>
                              <div className="font-bold text-blue-600 dark:text-blue-400">
                                {goal.currentValue} {goal.unit}
                              </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                              <div className="text-gray-600 dark:text-gray-400">Target</div>
                              <div className="font-bold text-green-600 dark:text-green-400">
                                {goal.targetValue} {goal.unit}
                              </div>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border-2 border-blue-300 dark:border-blue-600">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {weeksLeft > 0 ? `${weeksLeft} weeks left` : "Overdue"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Due: {format(goal.deadline, "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {activeGoals.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">No Active Goals</h3>
                    <p className="text-gray-500 mb-4">Create your first goal to start tracking your progress!</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Goal
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGoals.map((goal) => (
                  <Card
                    key={goal.id}
                    className="border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
                  >
                    <CardHeader className="border-b-2 border-green-200 dark:border-green-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <CardTitle className="text-lg text-green-700 dark:text-green-300">{goal.title}</CardTitle>
                        </div>
                        <Badge className="bg-green-100 text-green-800 border-2 border-green-200">Completed</Badge>
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                          {goal.targetValue} {goal.unit}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Completed on {format(goal.deadline, "MMM d, yyyy")}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {completedGoals.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      No Completed Goals Yet
                    </h3>
                    <p className="text-gray-500">Keep working on your active goals to see them here!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="border-2 border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {activeGoals.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Active Goals</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200 dark:border-green-700 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                        {completedGoals.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Completed Goals</div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {activeGoals.length > 0
                          ? Math.round(
                              activeGoals.reduce((sum, goal) => sum + calculateProgress(goal), 0) / activeGoals.length,
                            )
                          : 0}
                        %
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average Progress</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <CardHeader className="border-b-2 border-gray-200 dark:border-gray-700">
                  <CardTitle>Goal Progress Overview</CardTitle>
                  <CardDescription>Track your progress across all active goals</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {activeGoals.length > 0 ? (
                    <div className="space-y-4">
                      {activeGoals.map((goal) => {
                        const progress = calculateProgress(goal)
                        return (
                          <div
                            key={goal.id}
                            className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                {getTypeIcon(goal.type)}
                                <span className="font-medium">{goal.title}</span>
                              </div>
                              <span className="text-sm text-gray-500">{progress.toFixed(1)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active goals to display.</p>
                      <p className="text-sm mt-2">Create some goals to see your progress overview!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Toaster />
    </div>
  )
}

