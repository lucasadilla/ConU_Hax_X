# Gemini AI Usage Examples

Complete guide on how to use the Gemini AI integration in your ConU Hacks X project.

## Table of Contents
1. [Basic Usage](#basic-usage)
2. [Ticket Generation](#ticket-generation)
3. [Solution Evaluation](#solution-evaluation)
4. [Code Review](#code-review)
5. [Streaming Responses](#streaming-responses)
6. [API Endpoints](#api-endpoints)

---

## Basic Usage

### Simple Text Generation

```typescript
import { generateContent } from '@/lib/gemini';

// Generate simple content
const response = await generateContent('Explain what a binary tree is in simple terms');
console.log(response);
```

### Context-Aware Generation

```typescript
import { generateWithContext } from '@/lib/gemini';

const systemPrompt = 'You are a helpful coding mentor. Be encouraging and educational.';
const userPrompt = 'How do I improve my code quality?';

const response = await generateWithContext(systemPrompt, userPrompt);
console.log(response);
```

---

## Ticket Generation

### Generate an Easy Challenge

```typescript
import { generateWithContext } from '@/lib/gemini';
import { GENERATE_TICKET_SYSTEM_PROMPT, generateTicketPrompt } from '@/prompts/generateTicket';

const prompt = generateTicketPrompt('easy', 'arrays', 'javascript');
const response = await generateWithContext(GENERATE_TICKET_SYSTEM_PROMPT, prompt);

const ticket = JSON.parse(response);
console.log(ticket.title);
console.log(ticket.description);
```

### Via API Endpoint

```typescript
// In your component
const generateChallenge = async () => {
  const response = await fetch('/api/tickets/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      difficulty: 'medium',
      topic: 'recursion',
      language: 'python'
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log(data.ticket);
  }
};
```

### Example Generated Ticket

```json
{
  "title": "Find Maximum in Array",
  "difficulty": "easy",
  "description": "Write a function that finds the maximum number in an array of integers.",
  "examples": [
    {
      "input": "[1, 5, 3, 9, 2]",
      "output": "9",
      "explanation": "9 is the largest number in the array"
    }
  ],
  "constraints": [
    "Array will have at least 1 element",
    "All elements are integers"
  ],
  "hints": [
    "Consider using a variable to track the maximum",
    "Compare each element with the current maximum"
  ],
  "testCases": [
    {
      "input": "[1, 5, 3, 9, 2]",
      "expectedOutput": "9",
      "isHidden": false
    }
  ],
  "tags": ["array", "iteration", "basics"],
  "timeLimit": "15 minutes",
  "language": "javascript"
}
```

---

## Solution Evaluation

### Evaluate a Solution

```typescript
import { evaluateSolution } from '@/lib/gemini';

const problem = 'Find the sum of all elements in an array';
const solution = `
function sum(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}
`;

const evaluation = await evaluateSolution(problem, solution, 'javascript');

console.log('Score:', evaluation.score);
console.log('Passed:', evaluation.passed);
console.log('Feedback:', evaluation.feedback);
console.log('Strengths:', evaluation.strengths);
console.log('Improvements:', evaluation.improvements);
```

### Via API Endpoint

```typescript
const evaluateCode = async () => {
  const response = await fetch('/api/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemDescription: 'Reverse a string without using built-in reverse',
      solution: `
        function reverseString(str) {
          let reversed = '';
          for (let i = str.length - 1; i >= 0; i--) {
            reversed += str[i];
          }
          return reversed;
        }
      `,
      language: 'javascript',
      testResults: {
        passed: 4,
        failed: 1,
        total: 5
      }
    })
  });
  
  const data = await response.json();
  if (data.success) {
    console.log('Evaluation:', data.evaluation);
  }
};
```

### Example Evaluation Response

```json
{
  "score": 85,
  "passed": true,
  "feedback": "Good solution with clear logic. The string reversal works correctly, but there are more efficient approaches.",
  "strengths": [
    "Clear and readable code",
    "Correct implementation",
    "Good variable naming"
  ],
  "improvements": [
    "Consider using Array methods like split/reverse/join for better performance",
    "String concatenation in a loop can be slow for large strings"
  ],
  "complexity": {
    "time": "O(n)",
    "space": "O(n)"
  },
  "testResults": {
    "passed": 4,
    "failed": 1,
    "total": 5
  },
  "suggestions": [
    "Try using: str.split('').reverse().join('')",
    "Consider edge cases like empty strings"
  ]
}
```

---

## Code Review

### Get Code Review Feedback

```typescript
import { generateWithContext } from '@/lib/gemini';
import { CODE_REVIEW_SYSTEM_PROMPT, codeReviewPrompt } from '@/prompts/codeReviewFeedback';

const code = `
function fetchUser(id) {
  return fetch('/api/users/' + id)
    .then(res => res.json())
}
`;

const prompt = codeReviewPrompt(code, 'javascript', 'API call function');
const review = await generateWithContext(CODE_REVIEW_SYSTEM_PROMPT, prompt);

console.log(review);
```

### Example Review Response

```json
{
  "summary": "Functional code that accomplishes the task, but could benefit from error handling and modern syntax.",
  "positives": [
    "Simple and straightforward implementation",
    "Uses fetch API correctly"
  ],
  "concerns": [
    {
      "severity": "high",
      "category": "error-handling",
      "issue": "No error handling for failed requests",
      "suggestion": "Add .catch() or try-catch block",
      "example": "return fetch(url).then(res => res.json()).catch(err => console.error(err))"
    },
    {
      "severity": "medium",
      "category": "best-practices",
      "issue": "String concatenation for URL",
      "suggestion": "Use template literals",
      "example": "fetch(`/api/users/${id}`)"
    }
  ],
  "recommendations": [
    "Add error handling for network failures",
    "Check response status before parsing JSON",
    "Consider using async/await syntax"
  ],
  "resources": [
    {
      "title": "Fetch API Error Handling",
      "description": "Learn how to properly handle fetch errors",
      "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API"
    }
  ],
  "overallRating": "needs-work"
}
```

---

## Streaming Responses

### Stream Long Responses

```typescript
import { generateStreamingContent } from '@/lib/gemini';

async function streamResponse() {
  const prompt = 'Explain how binary search works step by step';
  
  for await (const chunk of generateStreamingContent(prompt)) {
    // Display chunk in real-time
    console.log(chunk);
    // Or update UI
    updateTextDisplay(chunk);
  }
}
```

### In React Component

```typescript
'use client';

import { useState } from 'react';
import { generateStreamingContent } from '@/lib/gemini';

export default function StreamingDemo() {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const startStreaming = async () => {
    setIsStreaming(true);
    setText('');
    
    try {
      for await (const chunk of generateStreamingContent('Explain recursion')) {
        setText(prev => prev + chunk);
      }
    } catch (error) {
      console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <button onClick={startStreaming} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Start Stream'}
      </button>
      <pre>{text}</pre>
    </div>
  );
}
```

---

## API Endpoints

### Test Gemini Connection

```bash
# GET request
curl http://localhost:3000/api/test-gemini

# Response
{
  "success": true,
  "message": "Gemini API is configured correctly!",
  "response": "Hello from ConuHacksX! The Gemini API is working correctly. 👋",
  "projectInfo": {
    "name": "conuhacksx",
    "projectId": "projects/911472020955"
  }
}
```

### Generate Ticket

```bash
curl -X POST http://localhost:3000/api/tickets/generate \
  -H "Content-Type: application/json" \
  -d '{
    "difficulty": "easy",
    "topic": "arrays",
    "language": "javascript"
  }'
```

### Evaluate Solution

```bash
curl -X POST http://localhost:3000/api/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "problemDescription": "Find the maximum element in an array",
    "solution": "function findMax(arr) { return Math.max(...arr); }",
    "language": "javascript",
    "testResults": {
      "passed": 5,
      "failed": 0,
      "total": 5
    }
  }'
```

---

## Advanced Usage

### Custom Model Selection

```typescript
import { generateContent } from '@/lib/gemini';

// Use more capable model
const response = await generateContent(
  'Complex prompt here',
  'gemini-1.5-pro'
);
```

### Batch Processing

```typescript
async function evaluateMultipleSolutions(solutions) {
  const results = await Promise.all(
    solutions.map(sol => 
      evaluateSolution(sol.problem, sol.code, sol.language)
    )
  );
  return results;
}
```

### Error Handling

```typescript
import { generateContent } from '@/lib/gemini';

try {
  const response = await generateContent('Your prompt');
  console.log(response);
} catch (error) {
  if (error.message.includes('quota')) {
    console.error('API quota exceeded');
  } else if (error.message.includes('authentication')) {
    console.error('API key invalid');
  } else {
    console.error('Unknown error:', error);
  }
}
```

---

## Best Practices

### 1. Rate Limiting

```typescript
import { generateContent } from '@/lib/gemini';

// Simple rate limiter
class RateLimiter {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  
  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      if (!this.processing) {
        this.process();
      }
    });
  }
  
  private async process() {
    this.processing = true;
    
    while (this.queue.length > 0) {
      const fn = this.queue.shift()!;
      await fn();
      await new Promise(resolve => setTimeout(resolve, 4000)); // 4s delay
    }
    
    this.processing = false;
  }
}

const limiter = new RateLimiter();

// Use it
const result = await limiter.add(() => 
  generateContent('Your prompt')
);
```

### 2. Caching

```typescript
const cache = new Map<string, string>();

async function generateWithCache(prompt: string) {
  if (cache.has(prompt)) {
    return cache.get(prompt)!;
  }
  
  const response = await generateContent(prompt);
  cache.set(prompt, response);
  return response;
}
```

### 3. Timeout Handling

```typescript
async function generateWithTimeout(prompt: string, timeoutMs = 30000) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );
  
  return Promise.race([
    generateContent(prompt),
    timeoutPromise
  ]);
}
```

---

## Testing

Visit http://localhost:3000/test-gemini to test all features in your browser!

## Troubleshooting

**Issue:** "API key not configured"  
**Solution:** Check `.env` file and restart dev server

**Issue:** "Rate limit exceeded"  
**Solution:** Implement rate limiting and retry logic

**Issue:** "Failed to parse JSON"  
**Solution:** Check raw response, Gemini might return markdown

---

For more information, see the [Gemini API Documentation](https://ai.google.dev/docs).
