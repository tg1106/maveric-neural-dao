# AI-Powered Clinical Decision Support System

A comprehensive healthcare application built with Next.js, Supabase, and AI integration for clinical decision support.

## Features

- **Secure Authentication**: Doctor-only access with Supabase authentication
- **Patient Management**: Comprehensive patient records with demographics, symptoms, and medical history
- **AI Clinical Analysis**: Powered by Microsoft's BioGPT for treatment recommendations
- **Patient Summaries**: Generate and export detailed patient summaries as PDF or email
- **Dashboard Analytics**: Overview of patient statistics and recent activity

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom healthcare theme
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth
- **AI Integration**: Hugging Face Inference API (BioGPT-Large)
- **Deployment**: Vercel

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Supabase Configuration (automatically provided in v0)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration
HUGGINGFACE_API_KEY=your_huggingface_api_key
\`\`\`

## AI Integration Setup

1. **Get Hugging Face API Key**:
   - Sign up at [Hugging Face](https://huggingface.co/)
   - Go to Settings > Access Tokens
   - Create a new token with read permissions
   - Add it to your environment variables as `HUGGINGFACE_API_KEY`

2. **Model Used**: Microsoft BioGPT-Large
   - Specialized for biomedical text generation
   - Provides clinical analysis and treatment recommendations
   - Fallback to rule-based analysis if API key not configured

## Database Schema

The application uses the following main tables:

- `doctors`: Healthcare professional profiles
- `patients`: Patient demographics and clinical data
- `medications`: Patient medication records
- `ai_analyses`: AI-generated clinical analyses

All tables implement Row Level Security (RLS) for data protection.

## Key Features

### 1. Authentication System
- Email/password authentication for doctors
- Pre-registered accounts (no public signup)
- Session management with middleware protection

### 2. Patient Management
- Comprehensive patient forms with multiple sections
- Symptom and medical history tracking
- Vital signs recording
- Medication management

### 3. AI Clinical Analysis
- Integration with BioGPT for clinical insights
- Confidence scoring for AI recommendations
- Fallback analysis when AI service unavailable
- Treatment recommendation generation

### 4. Patient Summariser
- Comprehensive patient summary generation
- PDF export functionality
- Email delivery system
- Professional medical report formatting

## Security Features

- Row Level Security (RLS) on all database tables
- Doctor-patient data isolation
- Secure API endpoints with authentication
- Environment variable protection for sensitive keys

## Getting Started

1. **Clone and Install**:
   \`\`\`bash
   git clone <repository>
   cd ai-clinical-decision-support
   npm install
   \`\`\`

2. **Configure Environment**:
   - Set up Supabase project
   - Configure environment variables
   - Run database migrations

3. **Development**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Production Deployment**:
   - Deploy to Vercel
   - Configure production environment variables
   - Ensure Hugging Face API key is set for AI features

## Usage

1. **Login**: Access with pre-registered doctor credentials
2. **Add Patients**: Use the comprehensive patient form
3. **AI Analysis**: Generate AI-powered treatment recommendations
4. **Export Summaries**: Create PDF reports or send via email
5. **Dashboard**: Monitor patient statistics and activity

## AI Disclaimer

This application uses AI for clinical decision support. All AI-generated content should be reviewed and validated by qualified healthcare professionals before making treatment decisions. The AI analysis is for informational purposes only and does not replace professional medical judgment.
