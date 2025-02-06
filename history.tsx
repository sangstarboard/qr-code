interface HistoryProps {
  items: string[]
}

export default function History({ items }: HistoryProps) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">履歴</h3>
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-blue-500 hover:underline">
            <a href={item} target="_blank" rel="noopener noreferrer">
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

