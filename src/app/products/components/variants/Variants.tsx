import { useQuery } from "@blitzjs/rpc"
import getProductVariants from "../../queries/getProductVariants"
import { FC } from "react"
import AddModifier from "./AddModifier"
import getProductModifierType from "../../queries/getProductModifierType"
import AddModifierValue from "./AddModifierValue"

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
      <ul>
        {type.values?.map((value) => (
          <li key={value.id}>
            {type.name}: {value.value} <button>Edit</button>
          </li>
        ))}
        <AddModifierValue modifierTypeId={type.id} />
      </ul>
    </>
  )
}

export default Variants
