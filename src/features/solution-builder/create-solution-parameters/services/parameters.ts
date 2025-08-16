import { ParameterEditData } from "@/features/solution-builder/types/types";

export const getUserInterfaceDisplayText = (userInterface: ParameterEditData["user_interface"]) => {
    if (!userInterface) {
        return "Not Viewable";
    }
    if (typeof userInterface === "string") {
        return userInterface === "input"
            ? "Input"
            : userInterface === "static"
            ? "Static"
            : userInterface === "not_viewable"
            ? "Not Viewable"
            : userInterface;
    }
    if (!userInterface.type) {
        return "Not Viewable";
    }
    return userInterface.type === "input"
        ? "Input"
        : userInterface.type === "static"
        ? "Static"
        : userInterface.type === "not_viewable"
        ? "Not Viewable"
        : userInterface.type;
};