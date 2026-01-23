"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react"
import { Route } from "next"
import { useRouter } from "next/navigation"
import React from "react"
import { useState } from "react"

export type SearchItem = {
  id: string | number
  title: string
  url: Route
}

export default function SearchBox({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false)

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const router = useRouter()

  // TODO: fix accessibility issues here

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
        >
          Search...
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            <CommandEmpty>No entry.</CommandEmpty>
            <CommandGroup>
              {items.map((item, index) => (
                <CommandItem
                  key={String(item.id)}
                  value={item.title}
                  onSelect={() => {
                    runCommand(() => router.push(item.url))
                  }}
                >
                  {index}. {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
