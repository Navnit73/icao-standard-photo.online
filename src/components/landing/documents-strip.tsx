const documents = [
  { name: "US Passport", size: "2×2 in" },
  { name: "UK Passport", size: "35×45 mm" },
  { name: "Schengen Visa", size: "35×45 mm" },
  { name: "Indian Passport", size: "35×45 mm" },
  { name: "Canada Passport", size: "50×70 mm" },
  { name: "Australia Passport", size: "35×45 mm" },
];

export function DocumentsStrip() {
  return (
    <section id="documents" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center text-sm font-medium text-gray-500">The right ICAO passport photo size for</p>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {documents.map((d) => (
            <li
              key={d.name}
              className="rounded-lg border border-border bg-white px-4 py-3 text-center transition-colors hover:border-lime-600/50"
            >
              <p className="text-sm font-medium text-black">{d.name}</p>
              <p className="mt-0.5 font-mono text-xs text-gray-500">{d.size}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
