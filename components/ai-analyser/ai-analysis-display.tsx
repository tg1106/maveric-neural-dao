import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckCircle, AlertCircle, Info } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AIAnalysis {
  id: string
  analysis_text: string
  confidence_score: number
  recommendations: string[]
  created_at: string
}

interface AIAnalysisDisplayProps {
  analysis: AIAnalysis
}

export function AIAnalysisDisplay({ analysis }: AIAnalysisDisplayProps) {
  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600"
    if (score >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (score: number) => {
    if (score >= 0.8) return CheckCircle
    return AlertCircle
  }

  const ConfidenceIcon = getConfidenceIcon(analysis.confidence_score)

  const isAIPowered = analysis.analysis_text.includes("BioGPT") || analysis.confidence_score >= 0.8
  const isFallback =
    analysis.analysis_text.includes("HUGGINGFACE_API_KEY not configured") ||
    analysis.analysis_text.includes("Clinical Analysis System")

  return (
    <div className="space-y-4">
      {/* Analysis Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">
            {isAIPowered ? "AI Analysis Results" : "Clinical Analysis"}
          </span>
          {isFallback && (
            <Info
              className="h-4 w-4 text-yellow-600"
              title="Using fallback analysis - configure HUGGINGFACE_API_KEY for AI-powered analysis"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceIcon className={`h-4 w-4 ${getConfidenceColor(analysis.confidence_score)}`} />
          <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
            {Math.round(analysis.confidence_score * 100)}% Confidence
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(analysis.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* AI Service Status */}
      {isFallback && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">
              Using clinical analysis system. Configure HUGGINGFACE_API_KEY environment variable for AI-powered
              analysis.
            </span>
          </div>
        </div>
      )}

      {/* Analysis Content */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Clinical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{analysis.analysis_text}</p>
        </CardContent>
      </Card>

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base text-primary">3 Key Treatment Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.recommendations.slice(0, 3).map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span className="text-foreground leading-relaxed">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-muted-foreground/20">
        <strong>Disclaimer:</strong> This {isAIPowered ? "AI-generated" : ""} analysis is for informational purposes
        only and should not replace professional medical judgment. Always consult with qualified healthcare
        professionals before making treatment decisions.
      </div>
    </div>
  )
}
