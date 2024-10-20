async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

export default async function Products() {
  const products = await getProducts();
  console.log(products);

  return (
    <div className="text-white text-4xl">
      <h1>Products!</h1>
    </div>
  );
}
