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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Modifiers: FC<{ productId: number }> = ({ productId }) => {
  const [types, { isLoading }] = useQuery(getProductModifierTypes, {
    productId,
  })

  const [deleteProductModifierValue] = useMutation(deleteProductModifierValueMutation)
  const [deleteProductModifierType] = useMutation(deleteProductModifierTypeMutation)

  const handleOnTypeDelete = async (id: number) => {
    try {
      if (!confirm("Are you sure you want to delete this modifier type?")) {
        return
      }

      await deleteProductModifierType({ id })
      invalidateQuery(getProductModifierTypes)
    } catch (error) {
      console.error("Failed to delete modifier value:", error)
    }
  }

  const handleOnDelete = async (id: number) => {
    try {
      if (!confirm("Are you sure you want to delete this modifier value?")) {
        return
      }

      await deleteProductModifierValue({ id })
      invalidateQuery(getProductModifierTypes)
    } catch (error) {
      console.error("Failed to delete modifier value:", error)
    }
  }

  if (isLoading) {
    return <div>Loading variants...</div>
  }

  return (
    <>
      <AddModifier productId={productId} />

      <div className="flex flex-wrap space-x-4">
        {types?.map((type) => (
          <React.Fragment key={type.id}>
            <Card className="grow">
              <CardHeader>
                <CardTitle>{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {type.values.length === 0 ? (
                  <>
                    <p>No modifier values for this type.</p>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleOnTypeDelete(type.id)}
                    >
                      Remove this modifier type.
                    </Button>
                  </>
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
                                variant.stockLevels.reduce(
                                  (prev_, curr) => prev_ + curr.quantity,
                                  0
                                ),
                              0
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button onClick={() => handleOnDelete(value.id)} size="sm">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                <AddModifierValue modifierTypeId={type.id} />
              </CardContent>
            </Card>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default Modifiers
