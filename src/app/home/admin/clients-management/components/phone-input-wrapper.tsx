import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputWrapperProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	international?: boolean;
	defaultCountry?: string;
}

export function PhoneInputWrapper({ 
	value, 
	onChange, 
	placeholder, 
	international = true,
	defaultCountry = "US",
	...props 
}: PhoneInputWrapperProps) {
	return (
		<div className="relative">
			<PhoneInput
				{...props}
				international={international}
				defaultCountry={defaultCountry as any}
				value={value}
				onChange={(value: any) => onChange(value || "")}
				placeholder={placeholder}
				className="flex items-center border border-input bg-background text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md h-8 [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:gap-1 [&_.PhoneInputCountry]:px-2 [&_.PhoneInputCountrySelect]:bg-transparent [&_.PhoneInputCountrySelect]:border-none [&_.PhoneInputCountrySelect]:outline-none [&_.PhoneInputCountrySelect]:text-xs [&_.PhoneInputCountrySelect]:font-medium [&_.PhoneInputCountrySelect]:text-foreground [&_.PhoneInputCountrySelectArrow]:text-muted-foreground [&_.PhoneInputCountrySelectArrow]:ml-1 [&_.PhoneInputInput]:flex [&_.PhoneInputInput]:h-8 [&_.PhoneInputInput]:w-full [&_.PhoneInputInput]:rounded-md [&_.PhoneInputInput]:border-0 [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:px-2 [&_.PhoneInputInput]:text-xs [&_.PhoneInputInput]:ring-offset-background [&_.PhoneInputInput]:placeholder:text-muted-foreground [&_.PhoneInputInput]:focus-visible:outline-none [&_.PhoneInputInput]:focus-visible:ring-0 [&_.PhoneInputInput]:focus-visible:ring-offset-0 [&_.PhoneInputInput]:disabled:cursor-not-allowed [&_.PhoneInputInput]:disabled:opacity-50 [&_.PhoneInputCountryFlag]:w-4 [&_.PhoneInputCountryFlag]:h-4 [&_.PhoneInputCountryIcon]:w-4 [&_.PhoneInputCountryIcon]:h-4"
			/>
		</div>
	);
} 