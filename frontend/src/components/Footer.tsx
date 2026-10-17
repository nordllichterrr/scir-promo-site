export default function Footer() {
  return (
    <footer className="bg-[#0F1225]/90 backdrop-blur-md text-gray-400 py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-jura text-white font-bold mb-3">SCIR</h4>
          <p className="text-sm">Ranking without History</p>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Разделы</h4>
          <ul className="text-sm space-y-2">
            <li><a href="#" className="hover:text-white transition">О проекте</a></li>
            <li><a href="/algorithm" className="hover:text-white transition">Алгоритм</a></li>
            <li><a href="/results" className="hover:text-white transition">Результаты</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Ресурсы</h4>
          <ul className="text-sm space-y-2">
            <li><a href="https://github.com/nikita-zmanovskiy/cold-start-algorithm" target="_blank" className="hover:text-white transition">Репозиторий</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-jura text-scir-emerald font-bold mb-3">Контакты</h4>
          <ul className="text-sm space-y-2">
            <li>lemdyasova68@gmail.com</li>
            <li>zmanovskiy.n.v@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/10 text-xs text-center">© 2026 SCIR. DOI: 10.5281/zenodo.18772321</div>
    </footer>
  );
}
