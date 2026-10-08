// Componente UI — Divisor con texto (para separar "o continuar con Google")
// Ref: AcademiaSanPedro/00_Meta/02_UI_UX_Guidelines.md → Divider con texto

interface DividerWithTextProps {
  text?: string;
}

export default function DividerWithText({
  text = "o",
}: DividerWithTextProps) {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex-grow border-t border-neutral-100" />
      <span className="mx-4 shrink-0 text-sm text-neutral-700">{text}</span>
      <div className="flex-grow border-t border-neutral-100" />
    </div>
  );
}
