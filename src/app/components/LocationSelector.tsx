"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useQuery } from "@blitzjs/rpc"
import { ErrorMessage, useField, useFormikContext } from "formik"
import { Check, ChevronsUpDown } from "lucide-react"
import { FC, useState } from "react"
import getLocations from "../locations/queries/getLocations"

const LocationSelector: FC<{ name: string; label: string }> = ({ name, label }) => {
  const [input] = useField(name)

  const [locationsResult] = useQuery(getLocations, {})

  const [open, setOpen] = useState(false)

  const activeLocationName = locationsResult?.locations.find(
    (location) => location.id === input.value
  )?.name

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {activeLocationName ?? "Select location..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search location..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {locationsResult?.locations.map((location) => (
                  <CommandItem
                    key={location.id}
                    value={location.name}
                    onSelect={() => {
                      const newValue = location.id === input.value ? -1 : location.id
                      input.onChange({ target: { name: name, value: newValue } })
                      setOpen(false)
                    }}
                    onBlur={() => input.onBlur({ target: { name } })}
                  >
                    {location.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        input.value === location.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <ErrorMessage name={name}>
        {(msg) => (
          <div role="alert" style={{ color: "red" }}>
            {msg}
          </div>
        )}
      </ErrorMessage>
    </>
  )
}

export default LocationSelector
