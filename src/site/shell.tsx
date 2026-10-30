import { SHELL } from "./index"

/** Шапка и подвал прототипа вокруг страницы на React (документы, 404). Скрипты меню и формы — из public/site. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page">
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: SHELL.header }} />
        {children}
        <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: SHELL.footer }} />
      </div>
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: SHELL.tail }} />
    </>
  )
}
