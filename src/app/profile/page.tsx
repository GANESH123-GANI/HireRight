"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StepIndicator from "@/components/StepIndicator";
import { useAuth } from "@/contexts/AuthContext";
import {
  Upload, FileText, CheckCircle, ChevronLeft, ArrowRight, Shield, Lock, Eye, Clock,
  Plus, Trash2, Briefcase, Code, Award, GraduationCap, Sparkles, ExternalLink, Tag, LogOut
} from "lucide-react";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import UserDropdown from "@/components/UserDropdown";
import AIChatbot from "@/components/AIChatbot";
import DatePicker from "@/components/DatePicker";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import type { ParsedWorkExperience, ParsedProject, ParsedEducation } from "@/types/resume";
import { parseRoleInsights } from "@/lib/role-insights";
import {
  normalizeJobType,
  normalizeWorkMode,
  normalizePreferredLocation,
  normalizeNoticePeriod,
} from "@/lib/preferences";

const steps = [
  { number: 1, label: "Profile", sublabel: "Tell us who you are" },
  { number: 2, label: "Resume", sublabel: "Your expertise" },
  { number: 3, label: "Skills & Projects", sublabel: "Your experience & tech stacks" },
  { number: 4, label: "AI Interview", sublabel: "Schedule assessment" },
  { number: 5, label: "All Set!", sublabel: "You're all set!" },
];

const roles = [
  "Software Engineer", "Full Stack Developer", "Frontend Engineer", "Backend Engineer",
  "Product Manager", "Data Scientist", "UX Designer", "DevOps Engineer", "Business Analyst"
];

const experiences = [
  "0-1 years", "1-3 years", "3-5 years", "5-8 years", "8-12 years", "12+ years"
];

/**
 * Preference values arrive from the AI in free-text form ("Full time",
 * "Bengaluru, India", "work from home"). They are normalised in
 * `@/lib/preferences` before they are written to the profile.
 */

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resumeParsed, setResumeParsed] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isRenderDomain, setIsRenderDomain] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsRenderDomain(window.location.hostname.includes("render"));
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/profile");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      setShowLogoutModal(true);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const [formData, setFormData] = useState({
    resume: null as File | null,
    resumeUrl: "",
    resumeFileName: "",
    aboutYou: "",
    whatDrivesYou: "",
    strengths: "",
    currentRole: "",
    totalExperience: "",
    currentLocation: "",
    noticePeriod: "",
    skills: "",
    currentCompany: "",
    education: "",
    linkedinUrl: "",
    workExperience: "" as string,
    projects: "" as string,
    keyAchievements: "" as string,
    certifications: "" as string,
    languages: "" as string,
    jobType: "",
    salaryRange: "",
    preferredLocation: "",
    workMode: "",
    preferredDate: "",
    preferredTimeSlot: "",
  });

  /**
   * Latest committed formData for async handlers. Auto-fill must run outside a
   * setState updater: React invokes updaters lazily during render, so filling
   * an external `filled` array inside one (and reading it back immediately)
   * would always see an empty array.
   */
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  });

  // Parsed structured lists for interactive form cards
  const [workExpList, setWorkExpList] = useState<ParsedWorkExperience[]>([]);
  const [projectsList, setProjectsList] = useState<ParsedProject[]>([]);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [certificationsList, setCertificationsList] = useState<string[]>([]);
  const [achievementsList, setAchievementsList] = useState<string[]>([]);
  const [educationDetailsList, setEducationDetailsList] = useState<{degree: string; institution: string; year: string; grade?: string; details?: string}[]>([]);
  const [suggestedRolesList, setSuggestedRolesList] = useState<string[]>([]);
  const [bestFitRole, setBestFitRole] = useState<string>("");
  const [candidateSummary, setCandidateSummary] = useState<string>("");
  const [topProjectsList, setTopProjectsList] = useState<string[]>([]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (validationError) setValidationError(null);
  };

  const generateAISummary = async () => {
    setGeneratingSummary(true);
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole: formData.currentRole,
          totalExperience: formData.totalExperience,
          currentLocation: formData.currentLocation,
          skills: formData.skills || skillsList.join(", "),
          workExperience: formData.workExperience,
          projects: formData.projects,
          education: formData.education,
          currentCompany: formData.currentCompany,
        }),
      });
      const data = await response.json();
      if (data.success && data.summary) {
        updateFormData({ aboutYou: data.summary });
        setAutoFilledFields((prev) =>
          prev.includes("About You") ? prev : [...prev, "AI Generated Summary"]
        );
      } else {
        setValidationError(data.error || "Failed to generate summary");
      }
    } catch {
      setValidationError("Failed to generate summary. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const progress = Math.round((currentStep / steps.length) * 100);

  // Sync state helpers
  const updateWorkExperienceList = (newList: ParsedWorkExperience[]) => {
    setWorkExpList(newList);
    updateFormData({ workExperience: JSON.stringify(newList) });
  };

  const updateProjectsList = (newList: ParsedProject[]) => {
    setProjectsList(newList);
    updateFormData({ projects: JSON.stringify(newList) });
  };

  const updateSkillsList = (newList: string[]) => {
    setSkillsList(newList);
    updateFormData({ skills: newList.join(", ") });
  };

  const updateCertificationsList = (newList: string[]) => {
    setCertificationsList(newList);
    updateFormData({ certifications: JSON.stringify(newList) });
  };

  const updateAchievementsList = (newList: string[]) => {
    setAchievementsList(newList);
    updateFormData({ keyAchievements: JSON.stringify(newList) });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Fetch profile data on mount
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/profile", { credentials: "include" });
        if (response.status === 401) {
          console.warn("Profile fetch unauthorized, preserving user session");
          return;
        }
        const data = await response.json();
        if (cancelled) return;
        if (data.success && data.profile) {
          const p = data.profile;
          setFormData((prev) => ({
            ...prev,
            resumeUrl: p.resumeUrl || "",
            resumeFileName: p.resumeFileName || "",
            aboutYou: p.aboutYou || "",
            whatDrivesYou: p.whatDrivesYou || "",
            strengths: p.strengths || "",
            currentRole: p.currentRole || "",
            totalExperience: p.totalExperience || "",
            currentLocation: p.currentLocation || "",
            noticePeriod: p.noticePeriod || "",
            skills: p.skills || "",
            currentCompany: p.currentCompany || "",
            education: p.education || "",
            linkedinUrl: p.linkedinUrl || "",
            workExperience: p.workExperience || "",
            projects: p.projects || "",
            keyAchievements: p.keyAchievements || "",
            certifications: p.certifications || "",
            languages: p.languages || "",
            jobType: p.jobType || "",
            salaryRange: p.salaryRange || "",
            preferredLocation: p.preferredLocation || "",
            workMode: p.workMode || "",
            preferredDate: p.preferredDate || "",
            preferredTimeSlot: p.preferredTimeSlot || "",
          }));

          // Parse JSON strings into interactive lists
          if (p.skills) {
            setSkillsList(p.skills.split(",").map((s: string) => s.trim()).filter(Boolean));
          }
          if (p.workExperience) {
            try { setWorkExpList(JSON.parse(p.workExperience)); } catch {}
          }
          if (p.projects) {
            try { setProjectsList(JSON.parse(p.projects)); } catch {}
          }
          if (p.certifications) {
            try { setCertificationsList(JSON.parse(p.certifications)); } catch {}
          }
          if (p.keyAchievements) {
            try { setAchievementsList(JSON.parse(p.keyAchievements)); } catch {}
          }
          if (p.educationDetails) {
            try { setEducationDetailsList(JSON.parse(p.educationDetails)); } catch {}
          }

          /* AI role match derived from the resume — persisted alongside suggestedRoles */
          const insights = parseRoleInsights(p.suggestedRoles);
          if (insights.roles.length > 0) setSuggestedRolesList(insights.roles);
          if (insights.bestFitRole) setBestFitRole(insights.bestFitRole);
          if (insights.topProjects.length > 0) setTopProjectsList(insights.topProjects);

          // Check if an explicit ?step= query parameter was requested in the URL, otherwise always start at stage 1
          const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          const queryStep = urlParams ? parseInt(urlParams.get("step") || "", 10) : NaN;
          if (!isNaN(queryStep) && queryStep >= 1 && queryStep <= steps.length) {
            setCurrentStep(queryStep);
          } else {
            setCurrentStep(1);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const saveProfile = async (stepUpdate?: number): Promise<boolean> => {
    setSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          resume: undefined,
          step: stepUpdate || currentStep,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        console.error("Failed to save profile:", data.error || "Unknown error");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Failed to save profile:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    setUploading(true);
    setParsingError(null);

    try {
      const formDataObj = new FormData();
      formDataObj.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        credentials: "include",
        body: formDataObj,
      });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        const errData = await response.json().catch(() => ({}));
        console.error("[upload] HTTP error:", response.status, errData);
        setParsingError(errData.error || `Upload failed (${response.status})`);
        return;
      }

      const data = await response.json();
      console.log("[upload] Response:", { success: data.success, parsingStatus: data.parsingStatus, hasParsed: !!data.parsedResume, error: data.parsingError });
      if (data.success) {
        setFormData((prev) => ({
          ...prev,
          resume: file,
          resumeUrl: data.file.url,
          resumeFileName: data.file.filename,
        }));

        // Auto-fill all profile fields from parsed resume
        if (data.parsedResume) {
          const parsed = data.parsedResume;
          const filled: string[] = [];

          // Computed synchronously (not inside a setState updater) so `filled`
          // is populated before it is read on the next line.
          const nextFormData = (() => {
            const updated = { ...formDataRef.current };
            
            const autoFill = (field: keyof typeof updated, value: string, label: string) => {
              if (value && (!updated[field] || String(updated[field]).trim() === "")) {
                (updated as Record<string, unknown>)[field] = value;
                filled.push(label);
              }
            };
            
            autoFill("currentRole", parsed.currentRole, "Current Role");
            autoFill("totalExperience", parsed.totalExperience, "Experience");
            autoFill("currentLocation", parsed.currentLocation, "Location");
            autoFill("currentCompany", parsed.currentCompany, "Company");
            autoFill("education", parsed.education, "Education");
            autoFill("aboutYou", parsed.summary, "About You");
            autoFill("strengths", parsed.strengths, "Strengths");
            autoFill("linkedinUrl", parsed.linkedinUrl, "LinkedIn");
            autoFill("noticePeriod", normalizeNoticePeriod(parsed.noticePeriod), "Notice Period");
            autoFill("whatDrivesYou", parsed.whatDrivesYou, "What Drives You");
            autoFill("jobType", normalizeJobType(parsed.jobType), "Job Type");
            autoFill("preferredLocation", normalizePreferredLocation(parsed.preferredLocation), "Preferred Location");
            autoFill("salaryRange", parsed.salaryRange, "Salary Range");
            autoFill("workMode", normalizeWorkMode(parsed.workMode), "Work Mode");
            
            if (parsed.skills?.length > 0) {
              const newSkills = parsed.skills.join(", ");
              if (!updated.skills || updated.skills.trim() === "") {
                updated.skills = newSkills;
                filled.push("Skills");
              } else {
                const existing = new Set(updated.skills.split(",").map((s: string) => s.trim().toLowerCase()));
                const toAdd = parsed.skills.filter((s: string) => !existing.has(s.toLowerCase()));
                if (toAdd.length > 0) {
                  updated.skills = updated.skills + ", " + toAdd.join(", ");
                  filled.push(`Skills (+${toAdd.length} new)`);
                }
              }
            }
            // Step 3 renders the chips from `skillsList`, not from formData —
            // keep them in sync or the Skills & Projects page looks empty.
            const mergedSkills = (updated.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
            if (mergedSkills.length > 0 && skillsList.length === 0) {
              setSkillsList(mergedSkills);
            }
            
            if (parsed.workExperience?.length > 0 && (!updated.workExperience || updated.workExperience === "")) {
              updated.workExperience = JSON.stringify(parsed.workExperience);
              setWorkExpList(parsed.workExperience);
              filled.push(`${parsed.workExperience.length} Work Experience Cards`);
            }
            if (parsed.projects?.length > 0 && (!updated.projects || updated.projects === "")) {
              updated.projects = JSON.stringify(parsed.projects);
              setProjectsList(parsed.projects);
              filled.push(`${parsed.projects.length} Project & Tech Stack Cards`);
            }
            if (parsed.keyAchievements?.length > 0 && (!updated.keyAchievements || updated.keyAchievements === "")) {
              updated.keyAchievements = JSON.stringify(parsed.keyAchievements);
              setAchievementsList(parsed.keyAchievements);
              filled.push("Highlights & Achievements");
            }
            if (parsed.certifications?.length > 0 && (!updated.certifications || updated.certifications === "")) {
              updated.certifications = JSON.stringify(parsed.certifications);
              setCertificationsList(parsed.certifications);
              filled.push(`${parsed.certifications.length} Certifications`);
            }
            if (parsed.languages?.length > 0 && (!updated.languages || updated.languages === "")) {
              updated.languages = parsed.languages.join(", ");
              filled.push("Languages");
            }
            if (parsed.educationDetails?.length > 0 && educationDetailsList.length === 0) {
              setEducationDetailsList(parsed.educationDetails);
              filled.push(`${parsed.educationDetails.length} Education Entries`);
            }
            if (parsed.suggestedRoles?.length > 0 && suggestedRolesList.length === 0) {
              setSuggestedRolesList(parsed.suggestedRoles);
              filled.push(`${parsed.suggestedRoles.length} Suggested Roles`);
            }
            if (parsed.bestFitRole) {
              setBestFitRole(parsed.bestFitRole);
              filled.push("Best Fit Role");
            }
            if (parsed.candidateSummary) {
              setCandidateSummary(parsed.candidateSummary);
              filled.push("Candidate Summary");
            }
            if (parsed.topProjects?.length > 0) {
              setTopProjectsList(parsed.topProjects);
              filled.push(`${parsed.topProjects.length} Top Projects`);
            }
            
            return {
              ...updated,
              resume: file,
              resumeUrl: data.file.url,
              resumeFileName: data.file.filename,
            };
          })();
          setFormData(nextFormData);

          if (filled.length > 0) {
            setResumeParsed(true);
            setAutoFilledFields(filled);
          } else if (data.parsingStatus === "success") {
            // Parsing succeeded but no new fields to fill (all already had data)
            setResumeParsed(true);
            setAutoFilledFields(["Resume uploaded - profile already up to date"]);
          }
        }

        // If inline parsing failed, try re-fetching profile from the API
        // (backend may have saved partial data before the error)
        if (!data.parsedResume && data.parsingStatus === "failed") {
          setParsingError(data.parsingError || "Resume parsing failed. Upload was successful but fields could not be auto-filled.");
          console.log("[upload] Parsing failed, attempting to re-fetch profile from API...");
          try {
            const profileResponse = await fetch("/api/profile", { credentials: "include" });
            const profileData = await profileResponse.json();
            if (profileData.success && profileData.profile) {
              const p = profileData.profile;
              const filled: string[] = [];
              const nextFormData = (() => {
                const updated = { ...formDataRef.current };
                const autoFill = (field: keyof typeof updated, value: string, label: string) => {
                  if (value && (!updated[field] || String(updated[field]).trim() === "")) {
                    (updated as Record<string, unknown>)[field] = value;
                    filled.push(label);
                  }
                };
                autoFill("currentRole", p.currentRole, "Current Role");
                autoFill("totalExperience", p.totalExperience, "Experience");
                autoFill("currentLocation", p.currentLocation, "Location");
                autoFill("currentCompany", p.currentCompany, "Company");
                autoFill("education", p.education, "Education");
                autoFill("aboutYou", p.aboutYou, "About You");
                autoFill("strengths", p.strengths, "Strengths");
                autoFill("linkedinUrl", p.linkedinUrl, "LinkedIn");
                autoFill("noticePeriod", normalizeNoticePeriod(p.noticePeriod), "Notice Period");
                autoFill("whatDrivesYou", p.whatDrivesYou, "What Drives You");
                autoFill("jobType", normalizeJobType(p.jobType), "Job Type");
                autoFill("preferredLocation", normalizePreferredLocation(p.preferredLocation), "Preferred Location");
                autoFill("salaryRange", p.salaryRange, "Salary Range");
                autoFill("workMode", normalizeWorkMode(p.workMode), "Work Mode");
                if (p.skills && (!updated.skills || updated.skills.trim() === "")) {
                  updated.skills = p.skills;
                  filled.push("Skills");
                }
                if (p.workExperience && (!updated.workExperience || updated.workExperience === "")) {
                  updated.workExperience = p.workExperience;
                  try { setWorkExpList(JSON.parse(p.workExperience)); } catch {}
                  filled.push("Work Experience");
                }
                if (p.projects && (!updated.projects || updated.projects === "")) {
                  updated.projects = p.projects;
                  try { setProjectsList(JSON.parse(p.projects)); } catch {}
                  filled.push("Projects");
                }
                if (p.certifications && (!updated.certifications || updated.certifications === "")) {
                  updated.certifications = p.certifications;
                  try { setCertificationsList(JSON.parse(p.certifications)); } catch {}
                  filled.push("Certifications");
                }
                if (p.keyAchievements && (!updated.keyAchievements || updated.keyAchievements === "")) {
                  updated.keyAchievements = p.keyAchievements;
                  try { setAchievementsList(JSON.parse(p.keyAchievements)); } catch {}
                  filled.push("Achievements");
                }
                if (p.educationDetails && educationDetailsList.length === 0) {                  try {
                    const details: ParsedEducation[] = JSON.parse(p.educationDetails);
                    if (details.length > 0) {
                      setEducationDetailsList(details);
                      filled.push(`${details.length} Education Entries`);
                    }
                  } catch {}
                }
                if (p.languages && (!updated.languages || updated.languages.trim() === "")) {
                  updated.languages = p.languages;
                  filled.push("Languages");
                }

                // Step 3 renders skill chips from `skillsList`, not formData
                const merged = (updated.skills || "").split(",").map((s) => s.trim()).filter(Boolean);
                if (merged.length > 0 && skillsList.length === 0) setSkillsList(merged);

                /* AI role match (best-fit role) persisted with suggestedRoles */
                const insights = parseRoleInsights(p.suggestedRoles);
                if (insights.roles.length > 0 && suggestedRolesList.length === 0) {
                  setSuggestedRolesList(insights.roles);
                  filled.push(`${insights.roles.length} Suggested Roles`);
                }
                if (insights.bestFitRole) {
                  setBestFitRole(insights.bestFitRole);
                  filled.push("Best Fit Role");
                }
                if (insights.candidateSummary) setCandidateSummary(insights.candidateSummary);
                if (insights.topProjects.length > 0) setTopProjectsList(insights.topProjects);

                return updated;
              })();
              setFormData(nextFormData);
              if (filled.length > 0) {
                setResumeParsed(true);
                setAutoFilledFields(filled);
                setParsingError(null); // Clear error since recovery succeeded
              }
            }
          } catch (fetchErr) {
            console.error("[upload] Failed to re-fetch profile:", fetchErr);
          }
        }
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setParsingError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const syntheticEvent = {
        target: { files: e.dataTransfer.files },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
  };

  const [removingResume, setRemovingResume] = useState(false);

  const handleRemoveResume = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setRemovingResume(true);
    try {
      setFormData((prev) => ({
        ...prev,
        resume: null,
        resumeUrl: "",
        resumeFileName: "",
      }));
      setResumeParsed(false);
      setAutoFilledFields([]);
      setParsingError(null);

      // Reset file input element so re-uploading the same file works
      const fileInput = document.getElementById("resume-upload") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeUrl: null,
          resumeFileName: null,
        }),
      });
    } catch (err) {
      console.error("Failed to remove resume:", err);
    } finally {
      setRemovingResume(false);
    }
  };

  const validateStep = (): string | null => {
    switch (currentStep) {
      case 1:
        if (!formData.aboutYou.trim()) return "Please tell us about yourself or upload a resume to auto-fill.";
        if (!formData.currentRole) return "Please enter your current role";
        return null;
      case 3:
        if (!formData.skills.trim() && skillsList.length === 0) return "Please enter your technical skills & tech stacks";
        return null;
      default:
        return null;
    }
  };

  const handleStepClick = async (targetStep: number) => {
    if (targetStep === currentStep) return;
    setValidationError(null);
    if (targetStep > currentStep) {
      const error = validateStep();
      if (error) {
        setValidationError(error);
        return;
      }
    }
    await saveProfile(targetStep);
    setCurrentStep(targetStep);
  };

  const handleNext = async () => {
    const error = validateStep();
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    if (currentStep === steps.length) {
      const saved = await saveProfile(currentStep);
      if (saved) {
        router.push("/interview");
      }
      return;
    }

    const nextStep = currentStep + 1;
    const saved = await saveProfile(nextStep);
    if (saved) {
      setCurrentStep(Math.min(steps.length, nextStep));
    }
  };

  const handlePrev = async () => {
    setValidationError(null);
    if (currentStep === 1) {
      await saveProfile(1);
      setShowLogoutModal(true);
      return;
    }
    const prevStep = Math.max(1, currentStep - 1);
    const saved = await saveProfile(prevStep);
    if (saved) {
      setCurrentStep(prevStep);
    }
  };

  const addSkillTag = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      const updated = [...skillsList, trimmed];
      updateSkillsList(updated);
      setNewSkill("");
    }
  };

  const removeSkillTag = (skillToRemove: string) => {
    const updated = skillsList.filter((s) => s !== skillToRemove);
    updateSkillsList(updated);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-[#D97757] border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  /** AI Role Match — tells the candidate which role their resume fits best. */
  const renderRoleMatchCard = () =>
    (bestFitRole || suggestedRolesList.length > 0) ? (
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">
          <Sparkles className="w-4 h-4 text-secondary animate-pulse" />
          AI Role Match — Best Fit For You
        </div>
        {bestFitRole && (
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white break-words">{bestFitRole}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Matched against the skills, experience, projects and education extracted from your resume.
        </p>
        {suggestedRolesList.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestedRolesList.slice(0, 5).map((role, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 ${
                  i === 0 && !bestFitRole
                    ? "bg-secondary text-primary-foreground"
                    : "bg-surface-hover text-muted-foreground"
                }`}
              >
                {i === 0 && <Sparkles className="w-3 h-3" />}
                {role}
              </span>
            ))}
          </div>
        )}
      </div>
    ) : null;

  const renderStep1 = () => (
    <div className="space-y-8">
      {/* Upload Resume Box */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            1. Upload Resume for Instant AI Auto-Fill
          </h3>
          <button className="text-xs font-semibold text-[#D97757] flex items-center gap-1.5 hover:text-[#B95F42] bg-[#FCE8DD] px-3 py-1 rounded-full border border-[#D97757]/20 uppercase tracking-wider">
            <Eye className="w-3.5 h-3.5" /> AI Resume Parsing Active
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-40 bg-white flex items-center justify-center flex-shrink-0 border border-[#EFE3DB] rounded-xl">
            <FileText className="w-16 h-16 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground mb-1.5">Upload your resume (PDF, DOCX, or Image)</h4>
            <p className="text-sm text-muted-foreground mb-3 text-xs sm:text-sm">
              All your skills, professional summary, work history, tech stacks, projects, and certifications will be auto-parsed into your profile without manual entry!
            </p>
            <div
              className="drop-zone border border-dashed border-[#EFE3DB] p-6 text-center cursor-pointer hover:border-[#D97757] transition-colors bg-white rounded-2xl"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-upload")?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center py-4">
                  <svg className="animate-spin h-8 w-8 text-[#D97757] mb-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-sm font-bold text-[#D97757]">AI Parsing your resume...</p>
                  <p className="text-xs text-muted-foreground mt-1">Extracting technical skills, projects, and work experience</p>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">Drag & drop your resume here</p>
                  <p className="text-xs text-muted-foreground my-1">or click to browse files</p>
                  <span className="inline-block rounded-xl bg-[#D97757] text-white px-5 py-2 text-sm font-semibold hover:bg-[#B95F42] shadow-sm transition-all mt-2">
                    Browse Resume File
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">Supports PDF, DOC, DOCX, PNG, JPG (Max 5MB)</p>
                </>
              )}
            </div>
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileUpload}
            />

            {formData.resumeFileName && (
              <div className="mt-3 flex items-center justify-between gap-3 text-secondary bg-white p-2.5 border border-[#EFE3DB] rounded-lg shadow-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 text-secondary" />
                  <span className="text-sm font-bold truncate text-secondary" title={formData.resumeFileName}>
                    {formData.resumeFileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  disabled={removingResume}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 px-2.5 py-1 rounded transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                  title="Remove uploaded resume"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{removingResume ? "Removing..." : "Remove"}</span>
                </button>
              </div>
            )}

            {parsingError && (
              <div className="mt-3 flex items-start gap-2 text-primary bg-white p-3 border border-[#EFE3DB] rounded-lg">
                <span className="text-sm ">{parsingError}</span>
              </div>
            )}

            {resumeParsed && autoFilledFields.length > 0 && (
              <div className="mt-4 p-5 bg-white text-foreground border border-[#EFE3DB] rounded-xl shadow-xs">
                <div className="flex items-center gap-2 font-bold text-base mb-1 tracking-wide text-[#382A25]">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  Resume Auto-Parsed & Fields Highlighted!
                </div>
                <p className="text-xs text-muted-foreground mb-3 font-medium">
                  The following sections were extracted from your resume and automatically populated into form boxes below:
                </p>
                <div className="flex flex-wrap gap-2">
                  {autoFilledFields.map((field) => (
                    <span key={field} className="inline-flex items-center gap-1.5 bg-white text-[#382A25] text-xs px-3 py-1 font-bold border border-[#EFE3DB] rounded-lg shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-[#15803D]" /> {field}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Role Match — tells the candidate which role they best fit */}
      {renderRoleMatchCard()}

      {/* Professional Summary Box */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            2. Professional Summary
          </h3>
          <div className="flex items-center gap-2">
            {formData.aboutYou && (
              <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D97757]" /> Auto-Filled
              </span>
            )}
            <button
              onClick={generateAISummary}
              disabled={generatingSummary}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-[#D97757] hover:bg-[#B95F42] text-white rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generatingSummary ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  AI Auto-Fill
                </>
              )}
            </button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3 text-xs sm:text-sm font-medium">
          {formData.aboutYou
            ? "Auto-extracted from your resume. Feel free to edit or refine it."
            : "Upload a resume or click AI Auto-Fill to generate a professional summary."}
        </p>
        <textarea
          className="w-full border border-[#EFE3DB] p-4 text-sm font-medium text-foreground resize-none focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] rounded-xl bg-white leading-relaxed placeholder-[#81736C]/60"
          rows={5}
          placeholder="Professional summary will be automatically filled when you upload your resume or click AI Auto-Fill..."
          value={formData.aboutYou}
          onChange={(e) => updateFormData({ aboutYou: e.target.value })}
        />
        <div className="flex justify-between items-center mt-2 text-xs font-semibold text-primary">
          <span>Editable box - Synced with AI interviewer</span>
          <span>{formData.aboutYou.length} characters</span>
        </div>
      </div>

      {/* What Drives You — extracted from the resume objective / summary */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            What Drives You
          </h3>
          {formData.whatDrivesYou && (
            <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#D97757]" /> Auto-Filled
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 text-xs sm:text-sm font-medium">
          {formData.whatDrivesYou
            ? "Pulled from your career objective / summary. Edit it to sound like you."
            : "Your motivation and career goals — filled automatically when you upload your resume."}
        </p>
        <textarea
          className="w-full border border-[#EFE3DB] p-4 text-sm font-medium text-foreground resize-none focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] rounded-xl bg-white leading-relaxed placeholder-[#81736C]/60"
          rows={3}
          placeholder="e.g. Building AI products that solve real business problems..."
          value={formData.whatDrivesYou}
          onChange={(e) => updateFormData({ whatDrivesYou: e.target.value })}
        />
      </div>

      {/* Current Role Snapshot */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">3. Role Snapshot & Overview</h3>
          {(formData.currentRole || formData.totalExperience || formData.currentLocation) && (
            <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#D97757]" /> Auto-Filled
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current / Target Role</label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#EFE3DB] p-3 text-sm font-medium text-foreground focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] bg-white"
              placeholder="e.g. Senior AI Engineer"
              value={formData.currentRole}
              onChange={(e) => updateFormData({ currentRole: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Total Experience</label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#EFE3DB] p-3 text-sm font-medium text-foreground focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] bg-white"
              placeholder="e.g. 10+ years"
              value={formData.totalExperience}
              onChange={(e) => updateFormData({ totalExperience: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current Location</label>
            <input
              type="text"
              className="w-full rounded-xl border border-[#EFE3DB] p-3 text-sm font-medium text-foreground focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] bg-white"
              placeholder="e.g. Bangalore, India"
              value={formData.currentLocation}
              onChange={(e) => updateFormData({ currentLocation: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* AI Role Match repeated here so the answer follows the candidate through the flow */}
      {renderRoleMatchCard()}

      {/* Technical Skills & Tech Stacks Box */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Technical Skills & Tech Stacks
          </h3>
          <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 px-3 py-1 font-bold rounded-full flex items-center gap-1 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-[#D97757]" /> {skillsList.length} Skills Extracted
          </span>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-4">
          All programming languages, frameworks, databases, and tools parsed from your resume.
        </p>

        {/* Skill Tag Chips */}
        <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white border border-[#EFE3DB] rounded-xl min-h-[70px] items-center">
          {skillsList.length === 0 ? (
            <p className="text-sm text-muted-foreground font-medium italic">No skills extracted yet. Upload a resume or add skills below.</p>
          ) : (
            skillsList.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 bg-[#D97757] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-2xs hover:bg-[#B95F42] transition-all group"
              >
                <Tag className="w-3.5 h-3.5 text-white/90" />
                {skill}
                <button
                  onClick={() => removeSkillTag(skill)}
                  className="hover:text-white/70 transition-colors ml-1 font-bold text-sm"
                  title="Remove skill"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>

        {/* Add Skill Input */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 rounded-xl border border-[#EFE3DB] p-3 text-sm font-medium text-foreground focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757] bg-white"
            placeholder="Add another skill or tech stack (e.g. Docker, Next.js, PyTorch)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkillTag();
              }
            }}
          />
          <button
            onClick={addSkillTag}
            type="button"
            className="rounded-xl bg-[#D97757] text-white px-5 py-3 text-sm font-semibold hover:bg-[#B95F42] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>
      </div>

      {/* Work Experience Cards */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Work Experience History
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Auto-extracted job titles, companies, durations, and responsibilities.</p>
          </div>
          <button
            onClick={() => {
              const updated = [
                ...workExpList,
                { company: "New Company", role: "Job Title", startDate: "2022", endDate: "Present", description: "Key achievements and duties..." },
              ];
              updateWorkExperienceList(updated);
            }}
            type="button"
            className="rounded-xl text-xs font-semibold bg-[#D97757] text-white hover:bg-[#B95F42] px-3.5 py-2 flex items-center gap-1 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Experience
          </button>
        </div>

        {workExpList.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#EFE3DB] bg-white rounded-xl">
            <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No work experience entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload your resume to automatically fill this section.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {workExpList.map((exp, idx) => (
              <div key={idx} className="border border-border rounded-xl p-5 bg-background hover:border-[#D97757] transition-all space-y-4 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#D97757]" /> Experience #{idx + 1} - Auto-Filled
                  </span>
                  <button
                    onClick={() => {
                      const updated = workExpList.filter((_, i) => i !== idx);
                      updateWorkExperienceList(updated);
                    }}
                    className="text-muted-foreground hover:text-red-500 bg-surface p-1.5 border border-border rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Company</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border p-3 text-sm font-medium text-foreground bg-background focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757]"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...workExpList];
                        updated[idx].company = e.target.value;
                        updateWorkExperienceList(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Role / Job Title</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border p-3 text-sm font-medium text-foreground bg-background focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757]"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...workExpList];
                        updated[idx].role = e.target.value;
                        updateWorkExperienceList(updated);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Start Date</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border p-2.5 text-xs font-medium text-foreground bg-background"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...workExpList];
                        updated[idx].startDate = e.target.value;
                        updateWorkExperienceList(updated);
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">End Date</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-border p-2.5 text-xs font-medium text-foreground bg-background"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...workExpList];
                        updated[idx].endDate = e.target.value;
                        updateWorkExperienceList(updated);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Responsibilities & Achievements</label>
                  <textarea
                    className="w-full border border-border rounded-xl p-3 text-xs font-medium text-foreground bg-background leading-relaxed resize-none focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757]"
                    rows={3}
                    value={exp.description}
                    onChange={(e) => {
                      const updated = [...workExpList];
                      updated[idx].description = e.target.value;
                      updateWorkExperienceList(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects & Tech Stacks Cards */}
      <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 transition-all rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Projects & Tech Stacks
            </h3>
            <p className="text-sm text-muted-foreground font-medium mt-1">Key projects and technologies extracted from your resume.</p>
          </div>
          <button
            onClick={() => {
              const updated = [
                ...projectsList,
                { name: "New Project", description: "Brief description of the project...", summary: "Detailed overview of the project...", technologies: ["React", "TypeScript"] },
              ];
              updateProjectsList(updated);
            }}
            type="button"
            className="rounded-xl text-xs font-semibold bg-[#D97757] text-white hover:bg-[#B95F42] px-3.5 py-2 flex items-center gap-1 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        {projectsList.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-[#EFE3DB] bg-white rounded-xl">
            <Code className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No project entries yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload your resume to automatically fill this section.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {projectsList.map((proj, idx) => (
              <div key={idx} className="border border-[#EFE3DB] rounded-xl p-5 bg-white hover:border-[#D97757] transition-all space-y-4 shadow-2xs">
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[#D97757]" /> Project #{idx + 1} - Auto-Filled
                  </span>
                  <button
                    onClick={() => {
                      const updated = projectsList.filter((_, i) => i !== idx);
                      updateProjectsList(updated);
                    }}
                    className="text-muted-foreground hover:text-red-500 bg-white p-1.5 border border-[#EFE3DB] rounded-lg transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Project Title</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-[#EFE3DB] p-3 text-sm font-medium text-foreground bg-white focus:ring-1 focus:ring-[#D97757] focus:border-[#D97757]"
                    value={proj.name}
                    onChange={(e) => {
                      const updated = [...projectsList];
                      updated[idx].name = e.target.value;
                      updateProjectsList(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                  <textarea
                    className="w-full border border-[#EFE3DB] p-3 text-xs font-semibold text-foreground bg-white leading-relaxed resize-none"
                    rows={2}
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...projectsList];
                      updated[idx].description = e.target.value;
                      updateProjectsList(updated);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Project Overview</label>
                  <textarea
                    className="w-full border border-[#EFE3DB] p-3 text-xs text-muted-foreground bg-white leading-relaxed resize-none"
                    rows={4}
                    placeholder="Detailed overview of what the project does, its architecture, key features, and impact..."
                    value={proj.summary || ""}
                    onChange={(e) => {
                      const updated = [...projectsList];
                      updated[idx].summary = e.target.value;
                      updateProjectsList(updated);
                    }}
                  />
                </div>

                {/* Tech Stack Tags for Project */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Tech Stack Used</label>
                  <input
                    type="text"
                    className="w-full border border-[#EFE3DB] p-3 text-xs font-bold text-secondary bg-white"
                    placeholder="Comma-separated tech stack (e.g. Next.js, Tailwind, PostgreSQL)"
                    value={proj.technologies ? proj.technologies.join(", ") : ""}
                    onChange={(e) => {
                      const updated = [...projectsList];
                      updated[idx].technologies = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                      updateProjectsList(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Education & Certifications Box */}
      <div className="bg-white rounded-2xl border border-[#EFE3DB] p-6 sm:p-7 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Education & Qualification
            </h3>
            {formData.education && (
              <span className="text-xs bg-[#FCE8DD] text-[#D97757] border border-[#D97757]/20 font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#D97757]" /> Auto-Filled
              </span>
            )}
          </div>
          <input
            type="text"
            className="w-full rounded-xl border border-border p-3.5 text-sm font-medium text-foreground focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757] bg-background"
            placeholder="e.g. B.Tech in Computer Science, IIT Delhi, 2020"
            value={formData.education}
            onChange={(e) => updateFormData({ education: e.target.value })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              Certifications & Credentials
            </h4>
            <button
              onClick={() => {
                const updated = [...certificationsList, "AWS Certified Solutions Architect"];
                updateCertificationsList(updated);
              }}
              type="button"
              className="rounded-xl text-xs font-semibold bg-[#D97757] text-white hover:bg-[#B95F42] px-3 py-1.5 flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          <div className="space-y-2.5">
            {certificationsList.length === 0 ? (
              <p className="text-xs text-muted-foreground font-medium italic">No certifications extracted yet.</p>
            ) : (
              certificationsList.map((cert, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 rounded-xl border border-border p-3 text-xs font-medium text-foreground bg-background focus:ring-2 focus:ring-[#D97757]/20 focus:border-[#D97757]"
                    value={cert}
                    onChange={(e) => {
                      const updated = [...certificationsList];
                      updated[idx] = e.target.value;
                      updateCertificationsList(updated);
                    }}
                  />
                  <button
                    onClick={() => {
                      const updated = certificationsList.filter((_, i) => i !== idx);
                      updateCertificationsList(updated);
                    }}
                    className="text-muted-foreground hover:text-red-500 bg-surface p-2.5 border border-border rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Education Details Timeline */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Complete Education History
            </h4>
            <button
              onClick={() => {
                const updated = [...educationDetailsList, { degree: "", institution: "", year: "", grade: "", details: "" }];
                setEducationDetailsList(updated);
              }}
              type="button"
              className="rounded-xl text-xs font-semibold bg-[#D97757] text-white hover:bg-[#B95F42] px-3 py-1.5 flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education
            </button>
          </div>

          <div className="space-y-3">
            {educationDetailsList.length === 0 ? (
              <p className="text-xs text-muted-foreground font-medium italic">No education details extracted yet. Upload your resume to auto-fill.</p>
            ) : (
              educationDetailsList.map((edu, idx) => (
                <div key={idx} className="border border-border rounded-xl p-4 bg-background space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#D97757]">Education #{idx + 1}</span>
                    <button
                      onClick={() => {
                        const updated = educationDetailsList.filter((_, i) => i !== idx);
                        setEducationDetailsList(updated);
                      }}
                      className="text-muted-foreground hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      className="border border-border p-2 text-xs text-foreground bg-background rounded-lg focus:ring-1 focus:ring-[#D97757]"
                      placeholder="Degree (e.g. B.Tech in CSE)"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...educationDetailsList];
                        updated[idx].degree = e.target.value;
                        setEducationDetailsList(updated);
                      }}
                    />
                    <input
                      type="text"
                      className="border border-border p-2 text-xs text-foreground bg-background rounded-lg focus:ring-1 focus:ring-[#D97757]"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...educationDetailsList];
                        updated[idx].institution = e.target.value;
                        setEducationDetailsList(updated);
                      }}
                    />
                    <input
                      type="text"
                      className="border border-border p-2 text-xs text-foreground bg-background rounded-lg focus:ring-1 focus:ring-[#D97757]"
                      placeholder="Year (e.g. 2020)"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...educationDetailsList];
                        updated[idx].year = e.target.value;
                        setEducationDetailsList(updated);
                      }}
                    />
                    <input
                      type="text"
                      className="border border-border p-2 text-xs text-foreground bg-background rounded-lg focus:ring-1 focus:ring-[#D97757]"
                      placeholder="Grade/GPA (optional)"
                      value={edu.grade || ""}
                      onChange={(e) => {
                        const updated = [...educationDetailsList];
                        updated[idx].grade = e.target.value;
                        setEducationDetailsList(updated);
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full border border-border p-2 text-xs text-muted-foreground bg-background rounded-lg focus:ring-1 focus:ring-[#D97757]"
                    placeholder="Additional details (specialization, honors, coursework)"
                    value={edu.details || ""}
                    onChange={(e) => {
                      const updated = [...educationDetailsList];
                      updated[idx].details = e.target.value;
                      setEducationDetailsList(updated);
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggested Roles */}
        {suggestedRolesList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-secondary" />
                AI-Suggested Best Fit Roles
              </h4>
              <span className="text-xs bg-[#FCE8DD] text-[#D97757] font-bold px-2 py-1 rounded-full flex items-center gap-1 border border-[#D97757]/20">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </div>
            <div className="space-y-2">
              {suggestedRolesList.map((role, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                  <span className="text-xs font-bold text-[#D97757] w-6">#{idx + 1}</span>
                  <span className="text-sm text-foreground font-medium">{role}</span>
                  {idx === 0 && <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full ml-auto font-semibold">Best Fit</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
      <h3 className="text-lg font-bold text-foreground mb-4 uppercase tracking-wider">AI Interview Preparation</h3>
      <p className="text-sm text-muted-foreground mb-6">Get ready for your 15-minute AI-powered interview.</p>
      <div className="space-y-4">
        <div className="bg-white border border-[#EFE3DB] rounded-xl p-4">
          <h4 className="font-semibold text-primary mb-2">What to expect:</h4>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#15803D]" /> Technical questions based on your resume & tech stacks</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#15803D]" /> Behavioral assessment</li>
            <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-[#15803D]" /> Live coding challenge in WebRTC room</li>
          </ul>
        </div>
        <div>
          <label htmlFor="preferredDate" className="block text-xs font-medium text-muted-foreground mb-1">Preferred Interview Date</label>
          <DatePicker
            id="preferredDate"
            value={formData.preferredDate}
            onChange={(value) => updateFormData({ preferredDate: value })}
          />
        </div>
        <div>
          <label htmlFor="preferredTimeSlot" className="block text-xs font-medium text-muted-foreground mb-1">Preferred Time Slot</label>
          <TimeSlotPicker
            id="preferredTimeSlot"
            value={formData.preferredTimeSlot}
            onChange={(value) => updateFormData({ preferredTimeSlot: value })}
          />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs text-center py-12">
      <div className="w-20 h-20 bg-[#FCE8DD]/40 border border-[#D97757]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-10 h-10 text-[#15803D]" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">All Set! You&apos;re Good to Go!</h3>
      <p className="text-muted-foreground mb-6">We&apos;re looking forward to your interview. Get ready to showcase your best self.</p>
      <div className="bg-white border border-[#EFE3DB] rounded-xl p-4 max-w-md mx-auto">
        <p className="text-sm font-semibold text-[#15803D]">Your profile is complete and your AI interview is scheduled. You&apos;ll receive a confirmation email shortly.</p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2:
        return (
          <div className="space-y-6">
            {/* Success Card */}
            <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-[#FCE8DD]/40 border border-[#D97757]/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-[#15803D]" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Great! Your resume is uploaded and parsed!</h3>
                <p className="text-muted-foreground">All your tech stacks, projects, skills, and work experience have been auto-filled.</p>
              </div>
            </div>

            {/* Best Fit Role */}
            {bestFitRole && (
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Best Fit Role
                </h3>
                <p className="text-[#D97757] font-bold text-xl">{bestFitRole}</p>
                <p className="text-sm text-muted-foreground mt-2">Based on your skills, experience, and project portfolio</p>
              </div>
            )}

            {/* Candidate Summary */}
            {candidateSummary && (
              <div className="bg-white border border-[#EFE3DB] rounded-2xl p-6 shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-primary" />
                  AI Candidate Summary
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{candidateSummary}</p>
              </div>
            )}

            {/* Suggested Roles */}
            {suggestedRolesList.length > 0 && (
              <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Suggested Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {suggestedRolesList.map((role, i) => (
                    <span key={i} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-[#EFE3DB] ${i === 0 ? "bg-white text-primary" : "bg-white text-muted-foreground"}`}>
                      {i === 0 && <Sparkles className="w-3 h-3" />}
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Top 3 Projects */}
            {topProjectsList.length > 0 && (
              <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-secondary" />
                  Top 3 Trending Projects
                </h3>
                <div className="space-y-3">
                  {topProjectsList.map((projName, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-[#EFE3DB] rounded-xl">
                      <span className="text-xs bg-[#FCE8DD] text-[#D97757] font-bold px-2 py-1 rounded-md">#{i + 1}</span>
                      <span className="text-sm font-medium text-foreground">{projName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Education */}
            {educationDetailsList.length > 0 && (
              <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h3>
                <div className="space-y-3">
                  {educationDetailsList.map((edu, i) => (
                    <div key={i} className="p-3 bg-white border border-[#EFE3DB] rounded-xl">
                      <p className="text-sm font-semibold text-foreground">{edu.degree}</p>
                      <p className="text-xs text-muted-foreground">{edu.institution} {edu.year && `- ${edu.year}`}</p>
                      {edu.grade && <p className="text-xs text-primary">Grade: {edu.grade}</p>}
                      {edu.details && <p className="text-xs text-muted-foreground mt-1">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certificationsList.length > 0 && (
              <div className="bg-white border border-[#EFE3DB] p-6 sm:p-7 rounded-2xl shadow-xs">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-secondary" />
                  Certifications
                </h3>
                <div className="space-y-2">
                  {certificationsList.map((cert, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className={`h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-white ${plusJakarta.className}`}>
      <Sidebar currentStep={currentStep} progress={progress} />
      <main className="flex-1 bg-white min-w-0 h-screen flex flex-col overflow-hidden">
        {/* Fixed Header: Top Bar + StepIndicator - permanently fixed at top, never moves when scrolling up or down */}
        <div className="shrink-0 bg-white z-20">
          <div className="h-14 px-4 sm:px-6 lg:px-8 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#81736C]">
              <Shield className="w-4 h-4 text-[#D97757]" />
              Your data is safe with us
            </div>
            <div className="flex items-center gap-3">
              <UserDropdown onLogoutClick={() => setShowLogoutModal(true)} />
            </div>
          </div>
          <StepIndicator steps={steps} currentStep={currentStep} onStepClick={handleStepClick} />
        </div>
        {/* Scrollable Main Content: Only this container scrolls, header stays permanently fixed at top */}
        <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 lg:px-8 pb-8 pt-2">
          {isRenderDomain && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Let&apos;s Build Your Profile</h2>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">Upload your resume to auto-fill all skills, projects, and work experience!</p>
            </div>
          )}

          {renderCurrentStep()}

          {validationError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 font-semibold text-[#B91C1C] text-sm mt-4 rounded-xl">
              {validationError}
            </div>
          )}

          <div className="flex justify-between items-center mt-8 gap-3">
            <button
              onClick={handlePrev}
              className="rounded-xl flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-[#EFE3DB] text-xs sm:text-sm font-semibold hover:bg-[#FCE8DD]/30 transition-colors bg-white text-[#382A25] cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{currentStep === 1 ? "Save & Exit" : "Previous"}</span>
            </button>
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs sm:text-sm text-muted-foreground">Saving...</span>}
              <button
                onClick={handleNext}
                disabled={saving}
                className="rounded-xl flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#D97757] text-white text-xs sm:text-sm font-semibold hover:bg-[#B95F42] transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
              >
                {saving ? "Saving..." : currentStep === steps.length ? "Complete" : "Save & Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <AIChatbot user={{ id: user?.id ?? null, name: user?.name ?? null, email: user?.email ?? null, role: user?.role ?? null }} />
        <LogoutConfirmModal
          isOpen={showLogoutModal}
          onClose={() => setShowLogoutModal(false)}
          onConfirm={async () => {
            setShowLogoutModal(false);
            await saveProfile(currentStep);
            logout();
          }}
        />
      </main>
    </div>
  );
}
