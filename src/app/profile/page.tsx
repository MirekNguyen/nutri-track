"use client"

import { Header } from "../components/header"
import { Sidebar } from "../components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

// Import the useSidebar hook
import { useSidebar } from "@/hooks/use-sidebar"

export default function ProfilePage() {
  const isMobile = useMobile()

  // Inside the ProfilePage component, add:
  const { collapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                      <AvatarFallback className="text-4xl">JD</AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold">John Doe</h2>
                  <p className="text-gray-500 mb-4">john.doe@example.com</p>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">Jan 2025</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md text-center">
                      <p className="text-sm text-gray-500">Streak</p>
                      <p className="font-medium">24 days</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6">
                  <Button variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Tabs defaultValue="personal">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" defaultValue="John" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" defaultValue="Doe" className="mt-1" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="john.doe@example.com" className="mt-1" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input id="age" type="number" defaultValue="32" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select defaultValue="male">
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="height">Height (cm)</Label>
                          <Input id="height" type="number" defaultValue="180" className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="goals" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fitness Goals</CardTitle>
                      <CardDescription>Set your nutrition and fitness targets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="goal">Primary Goal</Label>
                        <Select defaultValue="maintain">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lose">Lose Weight</SelectItem>
                            <SelectItem value="maintain">Maintain Weight</SelectItem>
                            <SelectItem value="gain">Gain Weight</SelectItem>
                            <SelectItem value="muscle">Build Muscle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="activity">Activity Level</Label>
                        <Select defaultValue="moderate">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                            <SelectItem value="light">Lightly active (light exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">
                              Moderately active (moderate exercise 3-5 days/week)
                            </SelectItem>
                            <SelectItem value="active">Very active (hard exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="extreme">
                              Extremely active (very hard exercise & physical job)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="targetWeight">Target Weight (lbs)</Label>
                          <Input id="targetWeight" type="number" defaultValue="160" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="weeklyGoal">Weekly Goal</Label>
                          <Select defaultValue="0.5">
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select weekly goal" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0.25">Lose 0.25 lbs per week</SelectItem>
                              <SelectItem value="0.5">Lose 0.5 lbs per week</SelectItem>
                              <SelectItem value="1">Lose 1 lb per week</SelectItem>
                              <SelectItem value="0">Maintain weight</SelectItem>
                              <SelectItem value="-0.5">Gain 0.5 lbs per week</SelectItem>
                              <SelectItem value="-1">Gain 1 lb per week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="calorieGoal">Daily Calories</Label>
                          <Input id="calorieGoal" type="number" defaultValue="2000" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="proteinGoal">Protein Goal (g)</Label>
                          <Input id="proteinGoal" type="number" defaultValue="150" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="waterGoal">Water Goal (oz)</Label>
                          <Input id="waterGoal" type="number" defaultValue="80" className="mt-1" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-green-600 hover:bg-green-700">Save Goals</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>App Preferences</CardTitle>
                      <CardDescription>Customize your app experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="units">Measurement Units</Label>
                        <Select defaultValue="imperial">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select units" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="imperial">Imperial (lb, in)</SelectItem>
                            <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select defaultValue="light">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select theme" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System Default</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="bg-green-600 hover:bg-green-700">Save Preferences</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
