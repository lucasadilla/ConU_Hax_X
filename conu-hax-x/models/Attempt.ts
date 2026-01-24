// MongoDB Attempt model - User solution attempts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestResult {
  testCaseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

export interface IEvaluation {
  score: number;
  passed: boolean;
  feedback: string;
  strengths: string[];
  improvements: string[];
  complexity?: {
    time: string;
    space: string;
  };
}

export interface IAttempt extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  ticketId: mongoose.Types.ObjectId;
  
  // Solution
  code: string;
  language: string;
  
  // Results
  testResults: ITestResult[];
  evaluation?: IEvaluation;
  
  // Metadata
  timeSpent: number; // in seconds
  submittedAt: Date;
  
  // Status
  status: 'pending' | 'running' | 'completed' | 'error';
  score: number;
  passed: boolean;
  
  // AI Feedback
  aiGeneratedFeedback: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema({
  testCaseIndex: {
    type: Number,
    required: true,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  actualOutput: {
    type: String,
    default: '',
  },
  error: {
    type: String,
  },
}, { _id: false });

const EvaluationSchema = new Schema({
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  passed: {
    type: Boolean,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  strengths: {
    type: [String],
    default: [],
  },
  improvements: {
    type: [String],
    default: [],
  },
  complexity: {
    time: String,
    space: String,
  },
}, { _id: false });

const AttemptSchema = new Schema<IAttempt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      required: true,
      index: true,
    },
    
    // Solution
    code: {
      type: String,
      required: [true, 'Code is required'],
      minlength: [10, 'Code must be at least 10 characters'],
    },
    language: {
      type: String,
      required: true,
      default: 'javascript',
    },
    
    // Results
    testResults: {
      type: [TestResultSchema],
      default: [],
    },
    evaluation: {
      type: EvaluationSchema,
    },
    
    // Metadata
    timeSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    
    // Status
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'error'],
      default: 'pending',
    },
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    
    // AI Feedback
    aiGeneratedFeedback: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AttemptSchema.index({ userId: 1, ticketId: 1 });
AttemptSchema.index({ userId: 1, createdAt: -1 });
AttemptSchema.index({ ticketId: 1, createdAt: -1 });
AttemptSchema.index({ passed: 1, score: -1 });

// Methods
AttemptSchema.methods.getPassedTestCount = function(): number {
  return this.testResults.filter((result: ITestResult) => result.passed).length;
};

AttemptSchema.methods.getTotalTestCount = function(): number {
  return this.testResults.length;
};

AttemptSchema.methods.calculateScore = function(): number {
  const total = this.getTotalTestCount();
  if (total === 0) return 0;
  
  const passed = this.getPassedTestCount();
  const baseScore = (passed / total) * 100;
  
  // Apply evaluation score if available
  if (this.evaluation?.score) {
    return Math.round((baseScore + this.evaluation.score) / 2);
  }
  
  return Math.round(baseScore);
};

// Delete existing model if it exists
if (mongoose.models.Attempt) {
  delete mongoose.models.Attempt;
}

const Attempt: Model<IAttempt> = mongoose.model<IAttempt>('Attempt', AttemptSchema);

export default Attempt;
