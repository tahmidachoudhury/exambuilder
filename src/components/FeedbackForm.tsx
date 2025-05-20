"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { StarIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type FeedbackFormProps = {
  onFeedbackSubmit?: (feedback: {
    category: string
    rating: number
    message: string
  }) => void
}

export default function FeedbackForm({ onFeedbackSubmit }: FeedbackFormProps) {
  const [category, setCategory] = useState<string>("")
  const [rating, setRating] = useState<number>(0)
  const [message, setMessage] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a feedback category",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating",
        variant: "destructive",
      })
      return
    }

    if (!message.trim()) {
      toast({
        title: "Feedback required",
        description: "Please provide your feedback",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically send the feedback to your backend
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (onFeedbackSubmit) {
        onFeedbackSubmit({ category, rating, message })
      }

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      setCategory("")
      setRating(0)
      setMessage("")
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to submit feedback. Please try again.${error}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provide Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback-category">Feedback Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="feedback-category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ui">User Interface</SelectItem>
              <SelectItem value="questions">Question Quality</SelectItem>
              <SelectItem value="features">Feature Requests</SelectItem>
              <SelectItem value="bugs">Bug Reports</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Rating</Label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <StarIcon
                  className={`h-6 w-6 ${
                    rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-message">Your Feedback</Label>
          <Textarea
            id="feedback-message"
            placeholder="Share your thoughts, suggestions, or report issues..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </CardFooter>
    </Card>
  )
}
