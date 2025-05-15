"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight } from "lucide-react"

// Sample topic data - replace with your actual data
const topicsData = [
  {
    id: 1,
    name: "Number",
    topics: [
      {
        topic: "Addition and Subtraction",
        url: "addition-and-subtraction.php",
      },
      {
        topic: "Multiplication and Division",
        url: "multiplication-and-division.php",
      },
      {
        topic: "Writing, Simplifying and Ordering Fractions",
        url: "fractions.php",
      },
    ],
  },
  {
    id: 2,
    name: "Algebra",
    topics: [
      {
        topic: "Solving Equations",
        url: "solving-equations.php",
      },
      {
        topic: "Expanding Brackets",
        url: "expanding-brackets.php",
      },
    ],
  },
  {
    id: 3,
    name: "Ratio, Proportion and Rates of Change",
    topics: [
      {
        topic: "Ratio",
        url: "ratio.php",
      },
      {
        topic: "Proportion",
        url: "proportion.php",
      },
    ],
  },
  {
    id: 4,
    name: "Geometry and Measures",
    topics: [
      {
        topic: "Area and Perimeter",
        url: "area-perimeter.php",
      },
      {
        topic: "Angles",
        url: "angles.php",
      },
    ],
  },
  {
    id: 5,
    name: "Statistics",
    topics: [
      {
        topic: "Mean, Median, Mode",
        url: "averages.php",
      },
      {
        topic: "Probability",
        url: "probability.php",
      },
    ],
  },
]

type TopicSelectorProps = {
  onSelectTopic: (topic: string) => void
}

export default function TopicSelector({ onSelectTopic }: TopicSelectorProps) {
  const [expandedTopics, setExpandedTopics] = useState<number[]>([])

  const toggleTopic = (topicId: number) => {
    setExpandedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="space-y-2">
          {topicsData.map((mainTopic) => (
            <div key={mainTopic.id} className="border rounded-md">
              <button
                className="w-full flex items-center justify-between p-3 font-medium text-left"
                onClick={() => toggleTopic(mainTopic.id)}
              >
                {mainTopic.name}
                {expandedTopics.includes(mainTopic.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {expandedTopics.includes(mainTopic.id) && (
                <div className="p-3 pt-0 border-t">
                  <ul className="space-y-1">
                    {mainTopic.topics.map((subTopic) => (
                      <li key={subTopic.url}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2"
                          onClick={() => onSelectTopic(subTopic.topic)}
                        >
                          {subTopic.topic}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
