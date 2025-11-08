import { useQuery } from "@blitzjs/rpc"
import { FC } from "react"
import AddModifier from "./AddModifier"
import AddModifierValue from "./AddModifierValue"
import ModifierValue from "./ModifierValue"
import { VariantTable } from "./VariantTable"
import { columns } from "./VariantColumn"
import getProductModifierTypes from "../../queries/getProductModifierTypes"
import React from "react"

const Variants: FC<{ productId: number }> = ({ productId }) => {
  const [types, { isLoading }] = useQuery(getProductModifierTypes, {
    productId,
  })

  console.log(types)

  if (isLoading) {
    return <div>Loading variants...</div>
  }

  return (
    <>
      {types?.map((type) => (
        <React.Fragment key={type.id}>
          <h3 className="mt-2 font-bold text-3xl">{type.name}</h3>
          <div>
            {type.values?.map((value) => (
              <ModifierValue value={value} type={type} key={value.id} />
            ))}
            <AddModifierValue modifierTypeId={type.id} />
          </div>
        </React.Fragment>
      ))}

      <AddModifier productId={productId} />
      <VariantTable columns={columns} data={[]} />
    </>
  )
}

export default Variants
