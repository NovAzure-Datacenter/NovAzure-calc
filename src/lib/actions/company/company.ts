'use server'

import { getCompaniesCollection } from "../../mongoDb/db";
import { ObjectId } from "mongodb";

export async function getCompanyDetails(companyId: string) {
    try {
        const companiesCollection = await getCompaniesCollection();
        const company = await companiesCollection.findOne({ _id: new ObjectId(companyId) });
        if (!company) {
            return { error: "Company not found" };
        }

        return {
            success: true,
            company: {
                name: company.name,
                _id: company._id.toString(),
                industry: company.industry,
                contact_email: company.contact_email,
                contact_number: company.contact_number,
                website: company.website,
                logo: company.logo,
                country: company.country,
                currency: company.currency,
                address: company.address,
                plan: company.plan,
                created_at: company.created_at
            }
        };
    } catch (error) {
        console.error("Error fetching company details:", error);
        return { error: "Failed to fetch company details" };
    }
}

export interface UpdateCompanyData {
    name: string;
    industry: string;
    contact_email: string;
    contact_number: string;
    website: string;
    logo: string;
    country: string;
    address: string;
    currency: string;
}

export async function updateCompanyDetails(companyId: string, data: UpdateCompanyData) {
    try {
        const companiesCollection = await getCompaniesCollection();
        
        const result = await companiesCollection.updateOne(
            { _id: new ObjectId(companyId) },
            {
                $set: {
                    name: data.name,
                    industry: data.industry,
                    contact_email: data.contact_email,
                    contact_number: data.contact_number,
                    website: data.website,
                    logo: data.logo,
                    country: data.country,
                    address: data.address,
                    currency: data.currency
                }
            }
        );

        if (!result.acknowledged) {
            return { error: "Failed to update company details" };
        }

        const updatedCompany = await companiesCollection.findOne({ _id: new ObjectId(companyId) });
        if (!updatedCompany) {
            return { error: "Failed to fetch updated company details" };
        }

        return {
            success: true,
            company: {
                name: updatedCompany.name,
                _id: updatedCompany._id.toString(),
                industry: updatedCompany.industry,
                contact_email: updatedCompany.contact_email,
                contact_number: updatedCompany.contact_number,
                website: updatedCompany.website,
                logo: updatedCompany.logo,
                country: updatedCompany.country,
                address: updatedCompany.address,
                currency: updatedCompany.currency,
                plan: updatedCompany.plan,
                created_at: updatedCompany.created_at
            }
        };
    } catch (error) {
        console.error("Error updating company details:", error);
        return { error: "Failed to update company details" };
    }
} 