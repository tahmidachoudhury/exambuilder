"use client"

import * as React from "react"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronsUpDown } from "lucide-react"

type Checked = DropdownMenuCheckboxItemProps["checked"]

const topics = [
  "Number",
  "Algebra",
  "Geometry",
  "RPR",
  "Statistics",
  "Probability",
]

type Props = {
  backendQuestions: []
  selected: string[]
}

export function DropdownMenuCheckboxes({ backendQuestions, selected }: Props) {
  const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
  const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
  const [showPanel, setShowPanel] = React.useState<Checked>(false)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={!!showPanel}
          className="w-full justify-between"
        >
          {/* {console.log(selected)} */}
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <Badge variant="secondary" key={value} className="mr-1">
                  hello
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Select topics</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>GCSE Maths Topics</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {topics.map((topic) => {
          const hasTopics = backendQuestions.some((q: any) => q.topic === topic)
          return (
            <DropdownMenuCheckboxItem
              checked={showPanel}
              key={topic}
              onCheckedChange={setShowStatusBar}
              disabled={!hasTopics}
            >
              {topic}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
