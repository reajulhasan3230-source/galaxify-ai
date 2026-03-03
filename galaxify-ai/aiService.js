import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
// Ensure VITE_GEMINI_API_KEY is set in your .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Helper to get the model safely, preventing top-level crashes if API key is missing
const getModel = () => {
  if (!API_KEY) {
    console.error("VITE_GEMINI_API_KEY is missing. Please add it to your .env file.");
    throw new Error("Gemini API Key is missing");
  }
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

/**
 * Extracts structured portfolio data from a PDF file (base64 encoded).
 * @param {string} pdfBase64 - The base64 string of the PDF file.
 * @returns {Promise<Object>} - The extracted data matching the database schema.
 */
export const extractPortfolioFromPdf = async (pdfBase64) => {
  try {
    // Remove data URI prefix if present (e.g., "data:application/pdf;base64,")
    const pdfData = pdfBase64.split(',')[1] || pdfBase64;

    const model = getModel();

    const prompt = `
      You are an expert data extraction assistant. 
      Analyze the attached PDF resume/portfolio and extract the following fields into a structured JSON object.
      
      Ensure the keys match this schema exactly to align with the database:
      {
        "fullName": "Name of the individual",
        "bio": "A professional bio or summary",
        "aboutMe": "Detailed 'About Me' section",
        "skills": "List of skills as a comma-separated string",
        "jobHistory": "Work experience and job history (formatted as Markdown string)",
        "projects": "Details of projects worked on (formatted as Markdown string)",
        "research": "Research work, publications, or papers",
        "achievements": "Awards, certifications, and achievements",
        "education": "Educational background (formatted as Markdown string)",
        "photoGallery": "Array of image URLs if explicitly mentioned (otherwise empty array)",
        "cvUpload": "URL to CV if explicitly mentioned in text (otherwise null)",
        "quickCommunications": {
          "facebook": "Facebook profile URL",
          "gmail": "Gmail address",
          "whatsapp": "WhatsApp number",
          "website": "Personal website or portfolio URL"
        }
      }

      If a field is not found, return an empty string "" or null for objects/arrays.
      Return ONLY the JSON object, no markdown formatting around it.
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: pdfData,
          mimeType: "application/pdf",
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up any potential markdown code blocks in the response
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error extracting portfolio from PDF:", error);
    throw error;
  }
};

/**
 * Parses raw text from a resume into structured JSON with a cinematic bio.
 * @param {string} text - The raw text extracted from a resume.
 * @returns {Promise<Object>} - The structured data matching the requested schema.
 */
export const parseResumeText = async (text) => {
  try {
    const model = getModel();

    const prompt = `Analyze the provided resume text and extract the data into a strict JSON object.
      
      Requirements:
      1. "bio" must be written in a "Cinematic" tone (epic, impressive, narrative).
      2. "skills" must be an array of strings.
      3. "experience" must be an array of objects.
      
      Output JSON Schema:
      {
        "name": "string",
        "bio": "string",
        "skills": ["string"],
        "experience": [{ "role": "string", "company": "string", "duration": "string", "description": "string" }],
        "education": "string"
      }
      
      Return ONLY the JSON object.
    `;

    // Pass text as a separate argument to avoid template literal syntax issues
    const result = await model.generateContent([prompt, text]);
    const response = await result.response;
    const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing resume text:", error);
    throw error;
  }
};

/**
 * Generates creative portfolio content from resume text using Gemini.
 * @param {string} resumeText - The raw text from the resume.
 * @returns {Promise<Object>} - The structured JSON content.
 */
export const generatePortfolioContent = async (resumeText) => {
  try {
    const model = getModel();

    const prompt = `Act as a professional portfolio copywriter. Return ONLY a JSON object with keys: full_name, tagline (5 words max), about_me (cinematic style), skills (categorized array), and experience_highlights. Do not include any markdown formatting or extra text in the response so I can parse it immediately with JSON.parse().`;

    const result = await model.generateContent([prompt, resumeText]);
    const response = await result.response;
    const text = response.text();
    
    // Clean up potential markdown just in case Gemini adds it despite instructions
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating portfolio content:", error);
    throw error;
  }
};

/**
 * Alias for extractPortfolioFromPdf to match requested function name.
 */
export const extractFromPDF = extractPortfolioFromPdf;

/**
 * Generates a specific bio from resume text.
 * @param {string} resumeText 
 * @returns {Promise<string>}
 */
export const generateBio = async (resumeText) => {
  try {
    const model = getModel();
    const prompt = `Write a professional and engaging bio (max 150 words) based on the following resume text. Tone: Cinematic and impressive. Return only the bio text.`;
    const result = await model.generateContent([prompt, resumeText]);
    return result.response.text();
  } catch (error) {
    console.error("Error generating bio:", error);
    throw error;
  }
};

/**
 * Generates a list of skills from resume text.
 * @param {string} resumeText 
 * @returns {Promise<string[]>}
 */
export const generateSkills = async (resumeText) => {
  try {
    const model = getModel();
    const prompt = `Extract the top 15 technical and soft skills from the resume text. Return ONLY a JSON array of strings.`;
    const result = await model.generateContent([prompt, resumeText]);
    const text = result.response.text();
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error generating skills:", error);
    throw error;
  }
};

/**
 * Formats arbitrary data into the portfolio JSON schema.
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export const formatPortfolioJSON = async (data) => {
  try {
    const model = getModel();
    const prompt = `
      Organize the following data into a structured JSON object for a portfolio website.
      Ensure the following keys exist: fullName, tagline, bio, skills, experience, projects, contact.
      Data: ${JSON.stringify(data)}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error formatting portfolio JSON:", error);
    throw error;
  }
};