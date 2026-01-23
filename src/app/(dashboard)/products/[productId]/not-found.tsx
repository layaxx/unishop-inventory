import Link from "next/link"

export default function NotFound() {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Product Not Found</h2>
      <p>The product you are looking for does not exist.</p>
      <Link href="/products">Back to Products</Link>
    </div>
  )
}
