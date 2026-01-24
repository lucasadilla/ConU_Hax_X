// MongoDB Ticket model - Coding challenges
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface IExample {
  input: string;
  output: string;
  explanation: string;
}

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  
  // Content
  examples: IExample[];
  constraints: string[];
  hints: string[];
  testCases: ITestCase[];
  
  // Metadata
  tags: string[];
  category: string;
  points: number;
  timeLimit: number; // in minutes
  
  // Statistics
  attemptCount: number;
  successCount: number;
  averageScore: number;
  
  // AI Generated
  generatedBy: 'ai' | 'manual';
  prompt?: string;
  
  // Status
  isActive: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
}, { _id: false });

const TestCaseSchema = new Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const TicketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    language: {
      type: String,
      required: true,
      default: 'javascript',
    },
    
    // Content
    examples: {
      type: [ExampleSchema],
      default: [],
    },
    constraints: {
      type: [String],
      default: [],
    },
    hints: {
      type: [String],
      default: [],
    },
    testCases: {
      type: [TestCaseSchema],
      default: [],
      validate: {
        validator: function(testCases: ITestCase[]) {
          return testCases.length >= 3;
        },
        message: 'At least 3 test cases are required',
      },
    },
    
    // Metadata
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      default: 'general',
    },
    points: {
      type: Number,
      required: true,
      min: [10, 'Points must be at least 10'],
      max: [1000, 'Points cannot exceed 1000'],
      default: 100,
    },
    timeLimit: {
      type: Number,
      default: 30,
      min: 5,
      max: 180,
    },
    
    // Statistics
    attemptCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    successCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    
    // AI Generated
    generatedBy: {
      type: String,
      enum: ['ai', 'manual'],
      default: 'ai',
    },
    prompt: {
      type: String,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
TicketSchema.index({ difficulty: 1, isActive: 1 });
TicketSchema.index({ tags: 1 });
TicketSchema.index({ category: 1 });
TicketSchema.index({ createdAt: -1 });
TicketSchema.index({ averageScore: -1 });

// Methods
TicketSchema.methods.recordAttempt = function(score: number, success: boolean) {
  this.attemptCount += 1;
  if (success) {
    this.successCount += 1;
  }
  
  // Update average score
  this.averageScore = 
    (this.averageScore * (this.attemptCount - 1) + score) / this.attemptCount;
};

TicketSchema.methods.getSuccessRate = function(): number {
  if (this.attemptCount === 0) return 0;
  return (this.successCount / this.attemptCount) * 100;
};

TicketSchema.methods.getVisibleTestCases = function(): ITestCase[] {
  return this.testCases.filter((tc: ITestCase) => !tc.isHidden);
};

// Delete existing model if it exists
if (mongoose.models.Ticket) {
  delete mongoose.models.Ticket;
}

const Ticket: Model<ITicket> = mongoose.model<ITicket>('Ticket', TicketSchema);

export default Ticket;
