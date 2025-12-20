"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/Checkbox"
import { Label } from "@/components/ui/label"

type FilterPanelProps = {
  activeFilters: {
    difficulty: string[]
    type: string[]
  }
  setActiveFilters: React.Dispatch<
    React.SetStateAction<{
      difficulty: string[]
      type: string[]
    }>
  >
}

export default function FilterPanel({
  activeFilters,
  setActiveFilters,
}: FilterPanelProps) {
  const difficulties = ["Grade 1-3", "Grade 4-5", "Grade 6-7", "Grade 8-9"]

  const paperTypes = ["calculator", "non-calc"]

  const toggleDifficulty = (difficulty: string) => {
    setActiveFilters((prev) => {
      if (prev.difficulty.includes(difficulty)) {
        return {
          ...prev,
          difficulty: prev.difficulty.filter((d) => d !== difficulty),
        }
      } else {
        return {
          ...prev,
          difficulty: [...prev.difficulty, difficulty],
        }
      }
    })
  }

  const toggleType = (type: string) => {
    setActiveFilters((prev) => {
      if (prev.type.includes(type)) {
        return {
          ...prev,
          type: prev.type.filter((t) => t !== type),
        }
      } else {
        return {
          ...prev,
          type: [...prev.type, type],
        }
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-medium">Difficulty Level</h3>
            <div className="space-y-2">
              {difficulties.map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={activeFilters.difficulty.includes(difficulty)}
                    onCheckedChange={() => toggleDifficulty(difficulty)}
                  />
                  <Label htmlFor={`difficulty-${difficulty}`}>
                    {difficulty}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Paper Type</h3>
            <div className="space-y-2">
              {paperTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={activeFilters.type.includes(type)}
                    onCheckedChange={() => toggleType(type)}
                  />
                  <Label htmlFor={`type-${type}`}>
                    {type === "non-calc" ? "Non-Calculator" : "Calculator"}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
