import { NextRequest, NextResponse } from "next/server";
import EvaluationService from "@/services/evaluationService";
import QuestService from "@/services/questService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      ticketId,
      code,
      language = "javascript",
      timeSpent = 0,
      questId,
      stageIndex,
    } = body;

    if (!userId || !ticketId || !code) {
      return NextResponse.json(
        { success: false, error: "userId, ticketId, and code are required" },
        { status: 400 }
      );
    }

    const attempt = await EvaluationService.submitSolution({
      userId,
      ticketId,
      code,
      language,
      timeSpent,
    });

    let questProgress = null as any;
    let nextStage = null as any;

    if (attempt.passed && questId && stageIndex !== undefined) {
      const stageIdx = Number(stageIndex);
      if (!Number.isNaN(stageIdx)) {
        await QuestService.startQuest(userId, questId);
        const canAccess = await QuestService.canAccessStage(userId, questId, stageIdx);
        if (canAccess) {
          questProgress = await QuestService.completeStage(
            userId,
            questId,
            stageIdx,
            attempt.score || 0,
            attempt._id,
            timeSpent
          );
        }

        const quest = await QuestService.getQuestById(questId);
        if (quest) {
          const nextStageIndex = stageIdx + 1;
          const nextStageData = quest.stages[nextStageIndex];
          const nextStageTicket = nextStageData?.ticketId as any;
          const nextStageTicketId =
            typeof nextStageTicket === "string"
              ? nextStageTicket
              : nextStageTicket?._id?.toString?.() ?? nextStageTicket?.id?.toString?.();

          if (nextStageTicketId) {
            nextStage = {
              stageIndex: nextStageIndex,
              ticketId: nextStageTicketId,
              url: `/ticket/${nextStageTicketId}?questId=${questId}&stageIndex=${nextStageIndex}`,
            };
          } else {
            nextStage = {
              stageIndex: nextStageIndex,
              url: `/quest/${questId}`,
            };
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt._id?.toString?.() ?? attempt.id,
        passed: attempt.passed,
        score: attempt.score,
        testResults: attempt.testResults || [],
        evaluation: attempt.evaluation || null,
        createdAt: attempt.createdAt,
      },
      questProgress,
      nextStage,
    });
  } catch (error) {
    console.error("Failed to submit solution:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit solution",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
