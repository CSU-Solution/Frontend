export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            HR
          </div>
          <span className="font-semibold text-foreground">CSU HR Policy Feedback</span>
        </div>
        <span className="text-sm text-muted-foreground">Persona-based policy analysis</span>
      </div>
    </header>
  )
}
