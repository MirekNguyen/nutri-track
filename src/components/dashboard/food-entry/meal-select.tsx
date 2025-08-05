import { CommandLoading } from "cmdk";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Meal } from "@/db/schema";

type MealSelectProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  meals: Meal[];
  isLoading: boolean;
  selectedMeal: Meal | undefined;
  onSelect: (meal: Meal) => void;
  triggerButton: React.ReactNode;
  isMobile: boolean;
};

export const MealSelectResponsive = ({
  open,
  setOpen,
  meals,
  isLoading,
  selectedMeal,
  onSelect,
  triggerButton,
  isMobile,
}: MealSelectProps) => {
  const List = (
    <ScrollArea className="w-full max-h-[400px]">
      <Command>
        <CommandInput placeholder="Search meals..." className="h-9" />
        {isLoading ? (
          <CommandLoading>
            <div className="p-2 space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CommandLoading>
        ) : (
          <CommandList className="max-h-[300px]">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No meals found.
            </CommandEmpty>
            <CommandGroup>
              {meals.map((meal) => (
                <CommandItem
                  key={meal.id}
                  value={meal.name}
                  onSelect={() => {
                    onSelect(meal);
                    setOpen(false);
                  }}
                  className={`
                  flex justify-between items-center cursor-pointer p-2 rounded-lg
                  ${
                    selectedMeal?.id === meal.id
                      ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                      : "hover:bg-muted/50"
                  }
                `}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">
                      {meal.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {meal.calories} kcal
                      </Badge>
                      <span className="text-xs text-blue-600 dark:text-blue-400">
                        {meal.protein}g protein
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      <div>C: {meal.carbs}g</div>
                      <div>F: {meal.fat}g</div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </ScrollArea>
  );

  // if (isMobile) {
  //   return (
  //     <Drawer open={open} onOpenChange={setOpen}>
  //       <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
  //       <DrawerContent>
  //         <div className="mt-4 border-t">{List}</div>
  //       </DrawerContent>
  //     </Drawer>
  //   );
  // }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="center"
      >
        {List}
      </PopoverContent>
    </Popover>
  );
};
