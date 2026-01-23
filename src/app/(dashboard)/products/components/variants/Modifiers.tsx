"use client"

import { invalidateQuery, useMutation, useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import AddModifier from "./AddModifier"
import AddModifierValue from "./AddModifierValue"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import deleteProductModifierValueMutation from "../../mutations/deleteProductModifierValue"
import deleteProductModifierTypeMutation from "../../mutations/deleteProductModifierType"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MenuIcon, TrashIcon } from "lucide-react"
import getProductVariants from "../../queries/getProductVariants"
import getProductVariantsWithStocksAndValues from "../../queries/getProductVariantsWithStocksAndValues"

type Props = {
  productId: number
  initialData?: Awaited<ReturnType<typeof getProductModifierTypes>>
}

const Modifiers: FC<Props> = ({ productId, initialData }) => {
  const [types] = useQuery(getProductModifierTypes, { productId }, { initialData })

  const [deleteProductModifierValue] = useMutation(deleteProductModifierValueMutation, {
    throwOnError: false,
  })
  const [deleteProductModifierType] = useMutation(deleteProductModifierTypeMutation, {
    throwOnError: false,
  })

  const handleOnTypeDelete = async (id: number) => {
    try {
      if (!confirm("Are you sure you want to delete this modifier type?")) {
        return
      }

      await deleteProductModifierType({ id })
      invalidateQuery(getProductModifierTypes)
      invalidateQuery(getProductVariants)
      invalidateQuery(getProductVariantsWithStocksAndValues)
    } catch (error) {
      console.error("Failed to delete modifier type:", error)
    }
  }

  const handleOnDelete = async (id: number) => {
    try {
      if (!confirm("Are you sure you want to delete this modifier value?")) {
        return
      }

      await deleteProductModifierValue({ id })
      invalidateQuery(getProductModifierTypes)
      invalidateQuery(getProductVariants)
      invalidateQuery(getProductVariantsWithStocksAndValues)
    } catch (error) {
      console.error("Failed to delete modifier value:", error)
    }
  }

  return (
    <>
      <div className="flex">
        <h2 className="font-bold text-4xl">Modifiers</h2>
        <AddModifier productId={productId} />
      </div>

      <div className="flex flex-wrap space-x-4">
        {types?.map((type) => (
          <Card className="grow" key={type.id}>
            <CardHeader>
              <CardTitle className="text-2xl">{type.name}</CardTitle>
              <CardAction>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <MenuIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start">
                    <PopoverHeader>
                      <PopoverTitle>Actions</PopoverTitle>
                    </PopoverHeader>
                    <div className="flex flex-col gap-2 items-start">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleOnTypeDelete(type.id)}
                        disabled={type.values.length > 0}
                      >
                        Remove this modifier type.
                      </Button>

                      <AddModifierValue modifierTypeId={type.id} />
                    </div>
                  </PopoverContent>
                </Popover>
              </CardAction>
            </CardHeader>

            <CardContent>
              {type.values.length === 0 ? (
                <p>No modifier values for this type.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Value</TableHead>
                      <TableHead className="text-right">Stock Total</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {type.values.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell className="font-medium">{value.value}</TableCell>
                        <TableCell className="text-right">
                          {value.ProductVariant.reduce(
                            (prev, variant) =>
                              prev +
                              variant.stockLevels.reduce((prev_, curr) => prev_ + curr.quantity, 0),
                            0
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="icon-sm">
                                <MenuIcon />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="start">
                              <PopoverHeader>
                                <PopoverTitle>Actions</PopoverTitle>
                              </PopoverHeader>
                              <div className="flex flex-col gap-2 items-start">
                                <Button
                                  onClick={() => handleOnDelete(value.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  Delete <TrashIcon />
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}

export default Modifiers
