type Props = {
  title: string;
  description?: string;
};

export function PlaceholderPage({ title, description }: Props) {
  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-on-surface">{title}</h2>
      {description ? <p className="text-on-surface-variant">{description}</p> : null}
      <p className="text-sm text-on-surface-variant">
        Pantalla reservada — implementar según HU y checklist en <code className="text-xs">hus/SPECS-IMPLEMENTATION.md</code>.
      </p>
    </div>
  );
}
