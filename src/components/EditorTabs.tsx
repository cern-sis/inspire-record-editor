import { Tabs } from "antd";
import { RJSFForm } from "react-formule";
import { TabType } from "../utils/schemaUtils";

interface EditorTabsProps {
    cleanedSchema: (tab: TabType) => any;
    uiSchema: any;
    formData: any;
    onFormDataChange: (data: any) => void;
}

export function EditorTabs({
    cleanedSchema,
    uiSchema,
    formData,
    onFormDataChange,
}: EditorTabsProps) {
    return (
        <Tabs
            id="editor-tabs"
            style={{ flex: 1 }}
            destroyOnHidden={true}
            tabBarStyle={{ borderBottom: "2px solid #ccc" }}
            items={[
                {
                    label: "Main",
                    key: "main",
                    children: (
                        <RJSFForm
                            schema={cleanedSchema("main")}
                            uiSchema={uiSchema}
                            formData={formData}
                            onChange={({ formData }) => onFormDataChange(formData)}
                        />
                    ),
                },
                {
                    label: "References",
                    key: "refs",
                    children: (
                        <RJSFForm
                            schema={cleanedSchema("refs")}
                            uiSchema={uiSchema}
                            formData={formData}
                            onChange={({ formData }) => onFormDataChange(formData)}
                        />
                    ),
                },
                {
                    label: "Authors",
                    key: "authors",
                    children: (
                        <RJSFForm
                            schema={cleanedSchema("authors")}
                            uiSchema={uiSchema}
                            formData={formData}
                            onChange={({ formData }) => onFormDataChange(formData)}
                        />
                    ),
                },
            ]}
        />
    );
}
