import Link from "next/link"
import { invoke } from "../blitz-server"
import getCurrentUser from "../users/queries/getCurrentUser"
import { LogoutButton } from "../(auth)/components/LogoutButton"

export default async function HomePageNavigation() {
  const currentUser = await invoke(getCurrentUser, null)

  return (
    <>
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
              <li>
                <Link href="/movements" className="underline">
                  Movements
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
    </>
  )
}
