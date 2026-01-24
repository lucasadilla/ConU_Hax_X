// MongoDB Quest model - Quest with 3-stage progression
import mongoose, { Schema, Document, Model } from 'mongoose';

export type QuestTheme = 'regression' | 'feature-creation' | 'debugging';
export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface IQuestStage {
  difficulty: QuestDifficulty;
  ticketId: mongoose.Types.ObjectId;
  order: number; // 1, 2, or 3
  unlocked: boolean;
}

export interface IQuest extends Document {
  _id: mongoose.Types.ObjectId;
  
  // Quest Info
  title: string;
  description: string;
  theme: QuestTheme;
  iconEmoji: string;
  
  // Map Progression (3 stages)
  stages: IQuestStage[];
  
  // Badge Reward
  badgeName: string;
  badgeDescription: string;
  badgePoints: number;
  badgeColor: string;
  
  // Metadata
  estimatedTime: number; // total minutes for all 3 stages
  tags: string[];
  
  // Statistics
  attemptCount: number;
  completionCount: number;
  averageCompletionTime: number;
  
  // Status
  isActive: boolean;
  
  // Tech Stack (always the same for this project)
  techStack: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserQuestProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  questId: mongoose.Types.ObjectId;
  
  // Progress tracking
  currentStage: number; // 0, 1, 2 (corresponds to stages array)
  completedStages: number[]; // Array of completed stage indices
  
  // Completion
  isCompleted: boolean;
  completedAt?: Date;
  totalTimeSpent: number; // in seconds
  
  // Badge
  badgeAwarded: boolean;
  badgeId?: mongoose.Types.ObjectId;
  
  // Scores for each stage
  stageScores: {
    stageIndex: number;
    score: number;
    attemptId: mongoose.Types.ObjectId;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const QuestStageSchema = new Schema({
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard'],
  },
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
  },
  order: {
    type: Number,
    required: true,
    min: 1,
    max: 3,
  },
  unlocked: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const QuestSchema = new Schema<IQuest>(
  {
    title: {
      type: String,
      required: [true, 'Quest title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Quest description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    theme: {
      type: String,
      required: true,
      enum: ['regression', 'feature-creation', 'debugging'],
    },
    iconEmoji: {
      type: String,
      default: '🎯',
    },
    
    // Map Progression
    stages: {
      type: [QuestStageSchema],
      validate: {
        validator: function(stages: IQuestStage[]) {
          return stages.length === 3;
        },
        message: 'Quest must have exactly 3 stages',
      },
    },
    
    // Badge Reward
    badgeName: {
      type: String,
      required: true,
    },
    badgeDescription: {
      type: String,
      required: true,
    },
    badgePoints: {
      type: Number,
      required: true,
      default: 300,
      min: 100,
    },
    badgeColor: {
      type: String,
      default: '#FFD700',
    },
    
    // Metadata
    estimatedTime: {
      type: Number,
      default: 90, // 90 minutes total
      min: 30,
    },
    tags: {
      type: [String],
      default: [],
    },
    
    // Statistics
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageCompletionTime: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    techStack: {
      type: [String],
      default: ['Next.js', 'TypeScript', 'Node.js', 'TailwindCSS', 'MongoDB'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
QuestSchema.index({ theme: 1, isActive: 1 });
QuestSchema.index({ createdAt: -1 });

// Methods
QuestSchema.methods.getCompletionRate = function(): number {
  if (this.attemptCount === 0) return 0;
  return (this.completionCount / this.attemptCount) * 100;
};

// User Quest Progress Schema
const UserQuestProgressSchema = new Schema<IUserQuestProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questId: {
      type: Schema.Types.ObjectId,
      ref: 'Quest',
      required: true,
      index: true,
    },
    
    currentStage: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
    completedStages: {
      type: [Number],
      default: [],
    },
    
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    badgeAwarded: {
      type: Boolean,
      default: false,
    },
    badgeId: {
      type: Schema.Types.ObjectId,
      ref: 'Badge',
    },
    
    stageScores: [{
      stageIndex: {
        type: Number,
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      attemptId: {
        type: Schema.Types.ObjectId,
        ref: 'Attempt',
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
UserQuestProgressSchema.index({ userId: 1, questId: 1 }, { unique: true });
UserQuestProgressSchema.index({ userId: 1, isCompleted: 1 });

// Methods
UserQuestProgressSchema.methods.completeStage = function(
  stageIndex: number,
  score: number,
  attemptId: mongoose.Types.ObjectId
) {
  if (!this.completedStages.includes(stageIndex)) {
    this.completedStages.push(stageIndex);
    this.stageScores.push({ stageIndex, score, attemptId });
    
    // Move to next stage if not at the end
    if (stageIndex < 2) {
      this.currentStage = stageIndex + 1;
    } else {
      // Quest completed!
      this.isCompleted = true;
      this.completedAt = new Date();
    }
  }
};

UserQuestProgressSchema.methods.getAverageScore = function(): number {
  if (this.stageScores.length === 0) return 0;
  const total = this.stageScores.reduce((sum, stage) => sum + stage.score, 0);
  return total / this.stageScores.length;
};

// Delete existing models if they exist
if (mongoose.models.Quest) {
  delete mongoose.models.Quest;
}
if (mongoose.models.UserQuestProgress) {
  delete mongoose.models.UserQuestProgress;
}

const Quest: Model<IQuest> = mongoose.model<IQuest>('Quest', QuestSchema);
const UserQuestProgress: Model<IUserQuestProgress> = mongoose.model<IUserQuestProgress>(
  'UserQuestProgress',
  UserQuestProgressSchema
);

export { Quest, UserQuestProgress };
export default Quest;
