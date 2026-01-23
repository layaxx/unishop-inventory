"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Route } from "next"
import { useRouter } from "next/navigation"

export type SearchItem = {
  id: number
  title: string
  url: Route
}

export default function SearchBox({ items }: { items: Array<SearchItem> }) {
  const router = useRouter()
  return (
    <Combobox<SearchItem>
      items={items.map(({ id, title, url }) => ({ label: title, id, url }))}
      itemToStringValue={(item: SearchItem) => item.title}
      onValueChange={(item) => {
        if (item) {
          router.push(item.url)
        }
      }}
    >
      <ComboboxInput placeholder="Search…" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(country) => (
            <ComboboxItem key={country.id} value={country}>
              {country.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
