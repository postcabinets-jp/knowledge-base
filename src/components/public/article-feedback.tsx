"use client"

import { useState } from "react"
import { submitArticleFeedback } from "@/app/actions/articles"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, ThumbsDown } from "lucide-react"

export function ArticleFeedbackButtons({ articleId }: { articleId: string }) {
  const [voted, setVoted] = useState<"helpful" | "not_helpful" | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  async function handleVote(isHelpful: boolean) {
    if (voted) return
    setVoted(isHelpful ? "helpful" : "not_helpful")
    if (!isHelpful) setShowComment(true)
    else {
      await submitArticleFeedback(articleId, true)
      setSubmitted(true)
    }
  }

  async function handleSubmitComment() {
    await submitArticleFeedback(articleId, false, comment || undefined)
    setSubmitted(true)
    setShowComment(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-slate-500">フィードバックありがとうございます。</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-slate-700 text-center">この記事は役に立ちましたか？</p>
      <div className="flex justify-center gap-3">
        <Button
          variant={voted === "helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(true)}
          disabled={!!voted}
          className={voted === "helpful" ? "bg-green-600 hover:bg-green-700 border-green-600" : ""}
        >
          <ThumbsUp className="w-4 h-4 mr-1.5" />
          役に立った
        </Button>
        <Button
          variant={voted === "not_helpful" ? "default" : "outline"}
          size="sm"
          onClick={() => handleVote(false)}
          disabled={!!voted}
          className={voted === "not_helpful" ? "bg-slate-600 hover:bg-slate-700" : ""}
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" />
          役に立たなかった
        </Button>
      </div>

      {showComment && (
        <div className="max-w-md mx-auto space-y-3 pt-2">
          <Textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="改善点があればお聞かせください（任意）"
            rows={3}
            className="text-sm resize-none"
          />
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={() => setSubmitted(true)}>スキップ</Button>
            <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={handleSubmitComment}>送信</Button>
          </div>
        </div>
      )}
    </div>
  )
}
