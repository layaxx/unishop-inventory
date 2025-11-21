import Link from "next/link"
import { invoke } from "./blitz-server"
import { LogoutButton } from "./(auth)/components/LogoutButton"
import getCurrentUser from "./users/queries/getCurrentUser"

export default async function Home() {
  const currentUser = await invoke(getCurrentUser, null)
  return (
    <div className="m-4">
      <h1 className="font-bold text-5xl">UniShop Bamberg</h1>
      <h2 className="font-bold text-2xl">Inventory Management</h2>

      {currentUser ? (
        <>
          <p className="mt-4">Welcome, {currentUser.name ?? currentUser.email}!</p>
          <nav className="my-4">
            <ul>
              <li>
                <Link href="/stock-taking" className="underline">
                  Stock Taking
                </Link>
              </li>
              <li>
                <Link href="/products" className="underline">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/locations" className="underline">
                  Locations
                </Link>
              </li>
            </ul>
          </nav>
          <LogoutButton />
        </>
      ) : (
        <div className="mt-4">
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
