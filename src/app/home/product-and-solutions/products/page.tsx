import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { ProductsMain } from "./components/products-main";

export default async function Products() {
	await checkRoutePermission("/home/product-and-solutions/products");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
			<ProductsMain />
		</div>
	);
}
