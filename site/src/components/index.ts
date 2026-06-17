export {default as PresentationHero} from './PresentationHero';
export {default as SectionBanner} from './SectionBanner';
export {default as ChapterHeader} from './ChapterHeader';
export {default as FaqSection} from './FaqSection';
export {default as FaqItem} from './FaqItem';
export {default as FaqNav} from './FaqNav';
export {default as MetricGrid} from './MetricGrid';
export {default as StepCards} from './StepCards';
export {default as StatementBlock} from './StatementBlock';
export {default as CursorScreenshot} from './CursorScreenshot';
export {default as CoursePath} from './CoursePath';
export {default as InteractiveChecklist} from './InteractiveChecklist';
export {default as KnowledgeCheck} from './KnowledgeCheck';
export {default as LabPanel} from './LabPanel';
export {default as PromptBlock} from './PromptBlock';
export {default as InstructorNote} from './InstructorNote';
export {default as PageProgress} from './PageProgress';
export {default as ComparePrompts} from './ComparePrompts';
export {default as OperatingModeCards} from './OperatingModeCards';
export {default as ModuleRecap} from './ModuleRecap';
export {default as AutonomyJourneyDiagram} from './AutonomyJourneyDiagram';
export {default as LoopFeedbackDiagram} from './LoopFeedbackDiagram';
export {default as SdlcAutonomyMap} from './SdlcAutonomyMap';
export {default as SidebarProgress} from './SidebarProgress';
export {default as PresentationControls} from './PresentationControls';
export {default as CourseComplete} from './CourseComplete';
export {LearningProgressProvider} from './LearningProgressContext';
export {useLmsConfig} from './useLmsConfig';
export {parseLmsConfig} from './lmsConfig';
export {
  BACKGROUNDS,
  BACKGROUND_IDS,
  SECTION_BACKGROUND_MAP,
  backgroundUrl,
  backgroundForSection,
  backgroundForDocId,
  sectionSlugFromDocId,
} from './backgrounds';
export type {BackgroundId, TextTreatment, BackgroundMeta} from './backgrounds';
export type {PresentationHeroProps} from './PresentationHero';
export type {SectionBannerProps, AgendaItem} from './SectionBanner';
export type {ChapterHeaderProps} from './ChapterHeader';
export type {FaqSectionProps} from './FaqSection';
export type {FaqItemProps} from './FaqItem';
export type {FaqNavProps, FaqNavItem} from './FaqNav';
export type {MetricGridProps, Metric} from './MetricGrid';
export type {StepCardsProps, StepCard} from './StepCards';
export type {StatementBlockProps} from './StatementBlock';
export type {CursorScreenshotProps} from './CursorScreenshot';
export type {CoursePathProps, CourseModule, WorkshopLevel} from './CoursePath';
export type {InteractiveChecklistProps, ChecklistItem} from './InteractiveChecklist';
export type {KnowledgeCheckProps, QuizQuestion, QuizOption} from './KnowledgeCheck';
export type {LabPanelProps} from './LabPanel';
export type {PromptBlockProps} from './PromptBlock';
export type {InstructorNoteProps} from './InstructorNote';
export type {PageProgressProps} from './PageProgress';
export type {ComparePromptsProps, PromptExample} from './ComparePrompts';
export type {
  OperatingModeCardsProps,
  OperatingMode,
  OperatingModeId,
} from './OperatingModeCards';
export type {ModuleRecapProps, ModuleRecapNext} from './ModuleRecap';
export type {LmsConfig} from './lmsConfig';
export type {CourseCompleteProps} from './CourseComplete';
