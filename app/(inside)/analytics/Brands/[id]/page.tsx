import { db } from "@/lib/db";
import BrandEditor from "./Brandeditor";

const BrandsEdit = async ({ params }: { params: { id: string } }) => {
  const brand = await db.brand.findFirst({
    where: {
      id: params.id,
    },
  });

  return (
    <div>
      {brand ? <BrandEditor brand={brand} /> : <p>Brand not found</p>}
    </div>
  );
};

export default BrandsEdit;
