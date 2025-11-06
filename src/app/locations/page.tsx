import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LocationsList } from "./components/LocationsList";

export const metadata: Metadata = {
  title: "Locations",
  description: "List of locations",
};

export default function Page() {
  return (
    <div>
      <p>
        <Link href={"/locations/new"}>Create Location</Link>
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <LocationsList />
      </Suspense>
    </div>
  );
}
