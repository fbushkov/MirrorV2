import { GLOSSARY } from "@/content/glossary"
import { DEMO_REPORT } from "@/content/demo-report"
import { report } from "@/lib/schemas/report"
export const parsed = report.parse(DEMO_REPORT)
export const glossary = GLOSSARY
