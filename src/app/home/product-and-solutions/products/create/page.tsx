import { checkRoutePermission } from "@/lib/auth/check-permissions";
import { CreateProductMain } from "./components/create-product-main";
        
export default async function CreateProduct() {
	await checkRoutePermission("/home/product-and-solutions/products/create");

	return (
		<div className="w-full min-h-full p-8 bg-gradient-to-br from-blue-50 to-sky-50 relative">
            <CreateProductMain />
		</div>
	);
}
