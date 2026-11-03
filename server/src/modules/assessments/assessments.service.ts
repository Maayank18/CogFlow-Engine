import {
  AssessmentModel,
  AssessmentAttemptModel,
  TopicProgressModel,
} from '../../infrastructure/database/models/index.js';
import { inMemoryStore } from '../../infrastructure/database/inMemoryStore.js';
import { getDatabaseStatus } from '../../infrastructure/database/index.js';
import { learningService } from '../learning/learning.service.js';
import { LLMOrchestrator } from '../../infrastructure/llm/LLMOrchestrator.js';

export class AssessmentsService {
  private llmOrchestrator = LLMOrchestrator.getInstance();

  async getAssessmentForTopic(topicId: string, tier: 'B' | 'A' | 'S' = 'A') {
    const lesson = await learningService.getLessonForTopic(topicId, tier);

    return {
      topicId,
      tier,
      title: `${lesson.topicTitle} — Tier ${tier} Assessment`,
      passingScorePercentage: 70,
      questions: lesson.practiceQuestions,
    };
  }

  async submitAttempt(params: {
    userId: string;
    topicId: string;
    tier: 'B' | 'A' | 'S';
    answers: Array<{
      questionId: string;
      type: 'mcq' | 'concept';
      selectedOptionIndex?: number;
      conceptualAnswerText?: string;
    }>;
  }) {
    const { userId, topicId, tier, answers } = params;
    const { isInMemoryMode } = getDatabaseStatus();

    // Retrieve the lesson to access question keys and rubric criteria
    const lesson = await learningService.getLessonForTopic(topicId, tier);
    const questions = lesson.practiceQuestions;

    let totalScore = 0;
    let maximumScore = 0;
    const evaluatedAnswers: any[] = [];
    const allStrengths: string[] = [];
    const allMissing: string[] = [];
    const allMisconceptions: string[] = [];
    const allRevisions: string[] = [];

    for (const ans of answers) {
      const q = questions.find((item) => item.id === ans.questionId);
      if (!q) continue;

      maximumScore += q.maxScore;

      if (q.type === 'mcq') {
        const isCorrect = ans.selectedOptionIndex === q.correctAnswerIndex;
        const earned = isCorrect ? q.maxScore : 0;
        totalScore += earned;

        evaluatedAnswers.push({
          questionId: q.id,
          type: 'mcq',
          selectedOptionIndex: ans.selectedOptionIndex,
          earnedScore: earned,
          feedback: isCorrect
            ? 'Correct! ' + q.explanation
            : `Incorrect. Expected option ${String.fromCharCode(65 + (q.correctAnswerIndex || 0))}. ${q.explanation}`,
        });

        if (isCorrect) {
          allStrengths.push(`Mastered key concept in question: "${q.prompt.slice(0, 40)}..."`);
        } else {
          allMissing.push(`Review explanation for "${q.prompt.slice(0, 40)}..."`);
        }
      } else {
        // Conceptual grading via semantic rubric evaluator
        const studentText = ans.conceptualAnswerText || '';
        const grading = await this.llmOrchestrator.evaluateConceptualAnswer({
          topicTitle: lesson.topicTitle,
          tier,
          questionPrompt: q.prompt,
          expectedExplanation: q.explanation,
          rubricCriteria: q.rubricCriteria || ['Clarity', 'Conceptual correctness', 'Completeness'],
          studentAnswer: studentText,
          maxScore: q.maxScore,
        });

        totalScore += grading.score;
        evaluatedAnswers.push({
          questionId: q.id,
          type: 'concept',
          conceptualAnswerText: studentText,
          earnedScore: grading.score,
          feedback: grading.feedback,
        });

        allStrengths.push(...grading.strengths);
        allMissing.push(...grading.missingConcepts);
        allMisconceptions.push(...grading.misconceptions);
        allRevisions.push(...grading.recommendedRevision);
      }
    }

    if (maximumScore === 0) maximumScore = 1;
    const percentage = Math.round((totalScore / maximumScore) * 100);
    const passed = percentage >= 70;

    const attemptData = {
      userId,
      topicId,
      tier,
      score: totalScore,
      maximumScore,
      percentage,
      passed,
      answers: evaluatedAnswers,
      overallFeedback: passed
        ? `Congratulations! You demonstrated strong mastery at Tier ${tier} (${percentage}%).`
        : `You scored ${percentage}%. Review the recommended concepts and try again.`,
      strengths: allStrengths.slice(0, 4),
      missingConcepts: allMissing.slice(0, 4),
      misconceptions: allMisconceptions.slice(0, 3),
      recommendedRevision: allRevisions.slice(0, 3),
      submittedAt: new Date(),
    };

    let attempt: any;
    if (isInMemoryMode) {
      attempt = inMemoryStore.assessmentAttempts.create(attemptData);

      // Update topic progress in-memory
      const progress = inMemoryStore.topicProgress.findOne(
        (p) => p.userId === userId && p.topicId === topicId
      );
      if (progress) {
        inMemoryStore.topicProgress.findByIdAndUpdate(progress.id, {
          assessmentCount: (progress.assessmentCount || 0) + 1,
          averageScore: Math.round(((progress.averageScore || 0) + percentage) / 2),
          masteryLevel: Math.max(progress.masteryLevel || 0, percentage),
          isMastered: (progress.masteryLevel || 0) >= 80 || percentage >= 80,
          highestTierReached: tier === 'S' ? 'S' : progress.highestTierReached === 'S' ? 'S' : tier,
          lastStudiedAt: new Date(),
        });
      } else {
        inMemoryStore.topicProgress.create({
          userId,
          topicId,
          assessmentCount: 1,
          averageScore: percentage,
          masteryLevel: percentage,
          isMastered: percentage >= 80,
          highestTierReached: tier,
          completedSections: [],
          totalTimeSpentSeconds: 180,
          lastStudiedAt: new Date(),
        });
      }
    } else {
      attempt = await AssessmentAttemptModel.create(attemptData);

      await TopicProgressModel.findOneAndUpdate(
        { userId, topicId },
        {
          $inc: { assessmentCount: 1 },
          $set: {
            masteryLevel: Math.max(percentage),
            isMastered: percentage >= 80,
            highestTierReached: tier,
            lastStudiedAt: new Date(),
          },
        },
        { upsert: true }
      );
    }

    return attempt;
  }

  async listAttempts(userId: string, topicId?: string) {
    const { isInMemoryMode } = getDatabaseStatus();

    if (isInMemoryMode) {
      return inMemoryStore.assessmentAttempts
        .find((a) => a.userId === userId && (!topicId || a.topicId === topicId))
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    const filter: Record<string, unknown> = { userId };
    if (topicId) filter.topicId = topicId;

    return AssessmentAttemptModel.find(filter).sort({ submittedAt: -1 }).limit(30);
  }
}

export const assessmentsService = new AssessmentsService();
