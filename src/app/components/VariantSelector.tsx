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
import getProductVariants from "../products/queries/getProductVariants"
import { ProductModifierValue } from "@prisma/client"

function getName(variant: any) {
  return `${variant.product.name} (${variant.modifierValues
    .map((mv: ProductModifierValue) => mv.value)
    .join(", ")})`
}

const VariantSelector: FC<{ name: string; label: string }> = ({ name }) => {
  const [input] = useField(name)
  const {} = useFormikContext()

  const [variantsResult] = useQuery(getProductVariants, {
    include: {
      modifierValues: { select: { value: true } },
      product: { select: { name: true } },
    },
    take: 250,
  })

  const [open, setOpen] = useState(false)

  const activeVariant = variantsResult?.productVariants.find(
    (variant) => variant.id === input.value
  )

  const activeVariantName = activeVariant ? getName(activeVariant) : null

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
            {activeVariantName ?? "Select product variant..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search variants..." className="h-9" />
            <CommandList>
              <CommandEmpty>No product variants found.</CommandEmpty>
              <CommandGroup>
                {variantsResult?.productVariants.map((variant) => (
                  <CommandItem
                    key={variant.id}
                    value={getName(variant)}
                    onSelect={() => {
                      const newValue = variant.id === input.value ? -1 : variant.id
                      input.onChange({ target: { name: name, value: newValue } })
                      setOpen(false)
                    }}
                    onBlur={() => input.onBlur({ target: { name } })}
                  >
                    {getName(variant)}
                    <Check
                      className={cn(
                        "ml-auto",
                        input.value === variant.id ? "opacity-100" : "opacity-0"
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

export default VariantSelector
