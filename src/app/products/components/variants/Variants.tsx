import { useQuery } from "@blitzjs/rpc"
import getProductVariants from "../../queries/getProductVariants"
import { FC } from "react"
import AddModifier from "./AddModifier"
import getProductModifierType from "../../queries/getProductModifierType"
import AddModifierValue from "./AddModifierValue"
import ModifierValue from "./ModifierValue"
import { VariantTable } from "./VariantTable"
import { columns } from "./VariantColumn"

const Variants: FC<{ productId: number }> = ({ productId }) => {
  const [type, { isLoading }] = useQuery(getProductModifierType, {
    productId,
  })

  if (isLoading) {
    return <div>Loading variants...</div>
  }

  if (!type) {
    return <AddModifier productId={productId} />
  }

  return (
    <>
      <h3>{type.name}</h3>
      <div>
        {type.values?.map((value) => (
          <ModifierValue value={value} type={type} key={value.id} />
        ))}
        <AddModifierValue modifierTypeId={type.id} />

        <VariantTable columns={columns} data={[]} />
      </div>
    </>
  )
}

export default Variants
