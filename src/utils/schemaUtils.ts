import { TAB_KEYS } from "../configs";

export type TabType = keyof typeof TAB_KEYS;

export function filterSchemaByTab(schema: any, tab: TabType): any {
    if (!schema || typeof schema !== "object" || !schema.properties) {
        return schema;
    }

    const allowedKeys = TAB_KEYS[tab];
    const filteredProperties: Record<string, any> = {};

    for (const key of allowedKeys) {
        if (key in schema.properties) {
            filteredProperties[key] = schema.properties[key];
        }
    }

    return {
        ...schema,
        properties: filteredProperties,
    };
}

export function replaceDescriptionWithTooltip(schema: any): any {
    if (Array.isArray(schema)) {
        return schema.map(replaceDescriptionWithTooltip);
    }

    if (schema && typeof schema === "object") {
        const out: Record<string, any> = {};
        for (const [key, value] of Object.entries(schema)) {
            const newKey = key === "description" ? "tooltip" : key;
            out[newKey] = replaceDescriptionWithTooltip(value);
        }
        return out;
    }

    return schema;
}
