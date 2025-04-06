"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandTitle,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { DisabledDiv } from "./DisabledDiv"

export type Option = {
  label: string
  value: string
  desc?: string
}

type MultiSelectProps = {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  backendQuestions: []
}

export function TopicSelect({
  options,
  selected,
  onChange,
  backendQuestions,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <Badge variant="secondary" key={value} className="mr-1">
                  {options.find((option) => option.value === value)?.label}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandTitle placeholder="GCSE Maths Topics" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const hasTopics = backendQuestions.some(
                  (q) => q.topic === option.value
                )
                return (
                  <CommandItem
                    key={option.value}
                    disabled={!hasTopics}
                    onSelect={() => {
                      onChange(
                        selected.includes(option.value)
                          ? selected.filter((item) => item !== option.value)
                          : [...selected, option.value]
                      )
                    }}
                  >
                    {/* {console.log(options)} */}
                    <div className="flex items-center space-x-2">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      {option.value}
                    </div>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
