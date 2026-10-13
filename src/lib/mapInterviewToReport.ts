import { CareerIntelligenceData, BENCHMARK_REPORT_DATA, QuestionScoreItem } from "@/components/interview/CareerIntelligenceDashboard";

interface RawEvaluation {
  score?: number;
  overallScore?: number;
  careerScore?: number;
  strengths?: string[];
  weaknesses?: string[];
  areasForImprovement?: string[];
  topicsToLearn?: string[];
  recommendation?: string;
  summary?: string;
  questionScores?: Array<{
    question?: string;
    topic?: string;
    answer?: string;
    score?: number;
    feedback?: string;
    technicalAccuracy?: number;
    clarity?: number;
    realTimeUnderstanding?: number;
    architectureDepth?: number;
  }>;
}

export function mapInterviewToCareerIntelligence(
  interview: any,
  user?: any,
  profile?: any
): CareerIntelligenceData {
  if (!interview) {
    return {
      ...BENCHMARK_REPORT_DATA,
      isCompleted: false,
      candidateName: user?.name || "Candidate",
    };
  }

  // Parse raw evaluation if string
  let parsedEval: RawEvaluation = {};
  if (interview.evaluation) {
    try {
      parsedEval =
        typeof interview.evaluation === "string"
          ? JSON.parse(interview.evaluation)
          : interview.evaluation;
    } catch {
      parsedEval = {};
    }
  }

  const isCompleted =
    interview.status === "completed" ||
    (Boolean(parsedEval.score) && interview.status !== "scheduled" && interview.status !== "cancelled");

  const candidateName = user?.name || interview.candidateName || "Candidate";

  // Compute Career Score (0 - 1000)
  let careerScore = 742;
  if (parsedEval.careerScore && typeof parsedEval.careerScore === "number") {
    careerScore = Math.round(parsedEval.careerScore);
  } else if (typeof parsedEval.score === "number") {
    // If score is 0-10, scale to 0-1000
    if (parsedEval.score <= 10) {
      careerScore = Math.round(parsedEval.score * 100);
      if (careerScore === 0) careerScore = 200; // minimum benchmark floor
    } else if (parsedEval.score <= 100) {
      careerScore = Math.round(parsedEval.score * 10);
    } else {
      careerScore = Math.round(parsedEval.score);
    }
  } else if (typeof interview.evaluationScore === "number") {
    careerScore = Math.round(interview.evaluationScore * 100);
  } else if (typeof interview.overallScore === "number") {
    careerScore = Math.round(interview.overallScore * 10);
  }

  // Determine industry status from score
  let industryStatus = "Industry Ready";
  if (careerScore >= 850) {
    industryStatus = "Premium Market-Ready Talent";
  } else if (careerScore >= 700) {
    industryStatus = "Industry Ready";
  } else if (careerScore >= 550) {
    industryStatus = "Growth Potential";
  } else {
    industryStatus = "Skill Enhancement Recommended";
  }

  // Candidate ID
  const candidateId =
    user?.id
      ? `HRT-AI-IND-${user.id.replace(/-/g, "").substring(0, 5).toUpperCase()}`
      : "HRT-AI-IND-10482";

  // Primary Skills
  let primarySkills = BENCHMARK_REPORT_DATA.primarySkills;
  if (profile?.skills && typeof profile.skills === "string") {
    const list = profile.skills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    if (list.length > 0) primarySkills = list;
  }

  // Parse questions
  let mappedQuestions: QuestionScoreItem[] = [];
  if (Array.isArray(parsedEval.questionScores) && parsedEval.questionScores.length > 0) {
    mappedQuestions = parsedEval.questionScores.map((q, idx) => {
      const qScore = typeof q.score === "number" ? q.score : 7;
      const normalizedScore10 = qScore <= 10 ? qScore : qScore / 10;
      
      const techAcc = q.technicalAccuracy ?? Math.min(10, Math.max(1, Math.round(normalizedScore10 * 1.05)));
      const clarity = q.clarity ?? Math.min(10, Math.max(1, Math.round(normalizedScore10 * 0.95)));
      const realTime = q.realTimeUnderstanding ?? Math.min(10, Math.max(1, Math.round(normalizedScore10 * 1.0)));
      const archDepth = q.architectureDepth ?? Math.min(10, Math.max(1, Math.round(normalizedScore10 * 0.85)));
      const total = techAcc + clarity + realTime + archDepth;

      return {
        number: idx + 1,
        topic: q.topic || extractTopic(q.question || `Technical Question ${idx + 1}`),
        question: q.question || "Technical interview question",
        answer: q.answer,
        technicalAccuracy: techAcc,
        clarity,
        realTimeUnderstanding: realTime,
        architectureDepth: archDepth,
        total,
        score: normalizedScore10,
        feedback: q.feedback || "Evaluated based on technical accuracy and real-time reasoning.",
      };
    });
  } else {
    mappedQuestions = BENCHMARK_REPORT_DATA.questions!;
  }

  // Candidate Title & Track
  const candidateTitle = profile?.currentRole
    ? `${profile.currentRole} | ${profile.totalExperience || "3+ Years Experience"}`
    : "Software Engineer | 5+ Years Experience";

  const careerTrack = profile?.suggestedRoles
    ? safeParseFirst(profile.suggestedRoles)
    : "Full Stack / Backend Engineering";

  // Strengths & Growth Areas
  const topStrengths =
    Array.isArray(parsedEval.strengths) && parsedEval.strengths.length > 0
      ? parsedEval.strengths
      : BENCHMARK_REPORT_DATA.topStrengths;

  const topGrowthAreas =
    Array.isArray(parsedEval.weaknesses) && parsedEval.weaknesses.length > 0
      ? parsedEval.weaknesses
      : Array.isArray(parsedEval.areasForImprovement) && parsedEval.areasForImprovement.length > 0
      ? parsedEval.areasForImprovement
      : BENCHMARK_REPORT_DATA.topGrowthAreas;

  // Coach Notes
  let coachNotes = parsedEval.summary;
  if (!coachNotes) {
    coachNotes = `${candidateName}, your interview assessment demonstrates practical technical foundation across your stack. With focused execution on ${topGrowthAreas?.[0]?.toLowerCase() || "system design"} and architecture communication, you will be well positioned for premium engineering roles.`;
  }

  // Interpretation
  const scoreBandInterpretation =
    `${candidateName} is ready for ${careerScore >= 700 ? "mid-level to senior full-stack" : "foundational engineering"} roles. Focus on system design, cloud ownership and architecture communication to reach the next career band.`;

  return {
    isCompleted,
    candidateName,
    candidateTitle,
    careerTrack,
    candidateId,
    avatarUrl: "/hero-candidate.jpg",
    interviewDate:
      interview.date ||
      new Date(interview.createdAt || Date.now()).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    interviewDurationMinutes: interview.duration || 42,
    totalQuestions: mappedQuestions.length,
    resumeVisibility: "Private — Not Shared",
    primarySkills,
    careerScore,
    industryStatus,
    scoreBandInterpretation,
    healthDistribution: {
      technical: Math.min(95, Math.max(45, Math.round(careerScore * 0.105))),
      practical: Math.min(95, Math.max(45, Math.round(careerScore * 0.11))),
      cloud: Math.min(90, Math.max(40, Math.round(careerScore * 0.09))),
      systemDesign: Math.min(90, Math.max(35, Math.round(careerScore * 0.082))),
      communication: Math.min(90, Math.max(45, Math.round(careerScore * 0.086))),
    },
    questions: mappedQuestions,
    topStrengths,
    topGrowthAreas,
    coachNotes,
    industryAlignment: Math.min(98, Math.max(50, Math.round(careerScore * 0.1))),
    recommendedRoles: BENCHMARK_REPORT_DATA.recommendedRoles,
    nextStep: BENCHMARK_REPORT_DATA.nextStep,
  };
}

function extractTopic(questionText: string): string {
  const lower = questionText.toLowerCase();
  if (lower.includes("rest") || lower.includes("api")) return "REST APIs";
  if (lower.includes("jwt") || lower.includes("token") || lower.includes("auth")) return "JWT Authentication";
  if (lower.includes("microservice") || lower.includes("distributed")) return "Microservices & Architecture";
  if (lower.includes("aws") || lower.includes("cloud") || lower.includes("gcp") || lower.includes("docker")) return "Cloud & DevOps";
  if (lower.includes("latency") || lower.includes("debug") || lower.includes("production")) return "Production Debugging";
  if (lower.includes("socket") || lower.includes("websocket")) return "Socket Communication";
  if (lower.includes("react") || lower.includes("state") || lower.includes("props")) return "React & State Management";
  if (lower.includes("sql") || lower.includes("database") || lower.includes("mongo")) return "Database Architecture";
  if (lower.includes("system") || lower.includes("design") || lower.includes("scal")) return "System Design";
  return "Engineering Assessment";
}

function safeParseFirst(jsonStr: string): string {
  try {
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed) && parsed[0]) return parsed[0];
    return "Full Stack / Backend Engineering";
  } catch {
    return jsonStr || "Full Stack / Backend Engineering";
  }
}
