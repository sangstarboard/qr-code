import Link from 'next/link'
import { Button } from "@/components/ui/button";

interface HistoryProps {
  items: string[]
}

export default function History({ items }: HistoryProps) {
  console.log('Items:', items);
  return (
    <div className="mt-4">
    <Link href="/list-history">
      <Button
        className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-300"
      >
        履歴
      </Button>
    </Link>
    
    <ul className="space-y-1 mt-4">
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
