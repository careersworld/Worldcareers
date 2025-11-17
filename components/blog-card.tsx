import Link from 'next/link'
import { Card } from '@/components/ui/card'
import type { Blog } from '@/lib/types'
import Image from 'next/image'

interface BlogCardProps {
  blog: Blog
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {blog.image_url && (
        <div className="relative h-48 w-full">
          <Image
            src={blog.image_url || "/placeholder.svg"}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
          By {blog.author}
        </p>
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
        <Link
          href={`/blog/${blog.slug}`}
          className="inline-flex text-[#D4AF37] font-semibold text-sm hover:underline"
        >
          Read More →
        </Link>
      </div>
    </Card>
  )
}
