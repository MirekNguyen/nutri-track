"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { type FC, type ReactNode, useMemo, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CustomEntryForm } from "./custom-entry-form"
import { EntryForm } from "./entry-form"
import { Sparkles, Search, Edit3 } from "lucide-react"
import { AIEntryForm } from "./ai-entry-form"

type Props = {
  type?: "breakfast" | "lunch" | "dinner" | "snack"
  children: ReactNode
}

export const AddFoodEntry: FC<Props> = ({ children, type }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [foodTab, setFoodTab] = useState<string>("choose")
  const isMobile = useIsMobile()
  
  const defaultMealType = useMemo(() => {
    if (type) return type;
    
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 10) {
      return "breakfast";
    } else if (currentHour >= 10 && currentHour < 16) {
      return "lunch";
    } else if (currentHour >= 16 && currentHour < 21) {
      return "dinner";
    } else {
      return "snack";
    }
  }, [type]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] max-w-[95vw] p-4 overflow-y-auto max-h-[90vh]"
          style={{
            height: isMobile ? "80vh" : "600px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DialogHeader className="pb-2">
            <DialogTitle className="text-lg">Add Food Entry</DialogTitle>
            {!isMobile && (
              <DialogDescription className="text-sm">
                Choose from saved meals, use AI analysis, or enter manually
              </DialogDescription>
            )}
          </DialogHeader>

          <Tabs value={foodTab} onValueChange={setFoodTab} className="mt-2">
            <TabsList className="grid w-full grid-cols-3 h-9">
              <TabsTrigger value="choose" className="text-xs">
                <Search className="w-3 h-3 mr-1" />
                {isMobile ? "Meals" : "Choose Meal"}
              </TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                {isMobile ? "AI" : "AI Upload"}
              </TabsTrigger>
              <TabsTrigger value="custom" className="text-xs">
                <Edit3 className="w-3 h-3 mr-1" />
                {isMobile ? "Manual" : "Manual"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="choose" className="mt-4">
              <EntryForm submitAction={() => setIsOpen(false)} type={defaultMealType} />
            </TabsContent>

            <TabsContent value="ai" className="mt-4">
              <AIEntryForm submitAction={() => setIsOpen(false)} />
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <CustomEntryForm submitAction={() => setIsOpen(false)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Dialog>
  )
}

