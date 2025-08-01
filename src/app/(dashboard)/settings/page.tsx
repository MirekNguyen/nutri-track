"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Settings
        </h1>
      </div>

      <Tabs defaultValue="notifications">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Push Notifications
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="daily-reminder" className="font-medium">
                      Daily Meal Reminders
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive reminders to log your meals
                    </p>
                  </div>
                  <Switch id="daily-reminder" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="goal-updates" className="font-medium">
                      Goal Updates
                    </Label>
                    <p className="text-sm text-gray-500">
                      Get notified about your progress towards goals
                    </p>
                  </div>
                  <Switch id="goal-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="weekly-summary" className="font-medium">
                      Weekly Summary
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of your nutrition
                    </p>
                  </div>
                  <Switch id="weekly-summary" defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Email Notifications
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-updates" className="font-medium">
                      App Updates
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive emails about new features and updates
                    </p>
                  </div>
                  <Switch id="email-updates" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-newsletter" className="font-medium">
                      Newsletter
                    </Label>
                    <p className="text-sm text-gray-500">
                      Receive our nutrition and fitness newsletter
                    </p>
                  </div>
                  <Switch id="email-newsletter" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Reminder Times
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="breakfast-reminder" className="font-medium">
                    Breakfast Reminder
                  </Label>
                  <Input
                    type="time"
                    id="breakfast-reminder"
                    defaultValue="08:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lunch-reminder" className="font-medium">
                    Lunch Reminder
                  </Label>
                  <Input type="time" id="lunch-reminder" defaultValue="12:30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dinner-reminder" className="font-medium">
                    Dinner Reminder
                  </Label>
                  <Input
                    type="time"
                    id="dinner-reminder"
                    defaultValue="18:30"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-green-600 hover:bg-green-700">
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Email Address
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    defaultValue="john.doe@example.com"
                    className="flex-1"
                  />
                  <Button variant="outline">Change Email</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">Password</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="password"
                    value="••••••••"
                    disabled
                    className="flex-1"
                  />
                  <Button variant="outline">Change Password</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enhance your account security</p>
                    <p className="text-sm text-gray-500">
                      Protect your account with 2FA
                    </p>
                  </div>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Connected Accounts
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        G
                      </div>
                      <div>
                        <p className="font-medium">Google</p>
                        <p className="text-sm text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Apple</p>
                        <p className="text-sm text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-green-600 hover:bg-green-700">
                Save Account Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Data Storage
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-storage" className="font-medium">
                        Store Data Locally
                      </Label>
                      <p className="text-sm text-gray-500">
                        Keep a copy of your data on this device
                      </p>
                    </div>
                    <Switch id="data-storage" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="cloud-backup" className="font-medium">
                        Cloud Backup
                      </Label>
                      <p className="text-sm text-gray-500">
                        Automatically backup your data to the cloud
                      </p>
                    </div>
                    <Switch id="cloud-backup" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Data Usage
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics" className="font-medium">
                        Analytics
                      </Label>
                      <p className="text-sm text-gray-500">
                        Help improve the app by sharing usage data
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="personalization" className="font-medium">
                        Personalization
                      </Label>
                      <p className="text-sm text-gray-500">
                        Allow us to personalize your experience
                      </p>
                    </div>
                    <Switch id="personalization" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Data Management
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium">Export Your Data</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Download all your nutrition and fitness data
                    </p>
                    <Button variant="outline">Export Data</Button>
                  </div>
                  <div>
                    <p className="font-medium">Delete Your Data</p>
                    <p className="text-sm text-gray-500 mb-2">
                      Permanently delete all your data
                    </p>
                    <Button variant="destructive">Delete All Data</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-green-600 hover:bg-green-700">
                Save Privacy Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
